import Link from "next/link";
import { prisma } from "@/lib/prisma";
export const dynamic = "force-dynamic";

export default async function BrandsPage() {
  let brands: Array<{ id: string; name: string; slug: string }> = [];
  try {
    brands = await prisma.brand.findMany({ orderBy: { name: "asc" } });
  } catch (e) {
    // ignore
  }
  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <h1 className="text-2xl font-semibold mb-6">Бренды</h1>
      <div className="grid gap-4 grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
        {brands.map((b) => (
          <Link key={b.id} href={`/catalog?brand=${b.slug}`} className="px-4 py-3 border border-black/10 rounded-lg hover:bg-black/5">
            {b.name}
          </Link>
        ))}
      </div>
    </div>
  );
}


