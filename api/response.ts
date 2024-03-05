import { Response } from "express";

export const unauthorized = (res: Response) => {
  res.status(401).json({ message: "Unauthorized" });
};

export const forbidden = (res: Response) => {
  res.status(403).json({ message: "Forbidden" });
};

export const invalidForm = (res: Response) => {
  res.status(400).json({ message: "表单无效" });
};
