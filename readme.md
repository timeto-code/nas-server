# NAS 资源管理服务器

Node + TypeScript + Express + Jose + Prisma + MySQL

## 功能

- 文件夹管理
- 文件管理
- 文件上传
- 文件下载
- 文件搜索
- 文件分享
- 用户管理
- 权限管理

## 部署 & 运行

- 安装 Node.js
- 下载并解压服务器应用文件
- 执行 `npm install --omit=dev` 安装依赖
- 执行 `npx prisma generate` 生成 Prisma Client（可选）
- 安装 MySQL 数据库
- 创建数据库，创建用户，并授予用户权限
- 配置服务器 `.env` 文件，配置数据库连接信息
- 在服务器根目录中执行 `npx prisma db push` 创建数据库表
- 将服务器 db 目录下的存储过程写入数据库
- 安装 PM2 进程管理器
- 执行 `pm2 start ecosystem.config.js` 启动服务器
