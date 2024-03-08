import { Request, Response } from "express";
import fs from "fs";
import path from "path";
import prisma from "../../lib/prisma";
import { envConfig } from "../../util/env.config";
import logger from "../../util/logger";
import { uploadFileFailed } from "./response";

// 上传文件
const uploadFile = async (req: Request, res: Response) => {
  try {
    if (!req.file) {
      logger.warn("上传文件失败，请求未携带任何文件！");
      return uploadFileFailed(res);
    }

    let { chunkIndex, fileName, isLastChunk, folderId } = req.body;
    const fileDir = path.join(envConfig.SERVER_ROOT!, "resources", fileName);

    if (chunkIndex == 0 && fs.existsSync(fileDir)) {
      fs.unlinkSync(fileDir);
    }

    const chunkPath = req.file.path;
    fs.appendFileSync(fileDir, fs.readFileSync(chunkPath));
    fs.unlinkSync(chunkPath);

    // 如果是最后一个块，数据库中创建文件记录
    if (isLastChunk === "true") {
      const folder = await prisma.folder.findUnique({
        where: {
          id: folderId,
        },
        include: {
          files: true,
        },
      });

      // 这个情况正常情况下不会发生，因为前端会在上传文件之前检查文件夹是否存在
      if (!folder) {
        logger.warn(`上传文件失败，文件夹不存在: ${folderId}`);
        return uploadFileFailed(res);
      }

      // 拆分文件名和扩展名
      let name = fileName;
      let baseName = fileName;
      let extension = "";
      const match = fileName.match(/^(.+?)(\.[^.]*$|$)/);
      if (match) {
        baseName = match[1];
        extension = match[2];
      }
      // 文件名在客户端时被添加了时间戳+folderId，这里去掉
      baseName = baseName.split("-");
      baseName = baseName.slice(1).join("");

      // 如果文件名已存在，则在文件名后面加上数字
      const files = folder.files;
      const existingFile = files.filter((file) => file.name.includes(fileName));
      if (existingFile.length > 0) {
        name = `${baseName}(${existingFile.length})${extension}`;
      }

      // 假设所有块都已上传，并且文件重组完成
      const file = await prisma.file.create({
        data: {
          name,
          size: fs.statSync(fileDir).size,
          type: extension.replace(".", ""),
          link: fileName,
          folderId,
        },
      });

      const rootFolder = await prisma.folder.findFirst({
        where: {
          parentId: null,
        },
      });

      await prisma.$executeRaw`CALL InsertFile(${rootFolder?.id}, ${file.folderId})`;
    }

    // 返回成功的响应，包含成功上传的文件名和分块索引
    res.send({
      message: `成功上传 ${fileName} 的第 ${chunkIndex} 块，可以实现进度条效果`,
    });
  } catch (error) {
    logger.error(`上传文件失败，服务器异常: ${error}`);
    res.status(500).send({ error: "上传失败，需要实现重试机制" }); // 返回500状态码和错误信息
  }
};

export { uploadFile };
