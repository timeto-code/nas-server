import { Request, Response } from "express";
import prisma from "../../lib/prisma";
import logger from "../../util/logger";

const getUserRootFolder = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    if (!id) {
      logger.error("无效用户Id");
      return res.status(400).json({ message: "无效用户Id" });
    }

    const folder = await prisma.folder.findFirst({
      where: {
        userId: id,
      },
      include: {
        files: true,
        subFolders: true,
      },
    });

    if (!folder) {
      logger.error(`用户Root文件夹不存在: ${id}`);
      return res.status(404).json({ message: "用户Root文件夹不存在" });
    }

    return res.status(200).json({ folder });
  } catch (error) {
    logger.error(`查询用户Root文件夹失败: ${error}`);
    return res.status(500).json({ message: "查询用户Root文件夹失败" });
  }
};

export default getUserRootFolder;
