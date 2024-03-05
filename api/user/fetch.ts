import { Request, Response } from "express";
import { GetUserDto } from "../../DTOs/UserDTOs";
import prisma from "../../lib/prisma";
import logger from "../../util/logger";
import { fetchUserFailed, userNotFound } from "./response";
import { invalidForm } from "../response";

const getUserByIdOrNameOrEmail = async (req: Request, res: Response) => {
  try {
    const validation = GetUserDto.safeParse(req.body);

    if (!validation.success) {
      logger.warn(
        `用户查询失败，表单无效：${validation.error.errors[0].message}`
      );
      return invalidForm(res);
    }

    const { id, name, email } = validation.data;

    if (!id && !name && !email) {
      logger.warn(`用户查询失败，要素全空！`);
      return invalidForm(res);
    }

    const conditions = [];
    if (id) conditions.push({ id });
    if (name) conditions.push({ name });
    if (email) conditions.push({ email });

    const where = { OR: conditions };

    const user = await prisma.user.findFirst({
      where,
    });

    if (!user) {
      logger.warn(`用户查询失败，用户不存在！`);
      return userNotFound(res);
    }

    return res.status(200).json({ user });
  } catch (error) {
    logger.error(`用户查询失败，服务器异常: ${error}`);
    return fetchUserFailed(res);
  }
};

export default getUserByIdOrNameOrEmail;
