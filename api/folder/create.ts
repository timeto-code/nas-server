import { Request, Response } from "express";
import { CreateFolderDto } from "../../DTOs/FolderDTOs";
import prisma from "../../lib/prisma";
import logger from "../../util/logger";

const createFolder = async (req: Request, res: Response) => {
  try {
    const validation = CreateFolderDto.safeParse(req.body);

    if (!validation.success) {
      logger.warn("文件夹信息无效");
      return res.status(400).json({ message: "文件夹信息无效" });
    }

    let { name, parentId } = validation.data;

    const parentFolder = await prisma.folder.findUnique({
      where: {
        id: parentId,
      },
    });

    if (!parentFolder) {
      logger.warn("父文件夹不存在");
      return res.status(404).json({ message: "父文件夹不存在" });
    }

    const existingFolder = await prisma.folder.findMany({
      where: {
        name: {
          contains: name,
        },
        parentId,
      },
    });

    if (existingFolder.length > 0) {
      name = `${name}（${existingFolder.length}）`;
    }

    const folder = await prisma.folder.create({
      data: { name, parentId },
    });

    const rootFolder = await prisma.folder.findFirst({
      where: {
        parentId: null,
      },
    });

    await prisma.$executeRaw`CALL InsertFolder(${rootFolder?.id}, ${folder.parentId})`;

    return res.status(201).send();
  } catch (error) {
    logger.error(`创建文件夹失败: ${error}`);
    return res.status(500).json({ message: "创建文件夹失败" });
  }
};

export default createFolder;
