import { PrismaClient } from "@prisma/client";
import * as fs from "fs";
import * as path from "path";

const prisma = new PrismaClient();

async function main() {
  const dataPath = path.join(process.cwd(), "prisma", "cars-data.json");
  const cars = JSON.parse(fs.readFileSync(dataPath, "utf-8"));

  console.log(`Seeding ${cars.length} cars...`);

  await prisma.car.deleteMany();
  await prisma.car.createMany({ data: cars });

  console.log(`Done. ${cars.length} cars inserted.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
