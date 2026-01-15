import { z } from "zod";

export const createTaskSchema = {
  body: z.object({
    taskName: z.string().min(1, "Task name is required"),
    dueDate: z.string().refine((date) => !isNaN(Date.parse(date)), {
      message: "Invalid date format",
    }),
    priority: z.enum(["Easy", "Medium", "Hard"], {
      message: "Priority must be Easy, Medium, or Hard",
    }),
    assignedUser: z.string().min(1, "Assigned user ID is required"),
    category: z.string().min(1, "Category ID is required"),
    repeatInterval: z.enum(["none", "daily", "weekly", "monthly"]).optional(),
  }),
};

export const updateTaskSchema = {
  params: z.object({
    id: z.string().min(1, "Task ID is required"),
  }),
  body: z
    .object({
      taskName: z.string().min(1, "Task name is required").optional(),
      dueDate: z
        .string()
        .refine((date) => !isNaN(Date.parse(date)), {
          message: "Invalid date format",
        })
        .optional(),
      priority: z
        .enum(["Easy", "Medium", "Hard"], {
          message: "Priority must be Easy, Medium, or Hard",
        })
        .optional(),
      assignedUser: z
        .string()
        .min(1, "Assigned user ID is required")
        .optional(),
      category: z.string().min(1, "Category ID is required").optional(),
      repeatInterval: z.enum(["none", "daily", "weekly", "monthly"]).optional(),
    })
    .strict(),
};

export const deleteTaskSchema = {
  params: z.object({
    id: z.string().min(1, "Task ID is required"),
  }),
};

export const completeTaskSchema = {
  params: z.object({
    id: z.string().min(1, "Task ID is required"),
  }),
};

export const updateTaskCategorySchema = {
  params: z.object({
    id: z.string().min(1, "Task ID is required"),
  }),
  body: z.object({
    category: z.string().min(1, "Category ID is required"),
  }),
};

export const testNotificationSchema = {
  body: z.object({
    taskId: z.string().min(1, "Task ID is required"),
    type: z.enum(["info", "warning", "error"]).optional(),
  }),
};
