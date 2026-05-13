import type { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { env } from "../../../config/env";
import { AppError } from "../../../shared/errors/AppError";
import type { AccessTokenPayload, AuthPermission } from "../interfaces/auth.types";

function getPayload(req: Request): AccessTokenPayload | undefined {
  return (req as Request & { admin?: AccessTokenPayload }).admin;
}

export function requireAuth(req: Request, _res: Response, next: NextFunction): void {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    next(new AppError("Token d'authentification manquant", 401));
    return;
  }

  try {
    const token = authHeader.slice("Bearer ".length);
    const payload = jwt.verify(token, env.JWT_SECRET) as AccessTokenPayload;
    if (payload.tokenType !== "access") {
      throw new Error("invalid token type");
    }
    (req as Request & { admin?: AccessTokenPayload }).admin = payload;
    next();
  } catch {
    next(new AppError("Token invalide ou expire", 401));
  }
}

export function requirePermissions(...permissions: AuthPermission[]) {
  return (req: Request, _res: Response, next: NextFunction): void => {
    const payload = getPayload(req);
    if (!payload) {
      next(new AppError("Contexte admin manquant", 401));
      return;
    }
    const ok = permissions.every((p) => payload.permissions.includes(p));
    if (!ok) {
      next(new AppError("Permissions insuffisantes", 403));
      return;
    }
    next();
  };
}
