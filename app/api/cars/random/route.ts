import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { buildCarWhere } from "@/lib/carWhere";

export async function GET(req: NextRequest) {
  const where = buildCarWhere(req.nextUrl.searchParams);

  const total = await prisma.car.count({ where });
  if (total === 0) return NextResponse.json(null);

  const skip = Math.floor(Math.random() * total);
  const car = await prisma.car.findFirst({ where, skip });

  return NextResponse.json(car);
}
