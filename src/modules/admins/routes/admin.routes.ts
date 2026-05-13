import { Router } from "express";
import { requireAuth, requirePermissions } from "../../auth/service/auth-guard.service";
import { AdminController } from "../controller/admin.controller";
import { AdminRepository } from "../repository/admin.repository";
import { AdminService } from "../service/admin.service";

const controller = new AdminController(new AdminService(new AdminRepository()));

export const adminRouter = Router();

adminRouter.use(requireAuth);
adminRouter.get("/admins", requirePermissions("structures:read"), (req, res, next) => controller.list(req, res, next));
