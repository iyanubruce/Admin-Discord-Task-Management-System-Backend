import winston from "winston";

const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || "debug", // Set log level (debug shows everything)
  format: winston.format.combine(
    winston.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
    winston.format.errors({ stack: true }),
    winston.format.json()
  ),
  transports: [
    new winston.transports.Console({
      level: process.env.LOG_LEVEL || "debug", // Also set level on console transport
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
        winston.format.printf(({ level, message, timestamp, ...meta }) => {
          let msg = `${timestamp} ${level}: ${message}`;
          // Include additional metadata if present
          if (Object.keys(meta).length > 0 && meta.stack) {
            msg += `\n${meta.stack}`;
          } else if (Object.keys(meta).length > 0) {
            msg += ` ${JSON.stringify(meta)}`;
          }
          return msg;
        })
      ),
      handleExceptions: true,
      handleRejections: true,
    }),
    new winston.transports.File({
      filename: "logs/error.log",
      level: "error",
      silent: process.env.NODE_ENV === "test",
      handleExceptions: true,
      handleRejections: true,
    }),
    new winston.transports.File({
      filename: "logs/combined.log",
      silent: process.env.NODE_ENV === "test",
    }),
  ],
  exitOnError: false,
});

export default logger;
