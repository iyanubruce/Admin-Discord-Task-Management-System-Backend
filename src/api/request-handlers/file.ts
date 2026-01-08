import { Request, Response } from "express";

export const handleFile = (req: Request, res: Response) => {
  res.json({ message: "file handler placeholder" });
};
