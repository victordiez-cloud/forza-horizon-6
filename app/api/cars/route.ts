import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { buildCarWhere } from "@/lib/carWhere";
import type { SortField } from "@/lib/types";

const VALID_SORT_FIELDS: SortField[] = [
  "name", "make", "year", "piRating", "price",
  "speed", "handling", "acceleration", "launch",
  "braking", "offroad", "topSpeedKph", "powerKw", "weightKg",
];

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl;

  const where = buildCarWhere(searchParams);
  const sortByRaw = (searchParams.get("sortBy") ?? "piRating") as SortField;
  const sortBy = VALID_SORT_FIELDS.includes(sortByRaw) ? sortByRaw : "piRating";
  const sortDir = searchParams.get("sortDir") === "asc" ? "asc" : "desc";
  const page = Math.max(1, parseInt(searchParams.get("page") ?? "1", 10));
  const perPage = Math.min(100, Math.max(10, parseInt(searchParams.get("perPage") ?? "20", 10)));

  const [total, cars] = await Promise.all([
    prisma.car.count({ where }),
    prisma.car.findMany({
      where,
      orderBy: { [sortBy]: sortDir },
      skip: (page - 1) * perPage,
      take: perPage,
    }),
  ]);

  return NextResponse.json({ cars, total, page, perPage, totalPages: Math.ceil(total / perPage) });
}
