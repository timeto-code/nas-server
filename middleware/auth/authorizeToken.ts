import { Request, Response, NextFunction } from "express";
import logger from "../../util/logger";

const authorizeToken = (req: Request, res: Response, next: NextFunction) => {
  const authToken = req.headers["x-auth-token"];
  const host = req.ip?.split("f:").pop();
  if (!authToken || authToken !== process.env.AUTH_TOKEN) {
    logger.warn(`[${host}] AuthToken is invalid!`);
    res.status(401).json({ message: "Unauthorized" });
    return;
  }
  next();
};

export default authorizeToken;
