import { Request, Response } from "express";
import { GetFolderDto } from "../../DTOs/FolderDTOs";
import prisma from "../../lib/prisma";

const getFolderByInfo = async (req: Request, res: Response) => {
  const validation = GetFolderDto.safeParse(req.body);

  if (!validation.success) {
    return res.status(400).json({ message: "无效文件夹信息" });
  }

  const { id, name, parentId, path, userId } = validation.data;

  if (!id && !name && !parentId && !path && !userId) {
    return res.status(400).json({ message: "无效文件夹索引" });
  }

  const conditions = [];
  if (id) conditions.push({ id });
  if (name) conditions.push({ name });
  if (parentId) conditions.push({ parentId });
  if (path) conditions.push({ path });
  if (userId) conditions.push({ userId });

  const where = { OR: conditions };

  const folders = await prisma.folder.findMany({
    where,
  });

  return res.status(200).json(folders);
};

export default getFolderByInfo;
