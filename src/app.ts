import path from "node:path";
import express from "express";
import pinoHttp from "pino-http";
import { logger } from "./infrastructure/logger/logger";
import { prisma } from "./infrastructure/prisma/client";
import { swaggerDocument } from "./docs/swagger";
import { corsMiddleware, helmetMiddleware, rateLimiter } from "./shared/middleware/security";
import { notFoundHandler } from "./shared/middleware/notFoundHandler";
import { errorHandler } from "./shared/middleware/errorHandler";
import { healthRouter } from "./modules/health/routes/health.routes";
import { authRouter } from "./modules/auth/routes/auth.routes";
import { studentRouter } from "./modules/students/routes/student.routes";
import { facultyRouter } from "./modules/faculties/routes/faculty.routes";
import { departmentRouter } from "./modules/departments/routes/department.routes";
import { levelRouter } from "./modules/levels/routes/level.routes";
import { enrollmentRouter } from "./modules/enrollments/routes/enrollment.routes";
import { adminRouter } from "./modules/admins/routes/admin.routes";
import {
  buildSwaggerIndexHtml,
  swaggerUiIndexHtmlHandler,
  swaggerUiInitMiddleware,
} from "./shared/swagger/swaggerDocs";

const swaggerIndexHtml = buildSwaggerIndexHtml(swaggerDocument, {
  title: "UCAO University API",
});

export const app = express();

app.set("trust proxy", 1);

app.use(pinoHttp({ logger }));
app.use(helmetMiddleware);
app.use(corsMiddleware);
app.use(rateLimiter);
app.use(express.json());
app.use(express.static(path.join(process.cwd(), "public"), { index: false }));

app.get("/", async (_req, res) => {
  res.setHeader("Cache-Control", "no-store");
  let database: "ok" | "error" = "error";
  try {
    await prisma.$queryRaw`SELECT 1`;
    database = "ok";
  } catch {
    database = "error";
  }
  res.status(200).json({
    service: "UCAO University API",
    status: "running",
    environment: process.env.NODE_ENV ?? "unknown",
    timestamp: new Date().toISOString(),
    uptimeSeconds: Math.round(process.uptime() * 1000) / 1000,
    database,
    message:
      database === "ok"
        ? "API opérationnelle, base joignable. Santé : GET /api/health · Documentation : /api/docs"
        : "API démarrée mais la base de données ne répond pas. Vérifiez DATABASE_URL (ex. Neon) sur l'hébergeur.",
    links: {
      health: "/api/health",
      docs: "/api/docs",
      openApiJson: "/api/docs.json",
    },
  });
});

app.get("/api/docs.json", (_req, res) => res.json(swaggerDocument));
app.use("/api/docs", swaggerUiInitMiddleware(), swaggerUiIndexHtmlHandler(swaggerIndexHtml));

app.use("/api", healthRouter);
app.use("/api", authRouter);
app.use("/api", studentRouter);
app.use("/api", facultyRouter);
app.use("/api", departmentRouter);
app.use("/api", levelRouter);
app.use("/api", enrollmentRouter);
app.use("/api", adminRouter);

app.use(notFoundHandler);
app.use(errorHandler);

export default app;
