import { Request, Response } from "express";
import logger from "../logger";

const ensureEnvVars = (req: Request, res: Response, next: () => void) => {
  const requiredVars = [
    "NGINX_CONFIG_PATH",
    "NGINX_CONFIG_NAME",
    "AUTH_TOKEN",
    "PUBLIC_KEY",
    "JWT_VERIFY_ALG",
    "JWT_VERIFY_SUB",
    "JWT_VERIFY_ISS",
    "JWT_VERIFY_AUD",
    "JWT_PAYLOAD_KEY",
  ];
  const missingVars = requiredVars.filter((v) => !process.env[v]);
  if (missingVars.length > 0) {
    logger.error(
      `${missingVars.join(", ")} environment variable(s) are missing!`
    );
    res.status(500).json({ message: "Server Error!" });
    return;
  }
  next();
};

export default ensureEnvVars;
