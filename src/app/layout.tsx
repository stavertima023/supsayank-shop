import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import TopNav from "@/app/_components/TopNav";
import MobileNav from "@/app/_components/MobileNav";
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
  title: "NENEGR SHOP — Streetwear",
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
        <header className="sticky top-0 z-20">
          <div className="glass mx-auto max-w-6xl px-4 h-16 grid grid-cols-2 md:grid-cols-3 items-center gap-3 rounded-b-xl">
            <Link href="/" className="text-base md:text-lg tracking-tight font-bold hover:opacity-80">NENEGR SHOP</Link>
            <TopNav brands={brands} categories={categories} />
            <form action="/catalog" className="hidden md:block justify-self-end">
              <input name="q" placeholder="Поиск" className="px-3 py-2 rounded-md glass text-sm w-36 md:w-64 focus:outline-none" />
            </form>
            <MobileNav brands={brands} categories={categories} />
          </div>
        </header>
        {children}
      </body>
    </html>
  );
}
