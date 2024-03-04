import { Request, Response } from "express";
import { RenameFolderDto } from "../../DTOs/FolderDTOs";
import prisma from "../../lib/prisma";
import logger from "../../util/logger";

const renameFolder = async (req: Request, res: Response) => {
  try {
    const validation = RenameFolderDto.safeParse(req.body);

    if (!validation.success) {
      logger.warn(`重命名文件夹失败，无效文件夹信息！`);
      return res
        .status(400)
        .json({ message: "重命名文件夹失败，无效文件夹信息！" });
    }

    const { id, name } = validation.data;

    const existingFolder = await prisma.folder.findUnique({
      where: { id },
    });

    if (!existingFolder) {
      logger.warn(`重命名文件夹失败，文件夹不存在！`);
      return res
        .status(404)
        .json({ message: "重命名文件夹失败，文件夹不存在！" });
    }

    await prisma.folder.update({
      where: { id },
      data: { name },
    });

    return res.status(200).send();
  } catch (error) {
    logger.error(`重命名文件夹失败: ${error}`);
    return res.status(500).json({ message: "重命名文件夹失败" });
  }
};

export default renameFolder;
