import { Router } from "express";
import { validate } from "../../middlewares/validate";
import { adminLoginSchema } from "../../../validations/admin";
import * as adminHandlers from "../../request-handlers/admin";

const adminRouter = Router();

adminRouter.post(
  "/login",
  validate(adminLoginSchema),
  adminHandlers.adminLogin
);

adminRouter.get("/validate-access-token", adminHandlers.validateAccessToken);

export default adminRouter;
