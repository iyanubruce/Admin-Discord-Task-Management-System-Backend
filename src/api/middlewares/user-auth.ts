import { Request, Response, NextFunction } from "express";
import {
  JsonWebTokenError,
  NotBeforeError,
  TokenExpiredError,
} from "jsonwebtoken";

import { findAdmin } from "../../database/repositories/admin";
import { NotAuthenticatedError, NotAuthorizedError } from "../../errors";
import JWT from "../../helpers/jwt";

const authenticate = (admin?: boolean) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { authorization } = req.headers;

      if (!authorization) {
        throw new NotAuthenticatedError(
          "Not authenticated. Session does not exist"
        );
      }

      const [, token] = authorization.split(" ");

      if (!token) {
        throw new NotAuthenticatedError("Session does not exist");
      }

      const decoded = JWT.decode(token);
      const user = await findAdmin({
        filter: { _id: decoded.user },
      });

      if (!user) {
        throw new NotAuthenticatedError("Invalid session");
      }

      res.locals.user = user;

      return next();
    } catch (error) {
      if (error instanceof TokenExpiredError) {
        return next(
          new NotAuthenticatedError("Session has expired, please log in again")
        );
      }

      if (error instanceof NotBeforeError) {
        return next(new NotAuthenticatedError("Token used prematurely"));
      }

      if (error instanceof JsonWebTokenError) {
        return next(
          new NotAuthenticatedError("Session invalid, please log in again")
        );
      }

      next(error);
    }
  };
};

export default authenticate;
