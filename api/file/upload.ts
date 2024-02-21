import { Router, response } from "express";
import logger from "../../logger";
const router = Router();
import { Prisma } from "@prisma/client";

router.post("/", (req, res) => {
  console.log(req.body);
});

export default router;
