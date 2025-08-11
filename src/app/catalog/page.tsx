import Link from "next/link";
import { prisma } from "@/lib/prisma";
export const dynamic = "force-dynamic";

export default async function CatalogPage({ searchParams }: { searchParams: Promise<Record<string, string | string[]>> }) {
  let products: Array<{
    id: string;
    slug: string;
    title: string;
    priceCents: number;
    currency: string;
    images: { url: string | null }[];
    brand: { name: string };
  }> = [];
  let brands: Array<{ id: string; name: string; slug: string }> = [];
  try {
    const where: { brandId?: string } = {};
    const sp = await searchParams;
    const brandSlug = typeof sp?.brand === 'string' ? sp.brand : undefined;
    if (brandSlug) {
      const brand = await prisma.brand.findUnique({ where: { slug: brandSlug } });
      if (brand) where.brandId = brand.id;
    }
    brands = await prisma.brand.findMany({ orderBy: { name: "asc" } });
    products = await prisma.product.findMany({
      where,
      include: {
        images: { orderBy: { index: "asc" }, take: 1 },
        brand: true,
      },
      orderBy: { createdAt: "desc" },
      take: 24,
    });
  } catch {
    // ignore and render empty state
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <div className="flex items-baseline justify-between mb-6">
        <h1 className="text-2xl font-semibold">Каталог</h1>
      </div>
      {brands.length > 0 && (
        <div className="mb-6 flex flex-wrap gap-2">
          {brands.map((b) => (
            <Link key={b.id} href={`/catalog?brand=${b.slug}`} className="px-3 py-1 rounded-full border border-border text-sm hover:bg-muted">
              {b.name}
            </Link>
          ))}
        </div>
      )}
      <div className="grid gap-6 grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {products.map((p) => (
          <Link key={p.id} href={`/product/${p.slug}`} className="group">
            <div
              className="aspect-square rounded-xl bg-cover bg-center"
              style={{ backgroundImage: `url(${p.images[0]?.url ?? "https://images.unsplash.com/photo-1512436991641-6745cdb1723f"})` }}
            />
            <div className="mt-3">
              <div className="text-sm">{p.brand.name}</div>
              <div className="text-sm/5 text-muted-foreground">{p.title}</div>
              <div className="text-sm mt-1 font-semibold">{(p.priceCents / 100).toLocaleString("ru-RU", { style: "currency", currency: 'RUB' })}</div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}


