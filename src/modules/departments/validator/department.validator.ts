import { z } from "zod";
export const departmentSchema = z.object({ name: z.string().min(2).max(120), code: z.string().min(2).max(20), facultyId: z.string().min(5).max(64) });
