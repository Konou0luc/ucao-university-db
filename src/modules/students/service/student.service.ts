import { AppError } from "../../../shared/errors/AppError";
import type { CreateStudentDto } from "../dto/student.dto";
import { StudentRepository } from "../repository/student.repository";

export class StudentService {
  constructor(private readonly repository: StudentRepository) {}

  async create(input: CreateStudentDto) {
    const existingMatricule = await this.repository.findByMatricule(input.matricule);
    if (existingMatricule) {
      throw new AppError("Matricule deja existant", 409);
    }

    const existingEmail = await this.repository.findByEmail(input.email);
    if (existingEmail) {
      throw new AppError("Email deja existant", 409);
    }

    return this.repository.create(input);
  }

  async getById(id: string) {
    const student = await this.repository.findById(id);
    if (!student) throw new AppError("Etudiant introuvable", 404);
    return student;
  }

  async getByMatricule(matricule: string) {
    const student = await this.repository.findByMatricule(matricule);
    if (!student) throw new AppError("Etudiant introuvable", 404);
    return student;
  }

  async getByEmail(email: string) {
    const student = await this.repository.findByEmail(email);
    if (!student) throw new AppError("Etudiant introuvable", 404);
    return student;
  }

  async verifyByMatricule(matricule: string) {
    const student = await this.repository.findByMatricule(matricule);
    if (!student) {
      return {
        exists: false,
        matricule,
      };
    }

    return {
      exists: true,
      matricule: student.matricule,
      firstName: student.firstName,
      lastName: student.lastName,
      department: student.department.name,
      level: student.level.name,
      isActive: student.isActive,
    };
  }

  async updateStatus(id: string, isActive: boolean) {
    await this.getById(id);
    return this.repository.updateStatus(id, isActive);
  }

  async list(query: { page?: string; limit?: string; search?: string; departmentId?: string; levelId?: string; isActive?: string }) {
    const page = Math.max(Number(query.page ?? "1"), 1);
    const limit = Math.min(Math.max(Number(query.limit ?? "10"), 1), 100);
    const isActive = query.isActive !== undefined ? query.isActive === "true" : undefined;

    const [items, total] = await this.repository.list({
      page,
      limit,
      search: query.search,
      departmentId: query.departmentId,
      levelId: query.levelId,
      isActive,
    });

    return {
      items,
      meta: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }
}
