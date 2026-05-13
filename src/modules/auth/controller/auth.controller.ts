import type { NextFunction, Request, Response } from "express";
import type { AuthLoginRequestDto, AuthLogoutRequestDto, AuthRefreshRequestDto, AuthTokenResponseDto } from "../dto/auth.dto";
import { AuthService } from "../service/auth.service";

export class AuthController {
  constructor(private readonly service: AuthService) {}

  async login(req: Request<unknown, AuthTokenResponseDto, AuthLoginRequestDto>, res: Response<AuthTokenResponseDto>, next: NextFunction): Promise<void> {
    try {
      const result = await this.service.login(req.body);
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }

  async refresh(req: Request<unknown, AuthTokenResponseDto, AuthRefreshRequestDto>, res: Response<AuthTokenResponseDto>, next: NextFunction): Promise<void> {
    try {
      const result = await this.service.refresh(req.body);
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }

  async logout(req: Request<unknown, { success: true; message: string; data: {} }, AuthLogoutRequestDto>, res: Response<{ success: true; message: string; data: {} }>, next: NextFunction): Promise<void> {
    try {
      const result = await this.service.logout(req.body);
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }
}
