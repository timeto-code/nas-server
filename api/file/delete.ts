import { Request, Response } from "express";
import prisma from "../../lib/prisma";
import logger from "../../util/logger";

const deleteFile = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const existingFile = await prisma.file.findUnique({
      where: { id },
    });

    if (!existingFile) {
      logger.warn("删除失败，文件不存在！");
      return res.status(404).json({
        message: "删除失败，文件不存在！",
      });
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
    logger.error(`文件删除失败: ${error}`);
    return res.status(500).json({
      message: "服务器错误",
    });
  }
};

export default deleteFile;
