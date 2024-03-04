import bcrypt from "bcrypt";
import { Request, Response } from "express";
import { CreateUserDto } from "../../DTOs/UserDTOs";
import prisma from "../../lib/prisma";
import logger from "../../util/logger";

const createUser = async (req: Request, res: Response) => {
  try {
    const validation = CreateUserDto.safeParse(req.body);

    if (!validation.success) {
      logger.warn(`创建用户失败，无效用户信息！`);
      return res.status(400).json({ message: "创建用户失败，无效用户信息！" });
    }

    const { name, email, password } = validation.data;

    const userNameExisted = await prisma.user.findUnique({
      where: {
        name,
      },
    });

    if (userNameExisted) {
      logger.warn(`注册失败用户名 ${name} 已存在`);
      return res.status(400).json({ message: "用户名已存在" });
    }

    const userEmailExisted = await prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (userEmailExisted) {
      logger.warn(`注册失败邮箱 ${email} 已存在`);
      return res.status(400).json({ message: "邮箱已存在" });
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

    const root = await prisma.folder.create({
      data: {
        name: user.id + "_root",
        userId: user.id,
      },
    });

    logger.info(`用户创建成功: ${user.name} [${user.id}]`);
    return res.status(201).send();
  } catch (error) {
    logger.error(`创建用户失败: ${error}`);
    return res.status(500).json({ message: "创建用户失败" });
  }
};

export default createUser;
