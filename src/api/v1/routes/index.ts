import { Router } from "express";

import usersRouter from "./users";
import categoriesRouter from "./categories";
import tasksRouter from "./tasks";
import adminRouter from "./admin";

const router = Router();

router.use("/users", usersRouter);
router.use("/categories", categoriesRouter);
router.use("/tasks", tasksRouter);
router.use("/admin", adminRouter);

export default router;
