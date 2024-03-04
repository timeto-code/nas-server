import bcrypt from "bcrypt";
import { Request, Response } from "express";
import { LoginDto } from "../../DTOs/UserDTOs";
import prisma from "../../lib/prisma";
import logger from "../../util/logger";

const authLogin = async (req: Request, res: Response) => {
  try {
    const validation = LoginDto.safeParse(req.body);

    if (!validation.success) {
      logger.warn(`获取用户信息失败，索引信息无效！`);
      return res
        .status(400)
        .json({ message: "获取用户信息失败，索引信息无效！" });
    }

    const { username: name, password } = validation.data;

    const user = await prisma.user.findFirst({
      where: {
        name,
      },
    });

    if (!user) {
      logger.warn(`用户不存在`);
      return res.status(404).json({ message: "用户不存在" });
    }

    const passwordsMatch = await bcrypt.compare(password, user.hashedPassword);

    if (!passwordsMatch) {
      logger.warn(`密码错误`);
      return res.status(401).json({ message: "密码错误" });
    }

    return res.status(200).json(user);
  } catch (error) {
    logger.error(`获取用户信息失败: ${error}`);
    return res.status(500).json({ message: "获取用户信息失败" });
  }
};

export default authLogin;
