import { Router } from "express";
import { validateBody } from "../../../shared/validators/validateBody";
import { requireAuth, requirePermissions } from "../../auth/service/auth-guard.service";
import { FacultyController } from "../controller/faculty.controller";
import { FacultyRepository } from "../repository/faculty.repository";
import { FacultyService } from "../service/faculty.service";
import { facultySchema } from "../validator/faculty.validator";

const controller = new FacultyController(new FacultyService(new FacultyRepository()));
export const facultyRouter = Router();
facultyRouter.use(requireAuth);
facultyRouter.get("/faculties", requirePermissions("structures:read"), (req,res,next)=>controller.list(req,res,next));
facultyRouter.post("/faculties", requirePermissions("structures:write"), validateBody(facultySchema), (req,res,next)=>controller.create(req,res,next));
