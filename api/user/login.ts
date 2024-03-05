import bcrypt from "bcrypt";
import { Request, Response } from "express";
import { LoginDto } from "../../DTOs/UserDTOs";
import prisma from "../../lib/prisma";
import logger from "../../util/logger";
import { unauthorized } from "../response";

const login = async (req: Request, res: Response) => {
  try {
    const validation = LoginDto.safeParse(req.body);

    if (!validation.success) {
      logger.warn(`登录表单信息无效：${validation.error.errors[0].message}`);
      return unauthorized(res);
    }

    const { username: name, password } = validation.data;

    const user = await prisma.user.findFirst({
      where: {
        name,
      },
    });

    if (!user) {
      logger.warn(`登录用户数据库未找到：${name}`);
      return unauthorized(res);
    }

    const passwordsMatch = await bcrypt.compare(password, user.hashedPassword);

    if (!passwordsMatch) {
      logger.warn(`登录用户密码不匹配：${name}`);
      return unauthorized(res);
    }

    return res.status(200).json(user);
  } catch (error) {
    logger.error(`登录失败，服务器异常: ${error}`);
    return unauthorized(res);
  }
};

export default login;
