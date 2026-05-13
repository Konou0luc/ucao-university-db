import { prisma } from "../../../infrastructure/prisma/client";

export class FacultyRepository {
  list() {
    return prisma.faculty.findMany({ orderBy: { name: "asc" } });
  }
  create(input: { name: string; code: string }) {
    return prisma.faculty.create({ data: input });
  }
}
