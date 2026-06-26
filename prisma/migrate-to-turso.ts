import { createClient } from "@libsql/client";
import * as fs from "fs";
import * as path from "path";

// Load .env
try {
  const env = fs.readFileSync(".env", "utf-8");
  for (const line of env.split("\n")) {
    const match = line.match(/^([^#\s=]+)\s*=\s*"?([^"\n]*)"?\s*$/);
    if (match) process.env[match[1]] = match[2];
  }
} catch {}

const client = createClient({
  url: process.env.TURSO_DATABASE_URL!,
  authToken: process.env.TURSO_AUTH_TOKEN,
});

const schema = `
CREATE TABLE IF NOT EXISTS "Car" (
  "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
  "slug" TEXT NOT NULL,
  "name" TEXT NOT NULL,
  "make" TEXT NOT NULL,
  "model" TEXT NOT NULL,
  "year" INTEGER NOT NULL,
  "division" TEXT NOT NULL DEFAULT '',
  "piRating" INTEGER NOT NULL,
  "piClass" TEXT NOT NULL,
  "drivetrain" TEXT NOT NULL,
  "price" INTEGER NOT NULL,
  "source" TEXT NOT NULL DEFAULT '',
  "rarity" TEXT NOT NULL DEFAULT '',
  "country" TEXT NOT NULL DEFAULT '',
  "isDlc" INTEGER NOT NULL DEFAULT 0,
  "speed" REAL NOT NULL,
  "handling" REAL NOT NULL,
  "acceleration" REAL NOT NULL,
  "launch" REAL NOT NULL,
  "braking" REAL NOT NULL,
  "offroad" REAL NOT NULL,
  "powerKw" INTEGER NOT NULL,
  "weightKg" INTEGER NOT NULL,
  "topSpeedKph" REAL NOT NULL
);
CREATE UNIQUE INDEX IF NOT EXISTS "Car_slug_key" ON "Car"("slug");
CREATE INDEX IF NOT EXISTS "Car_make_idx" ON "Car"("make");
CREATE INDEX IF NOT EXISTS "Car_piClass_idx" ON "Car"("piClass");
CREATE INDEX IF NOT EXISTS "Car_division_idx" ON "Car"("division");
CREATE INDEX IF NOT EXISTS "Car_drivetrain_idx" ON "Car"("drivetrain");
`;

async function main() {
  console.log("Creating schema...");
  for (const stmt of schema.split(";").map((s) => s.trim()).filter(Boolean)) {
    await client.execute(stmt);
  }
  console.log("Schema ready.");

  const dataPath = path.join(process.cwd(), "prisma", "cars-data.json");
  const cars = JSON.parse(fs.readFileSync(dataPath, "utf-8"));
  console.log(`Inserting ${cars.length} cars...`);

  await client.execute("DELETE FROM Car");

  for (const car of cars) {
    await client.execute({
      sql: `INSERT INTO Car (id, slug, name, make, model, year, division, piRating, piClass, drivetrain, price, source, rarity, country, isDlc, speed, handling, acceleration, launch, braking, offroad, powerKw, weightKg, topSpeedKph)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      args: [
        car.id, car.slug, car.name, car.make, car.model, car.year,
        car.division, car.piRating, car.piClass, car.drivetrain, car.price,
        car.source, car.rarity, car.country, car.isDlc ? 1 : 0,
        car.speed, car.handling, car.acceleration, car.launch,
        car.braking, car.offroad, car.powerKw, car.weightKg, car.topSpeedKph,
      ],
    });
  }

  console.log(`Done. ${cars.length} cars inserted into Turso.`);
  client.close();
}

main().catch((e) => { console.error(e); process.exit(1); });
