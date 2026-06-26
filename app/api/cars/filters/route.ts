import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET() {
  const [makes, divisions, drivetrains, sources, piClassRows, yearRows] = await Promise.all([
    prisma.car.findMany({ select: { make: true }, distinct: ["make"], orderBy: { make: "asc" } }),
    prisma.car.findMany({
      select: { division: true },
      distinct: ["division"],
      where: { division: { not: "" } },
      orderBy: { division: "asc" },
    }),
    prisma.car.findMany({ select: { drivetrain: true }, distinct: ["drivetrain"], orderBy: { drivetrain: "asc" } }),
    prisma.car.findMany({
      select: { source: true },
      distinct: ["source"],
      where: { source: { not: "" } },
      orderBy: { source: "asc" },
    }),
    prisma.car.findMany({ select: { piClass: true }, distinct: ["piClass"] }),
    prisma.car.findMany({ select: { year: true } }),
  ]);

  const CLASS_ORDER = ["D", "C", "B", "A", "S1", "S2", "X", "R"];
  const piClasses = piClassRows
    .map((r) => r.piClass)
    .sort((a, b) => CLASS_ORDER.indexOf(a) - CLASS_ORDER.indexOf(b));

  const decadeSet = new Set(yearRows.map((r) => Math.floor(r.year / 10) * 10));
  const decades = [...decadeSet].sort((a, b) => a - b);

  return NextResponse.json({
    makes: makes.map((m) => m.make),
    divisions: divisions.map((d) => d.division),
    drivetrains: drivetrains.map((d) => d.drivetrain),
    sources: sources.map((s) => s.source),
    piClasses,
    decades,
  });
}
