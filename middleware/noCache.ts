import { Request, Response } from "express";

const noCache = (req: Request, res: Response, next: () => void) => {
  res.set("Cache-Control", "no-store, no-cache, must-revalidate, proxy-revalidate");
  res.set("Pragma", "no-cache");
  res.set("Expires", "0");
  res.set("Surrogate-Control", "no-store");
  next();
};

export default noCache;
