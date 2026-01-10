import { Router } from "express";
import * as categoryHandlers from "../../request-handlers/categories";

const router = Router();

router.get("/", categoryHandlers.getCategories);

router.post("/", categoryHandlers.createCategory);

router.delete("/:id", categoryHandlers.deleteCategory);

export default router;
