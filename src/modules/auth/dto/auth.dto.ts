import type { AdminRole, AuthPermission } from "../interfaces/auth.types";

export interface AuthLoginRequestDto {
  email: string;
  password: string;
}

export interface AuthRefreshRequestDto {
  refreshToken: string;
}

export interface AuthLogoutRequestDto {
  refreshToken: string;
}

export interface AuthTokenResponseDto {
  success: true;
  message: string;
  data: {
    accessToken: string;
    refreshToken: string;
    tokenType: "Bearer";
    expiresIn: string;
    admin: {
      id: string;
      email: string;
      role: AdminRole;
      permissions: AuthPermission[];
    };
  };
}
