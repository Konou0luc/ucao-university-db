import { FacultyRepository } from "../repository/faculty.repository";

export class FacultyService {
  constructor(private readonly repository: FacultyRepository) {}
  list() { return this.repository.list(); }
  create(input: { name: string; code: string }) { return this.repository.create(input); }
}
