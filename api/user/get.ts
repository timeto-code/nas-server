import { Request, Response } from "express";
import GetUserDto from "../../DTOs/user/GetUserDto";
import prisma from "../../lib/prisma";

const getUserByIdOrNameOrEmail = async (req: Request, res: Response) => {
  const validation = GetUserDto.safeParse(req.body);

  if (!validation.success) {
    return res.status(400).json({ message: "用户信息无效" });
  }

  const { id, name, email } = validation.data;

  if (!id && !name && !email) {
    return res.status(400).json({ message: "用户信息无效" });
  }

  const conditions = [];
  if (id) conditions.push({ id });
  if (name) conditions.push({ name });
  if (email) conditions.push({ email });

  if (conditions.length < 1) {
    return res.status(400).json({ message: "用户信息无效" });
  }

  const where = { OR: conditions };

  const user = await prisma.user.findFirst({
    where,
  });

  if (!user) {
    return res.status(404).json({ message: "用户不存在" });
  }

  return res.status(200).json(user);
};

export default getUserByIdOrNameOrEmail;
