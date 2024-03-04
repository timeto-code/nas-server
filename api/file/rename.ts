import { Request, Response } from "express";
import { RenameFileDto } from "../../DTOs/FileDTOs";
import prisma from "../../lib/prisma";
import logger from "../../util/logger";

const renameFile = async (req: Request, res: Response) => {
  const validation = RenameFileDto.safeParse(req.body);
  if (!validation.success) {
    logger.warn("无效文件名");
    return res.status(400).json({ message: "无效文件名" });
  }

  const { id, name } = validation.data;

  try {
    const existingFile = await prisma.file.findUnique({
      where: { id },
    });

    if (!existingFile) {
      logger.warn("数据库文件不存在");
      return res.status(404).json({ message: "数据库文件不存在" });
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
    logger.error(`文件名更新失败: ${error}`);
    return res.status(500).json({ message: "服务器错误" });
  }
};

export default renameFile;
