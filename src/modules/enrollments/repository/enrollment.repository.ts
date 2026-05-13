import { prisma } from "../../../infrastructure/prisma/client";
import type { EnrollmentStatus } from "../../../generated/prisma/enums";
export class EnrollmentRepository { list(){return prisma.enrollment.findMany({include:{student:true},orderBy:{createdAt:"desc"}});} create(input:{studentId:string;academicYear:string;status:EnrollmentStatus;isCurrent:boolean}){return prisma.enrollment.create({data:input});} }
