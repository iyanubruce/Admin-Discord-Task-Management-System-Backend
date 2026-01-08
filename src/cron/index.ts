import cron from "node-cron";
import logger from "../utils/logger";
import config from "../config/env";
import { checkAndSendNotifications } from "./tasks/daily-notification-check";

export const initialize = (): void => {
  cron.schedule(config.cron.dailyNotificationCheck, async () => {
    logger.info("[Cron] => Running daily notification check");
    await checkAndSendNotifications();
  });
  
  cron.schedule(config.cron.sixHourlyCheck, async () => {
    logger.info("[Cron] => Running six hourly notification check");
    await checkAndSendNotifications();
  });
  
  logger.info("[Cron] => Jobs scheduled successfully");
};
