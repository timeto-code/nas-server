import { Request, Response } from "express";
import { GetUserDto } from "../../DTOs/UserDTOs";
import prisma from "../../lib/prisma";
import logger from "../../util/logger";

const getUserByIdOrNameOrEmail = async (req: Request, res: Response) => {
  try {
    const validation = GetUserDto.safeParse(req.body);
    logger.info(`获取用户信息: ${JSON.stringify(validation)}`);

    if (!validation.success) {
      logger.warn(`获取用户信息失败，索引信息无效！`);
      return res
        .status(400)
        .json({ message: "获取用户信息失败，索引信息无效！" });
    }

    const { id, name, email } = validation.data;
    logger.info(`获取用户信息: ${id}, ${name}, ${email}`);

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

    logger.info(`获取用户信息成功: ${JSON.stringify(user)}`);
    return res.status(200).json({ user });
  } catch (error) {
    logger.error(`获取用户信息失败: ${error}`);
    return res.status(500).json({ message: "获取用户信息失败" });
  }
};

export default getUserByIdOrNameOrEmail;
