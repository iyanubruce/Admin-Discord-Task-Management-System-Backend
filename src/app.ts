import express, { Application, NextFunction, Request, Response } from "express";
import mongoose from "mongoose";
import cors from "cors";
import axios from "axios";
import cron from "node-cron";
import dotenv from "dotenv";
import compression from "compression";

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

app.use(cors());
app.use(compression());
