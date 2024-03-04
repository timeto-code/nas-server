import { Request, Response } from "express";
import { MoveFileDto } from "../../DTOs/FileDTOs";
import prisma from "../../lib/prisma";
import logger from "../../util/logger";

const moveFile = async (req: Request, res: Response) => {
  try {
    const validation = MoveFileDto.safeParse(req.body);

    if (!validation.success) {
      logger.warn(`移动文件失败，无效文件信息！`);
      return res.status(400).json({ message: "移动文件失败，无效文件信息！" });
    }

    const { id, folderId } = validation.data;

    const file = await prisma.file.findUnique({
      where: { id },
    });

    if (!file) {
      logger.warn(`移动文件失败，文件不存在！`);
      return res.status(404).json({ message: "移动文件失败，文件不存在！" });
    }

    const folder = await prisma.folder.findUnique({
      where: { id: folderId },
    });

    if (!folder) {
      logger.warn(`移动文件失败，目标文件夹不存在！`);
      return res
        .status(404)
        .json({ message: "移动文件失败，目标文件夹不存在！" });
    }

    await prisma.file.update({
      where: { id },
      data: { folderId },
    });

    return res.status(200).send();
  } catch (error) {
    logger.error(`移动文件失败: ${error}`);
    return res.status(500).json({ message: "移动文件失败" });
  }
};

export default moveFile;
