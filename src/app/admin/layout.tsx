import Link from "next/link";
import "../globals.css";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="border-b border-border">
        <div className="mx-auto max-w-6xl px-4 h-14 flex items-center justify-between">
          <Link href="/admin" className="font-semibold">Админ панель</Link>
          <nav className="flex items-center gap-4 text-sm">
            <Link href="/admin/products" className="hover:opacity-80">Товары</Link>
            <Link href="/admin/brands" className="hover:opacity-80">Бренды</Link>
            <Link href="/admin/categories" className="hover:opacity-80">Категории</Link>
            <form action={async () => { 'use server'; const { clearAdminCookie } = await import("@/lib/adminAuth"); await clearAdminCookie(); }}>
              <button className="text-sm text-muted-foreground hover:text-foreground" type="submit">Выйти</button>
            </form>
          </nav>
        </div>
      </header>
      <main className="mx-auto max-w-6xl px-4 py-8">
        {children}
      </main>
    </div>
  );
}


