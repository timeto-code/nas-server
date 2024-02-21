import "dotenv/config";
import express from "express";
import ensureEnvVars from "./middleware/ensureEnvVars";
import noCache from "./middleware/noCache";
import rootRouter from "./routers/root";
import authorizeToken from "./middleware/auth/authorizeToken";
import authorizeJWT from "./middleware/auth/authorizeJWT";
import logger from "./logger";
import userRouter from "./routers/user";
import folderRouter from "./routers/folder";

const app = express();
// app.set("trust proxy", true);
app.use(express.static("public"));
app.use(express.json());
app.use(noCache);
// app.use(ensureEnvVars);

// 请求验证中间件
// app.use(authorizeToken);
// app.use(authorizeJWT);

// 处理请求
app.use("/", rootRouter);
app.use("/favicon.ico", express.static("public/favicon.ico"));
// app.use("/robots.txt", express.static("public/robots.txt"));
app.use("/api/user", userRouter);
app.use("/api/folder", folderRouter);

const port = parseInt(process.env.DDNS_SERVER_PORT!);
const host = "localhost";
const server = app.listen(port, host, () => {
  logger.debug(`Server is running on port ${port} 🚀...`);
});

server.on("connection", (socket) => {
  socket.setTimeout(30 * 1000);
});
