import type { NextFunction, Request, Response } from "express";
import { DepartmentService } from "../service/department.service";
export class DepartmentController { constructor(private readonly service: DepartmentService) {} async list(_req:Request,res:Response,next:NextFunction){try{res.status(200).json({success:true,message:"Departments",data:await this.service.list()});}catch(e){next(e);}} async create(req:Request,res:Response,next:NextFunction){try{res.status(201).json({success:true,message:"Department cree",data:await this.service.create(req.body)});}catch(e){next(e);}} }
