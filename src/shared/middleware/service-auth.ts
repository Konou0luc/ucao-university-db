import type { NextFunction, Request, Response } from "express";
import rateLimit from "express-rate-limit";
import { env } from "../../config/env";
import { AppError } from "../errors/AppError";

export function requireServiceApiKey(req: Request, _res: Response, next: NextFunction): void {
  const key = req.headers["x-api-key"];
  const apiKey = Array.isArray(key) ? key[0] : key;

  if (!apiKey || apiKey !== env.SERVICE_API_KEY) {
    next(new AppError("Acces non autorise au endpoint de verification", 401));
    return;
  }

  next();
}

export const verifyEndpointRateLimiter = rateLimit({
  windowMs: env.RATE_LIMIT_WINDOW_MS,
  limit: env.VERIFY_RATE_LIMIT_MAX,
  standardHeaders: true,
  legacyHeaders: false,
});
