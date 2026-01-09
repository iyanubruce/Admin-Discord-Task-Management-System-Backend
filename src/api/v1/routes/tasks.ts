import { Router, Request, Response } from "express";
import Category from "../../../database/models/category";
import Task from "../../../database/models/task";
import User from "../../../database/models/user";
import { sendDiscordNotification } from "../../../helpers/discord-notifications";

const router = Router();

router.get("/", async (req: Request, res: Response) => {
  try {
    const tasks = await Task.find()
      .populate("category")
      .populate("assignedUser")
      .sort({ created_at: -1 });
    res.json(tasks);
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    res.status(500).json({ error: msg });
  }
});

router.post("/", async (req: Request, res: Response) => {
  try {
    const {
      taskName,
      dueDate,
      priority,
      assignedUser,
      category,
      repeatInterval,
    } = req.body;
    const task = new Task({
      taskName,
      dueDate,
      priority,
      assignedUser,
      category,
      repeatInterval: repeatInterval || "none",
    });
    await task.save();
    const populatedTask = await Task.findById(task._id)
      .populate("category")
      .populate("assignedUser");

    // Send Discord notification asynchronously (non-blocking)
    if (populatedTask) {
      sendDiscordNotification(
        populatedTask,
        populatedTask.assignedUser,
        "created"
      ).catch((err) => console.error("Discord notification failed:", err));
    }

    res.status(201).json(populatedTask || task);
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    res.status(400).json({ error: msg });
  }
});

router.put("/:id", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const {
      taskName,
      dueDate,
      priority,
      assignedUser,
      category,
      repeatInterval,
    } = req.body;

    // Validate required fields
    if (!taskName || !dueDate || !priority || !assignedUser || !category) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    // Check if task exists
    const existingTask = await Task.findById(id);
    if (!existingTask) {
      return res.status(404).json({ error: "Task not found" });
    }

    // Validate that user exists
    const userExists = await User.findById(assignedUser);
    if (!userExists) {
      return res.status(400).json({ error: "Assigned user not found" });
    }

    // Validate that category exists
    const categoryExists = await Category.findById(category);
    if (!categoryExists) {
      return res.status(400).json({ error: "Category not found" });
    }

    // Validate priority value
    if (!["Easy", "Medium", "Hard"].includes(priority)) {
      return res.status(400).json({ error: "Invalid priority value" });
    }

    // Validate repeat interval if provided
    if (
      repeatInterval &&
      !["none", "daily", "weekly", "monthly"].includes(repeatInterval)
    ) {
      return res.status(400).json({ error: "Invalid repeat interval" });
    }

    const task = await Task.findByIdAndUpdate(
      id,
      {
        taskName,
        dueDate,
        priority,
        assignedUser,
        category,
        repeatInterval: repeatInterval || "none",
      },
      { new: true, runValidators: true }
    )
      .populate("category")
      .populate("assignedUser");

    if (!task) {
      return res.status(404).json({ error: "Task not found" });
    }

    res.json(task);
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error("Error updating task:", err);
    res.status(500).json({ error: "Failed to update task: " + msg });
  }
});

router.delete("/:id", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const task = await Task.findById(id)
      .populate("category")
      .populate("assignedUser");

    if (!task) {
      return res.status(404).json({ error: "Task not found" });
    }

    const deletedCategory = await Category.findOne({ name: "Deleted Tasks" });

    // Resolve category name safely (category may be populated doc or ObjectId)
    const categoryName =
      task.category &&
      typeof task.category === "object" &&
      "name" in task.category
        ? (task.category as any).name
        : String(task.category);

    // If task is already in Deleted Tasks category, permanently delete it
    if (categoryName === "Deleted Tasks") {
      await Task.findByIdAndDelete(id);

      // Send permanent delete notification (non-blocking)
      sendDiscordNotification(task, task.assignedUser, "permanent").catch(
        (err) => console.error("Discord notification failed:", err)
      );

      res.status(200).json({ message: "Task permanently deleted" });
    } else if (deletedCategory) {
      // Move to Deleted Tasks category (store _id)
      task.category = deletedCategory._id as any;
      task.status = "deleted";
      await task.save();

      // Ensure category is populated for notification
      await task.populate("category");

      // Send delete notification (non-blocking)
      sendDiscordNotification(task, task.assignedUser, "delete").catch((err) =>
        console.error("Discord notification failed:", err)
      );

      res.status(200).json({ message: "Task moved to deleted" });
    } else {
      // If no deleted category exists, permanently delete
      await Task.findByIdAndDelete(id);
      res.status(200).json({ message: "Task deleted permanently" });
    }
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    res.status(500).json({ error: msg });
  }
});

router.patch("/:id/complete", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const completedCategory = await Category.findOne({
      name: "Completed Tasks",
    });

    if (!completedCategory) {
      return res
        .status(404)
        .json({ error: "Completed Tasks category not found" });
    }

    const task = await Task.findById(id)
      .populate("assignedUser")
      .populate("category");

    if (!task) {
      return res.status(404).json({ error: "Task not found" });
    }

    // Update task (store category _id)
    task.category = completedCategory._id as any;
    task.status = "completed";
    await task.save();

    // Populate the updated task
    await task.populate("category");

    // Send completion notification (non-blocking)
    sendDiscordNotification(task, task.assignedUser, "complete").catch((err) =>
      console.error("Discord notification failed:", err)
    );

    res.json(task);
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    res.status(400).json({ error: msg });
  }
});

router.patch("/:id/category", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { categoryId } = req.body;

    // Find the target category to check if it's special
    const targetCategory = await Category.findById(categoryId);

    if (!targetCategory) {
      return res.status(404).json({ error: "Category not found" });
    }

    // Determine the new status based on the category
    let newStatus = "active";
    if (targetCategory.name === "Completed Tasks") {
      newStatus = "completed";
    } else if (targetCategory.name === "Deleted Tasks") {
      newStatus = "deleted";
    }

    // Update both category and status
    const task = await Task.findByIdAndUpdate(
      id,
      {
        category: categoryId,
        status: newStatus,
      },
      { new: true }
    )
      .populate("category")
      .populate("assignedUser");

    res.json(task);
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    res.status(400).json({ error: msg });
  }
});

router.post("/test-notification", async (req: Request, res: Response) => {
  try {
    const { taskId, type = "reminder" } = req.body;
    const task = await Task.findById(taskId)
      .populate("assignedUser")
      .populate("category");

    if (!task) {
      return res.status(404).json({ error: "Task not found" });
    }

    await sendDiscordNotification(task, task.assignedUser, type);
    res.json({ message: `Test ${type} notification sent successfully` });
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    res.status(500).json({ error: msg });
  }
});

export default router;
