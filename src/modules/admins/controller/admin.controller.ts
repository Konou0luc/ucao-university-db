import type { NextFunction, Request, Response } from "express";
import { AdminService } from "../service/admin.service";

export class AdminController {
  constructor(private readonly service: AdminService) {}

  async list(_req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const admins = await this.service.list();
      res.status(200).json({ success: true, message: "Liste des admins", data: admins });
    } catch (error) {
      next(error);
    }
  }
}
