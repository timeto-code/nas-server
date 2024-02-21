import bcrypt from "bcrypt";
import { Request, Response } from "express";
import CreateUserDto from "../../DTOs/user/CreateUserDto";
import prisma from "../../lib/prisma";

const createUser = async (req: Request, res: Response) => {
  const validation = CreateUserDto.safeParse(req.body);

  if (!validation.success) {
    return res.status(400).json({ message: "用户信息无效" });
  }

  const { name, email, password } = validation.data;

  const existingUser = await prisma.user.findFirst({
    where: {
      OR: [{ name }, { email }],
    },
  });

  if (existingUser) {
    return res.status(400).json({ message: "用户名或邮箱已存在" });
  }

  const salt = bcrypt.genSaltSync(10);
  const hashedPassword = bcrypt.hashSync(password, salt);

  const user = await prisma.user.create({
    data: {
      name,
      email,
      hashedPassword,
    },
  });


  // response.setHeader("Access-Control-Allow-Origin", "*");
  // response.setHeader("Access-Control-Allow-Methods", "POST");


  return res.status(201).json({ message: "用户创建成功", userId: user.id });
};

export default createUser;