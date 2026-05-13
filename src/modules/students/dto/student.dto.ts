export interface CreateStudentDto {
  matricule: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  departmentId: string;
  levelId: string;
}
