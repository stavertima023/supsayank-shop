import Link from "next/link";
import { prisma } from "@/lib/prisma";

export default async function CategoryPage({ params, searchParams }: { params: Promise<{ slug: string }>, searchParams: Promise<Record<string,string|string[]>> }) {
  const { slug } = await params;
  const sp = await searchParams;
  const brandSlug = typeof sp.brand === 'string' ? sp.brand : undefined;
  const category = await prisma.category.findUnique({ where: { slug } });
  if (!category) return null;
  const brands = await prisma.brand.findMany({ orderBy: { name: 'asc' } });
  const where: { categoryId: string, brandId?: string } = { categoryId: category.id };
  if (brandSlug) {
    const b = await prisma.brand.findUnique({ where: { slug: brandSlug } });
    if (b) where.brandId = b.id;
  }
  const products = await prisma.product.findMany({ where, include: { images: { orderBy: { index: 'asc' }, take: 1 }, brand: true }, orderBy: { createdAt: 'desc' } });
  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <h1 className="text-2xl font-semibold mb-6">{category.name}</h1>
      <div className="mb-6 flex flex-wrap gap-2">
        {brands.map((b) => (
          <Link key={b.id} href={`/category/${slug}?brand=${b.slug}`} className={`px-3 py-1 rounded-full border border-border text-sm hover:bg-muted ${b.slug===brandSlug? 'bg-muted' : ''}`}>{b.name}</Link>
        ))}
      </div>
      <div className="grid gap-6 grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {products.map((p) => (
          <Link key={p.id} href={`/product/${p.slug}`} className="group">
            <div className="aspect-square rounded-xl bg-cover bg-center" style={{ backgroundImage: `url(${p.images[0]?.url ?? ''})` }} />
            <div className="mt-3">
              <div className="text-sm/5 text-muted-foreground">{p.brand.name}</div>
              <div className="text-sm mt-1 font-semibold">{(p.priceCents/100).toLocaleString('ru-RU', { style: 'currency', currency: 'RUB' })}</div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}


