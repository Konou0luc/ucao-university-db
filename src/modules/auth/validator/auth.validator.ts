import { z } from "zod";

export const authLoginSchema = z.object({
  email: z.string().trim().email().max(255),
  password: z.string().min(8).max(128),
});

export const authRefreshSchema = z.object({
  refreshToken: z.string().trim().min(20),
});

export const authLogoutSchema = z.object({
  refreshToken: z.string().trim().min(20),
});
