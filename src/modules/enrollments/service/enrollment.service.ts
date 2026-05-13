import { AppError } from "../../../shared/errors/AppError";
import type { EnrollmentStatus } from "../../../generated/prisma/enums";
import { EnrollmentRepository } from "../repository/enrollment.repository";
import { prisma } from "../../../infrastructure/prisma/client";
export class EnrollmentService { constructor(private readonly repository: EnrollmentRepository) {} list(){return this.repository.list();} async create(input:{studentId:string;academicYear:string;status:EnrollmentStatus;isCurrent:boolean}){const s=await prisma.student.findUnique({where:{id:input.studentId}}); if(!s) throw new AppError("Etudiant introuvable",404); return this.repository.create(input);} }
