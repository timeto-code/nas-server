import { createPublicKey } from "crypto";
import { NextFunction, Request, Response } from "express";
import fs from "fs";
import { jwtVerify } from "jose";
import path from "path";
import logger from "../../logger";

const authorizeJWT = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const host = req.ip?.split("f:").pop();
  try {
    const jwt = req.headers.authorization?.split("Bearer ").pop();
    if (!jwt) {
      logger.warn(`[${host}] JWT is invalid!`);
      res.status(401).json({ message: "Unauthorized" });
      return;
    }

    const basePath =
      process.env.NODE_ENV === "production"
        ? path.join(__dirname, "..", "..", "..")
        : path.join(__dirname, "..", "..");
    const publicKeyPath = path.join(basePath, "public-key.pem");
    const publicKeyPem = fs.readFileSync(publicKeyPath, "utf8");
    const publicKey = createPublicKey(publicKeyPem);

    const { payload } = await jwtVerify(jwt, publicKey, {
      // 验证算法
      algorithms: [process.env.JWT_VERIFY_ALG!],
      // 验证主题
      subject: process.env.JWT_VERIFY_SUB!,
      // 验证签发者
      issuer: process.env.JWT_VERIFY_ISS!,
      // 验证接收者
      audience: process.env.JWT_VERIFY_AUD!,
      // 设置并验证JWT验证窗口期时长, 自iat到现在不能超过2分钟
      maxTokenAge: "2m",
    });

    logger.debug(`payload: ${JSON.stringify(payload)}`);

    const { id } = payload;
    if (!id || id !== process.env.JWT_PAYLOAD_KEY!) {
      logger.warn(`[${host}] JWT payload is invalid!`);
      res.status(401).json({ message: "Unauthorized" });
      return;
    }

    next();
  } catch (err) {
    logger.error(`[${host}] JWT verification failed: ${err}`);
    res.status(401).json({ message: "Unauthorized" });
    return;
  }
};

export default authorizeJWT;
