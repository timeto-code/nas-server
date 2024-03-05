import { Request, Response } from "express";
import { CreateFolderDto } from "../../DTOs/FolderDTOs";
import prisma from "../../lib/prisma";
import logger from "../../util/logger";
import { invalidForm } from "../response";
import { createFolderFailed } from "./response";

const createFolder = async (req: Request, res: Response) => {
  try {
    const validation = CreateFolderDto.safeParse(req.body);

    if (!validation.success) {
      logger.warn(
        `创建文件夹失败，表单无效：${validation.error.errors[0].message}`
      );
      return invalidForm(res);
    }

    let { name, parentId } = validation.data;

    const parentFolder = await prisma.folder.findUnique({
      where: {
        id: parentId,
      },
    });

    if (!parentFolder) {
      logger.warn(`创建文件夹失败，父文件夹不存在！`);
      return createFolderFailed(res);
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
    logger.error(`创建文件夹失败，服务器异常: ${error}`);
    return createFolderFailed(res);
  }
};

export default createFolder;
