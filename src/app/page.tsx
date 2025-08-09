import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-white text-black">
      <header className="sticky top-0 z-20 backdrop-blur supports-[backdrop-filter]:bg-white/60 border-b border-black/10">
        <div className="mx-auto max-w-6xl px-4 h-16 flex items-center justify-between">
          <Link href="/" className="text-xl tracking-tight font-semibold">Supsayank shop</Link>
          <nav className="flex items-center gap-6 text-sm">
            <Link href="/catalog" className="hover:opacity-70">Каталог</Link>
            <Link href="/brands" className="hover:opacity-70">Бренды</Link>
            <Link href="/cart" className="hover:opacity-70">Корзина</Link>
          </nav>
        </div>
      </header>

      <main>
        <section className="border-b border-black/10">
          <div className="mx-auto max-w-6xl px-4 py-16 grid gap-10 md:grid-cols-2">
            <div className="space-y-6">
              <h1 className="text-4xl md:text-5xl font-semibold tracking-tight">Streetwear от топ-брендов</h1>
              <p className="text-black/70 text-lg">Supreme, Stüssy, Palace и другие. Минимализм, акцент на продукте, быстрая доставка.</p>
              <div className="flex gap-3">
                <Link href="/catalog" className="px-5 py-3 bg-black text-white rounded-full text-sm hover:bg-black/90">Открыть каталог</Link>
                <Link href="/brands" className="px-5 py-3 border border-black rounded-full text-sm hover:bg-black/5">Бренды</Link>
              </div>
            </div>
            <div className="aspect-[4/3] bg-[url('https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=1200&auto=format&fit=crop')] bg-cover bg-center rounded-2xl" />
          </div>
        </section>

        <section>
          <div className="mx-auto max-w-6xl px-4 py-12">
            <div className="flex items-baseline justify-between mb-6">
              <h2 className="text-2xl font-semibold">Новинки</h2>
              <Link href="/catalog" className="text-sm text-black/70 hover:text-black">Все товары →</Link>
            </div>
            <div className="grid gap-6 grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
              {[1,2,3,4].map((i) => (
                <Link key={i} href={`/product/sample-${i}`} className="group">
                  <div className="aspect-square rounded-xl bg-[url('https://images.unsplash.com/photo-1512436991641-6745cdb1723f?q=80&w=800&auto=format&fit=crop')] bg-cover bg-center"></div>
                  <div className="mt-3">
                    <div className="text-sm">Supreme</div>
                    <div className="text-sm/5 text-black/70">Logo Tee</div>
                    <div className="text-sm mt-1 font-semibold">6 900 ₽</div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-black/10">
        <div className="mx-auto max-w-6xl px-4 py-10 text-sm text-black/70 flex items-center justify-between">
          <div>© {new Date().getFullYear()} Supsayank shop</div>
          <div className="flex gap-4">
            <Link href="/policy" className="hover:text-black">Политика</Link>
            <Link href="/contacts" className="hover:text-black">Контакты</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
