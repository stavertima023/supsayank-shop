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
      <header className="sticky top-0 z-20 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b border-border">
        <div className="mx-auto max-w-6xl px-4 h-16 flex items-center justify-between relative">
          <Link href="/" className="text-xl tracking-tight font-semibold">Supsayank shop</Link>
          <nav className="absolute left-1/2 -translate-x-1/2 hidden md:flex items-center gap-6 text-lg font-semibold tracking-wide">
            <Link href="/catalog?sale=1" className="hover:opacity-80">Sale</Link>
            <Link href="/catalog?category=t-shirts" className="hover:opacity-80">Футболки</Link>
            <Link href="/catalog?category=longsleeves" className="hover:opacity-80">Лонгсливы</Link>
            <Link href="/catalog?category=hoodies" className="hover:opacity-80">Худи</Link>
            <Link href="/catalog?category=zip-hoodies" className="hover:opacity-80">Зип‑худи</Link>
            <Link href="/catalog?category=shorts" className="hover:opacity-80">Шорты</Link>
          </nav>
          <nav className="flex items-center gap-6 text-sm">
            <Link href="/catalog" className="hover:opacity-70">Каталог</Link>
            <Link href="/brands" className="hover:opacity-70">Бренды</Link>
            <Link href="/cart" className="hover:opacity-70">Корзина</Link>
          </nav>
        </div>
      </header>

      <main>
        <section className="border-b border-border">
          <div className="mx-auto max-w-6xl px-4 py-16 grid gap-10 md:grid-cols-2">
            <div className="space-y-6">
              <h1 className="text-4xl md:text-5xl font-semibold tracking-tight">Streetwear от топ-брендов</h1>
              <p className="text-muted-foreground text-lg">Supreme, Stüssy, Palace и другие. Минимализм, акцент на продукте, быстрая доставка.</p>
              <div className="flex gap-3">
                <Link href="/catalog" className="px-5 py-3 bg-accent text-accent-foreground rounded-full text-sm hover:bg-accent/90">Открыть каталог</Link>
                <Link href="/brands" className="px-5 py-3 border border-border rounded-full text-sm hover:bg-muted">Бренды</Link>
              </div>
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
