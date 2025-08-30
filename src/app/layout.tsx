

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
  } catch (error) {
    console.error("Failed to fetch navigation data:", error);
    // Use empty arrays as fallback
    brands = [];
    categories = [];
  }
  
  return (
    <html lang="ru">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <header className="sticky top-0 z-20">
          <div className="glass mx-auto max-w-6xl px-4 h-16 flex items-center justify-between">
            <Link href="/" className="text-base md:text-lg tracking-tight font-bold hover:opacity-80">NENEGR SHOP</Link>
            <TopNav brands={brands} categories={categories} />
            <MobileNav brands={brands} categories={categories} />
          </div>
        </header>
        {children}
      </body>
    </html>
  );
}
