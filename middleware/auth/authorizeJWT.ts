import { createPublicKey } from "crypto";
import { NextFunction, Request, Response } from "express";
import fs from "fs";
import { jwtVerify } from "jose";
import { unauthorized } from "../../api/response";
import prisma from "../../lib/prisma";
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
    const pathsToSkip = ["/api/file/upload", "/download", "/connection-test"];
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
      logger.error(`JWT 验证失败，[${host}] 未提供 JWT！`);
      return unauthorized(res);
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

    // 在登录和注册时，因为不存在用户信息，所以不需要进行 payload 验证
    const userAuthPath = [
      "/api/user/login",
      "/api/user/login/fetch",
      "/api/folder/login/fetchUserRoot",
      "/api/user/register",
    ];
    const unauthPayload = userAuthPath.some((path) =>
      req.path.startsWith(path)
    );
    if (!unauthPayload) {
      const { id } = payload as { id: string };

      if (!id) {
        logger.error(`JWT 验证失败，[${host}] 未找到 JWT payload id 为空！`);
        return unauthorized(res);
      }

      const user = await prisma.user.findUnique({
        where: { id },
      });

      if (!user) {
        logger.error(`JWT 验证失败，[${host}] 未找到用户: ${id}！`);
        return unauthorized(res);
      }
    }

    logger.debug(`[${host}] JWT 验证通过!`);
    next();
  } catch (err) {
    logger.error(`JWT 验证失败，服务器异常: [${host}] ${err}`);
    return unauthorized(res);
  }
};

export default authorizeJWT;
