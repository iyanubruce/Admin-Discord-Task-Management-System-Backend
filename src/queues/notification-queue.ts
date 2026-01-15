import Queue from "bull";
import { sendDiscordNotification } from "../helpers/discord-notifications";
import logger from "../utils/logger";

export const notificationQueue = new Queue("notifications", {
  redis: {
    host: process.env.REDIS_HOST || "localhost",
    port: parseInt(process.env.REDIS_PORT || "6379"),
  },
});

notificationQueue.process(async (job) => {
  const { task, user, type } = job.data;
  await sendDiscordNotification(task, user, type);
});

notificationQueue.on("failed", (job, err) => {
  logger.error("Notification job failed:", { jobId: job.id, error: err });
});
