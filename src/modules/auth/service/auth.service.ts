import bcrypt from "bcrypt";
import crypto from "crypto";
import jwt from "jsonwebtoken";
import { env } from "../../../config/env";
import { AppError } from "../../../shared/errors/AppError";
import type { AuthLoginRequestDto, AuthLogoutRequestDto, AuthRefreshRequestDto, AuthTokenResponseDto } from "../dto/auth.dto";
import type { AccessTokenPayload, AdminRole, AuthPermission, RefreshTokenPayload } from "../interfaces/auth.types";
import { AuthRepository } from "../repository/auth.repository";

function permissionsByRole(role: AdminRole): AuthPermission[] {
  if (role === "SUPER_ADMIN") {
    return ["students:read", "students:write", "enrollments:read", "enrollments:write", "structures:read", "structures:write"];
  }
  return ["students:read", "enrollments:read", "structures:read"];
}

function parseExpiresInToDate(value: string): Date {
  const now = Date.now();
  if (value.endsWith("d")) return new Date(now + Number(value.replace("d", "")) * 24 * 60 * 60 * 1000);
  if (value.endsWith("h")) return new Date(now + Number(value.replace("h", "")) * 60 * 60 * 1000);
  if (value.endsWith("m")) return new Date(now + Number(value.replace("m", "")) * 60 * 1000);
  return new Date(now + 7 * 24 * 60 * 60 * 1000);
}

export class AuthService {
  constructor(private readonly repository: AuthRepository) {}

  private createTokenPair(admin: { id: string; email: string; role: AdminRole }) {
    const permissions = permissionsByRole(admin.role);
    const accessPayload: AccessTokenPayload = {
      sub: admin.id,
      email: admin.email,
      role: admin.role,
      permissions,
      tokenType: "access",
    };

    const refreshPayload: RefreshTokenPayload = {
      sub: admin.id,
      email: admin.email,
      role: admin.role,
      tokenType: "refresh",
      jti: crypto.randomUUID(),
    };

    const accessToken = jwt.sign(accessPayload, env.JWT_SECRET, {
      algorithm: "HS256",
      expiresIn: env.JWT_ACCESS_EXPIRES_IN as jwt.SignOptions["expiresIn"],
    });

    const refreshToken = jwt.sign(refreshPayload, env.JWT_SECRET, {
      algorithm: "HS256",
      expiresIn: env.JWT_REFRESH_EXPIRES_IN as jwt.SignOptions["expiresIn"],
    });

    return { accessToken, refreshToken, permissions };
  }

  async login(payload: AuthLoginRequestDto): Promise<AuthTokenResponseDto> {
    const admin = await this.repository.findAdminByEmail(payload.email);
    if (!admin || !admin.isActive) {
      throw new AppError("Identifiants invalides", 401);
    }

    const isValidPassword = await bcrypt.compare(payload.password, admin.passwordHash);
    if (!isValidPassword) {
      throw new AppError("Identifiants invalides", 401);
    }

    const tokenPair = this.createTokenPair({ id: admin.id, email: admin.email, role: admin.role });
    await this.repository.createRefreshToken(admin.id, tokenPair.refreshToken, parseExpiresInToDate(env.JWT_REFRESH_EXPIRES_IN));
    await this.repository.updateLastLogin(admin.id);

    return {
      success: true,
      message: "Connexion admin reussie",
      data: {
        accessToken: tokenPair.accessToken,
        refreshToken: tokenPair.refreshToken,
        tokenType: "Bearer",
        expiresIn: env.JWT_ACCESS_EXPIRES_IN,
        admin: {
          id: admin.id,
          email: admin.email,
          role: admin.role,
          permissions: tokenPair.permissions,
        },
      },
    };
  }

  async refresh(payload: AuthRefreshRequestDto): Promise<AuthTokenResponseDto> {
    const stored = await this.repository.findValidRefreshToken(payload.refreshToken);
    if (!stored) {
      throw new AppError("Refresh token invalide ou expire", 401);
    }

    const decoded = jwt.verify(payload.refreshToken, env.JWT_SECRET) as RefreshTokenPayload;
    if (decoded.tokenType !== "refresh") {
      throw new AppError("Type de token invalide", 401);
    }

    const admin = await this.repository.findAdminById(decoded.sub);
    if (!admin || !admin.isActive) {
      throw new AppError("Admin introuvable", 401);
    }

    await this.repository.revokeRefreshToken(stored.id);

    const tokenPair = this.createTokenPair({ id: admin.id, email: admin.email, role: admin.role });
    await this.repository.createRefreshToken(admin.id, tokenPair.refreshToken, parseExpiresInToDate(env.JWT_REFRESH_EXPIRES_IN));

    return {
      success: true,
      message: "Token rafraichi avec succes",
      data: {
        accessToken: tokenPair.accessToken,
        refreshToken: tokenPair.refreshToken,
        tokenType: "Bearer",
        expiresIn: env.JWT_ACCESS_EXPIRES_IN,
        admin: {
          id: admin.id,
          email: admin.email,
          role: admin.role,
          permissions: tokenPair.permissions,
        },
      },
    };
  }

  async logout(payload: AuthLogoutRequestDto): Promise<{ success: true; message: string; data: {} }> {
    const stored = await this.repository.findValidRefreshToken(payload.refreshToken);
    if (!stored) {
      throw new AppError("Refresh token invalide ou expire", 401);
    }

    await this.repository.revokeRefreshToken(stored.id);

    return {
      success: true,
      message: "Deconnexion effectuee",
      data: {},
    };
  }
}
