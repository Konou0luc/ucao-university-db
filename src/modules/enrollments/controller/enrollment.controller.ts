import type { NextFunction, Request, Response } from "express";
import { EnrollmentService } from "../service/enrollment.service";
export class EnrollmentController { constructor(private readonly service: EnrollmentService) {} async list(_req:Request,res:Response,next:NextFunction){try{res.status(200).json({success:true,message:"Enrollments",data:await this.service.list()});}catch(e){next(e);}} async create(req:Request,res:Response,next:NextFunction){try{res.status(201).json({success:true,message:"Enrollment cree",data:await this.service.create(req.body)});}catch(e){next(e);}} }
