import { Router } from "express";
import multer from "multer";
import path from "path";
import deleteFile from "../api/file/delete";
import moveFile from "../api/file/move";
import renameFile from "../api/file/rename";
import getDownloadToken from "../api/file/token";
import { uploadFile } from "../api/file/upload";
import { envConfig } from "../util/env.config";

const fileRouter = Router();
const tempPath = path.join(envConfig.SERVER_ROOT!, "resources", "temp");
const upload = multer({ dest: tempPath });

fileRouter.post("/upload", upload.single("file"), async (req, res) => {
  uploadFile(req, res);
});

fileRouter.get("/token/:link", async (req, res) => {
  getDownloadToken(req, res);
});

fileRouter.put("/rename", async (req, res) => {
  renameFile(req, res);
});

fileRouter.put("/move", async (req, res) => {
  moveFile(req, res);
});

fileRouter.delete("/delete/:id", async (req, res) => {
  deleteFile(req, res);
});

export default fileRouter;
