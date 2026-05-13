import { AdminRepository } from "../repository/admin.repository";

export class AdminService {
  constructor(private readonly repository: AdminRepository) {}
  list() {
    return this.repository.list();
  }
}
