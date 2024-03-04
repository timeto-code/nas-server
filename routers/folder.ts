import { Router } from "express";
import createFolder from "../api/folder/create";
import deleteFolder from "../api/folder/delete";
import getFolderById from "../api/folder/fetch";
import moveFolder from "../api/folder/move";
import renameFolder from "../api/folder/rename";
import getUserRootFolder from "../api/folder/fetchUserRoot";
const folderRouter = Router();

folderRouter.post("/create", async (req, res) => {
  createFolder(req, res);
});

folderRouter.delete("/delete/:id", async (req, res) => {
  deleteFolder(req, res);
});

folderRouter.get("/fetch/:id", async (req, res) => {
  getFolderById(req, res);
});

folderRouter.get("/fetchUserRoot/:id", async (req, res) => {
  getUserRootFolder(req, res);
});

folderRouter.put("/move", async (req, res) => {
  moveFolder(req, res);
});

folderRouter.put("/rename", async (req, res) => {
  renameFolder(req, res);
});

export default folderRouter;
