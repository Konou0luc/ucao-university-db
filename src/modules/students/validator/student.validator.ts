import { z } from "zod";

export const createStudentSchema = z.object({
  matricule: z.string().trim().min(3).max(32),
  firstName: z.string().trim().min(2).max(120),
  lastName: z.string().trim().min(2).max(120),
  email: z.string().trim().email().max(255),
  phone: z.string().trim().max(30).optional(),
  departmentId: z.string().min(5).max(64),
  levelId: z.string().min(5).max(64),
});

export const studentStatusSchema = z.object({
  isActive: z.boolean(),
});

export const idParamSchema = z.object({ id: z.string().min(5).max(64) });
export const matriculeParamSchema = z.object({ matricule: z.string().min(3).max(32) });
export const emailParamSchema = z.object({ email: z.string().email().max(255) });
