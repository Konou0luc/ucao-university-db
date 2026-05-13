import crypto from "crypto";
import type { Prisma } from "../../../generated/prisma/client";
import { prisma } from "../../../infrastructure/prisma/client";

export class AuthRepository {
  findAdminByEmail(email: string) {
    return prisma.admin.findUnique({ where: { email } });
  }

  findAdminById(id: string) {
    return prisma.admin.findUnique({ where: { id } });
  }

  async createRefreshToken(adminId: string, refreshToken: string, expiresAt: Date) {
    const tokenHash = crypto.createHash("sha256").update(refreshToken).digest("hex");
    return prisma.refreshToken.create({ data: { adminId, tokenHash, expiresAt } });
  }

  async findValidRefreshToken(refreshToken: string) {
    const tokenHash = crypto.createHash("sha256").update(refreshToken).digest("hex");
    return prisma.refreshToken.findFirst({
      where: {
        tokenHash,
        revokedAt: null,
        expiresAt: { gt: new Date() },
      },
    });
  }

  revokeRefreshToken(id: string) {
    return prisma.refreshToken.update({ where: { id }, data: { revokedAt: new Date() } });
  }

  updateLastLogin(adminId: string) {
    return prisma.admin.update({ where: { id: adminId }, data: { lastLoginAt: new Date() } });
  }

  createAuditLog(input: { adminId?: string; action: string; entity: string; entityId?: string; severity: string; metadata?: Prisma.InputJsonValue }) {
    return prisma.auditLog.create({
      data: {
        adminId: input.adminId,
        action: input.action,
        entity: input.entity,
        entityId: input.entityId,
        severity: input.severity,
        metadata: input.metadata,
      },
    });
  }
}
