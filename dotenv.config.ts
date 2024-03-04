// 开发测试阶段需要动态导入不同 .env.* 文件
import dotenv from "dotenv";
dotenv.config({ path: `.env.${process.env.NODE_ENV}` });

// 部署打包阶段需要动态导入 .env 文件
// import "dotenv/config";
