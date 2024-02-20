import { Router, response } from "express";
import logger from "../logger";
const router = Router();

router.post("/", (req, res) => {
  const newIp = req.headers["x-real-ip"] as string;

  if (!newIp || typeof newIp !== "string") {
    logger.error("IP address invalid or not found in headers!");
    return res.status(400).json({ message: "Bad Request!" });
  }

  if (!req.headers.host) {
    logger.error("Host header is required");
    return;
  }

  response.setHeader("Access-Control-Allow-Origin", "*");
  response.setHeader("Access-Control-Allow-Methods", "POST");

  res.status(200).json({ IPv4: newIp });
});

export default router;
