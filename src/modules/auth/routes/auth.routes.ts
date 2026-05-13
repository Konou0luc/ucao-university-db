import { Router } from "express";
import { validateBody } from "../../../shared/validators/validateBody";
import { AuthController } from "../controller/auth.controller";
import { AuthRepository } from "../repository/auth.repository";
import { AuthService } from "../service/auth.service";
import { authLoginSchema, authLogoutSchema, authRefreshSchema } from "../validator/auth.validator";

const authController = new AuthController(new AuthService(new AuthRepository()));

export const authRouter = Router();

authRouter.post("/auth/login", validateBody(authLoginSchema), (req, res, next) => authController.login(req, res, next));
authRouter.post("/auth/refresh", validateBody(authRefreshSchema), (req, res, next) => authController.refresh(req, res, next));
authRouter.post("/auth/logout", validateBody(authLogoutSchema), (req, res, next) => authController.logout(req, res, next));
authRouter.post("/admin/login", validateBody(authLoginSchema), (req, res, next) => authController.login(req, res, next));
