import { RequestHandler } from "express";
import * as adminController from "../../controllers/admin";
import * as utilities from "../../helpers/utilities";

export const adminLogin: RequestHandler = async (req, res, next) => {
  try {
    const { username, password } = req.body;
    const token = await adminController.adminLogin({ username, password });
    res
      .status(200)
      .json(
        utilities.itemResponse({ token }, 200, "admin logged in successfully")
      );
  } catch (error) {
    next(error);
  }
};

export const validateAccessToken: RequestHandler = async (req, res, next) => {
  try {
    const { authorization } = req.headers;

    if (!authorization) {
      return res.json({ valid: false });
    }

    const [, token] = authorization.split(" ");

    if (!token) {
      return res.json({ valid: false });
    }

    const isValid = await adminController.validateAccessToken(token);

    res.json({ valid: isValid });
  } catch (error) {
    next(error);
  }
};
