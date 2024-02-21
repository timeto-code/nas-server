import { Router, response } from "express";
import logger from "../logger";
const router = Router();

router.post("/", (req, res) => {
  logger.debug("Received a request to /");
  res.send("Hello, World!");
});

export default router;
