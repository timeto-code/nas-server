import { Router } from "express";
import { envConfig } from "../util/env.config";
const connectionTestRouter = Router();

connectionTestRouter.get("/", async (req, res) => {
  res
    .status(200)
    .send({
      message: "successful",
      url: `${envConfig.PROTOCOL}://${envConfig.HOST}:${envConfig.PORT}`,
    });
});

export default connectionTestRouter;
