import Link from "next/link";
import { prisma } from "@/lib/prisma";

export default async function BrandPage({ params, searchParams }: { params: Promise<{ slug: string }>, searchParams: Promise<Record<string,string|string[]>> }) {
  const { slug } = await params;
  const sp = await searchParams;
  const catSlug = typeof sp.category === 'string' ? sp.category : undefined;
  const brand = await prisma.brand.findUnique({ where: { slug } });
  if (!brand) return null;
  const categories = await prisma.category.findMany({ orderBy: { name: 'asc' } });
  const where: { brandId: string, categoryId?: string } = { brandId: brand.id };
  if (catSlug) {
    const cat = await prisma.category.findUnique({ where: { slug: catSlug } });
    if (cat) where.categoryId = cat.id;
  }
  const products = await prisma.product.findMany({ where, include: { images: { orderBy: { index: 'asc' }, take: 1 }, category: true }, orderBy: { createdAt: 'desc' } });
  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <h1 className="text-2xl font-semibold mb-6">{brand.name}</h1>
      <div className="mb-6 flex flex-wrap gap-2">
        {categories.map((c) => (
          <Link key={c.id} href={`/brands/${slug}?category=${c.slug}`} className={`px-3 py-1 rounded-full border border-border text-sm hover:bg-muted ${c.slug===catSlug? 'bg-muted' : ''}`}>{c.name}</Link>
        ))}
      </div>
      <div className="grid gap-6 grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {products.map((p) => (
          <Link key={p.id} href={`/product/${p.slug}`} className="group">
            <div className="aspect-square rounded-xl bg-cover bg-center" style={{ backgroundImage: `url(${p.images[0]?.url ?? ''})` }} />
            <div className="mt-3">
              <div className="text-sm/5 text-muted-foreground">{p.category.name}</div>
              <div className="text-sm mt-1 font-semibold">{(p.priceCents/100).toLocaleString('ru-RU', { style: 'currency', currency: 'RUB' })}</div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}


