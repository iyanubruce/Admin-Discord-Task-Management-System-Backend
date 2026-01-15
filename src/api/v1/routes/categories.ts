import { Router } from "express";
import * as categoryHandlers from "../../request-handlers/categories";
import authenticate from "../../middlewares/user-auth";
import { validate } from "../../middlewares/validate";
import {
  createCategorySchema,
  deleteCategorySchema,
} from "../../../validations/categories";

const router = Router();
router.use(authenticate());

router.get("/", categoryHandlers.getCategories);

router.post(
  "/",
  validate(createCategorySchema),
  categoryHandlers.createCategory
);

router.delete(
  "/:id",
  validate(deleteCategorySchema),
  categoryHandlers.deleteCategory
);

export default router;
