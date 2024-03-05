import { Request, Response } from "express";
import prisma from "../../lib/prisma";
import logger from "../../util/logger";
import { fetchFolderFailed } from "./response";

const getFolderById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    if (!id) {
      logger.error(`查询文件夹失败，无效 Id`);
      return fetchFolderFailed(res);
    }

    const folder = await prisma.folder.findFirst({
      where: {
        AND: {
          id: id,
        },
      },
      include: {
        files: true,
        subFolders: true,
      },
    });

    if (!folder) {
      logger.error(`查询文件夹失败，文件夹不存在：${id}`);
      return fetchFolderFailed(res);
    }

    return res.status(200).json(folder);
  } catch (error) {
    logger.error(`查询文件夹失败，服务器异常: ${error}`);
    return fetchFolderFailed(res);
  }
};

export default getFolderById;
