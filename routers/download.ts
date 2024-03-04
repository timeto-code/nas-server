import express, { NextFunction, Router, Request, Response } from "express";
import path from "path";
import { envConfig } from "../util/env.config";
import logger from "../util/logger";
import prisma from "../lib/prisma";

const downloadRouter = Router();

const verifyToken = async (req: Request, res: Response, next: NextFunction) => {
  const { token } = req.query;
  if (!token) {
    logger.error(`无效链接！`);
    return res.status(401).json({ message: "无效链接！" });
  }

  const existingToke = await prisma.download_Token.findUnique({
    where: {
      token: token as string,
    },
  });

  if (!existingToke) {
    logger.error(`无效的下载链接！`);
    return res.status(401).json({ message: "无效的下载链接！" });
  }

  if (existingToke.expiresAt < new Date()) {
    logger.error(`下载链接已过期！`);
    return res.status(401).json({ message: "下载链接已过期！" });
  }

  next();
};

downloadRouter.use(
  "/",
  verifyToken,
  (req, res, next) => {
    res.setHeader("Content-Disposition", "attachment");
    next();
  },
  express.static(path.join(envConfig.SERVER_ROOT!, "resources"))
);

export default downloadRouter;
