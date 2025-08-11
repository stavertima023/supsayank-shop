import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import TopNav from "@/app/_components/TopNav";
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
            <TopNav brands={brands} categories={categories} />
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
