import { Response } from "express";

export const uploadFileFailed = (res: Response) => {
  res.status(500).json({ message: "上传文件失败" });
};

export const deleteFileFailed = (res: Response) => {
  res.status(500).json({ message: "删除文件失败" });
};

export const fetchFileFailed = (res: Response) => {
  res.status(500).json({ message: "查询文件失败" });
};

export const moveFileFailed = (res: Response) => {
  res.status(500).json({ message: "移动文件失败" });
};

export const renameFileFailed = (res: Response) => {
  res.status(500).json({ message: "重命名文件失败" });
};
