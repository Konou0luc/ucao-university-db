import type { NextFunction, Request, Response } from "express";
import type { CreateStudentDto } from "../dto/student.dto";
import { StudentService } from "../service/student.service";

function getParam(param: string | string[] | undefined): string {
  return Array.isArray(param) ? param[0] : (param ?? "");
}

export class StudentController {
  constructor(private readonly service: StudentService) {}

  async create(req: Request<unknown, unknown, CreateStudentDto>, res: Response, next: NextFunction): Promise<void> {
    try {
      const student = await this.service.create(req.body);
      res.status(201).json({ success: true, message: "Etudiant cree", data: student });
    } catch (error) {
      next(error);
    }
  }

  async list(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const data = await this.service.list(req.query as Record<string, string>);
      res.status(200).json({ success: true, message: "Liste des etudiants", data });
    } catch (error) {
      next(error);
    }
  }

  async getById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const student = await this.service.getById(getParam(req.params.id));
      res.status(200).json({ success: true, message: "Etudiant recupere", data: student });
    } catch (error) {
      next(error);
    }
  }

  async getByMatricule(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const student = await this.service.getByMatricule(getParam(req.params.matricule));
      res.status(200).json({ success: true, message: "Etudiant recupere", data: student });
    } catch (error) {
      next(error);
    }
  }

  async getByEmail(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const student = await this.service.getByEmail(getParam(req.params.email));
      res.status(200).json({ success: true, message: "Etudiant recupere", data: student });
    } catch (error) {
      next(error);
    }
  }

  async verify(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const result = await this.service.verifyByMatricule(getParam(req.params.matricule));
      res.status(200).json({ success: true, message: "Verification matricule", data: result });
    } catch (error) {
      next(error);
    }
  }

  async updateStatus(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const student = await this.service.updateStatus(getParam(req.params.id), Boolean(req.body.isActive));
      res.status(200).json({ success: true, message: "Statut etudiant mis a jour", data: student });
    } catch (error) {
      next(error);
    }
  }
}
