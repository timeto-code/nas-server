import { Request, Response } from "express";
import prisma from "../../lib/prisma";
import logger from "../../util/logger";
import { deleteFolderFailed } from "./response";

const deleteFolder = async (req: Request, res: Response) => {
  const { id } = req.params;

  if (!id) {
    logger.warn(`删除文件夹失败，无效 id`);
    return deleteFolderFailed(res);
  }

  try {
    const folder = await prisma.folder.findUnique({
      where: { id },
    });

    if (!folder) {
      logger.warn(`删除文件夹失败，文件夹不存在！`);
      return deleteFolderFailed(res);
    }

    const rootFolder = await prisma.folder.findFirst({
      where: {
        parentId: null,
      },
    });

    await prisma.folder.delete({ where: { id } });
    await prisma.$executeRaw`CALL DeleteFolder(${rootFolder!.id},${
      folder.parentId
    })`;

    return res.status(200).send();
  } catch (error) {
    logger.error(`删除文件夹失败，服务器异常: ${error}`);
    return deleteFolderFailed(res);
  }
};

export default deleteFolder;
