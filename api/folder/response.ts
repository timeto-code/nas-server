import { Response } from "express";

export const folderNotFound = (res: Response) => {
  res.status(404).json({ message: "文件夹不存在" });
};

export const createFolderFailed = (res: Response) => {
  res.status(500).json({ message: "创建文件夹失败" });
};

export const deleteFolderFailed = (res: Response) => {
  res.status(500).json({ message: "删除文件夹失败" });
};

export const fetchFolderFailed = (res: Response) => {
  res.status(500).json({ message: "查询文件夹失败" });
};

export const moveFolderFailed = (res: Response) => {
  res.status(500).json({ message: "移动文件夹失败" });
};

export const renameFolderFailed = (res: Response) => {
  res.status(500).json({ message: "重命名文件夹失败" });
};
