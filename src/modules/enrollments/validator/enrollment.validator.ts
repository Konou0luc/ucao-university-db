import { z } from "zod";
export const enrollmentSchema = z.object({ studentId: z.string().min(5).max(64), academicYear: z.string().min(4).max(20), status: z.enum(["ACTIVE","SUSPENDED","COMPLETED","WITHDRAWN"]).default("ACTIVE"), isCurrent: z.boolean().default(true) });
