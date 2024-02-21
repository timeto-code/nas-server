import { Router } from "express";
import getFolderByInfo from "../api/folder/get";
const folderRouter = Router();

folderRouter.post("/create", async (req, res) => {});

folderRouter.post("/get", async (req, res) => {
  getFolderByInfo(req, res);
});

folderRouter.put("/update", async (req, res) => {});

folderRouter.delete("/delete", async (req, res) => {});

export default folderRouter;
