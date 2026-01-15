import { Router } from "express";
import authenticate from "../../middlewares/user-auth";
import { validate } from "../../middlewares/validate";
import * as taskHandlers from "../../request-handlers/tasks";
import {
  createTaskSchema,
  updateTaskSchema,
  updateTaskCategorySchema,
  completeTaskSchema,
  deleteTaskSchema,
  testNotificationSchema,
} from "../../../validations/tasks";
const router = Router();

router.use(authenticate());

router.get("/", taskHandlers.getTasks);

router.post("/", validate(createTaskSchema), taskHandlers.createTask);

router.put("/:id", validate(updateTaskSchema), taskHandlers.updateTask);

router.delete("/:id", validate(deleteTaskSchema), taskHandlers.deleteTask);

router.patch(
  "/:id/complete",
  validate(completeTaskSchema),
  taskHandlers.completeTask
);

router.patch(
  "/:id/category",
  validate(updateTaskCategorySchema),
  taskHandlers.updateTaskCategory
);

router.post(
  "/test-notification",
  validate(testNotificationSchema),
  taskHandlers.testNotification
);

export default router;
