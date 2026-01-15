import app from "./app";
import http from "http";
import env from "./config/env";
import { connectDB } from "./config/database";
import { checkAndSendNotifications } from "./helpers/discord-notifications";
import { initialize as initializeCron } from "./cron";
import logger from "./utils/logger";

const PORT = env.application.port;
const server = http.createServer(app);
const HOST = "0.0.0.0";

const startServer = async () => {
  try {
    await connectDB();

    // Initialize cron jobs after DB connection
    initializeCron();
    logger.info("✅ Cron jobs initialized");

    server.listen(PORT, () => {
      logger.info(`🚀 Discord Task Manager API running on port ${PORT}`);
      logger.info(`📡 Environment: ${env.application.nodeEnv}`);

      // Run initial notification check
      checkAndSendNotifications();
    });
  } catch (err) {
    logger.error("💀 Fatal: Failed to start server due to DB error");
    process.exit(1);
  }
};

server.on("error", (error: NodeJS.ErrnoException) => {
  if (error.syscall !== "listen") throw error;

  const bind = typeof PORT === "string" ? `Pipe ${PORT}` : `Port ${PORT}`;
  switch (error.code) {
    case "EACCES":
      logger.error(`${bind} requires elevated privileges`);
      process.exit(1);
    case "EADDRINUSE":
      logger.error(`${bind} is already in use`);
      process.exit(1);
    default:
      throw error;
  }
});

process.on("SIGTERM", () => {
  server.close(() => {
    logger.info("🔌 Server closed");
    process.exit(0);
  });
});

startServer();
