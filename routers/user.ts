import { Router } from "express";
import createUser from "../api/user/create";
import getUserByIdOrNameOrEmail from "../api/user/get";
const router = Router();

router.post("/create", async (req, res) => {
  createUser(req, res);
});

router.post("/get", async (req, res) => {
  getUserByIdOrNameOrEmail(req, res);
});

router.put("/update", async (req, res) => {});

router.delete("/delete", async (req, res) => {});

export default router;
