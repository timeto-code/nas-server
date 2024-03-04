import { Request, Response } from "express";
import prisma from "../../lib/prisma";
import logger from "../../util/logger";

const deleteFolder = async (req: Request, res: Response) => {
  const { id } = req.params;

  if (!id) {
    logger.warn(`删除失败，无效文件夹索引！`);
    return res.status(400).json({ message: "删除失败，无效文件夹索引！" });
  }

  try {
    const folder = await prisma.folder.findUnique({
      where: { id },
    });

    if (!folder) {
      logger.warn(`删除失败，文件夹不存在！`);
      return res.status(404).json({ message: "删除失败，文件夹不存在！" });
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
    logger.error(`删除文件夹失败: ${error}`);
    return res.status(500).json({ message: "删除文件夹失败" });
  }
};

export default deleteFolder;
