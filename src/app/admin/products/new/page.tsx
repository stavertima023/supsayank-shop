import { prisma } from "@/lib/prisma";
import { requireAdminOrRedirect } from "@/lib/adminAuth";
import { redirect } from "next/navigation";
import UploadImage from "@/app/admin/_components/UploadImage";
import AutoSlug from "@/app/admin/_components/AutoSlug";
import { slugify } from "@/lib/slugify";

export const dynamic = "force-dynamic";

async function createProduct(formData: FormData) {
  'use server';
  const { requireAdminOrRedirect } = await import("@/lib/adminAuth");
  requireAdminOrRedirect();
  const title = String(formData.get("title") || "").trim();
  let slug = String(formData.get("slug") || "").trim();
  if (!slug && title) slug = slugify(title);
  const description = String(formData.get("description") || "").trim() || null;
  const price = Number(formData.get("price") || 0);
  const currency = "RUB";
  const brandId = String(formData.get("brandId") || "");
  const categoryId = String(formData.get("categoryId") || "");
  const imagesRaw = String(formData.get("images") || "").trim();
  const imageUrls = imagesRaw ? imagesRaw.split(/\n|,/).map((s) => s.trim()).filter(Boolean) : [];

  if (!title || !slug || !brandId || !categoryId || !price) return;
  // ensure unique slug for product
  let base = slugify(slug);
  if (!base) base = Math.random().toString(36).slice(2, 8);
  let candidate = base;
  let n = 2;
  while (true) {
    const exists = await prisma.product.findUnique({ where: { slug: candidate } });
    if (!exists) break;
    candidate = `${base}-${n++}`;
  }

  const product = await prisma.product.create({
    data: {
      title,
      slug: candidate,
      description,
      priceCents: Math.round(price * 100),
      currency,
      brandId,
      categoryId,
      images: {
        create: imageUrls.map((url, index) => ({ url, index })),
      },
      variants: {
        create: ["S","M","L","XL","XXL"].map((size) => ({
          size: size as "S"|"M"|"L"|"XL"|"XXL",
          sku: `${candidate}-${size}`,
          stock: 999999,
        })),
      },
    },
  });

  redirect(`/admin/products/${product.id}`);
}

export default async function AdminNewProductPage() {
  await requireAdminOrRedirect();
  let brands: Array<{ id: string; name: string }> = [];
  let categories: Array<{ id: string; name: string }> = [];
  try {
    [brands, categories] = await Promise.all([
      prisma.brand.findMany({ orderBy: { name: "asc" } }),
      prisma.category.findMany({ orderBy: { name: "asc" } }),
    ]);
  } catch {
    // fall back to empty dropdowns
  }
  return (
    <div className="max-w-2xl">
      <h1 className="text-2xl font-semibold mb-4">Новый товар</h1>
      <form action={createProduct} className="grid gap-4">
        <AutoSlug />
        <div className="grid gap-2">
          <label className="text-sm text-muted-foreground">Название</label>
          <input name="title" className="px-3 py-2 rounded-md bg-muted border border-border" required />
        </div>
        <div className="grid gap-2">
          <label className="text-sm text-muted-foreground">Slug</label>
          <input name="slug" className="px-3 py-2 rounded-md bg-muted border border-border" required />
        </div>
        <div className="grid gap-2">
          <label className="text-sm text-muted-foreground">Описание</label>
          <textarea name="description" className="px-3 py-2 rounded-md bg-muted border border-border min-h-28" />
        </div>
        <div className="grid gap-2">
          <label className="text-sm text-muted-foreground">Цена</label>
          <input name="price" type="number" step="0.01" className="px-3 py-2 rounded-md bg-muted border border-border" required />
        </div>
        {/* Валюта убрана: всегда RUB */}
        <div className="grid gap-2">
          <label className="text-sm text-muted-foreground">Бренд</label>
          <select name="brandId" className="px-3 py-2 rounded-md bg-muted border border-border" required>
            <option value="">Выберите бренд</option>
            {brands.map((b) => (
              <option key={b.id} value={b.id}>{b.name}</option>
            ))}
          </select>
        </div>
        <div className="grid gap-2">
          <label className="text-sm text-muted-foreground">Категория</label>
          <select name="categoryId" className="px-3 py-2 rounded-md bg-muted border border-border" required>
            <option value="">Выберите категорию</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
        </div>
        <div className="grid gap-2">
          <label className="text-sm text-muted-foreground">Фото (по одному URL в строке)</label>
          <textarea name="images" className="px-3 py-2 rounded-md bg-muted border border-border min-h-28" placeholder="https://...\nhttps://..." />
          <UploadImage />
        </div>
        <button className="px-4 py-2 bg-accent text-accent-foreground rounded-md text-sm" type="submit">Создать</button>
      </form>
    </div>
  );
}

// removed old server-action uploader in favor of client UploadImage component


