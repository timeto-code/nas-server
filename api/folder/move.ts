import { Request, Response } from "express";
import prisma from "../../lib/prisma";
import logger from "../../util/logger";
import { MoveFolderDto } from "../../DTOs/FolderDTOs";
import { invalidForm } from "../response";
import { moveFolderFailed } from "./response";

const moveFolder = async (req: Request, res: Response) => {
  try {
    const validation = MoveFolderDto.safeParse(req.body);

    if (!validation.success) {
      logger.warn(
        `移动文件夹失败，表单无效：${validation.error.errors[0].message}`
      );
      return invalidForm(res);
    }

    const { fronId, toId } = validation.data;

    const fromFolder = await prisma.folder.findUnique({
      where: { id: fronId },
    });

    if (!fromFolder) {
      logger.warn(`移动文件夹失败，源文件夹不存在: ${fronId}`);
      return moveFolderFailed(res);
    }

    const toFolder = await prisma.folder.findUnique({
      where: { id: toId },
    });

    if (!toFolder) {
      logger.warn(`移动文件夹失败，目标文件夹不存在: ${toId}`);
      return moveFolderFailed(res);
    }

    await prisma.folder.update({
      where: { id: fronId },
      data: { parentId: toId },
    });

    return res.status(200).send();
  } catch (error) {
    logger.error(`移动文件夹失败，服务器异常: ${error}`);
    return moveFolderFailed(res);
  }
};

export default moveFolder;
