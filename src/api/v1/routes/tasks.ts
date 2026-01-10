import { Router } from "express";
import * as taskHandlers from "../../request-handlers/tasks";

const router = Router();

router.get("/", taskHandlers.getTasks);

router.post("/", taskHandlers.createTask);

router.put("/:id", taskHandlers.updateTask);

router.delete("/:id", taskHandlers.deleteTask);

router.patch("/:id/complete", taskHandlers.completeTask);

router.patch("/:id/category", taskHandlers.updateTaskCategory);

router.post("/test-notification", taskHandlers.testNotification);

export default router;
