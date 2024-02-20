import prisma from "../lib/prisma";
import { Request, Response } from "express";

// 这个方法最有在应用初始化时调用，用于初始化数据库root用户和root文件夹。
const init = async (req: Request, res: Response) => {
  let rootUser;
  let rootFolder;
  rootUser = await prisma.user.findUnique({
    where: {
      name: "root",
    },
  });

  if (!rootUser) {
    rootUser = await prisma.user.create({
      data: {
        name: "root",
        alias: "root",
        email: "root@email.com",
      },
    });
  }

  rootFolder = await prisma.folder.findUnique({
    where: {
      path: "/root",
    },
  });

  if (!rootFolder) {
    rootFolder = await prisma.folder.create({
      data: {
        name: "root",
        path: "/root",
        userId: rootUser.id,
      },
    });
  }
};

export default init;
