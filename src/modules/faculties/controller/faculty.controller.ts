import type { NextFunction, Request, Response } from "express";
import { FacultyService } from "../service/faculty.service";

export class FacultyController {
  constructor(private readonly service: FacultyService) {}
  async list(_req: Request, res: Response, next: NextFunction): Promise<void> {
    try { res.status(200).json({ success: true, message: "Facultes", data: await this.service.list() }); } catch (e) { next(e); }
  }
  async create(req: Request, res: Response, next: NextFunction): Promise<void> {
    try { res.status(201).json({ success: true, message: "Faculte creee", data: await this.service.create(req.body) }); } catch (e) { next(e); }
  }
}
