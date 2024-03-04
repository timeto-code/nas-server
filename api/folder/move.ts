import { Request, Response } from "express";
import prisma from "../../lib/prisma";
import logger from "../../util/logger";
import { MoveFolderDto } from "../../DTOs/FolderDTOs";

const moveFolder = async (req: Request, res: Response) => {
  try {
    const validation = MoveFolderDto.safeParse(req.body);

    if (!validation.success) {
      logger.warn(`移动文件夹失败，无效文件夹信息！`);
      return res
        .status(400)
        .json({ message: "移动文件夹失败，无效文件夹信息！" });
    }

    const { fronId, toId } = validation.data;

    const fromFolder = await prisma.folder.findUnique({
      where: { id: fronId },
    });

    if (!fromFolder) {
      logger.warn(`移动文件夹失败，源文件夹不存在！`);
      return res
        .status(404)
        .json({ message: "移动文件夹失败，源文件夹不存在！" });
    }

    const toFolder = await prisma.folder.findUnique({
      where: { id: toId },
    });

    if (!toFolder) {
      logger.warn(`移动文件夹失败，目标文件夹不存在！`);
      return res
        .status(404)
        .json({ message: "移动文件夹失败，目标文件夹不存在！" });
    }

    await prisma.folder.update({
      where: { id: fronId },
      data: { parentId: toId },
    });

    return res.status(200).send();
  } catch (error) {
    logger.error(`移动文件夹失败: ${error}`);
    return res.status(500).json({ message: "移动文件夹失败" });
  }
};

export default moveFolder;
