import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import { env } from "../../config/env";

export const helmetMiddleware = helmet({
  contentSecurityPolicy: {
    directives: {
      ...helmet.contentSecurityPolicy.getDefaultDirectives(),
      "script-src": ["'self'", "https://unpkg.com"],
      "style-src": ["'self'", "'unsafe-inline'", "https:", "https://unpkg.com"],
      "img-src": ["'self'", "data:", "https:", "https://unpkg.com"],
      "font-src": ["'self'", "https:", "data:", "https://unpkg.com"],
      "connect-src": ["'self'", "https://unpkg.com"],
    },
  },
});

export const corsMiddleware = cors({
  origin: env.CORS_ORIGIN.split(",").map((o) => o.trim()),
  credentials: true,
});

export const rateLimiter = rateLimit({
  windowMs: env.RATE_LIMIT_WINDOW_MS,
  limit: env.RATE_LIMIT_MAX,
  standardHeaders: true,
  legacyHeaders: false,
});
