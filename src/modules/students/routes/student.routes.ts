import { Router } from "express";
import { validateBody } from "../../../shared/validators/validateBody";
import { validateParams } from "../../../shared/validators/validateParams";
import { requireServiceApiKey, verifyEndpointRateLimiter } from "../../../shared/middleware/service-auth";
import { requireAuth, requirePermissions } from "../../auth/service/auth-guard.service";
import { StudentController } from "../controller/student.controller";
import { StudentRepository } from "../repository/student.repository";
import { StudentService } from "../service/student.service";
import { createStudentSchema, emailParamSchema, idParamSchema, matriculeParamSchema, studentStatusSchema } from "../validator/student.validator";

const controller = new StudentController(new StudentService(new StudentRepository()));

export const studentRouter = Router();

studentRouter.get(
  "/students/verify/:matricule",
  verifyEndpointRateLimiter,
  requireServiceApiKey,
  validateParams(matriculeParamSchema),
  (req, res, next) =>
  controller.verify(req, res, next),
);

studentRouter.use(requireAuth);

studentRouter.get("/students", requirePermissions("students:read"), (req, res, next) => controller.list(req, res, next));
studentRouter.post("/students", requirePermissions("students:write"), validateBody(createStudentSchema), (req, res, next) =>
  controller.create(req, res, next),
);
studentRouter.get("/students/:id", requirePermissions("students:read"), validateParams(idParamSchema), (req, res, next) =>
  controller.getById(req, res, next),
);
studentRouter.get(
  "/students/matricule/:matricule",
  requirePermissions("students:read"),
  validateParams(matriculeParamSchema),
  (req, res, next) => controller.getByMatricule(req, res, next),
);
studentRouter.get("/students/email/:email", requirePermissions("students:read"), validateParams(emailParamSchema), (req, res, next) =>
  controller.getByEmail(req, res, next),
);
studentRouter.patch(
  "/students/:id/status",
  requirePermissions("students:write"),
  validateParams(idParamSchema),
  validateBody(studentStatusSchema),
  (req, res, next) => controller.updateStatus(req, res, next),
);
