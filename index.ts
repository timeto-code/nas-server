import "./dotenv.config";
import cors from "cors";
import express from "express";
import authorizeJWT from "./middleware/auth/authorizeJWT";
import noCache from "./middleware/noCache";
import downloadRouter from "./routers/download";
import fileRouter from "./routers/file";
import folderRouter from "./routers/folder";
import userRouter from "./routers/user";
import { envConfig } from "./util/env.config";
import logger from "./util/logger";
import connectionTestRouter from "./routers/connect";

const app = express();
// app.set("trust proxy", true);
app.use(
  cors({
    origin: envConfig.CORS_ORIGIN.split(",").map((origin) => origin.trim()),
    // credentials: true,
  })
);

app.use(express.json());
app.use(noCache);
// app.use(ensureEnvVars);

// 请求验证中间件
// app.use(authorizeToken);
app.use(authorizeJWT);

// 处理请求
// app.use("/", rootRouter);
// app.use("/favicon.ico", express.static("public/favicon.ico"));
// app.use("/robots.txt", express.static("public/robots.txt"));

// API 路由
app.use("/connection-test", connectionTestRouter);
app.use("/download", downloadRouter);
app.use("/api/user", userRouter);
app.use("/api/folder", folderRouter);
app.use("/api/file", fileRouter);

const host = envConfig.LISTEN_HOST!;
const port = parseInt(envConfig.PORT!);
const server = app.listen(port, host, () => {
  logger.debug(`Server is running on port ${port} 🚀...`);
});

server.on("connection", (socket) => {
  socket.setTimeout(30 * 1000);
});
