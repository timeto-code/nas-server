import { Request, Response } from "express";
import fs from "fs";
import path from "path";
import { v4 as uuidv4 } from "uuid";
import prisma from "../../lib/prisma";
import logger from "../../util/logger";
import { envConfig } from "../../util/env.config";

const uploadFile = async (req: Request, res: Response) => {
  if (!req.file) {
    // 如果请求中没有包含文件
    return res.status(400).send({ error: "文件内容为空" });
  }

  let { chunkIndex, fileName, isLastChunk, folderId } = req.body; // 从请求体中获取分块索引和文件名

  // 获取父文件夹的信息
  try {
    const folder = await prisma.folder.findUnique({
      where: {
        id: folderId,
      },
      include: {
        files: true,
      },
    });

    if (!folder) {
      return res.status(404).send({ error: "文件夹不存在" });
    }

    // 获取文件夹下的所有文件
    const files = folder.files;

    // 判断包含文件名的有多少个
    const existingFile = files.filter((file) => file.name.includes(fileName));

    // 如果有同名文件，就在文件名后面加上一个数字
    if (existingFile.length > 0) {
      const name = fileName.split(".").shift();
      const extension = fileName.split(".").pop();
      fileName = `${name}(${existingFile.length}).${extension}`;
    }

    const chunkPath = req.file.path; // 获取上传的文件分块的路径
    const link = `${fileName.split(".").shift()}_${uuidv4()}.${fileName
      .split(".")
      .pop()}`;
    const fileDir = path.join(envConfig.SERVER_ROOT!, "resources", link); // 计算最终文件的存储路径

    // 如果是第一个分块且最终文件已存在，则删除最终文件
    if (chunkIndex == 0 && fs.existsSync(fileDir)) {
      fs.unlinkSync(fileDir);
    }

    // 将分块内容追加到最终文件中
    fs.appendFileSync(fileDir, fs.readFileSync(chunkPath));
    // 删除已上传的分块文件
    fs.unlinkSync(chunkPath);

    if (isLastChunk === "true") {
      // 假设所有块都已上传，并且文件重组完成
      const file = await prisma.file.create({
        data: {
          name: fileName,
          size: fs.statSync(fileDir).size,
          type: fileName.split(".").pop(),
          link,
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
    logger.error(error);
    res.status(500).send({ error: "上传失败，需要实现重试机制" }); // 返回500状态码和错误信息
  }
};

export default uploadFile;
