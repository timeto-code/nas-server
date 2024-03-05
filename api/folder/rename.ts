import { Request, Response } from "express";
import { RenameFolderDto } from "../../DTOs/FolderDTOs";
import prisma from "../../lib/prisma";
import logger from "../../util/logger";
import { renameFolderFailed } from "./response";

const renameFolder = async (req: Request, res: Response) => {
  try {
    const validation = RenameFolderDto.safeParse(req.body);

    if (!validation.success) {
      logger.warn(
        `重命名文件夹失败，表单无效：${validation.error.errors[0].message}`
      );
      return renameFolderFailed(res);
    }

    const { id, name } = validation.data;

    const existingFolder = await prisma.folder.findUnique({
      where: { id },
    });

    if (!existingFolder) {
      logger.warn(`重命名文件夹失败，文件夹不存在: ${id}`);
      return renameFolderFailed(res);
    }

    await prisma.folder.update({
      where: { id },
      data: { name },
    });

    return res.status(200).send();
  } catch (error) {
    logger.error(`重命名文件夹失败，服务器异常: ${error}`);
    return renameFolderFailed(res);
  }
};

export default renameFolder;
