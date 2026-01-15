import express, { Application, NextFunction, Request, Response } from "express";
import cors from "cors";
import morgan from "morgan";
import compression from "compression";
import customErrorMiddleware from "./api/middlewares/custom-error-middleware";
import v1Router from "./api/v1/routes";
import Redis from "ioredis";
import env from "./config/env";
import { init as initRedis } from "./utils/redis";

initRedis(new Redis(env.redis));

const app: Application = express();

const noCache = (req: Request, res: Response, next: NextFunction) => {
  res.setHeader(
    "Cache-Control",
    "no-store, no-cache, must-revalidate, proxy-revalidate"
  );
  res.setHeader("Pragma", "no-cache");
  res.setHeader("Expires", "0");
  res.removeHeader("ETag");
  next();
};

app.use(noCache);

// Middleware
app.use(cors());
app.use(compression());
app.use(express.json());
app.use(morgan("dev"));

// Health check endpoint
app.get("/health", (_req: Request, res: Response) => {
  res.status(200).json({ status: "ok" });
});

// API routes
app.use("/api/v1", v1Router);

// Error handler
app.use(customErrorMiddleware);

// 404 handler
app.use((_req: Request, res: Response) => {
  res.status(404).json({ error: "Not Found", data: null, path: _req.url });
});

export default app;
