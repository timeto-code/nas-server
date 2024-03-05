import { Request, Response } from "express";
import prisma from "../../lib/prisma";
import logger from "../../util/logger";
import { v4 as uuidv4 } from "uuid";
import { envConfig } from "../../util/env.config";

const getDownloadToken = async (req: Request, res: Response) => {
  try {
    const { link } = req.params;
    const file = await prisma.file.findUnique({
      where: { link },
    });

    if (!file) {
      logger.warn(`获取下载链接失败，文件不存在！`);
      return res
        .status(404)
        .json({ message: "获取下载链接失败，文件不存在！" });
    }

    const downloadToken = await prisma.download_Token.create({
      data: {
        fileId: file.id,
        token: uuidv4(),
        expiresAt: new Date(Date.now() + 1000 * 60),
      },
    });

    const downloadLink = `${envConfig.PROTOCOL}://${envConfig.HOST}:${envConfig.PORT}/download/${file.link}?token=${downloadToken.token}`;
    return res.status(200).json({ downloadLink });
  } catch (error) {
    logger.error(`获取下载链接失败，服务器异常: ${error}`);
    return res.status(500).json({ message: "获取下载链接失败" });
  }
};

export default getDownloadToken;
