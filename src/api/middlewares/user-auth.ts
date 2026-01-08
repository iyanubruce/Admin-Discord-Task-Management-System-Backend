import { Request, Response, NextFunction } from "express";

export function userAuth(req: Request, res: Response, next: NextFunction) {
  // placeholder auth
  next();
}
