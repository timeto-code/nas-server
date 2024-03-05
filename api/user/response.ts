import { Response } from "express";

export const userNotFound = (res: Response) => {
  res.status(404).json({ message: "用户不存在" });
};

export const userNameExists = (res: Response) => {
  res.status(409).json({ message: "用户名已存在" });
};

export const emailExists = (res: Response) => {
  res.status(409).json({ message: "邮箱已存在" });
};

export const registrationFailed = (res: Response) => {
  res.status(500).json({ message: "注册失败" });
};

export const fetchUserFailed = (res: Response) => {
  res.status(500).json({ message: "用户查询失败" });
};
