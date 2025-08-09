import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
export const dynamic = "force-dynamic";

export async function GET() {
  const products = await prisma.product.findMany({
    include: { images: { orderBy: { index: "asc" }, take: 1 }, brand: true },
    orderBy: { createdAt: "desc" },
    take: 50,
  });
  return NextResponse.json(products);
}


