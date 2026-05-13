import { Router } from "express";
import { HealthController } from "../controller/health.controller";
import { HealthRepository } from "../repository/health.repository";
import { HealthService } from "../service/health.service";
const controller = new HealthController(new HealthService(new HealthRepository()));
export const healthRouter = Router();
healthRouter.get("/health", (req,res)=>controller.get(req,res));
