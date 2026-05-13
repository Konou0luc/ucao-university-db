import { prisma } from "../../../infrastructure/prisma/client";

export class DepartmentRepository {
  list() { return prisma.department.findMany({ include: { faculty: true }, orderBy: { name: "asc" } }); }
  create(input: { name: string; code: string; facultyId: string }) { return prisma.department.create({ data: input }); }
}
