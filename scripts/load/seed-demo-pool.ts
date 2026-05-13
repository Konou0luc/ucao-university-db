import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../../src/generated/prisma/client";
import { EnrollmentStatus } from "../../src/generated/prisma/enums";

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  throw new Error("DATABASE_URL is required");
}

const prisma = new PrismaClient({ adapter: new PrismaPg({ connectionString }) });

function matriculeAt(index: number): string {
  return `UCAODEMO${String(index).padStart(3, "0")}`;
}

async function main() {
  const target = Number(process.env.DEMO_POOL_SIZE ?? "100");

  const department = await prisma.department.findFirst({ where: { isActive: true }, orderBy: { createdAt: "asc" } });
  const level = await prisma.level.findFirst({ where: { name: "L2", isActive: true } });

  if (!department || !level) {
    throw new Error("Department/Level not found. Run seed first.");
  }

  const operations: Promise<unknown>[] = [];

  for (let i = 1; i <= target; i += 1) {
    const matricule = matriculeAt(i);
    const firstName = `Demo${i}`;
    const lastName = `Student${i}`;
    const email = `demo.student.${i}@ucao-uut.tg`;

    const op = prisma.student
      .upsert({
        where: { matricule },
        update: {
          firstName,
          lastName,
          email,
          departmentId: department.id,
          levelId: level.id,
          isActive: true,
        },
        create: {
          matricule,
          firstName,
          lastName,
          email,
          phone: `+22891${String(i).padStart(6, "0")}`,
          departmentId: department.id,
          levelId: level.id,
          isActive: true,
        },
      })
      .then((student) =>
        prisma.enrollment.upsert({
          where: {
            studentId_academicYear: {
              studentId: student.id,
              academicYear: "2025-2026",
            },
          },
          update: {
            status: EnrollmentStatus.ACTIVE,
            isCurrent: true,
          },
          create: {
            studentId: student.id,
            academicYear: "2025-2026",
            status: EnrollmentStatus.ACTIVE,
            isCurrent: true,
          },
        }),
      );

    operations.push(op);
  }

  await Promise.all(operations);
  console.log(`Demo pool ready: ${target} active students (UCAODEMO001..${matriculeAt(target)})`);
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
