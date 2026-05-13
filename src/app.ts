import express from "express";
import pinoHttp from "pino-http";
import swaggerUi from "swagger-ui-express";
import { logger } from "./infrastructure/logger/logger";
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

export const app = express();

app.use(pinoHttp({ logger }));
app.use(helmetMiddleware);
app.use(corsMiddleware);
app.use(rateLimiter);
app.use(express.json());

app.get("/api/docs.json", (_req, res) => res.json(swaggerDocument));
app.use("/api/docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument, { explorer: true }));

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
