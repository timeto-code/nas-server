import { Router } from "express";
import createUser from "../api/user/create";
import getUserByIdOrNameOrEmail from "../api/user/get";
const userRouter = Router();

userRouter.post("/create", async (req, res) => {
  createUser(req, res);
});

userRouter.post("/get", async (req, res) => {
  getUserByIdOrNameOrEmail(req, res);
});

userRouter.put("/update", async (req, res) => {});

userRouter.delete("/delete", async (req, res) => {});

export default userRouter;
