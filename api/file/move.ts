import { Request, Response } from "express";
import { MoveFileDto } from "../../DTOs/FileDTOs";
import prisma from "../../lib/prisma";
import logger from "../../util/logger";
import { moveFileFailed } from "./response";

const moveFile = async (req: Request, res: Response) => {
  try {
    const validation = MoveFileDto.safeParse(req.body);

    if (!validation.success) {
      logger.warn(
        `移动文件失败，表单无效：${validation.error.errors[0].message}`
      );
      return moveFileFailed(res);
    }

    const { id, folderId } = validation.data;

    const file = await prisma.file.findUnique({
      where: { id },
    });

    if (!file) {
      logger.warn(`移动文件失败，文件不存在: ${id}`);
      return moveFileFailed(res);
    }

    const folder = await prisma.folder.findUnique({
      where: { id: folderId },
    });

    if (!folder) {
      logger.warn(`移动文件失败，目标文件夹不存在: ${folderId}`);
      return moveFileFailed(res);
    }

    await prisma.file.update({
      where: { id },
      data: { folderId },
    });

    return res.status(200).send();
  } catch (error) {
    logger.error(`移动文件失败，服务器异常: ${error}`);
    return moveFileFailed(res);
  }
};

export default moveFile;
