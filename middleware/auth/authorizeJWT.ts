import { createPublicKey } from "crypto";
import { NextFunction, Request, Response } from "express";
import fs from "fs";
import { jwtVerify } from "jose";
import { envConfig } from "../../util/env.config";
import logger from "../../util/logger";

const authorizeJWT = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const host = req.ip?.split("f:").pop();
  try {
    /**
     * 定义不需要进行 JWT 验证的路由列表
     * 检查当前请求的路径是否在不需要验证的列表中
     * 如果当前请求路径在跳过列表中，跳过验证
     */
    const pathsToSkip = ["/api/file/upload", "/download"];
    const shouldSkip = pathsToSkip.some((path) => req.path.startsWith(path));
    if (shouldSkip) {
      return next();
    }

    /**
     * 从请求头中获取 JWT
     * 如果 JWT 不存在，返回 401
     * 如果 JWT 存在，验证 JWT
     * 如果验证失败，返回 401
     * 如果验证成功，继续下一个中间件
     */
    const jwt = req.headers.authorization?.split("Bearer ").pop();
    if (!jwt) {
      logger.error(`[${host}] JWT 无效!`);
      res.status(401).json({ message: "Unauthorized" });
      return;
    }

    const publicKeyPem = fs.readFileSync(
      envConfig.ASYMMETRIC_PUBLIC_KEY,
      "utf8"
    );
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
      // 设置并验证JWT验证窗口期时长, 自iat到现在不能超过1分钟
      // maxTokenAge: "2 minutes",
    });
    logger.debug(`payload: ${JSON.stringify(payload)}`);

    const { id } = payload;
    if (!id || id !== process.env.JWT_PAYLOAD_KEY!) {
      logger.error(`[${host}] JWT 用户信息无效!`);
      res.status(401).json({ message: "Unauthorized" });
      return;
    }

    logger.debug(`[${host}] JWT 验证通过!`);
    next();
  } catch (err) {
    logger.error(`[${host}] JWT 验证失败: ${err}`);
    res.status(401).json({ message: "Unauthorized" });
    return;
  }
};

export default authorizeJWT;
