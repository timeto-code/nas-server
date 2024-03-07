import bcrypt from "bcrypt";
import { Request, Response } from "express";
import { CreateUserDto } from "../../DTOs/UserDTOs";
import prisma from "../../lib/prisma";
import logger from "../../util/logger";
import { invalidForm } from "../response";
import { emailExists, registrationFailed, userNameExists } from "./response";

const createUser = async (req: Request, res: Response) => {
  try {
    const validation = CreateUserDto.safeParse(req.body);

    if (!validation.success) {
      logger.warn(`注册表单无效：${validation.error.errors[0].message}`);
      return invalidForm(res);
    }

    const { name, email, password } = validation.data;

    const userNameExisted = await prisma.user.findUnique({
      where: {
        name,
      },
    });

    if (userNameExisted) {
      logger.warn(`注册失败用户名已存在: ${name}`);
      return userNameExists(res);
    }

    const userEmailExisted = await prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (userEmailExisted) {
      logger.warn(`注册失败邮箱已存在: ${email}`);
      return emailExists(res);
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

    logger.info(`注册成功: ${user.name} [${user.id}]`);
    return res.status(201).send();
  } catch (error) {
    logger.error(`注册失败，服务器异常: ${error}`);
    return registrationFailed(res);
  }
};

export default createUser;
