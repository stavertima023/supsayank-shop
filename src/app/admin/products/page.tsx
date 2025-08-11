import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { requireAdminOrRedirect } from "@/lib/adminAuth";

export const dynamic = "force-dynamic";

export default async function AdminProductsPage() {
  requireAdminOrRedirect();
  const products = await prisma.product.findMany({
    include: { brand: true, category: true, images: { orderBy: { index: "asc" }, take: 1 } },
    orderBy: { createdAt: "desc" },
    take: 100,
  });
  return (
    <div className="grid gap-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Товары</h1>
        <Link href="/admin/products/new" className="px-4 py-2 bg-accent text-accent-foreground rounded-md text-sm">Добавить товар</Link>
      </div>
      <div className="grid gap-3">
        {products.map((p) => (
          <div key={p.id} className="flex items-center justify-between p-3 rounded-md border border-border">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-md bg-cover bg-center" style={{ backgroundImage: `url(${p.images[0]?.url ?? "https://images.unsplash.com/photo-1512436991641-6745cdb1723f"})` }} />
              <div>
                <div className="font-medium">{p.title}</div>
                <div className="text-xs text-muted-foreground">{p.brand.name} • {p.category.name} • {(p.priceCents/100).toLocaleString("ru-RU", { style: 'currency', currency: p.currency })}</div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Link href={`/admin/products/${p.id}`} className="text-sm text-muted-foreground hover:text-foreground">Редактировать</Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}


