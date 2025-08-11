import Link from "next/link";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function Home() {
  const hits = await prisma.product.findMany({
    where: { isFeatured: true },
    orderBy: { createdAt: "desc" },
    include: { images: { orderBy: { index: "asc" }, take: 1 } },
    take: 8,
  });
  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* header moved to layout */}

      <main>
        <section className="border-b border-border">
          <div className="mx-auto max-w-6xl px-4 py-16 grid gap-10 md:grid-cols-2">
            <div className="space-y-6">
              <h1 className="text-4xl md:text-5xl font-semibold tracking-tight">Streetwear от топ-брендов</h1>
              <p className="text-muted-foreground text-lg">Supreme, Stüssy, Palace и другие. Минимализм, акцент на продукте, быстрая доставка.</p>
             
            </div>
            <div className="aspect-[4/3] bg-[url('https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=1200&auto=format&fit=crop')] bg-cover bg-center rounded-2xl" />
          </div>
        </section>

        <section>
          <div className="mx-auto max-w-6xl px-4 py-12">
            <div className="flex items-baseline justify-between mb-6">
              <h2 className="text-2xl font-semibold">ХИТЫ ПРОДАЖ</h2>
              <Link href="/catalog" className="text-sm text-muted-foreground hover:text-foreground">Все товары →</Link>
            </div>
            <div className="grid gap-6 grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
              {hits.map((p) => (
                <Link key={p.id} href={`/product/${p.slug}`} className="group">
                  <div className="aspect-square rounded-xl bg-cover bg-center" style={{ backgroundImage: `url(${p.images[0]?.url ?? ''})` }}></div>
                  <div className="mt-3">
                    <div className="text-sm/5 text-muted-foreground">{p.title}</div>
                    <div className="text-sm mt-1 font-semibold">{(p.priceCents/100).toLocaleString('ru-RU', { style: 'currency', currency: 'RUB' })}</div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-border">
        <div className="mx-auto max-w-6xl px-4 py-10 text-sm text-muted-foreground flex items-center justify-between">
          <div>© {new Date().getFullYear()} Supsayank shop</div>
          <div className="flex gap-4">
            <Link href="/policy" className="hover:text-foreground">Политика</Link>
            <Link href="/contacts" className="hover:text-foreground">Контакты</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
