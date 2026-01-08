import { Request, Response, NextFunction } from "express";

export function customErrorMiddleware(
  err: unknown,
  req: Request,
  res: Response,
  next: NextFunction
) {
  const message = err instanceof Error ? err.message : String(err);
  res.status(500).json({ error: message });
}
