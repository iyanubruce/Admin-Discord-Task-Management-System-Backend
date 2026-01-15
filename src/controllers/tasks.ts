import { TaskAttributes } from "../database/models/task";
import ResourceNotFoundError from "../errors/resourceNotFoundError";
import BadRequestError from "../errors/badRequestError";
import {
  NotificationType,
  sendDiscordNotification,
} from "../helpers/discord-notifications";
import * as taskRepository from "../database/repositories/task";
import * as categoryRepository from "../database/repositories/category";
import * as userRepository from "../database/repositories/user";
import { Types } from "mongoose";
import logger from "../utils/logger";
import { notificationQueue } from "../queues/notification-queue";
export const getTasks = async (): Promise<TaskAttributes[]> => {
  const tasks = await taskRepository.findTasks({
    populate: ["category", "assignedUser"],
    sort: { created_at: -1 },
  });
  return tasks;
};

export const createTask = async (data: {
  taskName: string;
  dueDate: Date;
  priority: "Easy" | "Medium" | "Hard";
  assignedUser: string;
  category: string;
  repeatInterval?: string;
}): Promise<TaskAttributes> => {
  const {
    taskName,
    dueDate,
    priority,
    assignedUser,
    category,
    repeatInterval,
  } = data;

  const task = await taskRepository.createTask({
    taskName,
    dueDate,
    priority,
    assignedUser,
    category,
    repeatInterval: repeatInterval || "none",
  });

  const populatedTask = await taskRepository.findTaskById(task._id, {
    populate: ["category", "assignedUser"],
  });

  // Send Discord notification asynchronously (non-blocking)
  if (populatedTask) {
    notificationQueue.add({
      task: populatedTask,
      user: populatedTask.assignedUser,
      type: NotificationType.Created,
    });
  }

  return populatedTask || task;
};

export const updateTask = async (
  taskId: string,
  data: Partial<{
    taskName: string;
    dueDate: Date;
    priority: "Easy" | "Medium" | "Hard";
    assignedUser: string;
    category: string;
    repeatInterval?: "none" | "daily" | "weekly" | "monthly";
  }>
): Promise<TaskAttributes> => {
  const {
    taskName,
    dueDate,
    priority,
    assignedUser,
    category,
    repeatInterval,
  } = data;

  // Check if task exists
  const existingTask = await taskRepository.findTaskById(taskId);
  if (!existingTask) {
    throw new ResourceNotFoundError("Task not found");
  }

  if (assignedUser) {
    const userExists = await userRepository.findUserById(assignedUser);
    if (!userExists) {
      throw new BadRequestError("Assigned user not found");
    }
  }

  if (category) {
    const categoryExists = await categoryRepository.findCategoryById(category);
    if (!categoryExists) {
      throw new BadRequestError("Category not found");
    }
  }

  const updateData: any = {};
  if (taskName !== undefined) updateData.taskName = taskName;
  if (dueDate !== undefined) updateData.dueDate = dueDate;
  if (priority !== undefined) updateData.priority = priority;
  if (assignedUser !== undefined)
    updateData.assignedUser = new Types.ObjectId(assignedUser);
  if (category !== undefined)
    updateData.category = new Types.ObjectId(category);
  if (repeatInterval !== undefined) updateData.repeatInterval = repeatInterval;

  const task = await taskRepository.updateTask(taskId, updateData, {
    runValidators: true,
    populate: ["category", "assignedUser"],
  });

  if (!task) {
    throw new ResourceNotFoundError("Task not found");
  }

  return task;
};

export const deleteTask = async (
  taskId: string
): Promise<{ message: string }> => {
  const task = await taskRepository.findTaskById(taskId, {
    populate: ["category", "assignedUser"],
  });

  if (!task) {
    throw new ResourceNotFoundError("Task not found");
  }

  const deletedCategory = await categoryRepository.findCategoryByName(
    "Deleted Tasks"
  );

  // Resolve category name safely (category may be populated doc or ObjectId)
  const categoryName =
    task.category &&
    typeof task.category === "object" &&
    "name" in task.category
      ? (task.category as any).name
      : String(task.category);

  // If task is already in Deleted Tasks category, permanently delete it
  if (categoryName === "Deleted Tasks") {
    await taskRepository.deleteTask(taskId);

    notificationQueue.add({
      task,
      user: task.assignedUser,
      type: NotificationType.Permanent,
    });

    return { message: "Task permanently deleted" };
  } else if (deletedCategory) {
    // Move to Deleted Tasks category (store _id)
    task.category = deletedCategory._id as any;
    task.status = "deleted";
    await task.save();

    // Ensure category is populated for notification
    await task.populate("category");

    notificationQueue.add({
      task,
      user: task.assignedUser,
      type: NotificationType.Delete,
    });

    return { message: "Task moved to deleted" };
  } else {
    // If no deleted category exists, permanently delete
    await taskRepository.deleteTask(taskId);
    return { message: "Task deleted permanently" };
  }
};

export const completeTask = async (taskId: string): Promise<TaskAttributes> => {
  const completedCategory = await categoryRepository.findCategoryByName(
    "Completed Tasks"
  );

  if (!completedCategory) {
    throw new ResourceNotFoundError("Completed Tasks category not found");
  }

  const task = await taskRepository.findTaskById(taskId, {
    populate: ["assignedUser", "category"],
  });

  if (!task) {
    throw new ResourceNotFoundError("Task not found");
  }

  // Update task (store category _id)
  task.category = completedCategory._id as any;
  task.status = "completed";
  await task.save();

  // Populate the updated task
  await task.populate("category");

  // Send completion notification (non-blocking)
  notificationQueue.add({
    task,
    user: task.assignedUser,
    type: NotificationType.Complete,
  });

  return task;
};

export const updateTaskCategory = async (
  taskId: string,
  categoryId: string
): Promise<TaskAttributes> => {
  // Find the target category to check if it's special
  const targetCategory = await categoryRepository.findCategoryById(
    new Types.ObjectId(categoryId)
  );
  console.log("Target Category:", targetCategory);
  if (!targetCategory) {
    throw new ResourceNotFoundError("Category not found");
  }

  let newStatus: "active" | "completed" | "deleted" = "active";
  if (targetCategory.name === "Completed Tasks") {
    newStatus = "completed";
  } else if (targetCategory.name === "Deleted Tasks") {
    newStatus = "deleted";
  }

  // Update both category and status
  const task = await taskRepository.updateTask(
    taskId,
    {
      category: new Types.ObjectId(categoryId),
      status: newStatus,
    },
    {
      populate: ["category", "assignedUser"],
    }
  );

  if (!task) {
    throw new ResourceNotFoundError("Task not found");
  }

  return task;
};

export const testNotification = async (
  taskId: string,
  type: NotificationType = NotificationType.Reminder
): Promise<{ message: string }> => {
  const task = await taskRepository.findTaskById(taskId, {
    populate: ["assignedUser", "category"],
  });

  if (!task) {
    throw new ResourceNotFoundError("Task not found");
  }

  notificationQueue.add({
    task,
    user: task.assignedUser,
    type: type,
  });

  return { message: `Test ${type} notification sent successfully` };
};
