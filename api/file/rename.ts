import { Request, Response } from "express";
import { RenameFileDto } from "../../DTOs/FileDTOs";
import prisma from "../../lib/prisma";
import logger from "../../util/logger";
import { renameFileFailed } from "./response";

const renameFile = async (req: Request, res: Response) => {
  const validation = RenameFileDto.safeParse(req.body);
  if (!validation.success) {
    logger.warn(
      `文件名更新失败，表单无效：${validation.error.errors[0].message}`
    );
    return renameFileFailed(res);
  }

  const { id, name } = validation.data;

  try {
    const existingFile = await prisma.file.findUnique({
      where: { id },
    });

    if (!existingFile) {
      logger.warn(`文件名更新失败，文件不存在: ${id}`);
      return renameFileFailed(res);
    }

    // 检查新文件名是否有后辍
    let newName = name.includes(".") ? name.split(".").shift() : name;
    const extension = name.includes(".") ? "." + name.split(".").pop() : "";
    // 和旧文件名后辍是否一致, 不一致则改为一致
    if (
      existingFile.name.split(".").length > 1 &&
      extension !== existingFile.name.split(".").pop()
    ) {
      newName = `${newName}.${existingFile.name.split(".").pop()}`;
    } else {
      newName = `${newName}${extension}`;
    }

    await prisma.file.update({
      where: { id },
      data: { name: newName },
    });

    return res.status(200).send();
  } catch (error) {
    logger.error(`文件名更新失败，服务器异常: ${error}`);
    return renameFileFailed(res);
  }
};

export default renameFile;
