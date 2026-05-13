import { DepartmentRepository } from "../repository/department.repository";
export class DepartmentService { constructor(private readonly repository: DepartmentRepository) {} list(){return this.repository.list();} create(input:{name:string;code:string;facultyId:string}){return this.repository.create(input);} }
