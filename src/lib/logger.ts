import winston from "winston";

const logger = winston.createLogger({
  level: "info",
  format: winston.format.combine(
    winston.format.json(),
    winston.format.errors({ stack: true }),
  ),
  transports: [new winston.transports.Console()],
});

// if (process.env.NODE_ENV !== "production") {
//   logger.add(new winston.transports.Console());
// }

export default logger;
