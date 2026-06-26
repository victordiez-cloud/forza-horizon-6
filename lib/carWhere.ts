import type { NextRequest } from "next/server";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function buildCarWhere(searchParams: NextRequest["nextUrl"]["searchParams"]): any {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const where: any = {};

  const search = searchParams.get("search") ?? "";
  const piClass = searchParams.get("piClass") ?? "";
  const division = searchParams.get("division") ?? "";
  const make = searchParams.get("make") ?? "";
  const drivetrain = searchParams.get("drivetrain") ?? "";
  const source = searchParams.get("source") ?? "";
  const decade = searchParams.get("decade") ?? "";
  const isDlc = searchParams.get("isDlc") ?? "";

  if (search) {
    where.OR = [
      { name: { contains: search } },
      { make: { contains: search } },
      { model: { contains: search } },
    ];
  }
  if (piClass) where.piClass = piClass;
  if (division) where.division = division;
  if (make) where.make = make;
  if (drivetrain) where.drivetrain = drivetrain;
  if (source) where.source = { contains: source };
  if (decade) {
    const start = parseInt(decade, 10);
    where.year = { gte: start, lt: start + 10 };
  }
  if (isDlc === "true") where.isDlc = true;
  if (isDlc === "false") where.isDlc = false;

  return where;
}
