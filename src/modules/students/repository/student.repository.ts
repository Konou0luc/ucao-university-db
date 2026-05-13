import { prisma } from "../../../infrastructure/prisma/client";
import type { CreateStudentDto } from "../dto/student.dto";

export class StudentRepository {
  create(input: CreateStudentDto) {
    return prisma.student.create({ data: input });
  }

  findById(id: string) {
    return prisma.student.findUnique({
      where: { id },
      include: { department: { include: { faculty: true } }, level: true, enrollments: true },
    });
  }

  findByMatricule(matricule: string) {
    return prisma.student.findUnique({
      where: { matricule },
      include: { department: { include: { faculty: true } }, level: true },
    });
  }

  findByEmail(email: string) {
    return prisma.student.findUnique({ where: { email }, include: { department: true, level: true } });
  }

  updateStatus(id: string, isActive: boolean) {
    return prisma.student.update({ where: { id }, data: { isActive } });
  }

  list(input: { page: number; limit: number; search?: string; departmentId?: string; levelId?: string; isActive?: boolean }) {
    const where = {
      ...(input.search
        ? {
            OR: [
              { firstName: { contains: input.search, mode: "insensitive" as const } },
              { lastName: { contains: input.search, mode: "insensitive" as const } },
              { matricule: { contains: input.search, mode: "insensitive" as const } },
              { email: { contains: input.search, mode: "insensitive" as const } },
            ],
          }
        : {}),
      ...(input.departmentId ? { departmentId: input.departmentId } : {}),
      ...(input.levelId ? { levelId: input.levelId } : {}),
      ...(input.isActive !== undefined ? { isActive: input.isActive } : {}),
    };

    return Promise.all([
      prisma.student.findMany({
        where,
        include: { department: { include: { faculty: true } }, level: true },
        skip: (input.page - 1) * input.limit,
        take: input.limit,
        orderBy: { createdAt: "desc" },
      }),
      prisma.student.count({ where }),
    ]);
  }
}
