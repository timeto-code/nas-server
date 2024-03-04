import path from "path";
import { createLogger, format, transports } from "winston";
import { envConfig } from "./env.config";

const logger = createLogger({
  level: "debug",

  // 使用format.combine结合多个日志格式化选项。
  format: format.combine(
    // 添加时间戳，格式为"YYYY-MM-DD HH:mm:ss"。
    format.timestamp({
      format: "YYYY-MM-DD HH:mm:ss",
    }),
    // 当记录错误时，包含错误堆栈。
    format.errors({ stack: true }),
    // 支持日志字符串插值。
    format.splat(),
    // 设置日志格式为JSON。
    format.json(),
    // 自定义日志格式。
    format.printf(({ level, message, timestamp, service }) => {
      return `${timestamp} [${level}] ${message}`;
    })
  ),

  // 设置默认元数据，这些元数据将被添加到每条日志中。
  // defaultMeta: { service: "node-ddns-server" },

  // 设置日志输出
  transports: [
    // 是否在控制台输出
    ...(process.env.NODE_ENV === "production"
      ? []
      : [
          new transports.Console({
            format: format.combine(
              format.colorize(),
              format.simple(),
              format.printf(
                ({ level, message, timestamp }) =>
                  `[${timestamp}] [${level}]: ${message}`
              )
            ),
          }),
        ]),

    // 打印debug级别以上的所有日志
    new transports.File({
      filename: "combined.log",
      level: "debug",
      maxsize: 5242880,
      maxFiles: 5,
      dirname: path.join(envConfig.SERVER_ROOT!, "logs"),
    }),

    // 打印info级别以上的所有日志
    new transports.File({
      filename: "info.log",
      level: "info",
      maxsize: 5242880,
      maxFiles: 5,
      dirname: path.join(envConfig.SERVER_ROOT!, "logs"),
    }),

    // 打印warn级别以上的所有日志
    new transports.File({
      filename: "warn.log",
      level: "warn",
      maxsize: 5242880,
      maxFiles: 5,
      dirname: path.join(envConfig.SERVER_ROOT!, "logs"),
    }),

    // 打印error级别以上的所有日志
    new transports.File({
      filename: "errors.log",
      level: "error",
      maxsize: 5242880,
      maxFiles: 5,
      dirname: path.join(envConfig.SERVER_ROOT!, "logs"),
    }),
  ],
});

export default logger;
