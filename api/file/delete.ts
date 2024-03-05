import { Request, Response } from "express";
import prisma from "../../lib/prisma";
import logger from "../../util/logger";
import { deleteFileFailed } from "./response";

const deleteFile = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    if (!id) {
      logger.warn("删除文件失败，无效 id");
      return deleteFileFailed(res);
    }

    const existingFile = await prisma.file.findUnique({
      where: { id },
    });

    if (!existingFile) {
      logger.warn(`删除文件失败，文件不存在: ${id}`);
      return deleteFileFailed(res);
    }

    await prisma.file.delete({ where: { id } });
    const rootFolder = await prisma.folder.findFirst({
      where: { parentId: null },
    });

    await prisma.$executeRaw`CALL DeleteFolder(${rootFolder!.id},${
      existingFile.folderId
    })`;

    return res.status(200).send();
  } catch (error) {
    logger.error(`删除文件失败，文件不存在: ${error}`);
    return deleteFileFailed(res);
  }
};

export default deleteFile;
