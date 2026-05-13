import { z } from "zod";
export const levelSchema = z.object({ name: z.string().min(2).max(50), rank: z.number().int().min(1).max(20) });
