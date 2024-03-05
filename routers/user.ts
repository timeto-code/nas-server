import { Router } from "express";
import createUser from "../api/user/create";
import getUserByIdOrNameOrEmail from "../api/user/fetch";
import login from "../api/user/login";
const userRouter = Router();

userRouter.post("/register", async (req, res) => {
  createUser(req, res);
});

userRouter.post("/fetch", async (req, res) => {
  getUserByIdOrNameOrEmail(req, res);
});

userRouter.post("/login", async (req, res) => {
  login(req, res);
});

userRouter.post("/login/fetch", async (req, res) => {
  getUserByIdOrNameOrEmail(req, res);
});

userRouter.put("/update", async (req, res) => {});

userRouter.delete("/delete", async (req, res) => {});

export default userRouter;
