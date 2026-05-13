export type AdminRole = "SUPER_ADMIN" | "STANDARD_ADMIN";

export type AuthPermission =
  | "students:read"
  | "students:write"
  | "enrollments:read"
  | "enrollments:write"
  | "structures:read"
  | "structures:write";

export interface AccessTokenPayload {
  sub: string;
  email: string;
  role: AdminRole;
  permissions: AuthPermission[];
  tokenType: "access";
}

export interface RefreshTokenPayload {
  sub: string;
  email: string;
  role: AdminRole;
  tokenType: "refresh";
  jti: string;
}
