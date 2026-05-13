import { z } from "zod";
export const facultySchema = z.object({ name: z.string().min(2).max(120), code: z.string().min(2).max(20) });
