import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
export const dynamic = "force-dynamic";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Supsayank shop — Streetwear",
  description: "Магазин streetwear брендов: Supreme, Stüssy, Palace и другие.",
  icons: { icon: "/favicon.ico" },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  let brands: Array<{ id: string; name: string; slug: string }> = [];
  let categories: Array<{ id: string; name: string; slug: string }> = [];
  try {
    [brands, categories] = await Promise.all([
      prisma.brand.findMany({ orderBy: { name: "asc" } }),
      prisma.category.findMany({ orderBy: { name: "asc" } }),
    ]);
  } catch {
    // render empty menus if db not available during build
  }
  return (
    <html lang="ru">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <header className="sticky top-0 z-20 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b border-border">
          <div className="mx-auto max-w-6xl px-4 h-16 flex items-center justify-between">
            <Link href="/" className="text-lg tracking-tight font-semibold hover:opacity-80">Supsayank shop</Link>
            <nav className="flex items-center gap-6 text-sm">
              <div className="relative group">
                <button className="px-2 py-1 rounded hover:bg-muted">Одежда</button>
                <div className="absolute left-0 mt-2 hidden group-hover:block bg-background border border-border rounded-md shadow-md p-2 min-w-48">
                  {categories.map((c) => (
                    <Link key={c.id} href={`/category/${c.slug}`} className="block px-3 py-2 rounded hover:bg-muted">
                      {c.name}
                    </Link>
                  ))}
                </div>
              </div>
              <div className="relative group">
                <button className="px-2 py-1 rounded hover:bg-muted">Бренды</button>
                <div className="absolute left-0 mt-2 hidden group-hover:block bg-background border border-border rounded-md shadow-md p-2 min-w-48 max-h-80 overflow-auto">
                  {brands.map((b) => (
                    <Link key={b.id} href={`/brands/${b.slug}`} className="block px-3 py-2 rounded hover:bg-muted">
                      {b.name}
                    </Link>
                  ))}
                </div>
              </div>
            </nav>
            <form action="/catalog" className="hidden md:block">
              <input name="q" placeholder="Поиск товаров" className="px-3 py-2 rounded-md bg-muted border border-border text-sm w-64 focus:outline-none focus:ring-2 focus:ring-accent" />
            </form>
          </div>
        </header>
        {children}
      </body>
    </html>
  );
}
