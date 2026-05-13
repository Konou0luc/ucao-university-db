import type { Request, Response } from "express";
import type { HealthResponseDto } from "../dto/health.dto";
import { HealthService } from "../service/health.service";
export class HealthController { constructor(private readonly service: HealthService) {} get(_req:Request,res:Response<HealthResponseDto>){ res.status(200).json({ success:true, message:"Health check successful", data:this.service.getStatus() }); } }
