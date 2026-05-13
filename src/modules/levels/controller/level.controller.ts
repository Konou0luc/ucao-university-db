import type { NextFunction, Request, Response } from "express";
import { LevelService } from "../service/level.service";
export class LevelController { constructor(private readonly service: LevelService) {} async list(_req:Request,res:Response,next:NextFunction){try{res.status(200).json({success:true,message:"Levels",data:await this.service.list()});}catch(e){next(e);}} async create(req:Request,res:Response,next:NextFunction){try{res.status(201).json({success:true,message:"Level cree",data:await this.service.create(req.body)});}catch(e){next(e);}} }
