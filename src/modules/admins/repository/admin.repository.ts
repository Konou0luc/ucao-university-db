import { prisma } from "../../../infrastructure/prisma/client";

export class AdminRepository {
  list() {
    return prisma.admin.findMany({
      select: { id: true, email: true, role: true, isActive: true, lastLoginAt: true, createdAt: true },
      orderBy: { createdAt: "desc" },
    });
  }
}
