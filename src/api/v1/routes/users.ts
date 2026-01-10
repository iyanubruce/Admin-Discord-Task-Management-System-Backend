import { Router } from "express";
import { validate } from "../../middlewares/validate";
import { createUserSchema, deleteUserSchema } from "../../../validations/users";
import * as userHandlers from "../../request-handlers/users";

const router = Router();

router.get("/", userHandlers.getUsers);

router.post("/", validate(createUserSchema), userHandlers.createUser);

router.delete("/:id", validate(deleteUserSchema), userHandlers.deleteUser);

export default router;
