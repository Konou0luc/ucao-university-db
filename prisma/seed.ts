import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import bcrypt from "bcrypt";
import { PrismaClient } from "../src/generated/prisma/client";
import { AdminRole, EnrollmentStatus } from "../src/generated/prisma/enums";

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  throw new Error("DATABASE_URL is required");
}

const prisma = new PrismaClient({ adapter: new PrismaPg({ connectionString }) });

type FacultySeed = {
  code: string;
  name: string;
  departments: Array<{ code: string; name: string }>;
};

type StudentSeed = {
  matricule: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  facultyCode: string;
  departmentCode: string;
  levelName: "L1" | "L2" | "L3";
  isActive: boolean;
};

const facultiesSeed: FacultySeed[] = [
  {
    code: "ISEG",
    name: "Faculte Economie et Gestion (ISEG)",
    departments: [
      { code: "FCC", name: "Finance - Comptabilite - Controle" },
      { code: "MKT", name: "Marketing" },
      { code: "RH", name: "Ressources Humaines" },
      { code: "EAD", name: "Economie Appliquee au Developpement" },
    ],
  },
  {
    code: "IMETIC",
    name: "Communication et Medias (IMETIC)",
    departments: [
      { code: "CO", name: "Communication des Organisations" },
      { code: "JTN", name: "Journalisme et Technologies Numeriques" },
      { code: "MMI", name: "Multimedia et Management de l Information" },
      { code: "AG", name: "Arts et Graphisme" },
      { code: "CD", name: "Communication Digitale" },
    ],
  },
  {
    code: "ISSJ",
    name: "Droit et Sciences Juridiques (ISSJ)",
    departments: [
      { code: "LDP", name: "Licence en Droit Public" },
      { code: "LDPR", name: "Licence en Droit Prive" },
    ],
  },
  {
    code: "ITN",
    name: "Informatique et Technologies Numeriques",
    departments: [
      { code: "MI", name: "Mathematiques Informatique" },
      { code: "DA", name: "Developpement d Applications" },
      { code: "RIT", name: "Reseaux Informatiques et Telecommunications" },
    ],
  },
];

const levelsSeed = [
  { name: "L1", rank: 1 },
  { name: "L2", rank: 2 },
  { name: "L3", rank: 3 },
] as const;

const studentsSeed: StudentSeed[] = [
  { matricule: "UCAO24A001", firstName: "Ama", lastName: "Kossi", email: "groupeflutter@gmail.com", phone: "+22890000001", facultyCode: "ITN", departmentCode: "DA", levelName: "L3", isActive: true },
  { matricule: "UCAO24A002", firstName: "Yao", lastName: "Mensah", email: "konouluc1@gmail.com", phone: "+22890000002", facultyCode: "ISEG", departmentCode: "MKT", levelName: "L2", isActive: true },
  { matricule: "UCAO24A003", firstName: "Akoua", lastName: "Adjovi", email: "akoua.adjovi@ucao-uut.tg", phone: "+22890000003", facultyCode: "ISEG", departmentCode: "FCC", levelName: "L1", isActive: true },
  { matricule: "UCAO24A004", firstName: "Komlan", lastName: "Ayivi", email: "komlan.ayivi@ucao-uut.tg", phone: "+22890000004", facultyCode: "ISEG", departmentCode: "RH", levelName: "L3", isActive: true },
  { matricule: "UCAO24A005", firstName: "Afi", lastName: "Dodzi", email: "afi.dodzi@ucao-uut.tg", phone: "+22890000005", facultyCode: "ISEG", departmentCode: "EAD", levelName: "L2", isActive: true },
  { matricule: "UCAO24A006", firstName: "Komi", lastName: "Soglo", email: "komi.soglo@ucao-uut.tg", phone: "+22890000006", facultyCode: "IMETIC", departmentCode: "CO", levelName: "L1", isActive: true },
  { matricule: "UCAO24A007", firstName: "Abla", lastName: "Goka", email: "abla.goka@ucao-uut.tg", phone: "+22890000007", facultyCode: "IMETIC", departmentCode: "JTN", levelName: "L2", isActive: true },
  { matricule: "UCAO24A008", firstName: "Essi", lastName: "Takou", email: "essi.takou@ucao-uut.tg", phone: "+22890000008", facultyCode: "IMETIC", departmentCode: "MMI", levelName: "L3", isActive: true },
  { matricule: "UCAO24A009", firstName: "Kokou", lastName: "Napo", email: "kokou.napo@ucao-uut.tg", phone: "+22890000009", facultyCode: "IMETIC", departmentCode: "AG", levelName: "L1", isActive: true },
  { matricule: "UCAO24A010", firstName: "Mawuli", lastName: "Abalo", email: "mawuli.abalo@ucao-uut.tg", phone: "+22890000010", facultyCode: "IMETIC", departmentCode: "CD", levelName: "L3", isActive: true },
  { matricule: "UCAO24A011", firstName: "Sena", lastName: "Padja", email: "sena.padja@ucao-uut.tg", phone: "+22890000011", facultyCode: "ISSJ", departmentCode: "LDP", levelName: "L1", isActive: true },
  { matricule: "UCAO24A012", firstName: "Adjoba", lastName: "Kpam", email: "adjoba.kpam@ucao-uut.tg", phone: "+22890000012", facultyCode: "ISSJ", departmentCode: "LDPR", levelName: "L2", isActive: true },
  { matricule: "UCAO24A013", firstName: "Kafui", lastName: "Anani", email: "kafui.anani@ucao-uut.tg", phone: "+22890000013", facultyCode: "ITN", departmentCode: "MI", levelName: "L1", isActive: true },
  { matricule: "UCAO24A014", firstName: "Dela", lastName: "Teteh", email: "dela.teteh@ucao-uut.tg", phone: "+22890000014", facultyCode: "ITN", departmentCode: "RIT", levelName: "L2", isActive: true },
  { matricule: "UCAO24A015", firstName: "Nina", lastName: "Attiogbe", email: "nina.attiogbe@ucao-uut.tg", phone: "+22890000015", facultyCode: "ITN", departmentCode: "DA", levelName: "L1", isActive: true },
  { matricule: "UCAO24A016", firstName: "Eyram", lastName: "Boko", email: "eyram.boko@ucao-uut.tg", phone: "+22890000016", facultyCode: "ISEG", departmentCode: "FCC", levelName: "L3", isActive: false },
  { matricule: "UCAO24A017", firstName: "Kossi", lastName: "Gbenyo", email: "kossi.gbenyo@ucao-uut.tg", phone: "+22890000017", facultyCode: "ITN", departmentCode: "MI", levelName: "L2", isActive: false },
  { matricule: "UCAO24A018", firstName: "Adele", lastName: "Kodjo", email: "adele.kodjo@ucao-uut.tg", phone: "+22890000018", facultyCode: "IMETIC", departmentCode: "CD", levelName: "L2", isActive: true },
  { matricule: "UCAO24A019", firstName: "Mensi", lastName: "Wotome", email: "mensi.wotome@ucao-uut.tg", phone: "+22890000019", facultyCode: "ISSJ", departmentCode: "LDP", levelName: "L3", isActive: true },
  { matricule: "UCAO24A020", firstName: "Kokouvi", lastName: "Seda", email: "kokouvi.seda@ucao-uut.tg", phone: "+22890000020", facultyCode: "ISEG", departmentCode: "RH", levelName: "L1", isActive: true },
  { matricule: "UCAO24A021", firstName: "Ablavi", lastName: "Dossou", email: "ablavi.dossou@ucao-uut.tg", phone: "+22890000021", facultyCode: "ISEG", departmentCode: "MKT", levelName: "L3", isActive: true },
  { matricule: "UCAO24A022", firstName: "Komi", lastName: "Dakou", email: "komi.dakou@ucao-uut.tg", phone: "+22890000022", facultyCode: "IMETIC", departmentCode: "MMI", levelName: "L1", isActive: true },
  { matricule: "UCAO24A023", firstName: "Fiavi", lastName: "Sika", email: "fiavi.sika@ucao-uut.tg", phone: "+22890000023", facultyCode: "ITN", departmentCode: "RIT", levelName: "L3", isActive: true },
  { matricule: "UCAO24A024", firstName: "Aklesso", lastName: "Nyame", email: "aklesso.nyame@ucao-uut.tg", phone: "+22890000024", facultyCode: "ISSJ", departmentCode: "LDPR", levelName: "L1", isActive: true },
];

async function main() {
  const facultyByCode = new Map<string, { id: string }>();
  const departmentByCompositeCode = new Map<string, { id: string }>();
  const levelByName = new Map<string, { id: string }>();

  for (const faculty of facultiesSeed) {
    const savedFaculty = await prisma.faculty.upsert({
      where: { code: faculty.code },
      update: { name: faculty.name, isActive: true },
      create: { code: faculty.code, name: faculty.name, isActive: true },
    });
    facultyByCode.set(faculty.code, { id: savedFaculty.id });

    for (const department of faculty.departments) {
      const savedDepartment = await prisma.department.upsert({
        where: {
          facultyId_code: {
            facultyId: savedFaculty.id,
            code: department.code,
          },
        },
        update: {
          name: department.name,
          isActive: true,
        },
        create: {
          facultyId: savedFaculty.id,
          name: department.name,
          code: department.code,
          isActive: true,
        },
      });
      departmentByCompositeCode.set(`${faculty.code}:${department.code}`, { id: savedDepartment.id });
    }
  }

  for (const level of levelsSeed) {
    const savedLevel = await prisma.level.upsert({
      where: { name: level.name },
      update: { rank: level.rank, isActive: true },
      create: { name: level.name, rank: level.rank, isActive: true },
    });
    levelByName.set(level.name, { id: savedLevel.id });
  }

  const seededStudents: Array<{ id: string; levelName: "L1" | "L2" | "L3"; isActive: boolean }> = [];

  for (const student of studentsSeed) {
    const department = departmentByCompositeCode.get(`${student.facultyCode}:${student.departmentCode}`);
    const level = levelByName.get(student.levelName);

    if (!department || !level) {
      throw new Error(`Configuration seed invalide pour ${student.matricule}`);
    }

    const savedStudent = await prisma.student.upsert({
      where: { matricule: student.matricule },
      update: {
        firstName: student.firstName,
        lastName: student.lastName,
        email: student.email,
        phone: student.phone,
        departmentId: department.id,
        levelId: level.id,
        isActive: student.isActive,
      },
      create: {
        matricule: student.matricule,
        firstName: student.firstName,
        lastName: student.lastName,
        email: student.email,
        phone: student.phone,
        departmentId: department.id,
        levelId: level.id,
        isActive: student.isActive,
      },
    });

    seededStudents.push({
      id: savedStudent.id,
      levelName: student.levelName,
      isActive: student.isActive,
    });
  }

  for (const student of seededStudents) {
    let previousYearStatus: EnrollmentStatus = EnrollmentStatus.COMPLETED;
    if (!student.isActive) {
      previousYearStatus = EnrollmentStatus.SUSPENDED;
    }

    let currentYearStatus: EnrollmentStatus = EnrollmentStatus.ACTIVE;
    if (!student.isActive) {
      currentYearStatus = EnrollmentStatus.WITHDRAWN;
    }

    await prisma.enrollment.upsert({
      where: { studentId_academicYear: { studentId: student.id, academicYear: "2024-2025" } },
      update: { status: previousYearStatus, isCurrent: false },
      create: {
        studentId: student.id,
        academicYear: "2024-2025",
        status: previousYearStatus,
        isCurrent: false,
      },
    });

    await prisma.enrollment.upsert({
      where: { studentId_academicYear: { studentId: student.id, academicYear: "2025-2026" } },
      update: { status: currentYearStatus, isCurrent: true },
      create: {
        studentId: student.id,
        academicYear: "2025-2026",
        status: currentYearStatus,
        isCurrent: true,
      },
    });
  }

  const passwordHash = await bcrypt.hash("admin12345", 12);
  await prisma.admin.upsert({
    where: { email: "admin@ucao-uut.tg" },
    update: { passwordHash, role: AdminRole.SUPER_ADMIN, isActive: true },
    create: { email: "admin@ucao-uut.tg", passwordHash, role: AdminRole.SUPER_ADMIN, isActive: true },
  });
  await prisma.admin.upsert({
    where: { email: "registrar@ucao-uut.tg" },
    update: { passwordHash, role: AdminRole.STANDARD_ADMIN, isActive: true },
    create: { email: "registrar@ucao-uut.tg", passwordHash, role: AdminRole.STANDARD_ADMIN, isActive: true },
  });

  console.log("Seed UCAO API termine avec succes.");
  console.log(`Facultes: ${facultiesSeed.length}`);
  console.log(`Filieres: ${facultiesSeed.reduce((sum, f) => sum + f.departments.length, 0)}`);
  console.log(`Niveaux: ${levelsSeed.length}`);
  console.log(`Etudiants: ${studentsSeed.length}`);
  console.log("Inscriptions: 48 (2 annees x 24 etudiants)");
}

main()
  .finally(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
