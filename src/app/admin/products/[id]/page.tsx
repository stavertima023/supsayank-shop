import { prisma } from "@/lib/prisma";
import { requireAdminOrRedirect } from "@/lib/adminAuth";
import { notFound, redirect } from "next/navigation";
import type { Prisma, Size } from "@prisma/client";
import { slugify } from "@/lib/slugify";

export const dynamic = "force-dynamic";

interface Props { params: Promise<{ id: string }> }

async function updateProduct(formData: FormData) {
  'use server';
  const { requireAdminOrRedirect } = await import("@/lib/adminAuth");
  requireAdminOrRedirect();
  const id = String(formData.get("id") || "");
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

  if (!id) return;

  await prisma.$transaction(async (tx) => {
    await tx.product.update({
      where: { id },
      data: {
        title,
        slug,
        description,
        priceCents: Math.round(price * 100),
        currency,
        brandId,
        categoryId,
      },
    });
    if (imageUrls.length > 0) {
      await tx.productImage.deleteMany({ where: { productId: id } });
      await tx.productImage.createMany({ data: imageUrls.map((url, index) => ({ url, index, productId: id })) });
    }
  });
}

async function deleteProduct(formData: FormData) {
  'use server';
  const { requireAdminOrRedirect } = await import("@/lib/adminAuth");
  requireAdminOrRedirect();
  const id = String(formData.get("id") || "");
  if (!id) return;
  await prisma.product.delete({ where: { id } });
  redirect("/admin/products");
}

export default async function AdminEditProductPage({ params }: Props) {
  await requireAdminOrRedirect();
  const { id } = await params;
  type ProductWithAll = Prisma.ProductGetPayload<{
    include: { images: true; brand: true; category: true; variants: true };
  }>;
  let product: ProductWithAll | null = null;
  try {
    const prod = await prisma.product.findUnique({
      where: { id },
      include: { images: { orderBy: { index: "asc" } }, brand: true, category: true, variants: { orderBy: { sku: "asc" } } },
    });
    if (prod) {
      product = prod as unknown as ProductWithAll;
    }
  } catch {
    // handled by notFound below
  }
  if (!product) return notFound();
  const [brands, categories] = await Promise.all([
    prisma.brand.findMany({ orderBy: { name: "asc" } }),
    prisma.category.findMany({ orderBy: { name: "asc" } }),
  ]);
  return (
    <div className="max-w-2xl">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-semibold">Редактирование товара</h1>
        <form action={deleteProduct}>
          <input type="hidden" name="id" value={product.id} />
          <button className="text-sm text-muted-foreground hover:text-foreground">Удалить</button>
        </form>
      </div>
      <form action={updateProduct} className="grid gap-4">
        <input type="hidden" name="id" value={product.id} />
        <div className="grid gap-2">
          <label className="text-sm text-muted-foreground">Название</label>
          <input name="title" defaultValue={product.title} className="px-3 py-2 rounded-md bg-muted border border-border" required />
        </div>
        <div className="grid gap-2">
          <label className="text-sm text-muted-foreground">Slug</label>
          <input name="slug" defaultValue={product.slug} className="px-3 py-2 rounded-md bg-muted border border-border" required />
        </div>
        <div className="grid gap-2">
          <label className="text-sm text-muted-foreground">Описание</label>
          <textarea name="description" defaultValue={product.description ?? ""} className="px-3 py-2 rounded-md bg-muted border border-border min-h-28" />
        </div>
        <div className="grid gap-2">
          <label className="text-sm text-muted-foreground">Цена</label>
          <input name="price" type="number" step="0.01" defaultValue={(product.priceCents/100).toString()} className="px-3 py-2 rounded-md bg-muted border border-border" required />
        </div>
        {/* Валюта убрана: всегда RUB */}
        <div className="grid gap-2">
          <label className="text-sm text-muted-foreground">Бренд</label>
          <select name="brandId" defaultValue={product.brandId} className="px-3 py-2 rounded-md bg-muted border border-border" required>
            {brands.map((b) => (
              <option key={b.id} value={b.id}>{b.name}</option>
            ))}
          </select>
        </div>
        <div className="grid gap-2">
          <label className="text-sm text-muted-foreground">Категория</label>
          <select name="categoryId" defaultValue={product.categoryId} className="px-3 py-2 rounded-md bg-muted border border-border" required>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
        </div>
        <div className="grid gap-2">
          <label className="text-sm text-muted-foreground">Фото (по одному URL в строке)</label>
          <textarea name="images" defaultValue={product.images.map((i) => i.url).join("\n")} className="px-3 py-2 rounded-md bg-muted border border-border min-h-28" />
        </div>
        <div className="flex items-center gap-2">
          <button className="px-4 py-2 bg-accent text-accent-foreground rounded-md text-sm" type="submit">Сохранить</button>
        </div>
      </form>

      <VariantsSection productId={product.id} />
    </div>
  );
}

async function createVariant(formData: FormData) {
  'use server';
  const { requireAdminOrRedirect } = await import("@/lib/adminAuth");
  requireAdminOrRedirect();
  const productId = String(formData.get("productId") || "");
  const sizeRaw = String(formData.get("size") || "");
  const color = String(formData.get("color") || "") || null;
  const sku = String(formData.get("sku") || "").trim();
  const stock = Number(formData.get("stock") || 0);
  if (!productId || !sku) return;
  const allowedSizes = new Set(["XS","S","M","L","XL","XXL"]);
  const size: Size | null = sizeRaw && allowedSizes.has(sizeRaw) ? (sizeRaw as Size) : null;
  await prisma.productVariant.create({ data: { productId, size, color, sku, stock: isNaN(stock) ? 0 : stock } });
}

async function updateVariant(formData: FormData) {
  'use server';
  const { requireAdminOrRedirect } = await import("@/lib/adminAuth");
  requireAdminOrRedirect();
  const id = String(formData.get("id") || "");
  const sizeRaw = String(formData.get("size") || "");
  const color = String(formData.get("color") || "") || null;
  const sku = String(formData.get("sku") || "").trim();
  const stock = Number(formData.get("stock") || 0);
  if (!id || !sku) return;
  const allowedSizes = new Set(["XS","S","M","L","XL","XXL"]);
  const size: Size | null = sizeRaw && allowedSizes.has(sizeRaw) ? (sizeRaw as Size) : null;
  await prisma.productVariant.update({ where: { id }, data: { size, color, sku, stock: isNaN(stock) ? 0 : stock } });
}

async function deleteVariant(formData: FormData) {
  'use server';
  const { requireAdminOrRedirect } = await import("@/lib/adminAuth");
  requireAdminOrRedirect();
  const id = String(formData.get("id") || "");
  if (!id) return;
  await prisma.productVariant.delete({ where: { id } });
}

async function VariantsSection({ productId }: { productId: string }) {
  const sizes = ["", "XS", "S", "M", "L", "XL", "XXL"];
  const product = await prisma.product.findUnique({ where: { id: productId }, include: { variants: { orderBy: { sku: "asc" } } } });
  if (!product) return null;
  return (
    <div className="mt-10">
      <h2 className="text-lg font-semibold mb-3">Варианты</h2>
      <div className="grid gap-2 mb-6">
        {product.variants.map((v) => (
          <div key={v.id} className="p-3 rounded-md border border-border">
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
              <form action={updateVariant} className="contents">
                <input type="hidden" name="id" value={v.id} />
                <select name="size" defaultValue={v.size ?? ""} className="px-3 py-2 rounded-md bg-muted border border-border">
                  {sizes.map((s) => (
                    <option key={s} value={s}>{s || "—"}</option>
                  ))}
                </select>
                <input name="color" defaultValue={v.color ?? ""} placeholder="Цвет" className="px-3 py-2 rounded-md bg-muted border border-border" />
                <input name="sku" defaultValue={v.sku} placeholder="SKU" className="px-3 py-2 rounded-md bg-muted border border-border" required />
                <input name="stock" type="number" defaultValue={v.stock} placeholder="Остаток" className="px-3 py-2 rounded-md bg-muted border border-border" />
                <button className="px-3 py-2 bg-accent text-accent-foreground rounded-md text-sm" type="submit">Сохранить</button>
              </form>
              <form action={deleteVariant} className="flex items-center">
                <input type="hidden" name="id" value={v.id} />
                <button className="text-sm text-muted-foreground hover:text-foreground" type="submit">Удалить</button>
              </form>
            </div>
          </div>
        ))}
      </div>
      <form action={createVariant} className="grid gap-2 p-4 rounded-md border border-border">
        <input type="hidden" name="productId" value={productId} />
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
          <select name="size" className="px-3 py-2 rounded-md bg-muted border border-border">
            {sizes.map((s) => (
              <option key={s} value={s}>{s || "—"}</option>
            ))}
          </select>
          <input name="color" placeholder="Цвет" className="px-3 py-2 rounded-md bg-muted border border-border" />
          <input name="sku" placeholder="SKU" className="px-3 py-2 rounded-md bg-muted border border-border" required />
          <input name="stock" type="number" placeholder="Остаток" className="px-3 py-2 rounded-md bg-muted border border-border" />
          <button className="px-3 py-2 bg-accent text-accent-foreground rounded-md text-sm" type="submit">Добавить вариант</button>
        </div>
      </form>
    </div>
  );
}


