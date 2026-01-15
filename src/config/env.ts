import * as dotenv from "dotenv";
import { jwt } from "zod";

dotenv.config();

export default {
  application: {
    appName: process.env.APP_NAME || "Discord Task Manager",
    nodeEnv: process.env.NODE_ENV?.toLowerCase() || "development",
    port: Number(process.env.PORT) || 5000,
    baseUrl: process.env.APP_URL || "http://localhost:5000",
    isProd: process.env.NODE_ENV?.toLowerCase() === "production",
    isDev: process.env.NODE_ENV?.toLowerCase() === "development",
    database: {
      mongodb_uri: process.env.MONGODB_URI || "",
      serverSelectionTimeoutMS:
        Number(process.env.DB_SELECTION_TIMEOUT) || 30000,
      socketTimeoutMS: Number(process.env.DB_SOCKET_TIMEOUT) || 45000,
      maxPoolSize: Number(process.env.DB_MAX_POOL_SIZE) || 10,
      minPoolSize: Number(process.env.DB_MIN_POOL_SIZE) || 2,
    },
    timezone: {
      application_timezone: process.env.TIMEZONE || "Asia/Kolkata",
    },
  },
  redis: {
    url: process.env.REDIS_URL || "",
    host: process.env.REDIS_HOST || "127.0.0.1",
    port: Number(process.env.REDIS_PORT) || 6379,
    password: process.env.REDIS_PASSWORD || "",
    maxRetriesPerRequest: null as any,
    enableReadyCheck: false,
  },
  jwt: {
    secret: process.env.JWT_SECRET || "your_jwt_secret_key",
    expiresIn: process.env.JWT_EXPIRES_IN || "3600", // in seconds
  },
  discord: {
    webhooks: {
      reminder: process.env.DISCORD_WEBHOOK_REMINDER || "",
      complete: process.env.DISCORD_WEBHOOK_COMPLETE || "",
      delete: process.env.DISCORD_WEBHOOK_DELETE || "",
    },
  },
  cron: {
    dailyNotificationCheck: process.env.CRON_DAILY_CHECK || "0 9 * * *", // 9 AM IST daily
    sixHourlyCheck: process.env.CRON_SIX_HOURLY || "0 */6 * * *", // Every 6 hours
  },
  admin: {
    username: process.env.ADMIN_USERNAME || "admin",
    password: process.env.ADMIN_PASSWORD || "password",
  },
};
