import { prisma } from "@/lib/prisma";
import { requireAdminOrRedirect } from "@/lib/adminAuth";
import { notFound, redirect } from "next/navigation";
import { slugify } from "@/lib/slugify";
import { revalidatePath } from "next/cache";

export const dynamic = "force-dynamic";

interface Props { params: Promise<{ id: string }> }

async function updateProduct(formData: FormData) {
  'use server';
  const { requireAdminOrRedirect } = await import("@/lib/adminAuth");
  await requireAdminOrRedirect();
  const id = String(formData.get("id") || "");
  const title = String(formData.get("title") || "").trim();
  const description = String(formData.get("description") || "").trim() || null;
  const price = Number(formData.get("price") || 0);
  const brandId = String(formData.get("brandId") || "");
  const categoryId = String(formData.get("categoryId") || "");
  const imagesRaw = String(formData.get("images") || "").trim();
  const imageUrls = imagesRaw ? imagesRaw.split(/\n|,/).map((s) => s.trim()).filter(Boolean) : [];
  const isFeatured = String(formData.get("isFeatured") || "") === "on";

  if (!id || !title || !brandId || !categoryId || !price) return;
  const slug = slugify(title);

  await prisma.$transaction(async (tx) => {
    await tx.product.update({
      where: { id },
      data: {
        title,
        slug,
        description,
        priceCents: Math.round(price * 100),
        currency: "RUB",
        brandId,
        categoryId,
        isFeatured,
      },
    });
    if (imageUrls.length > 0) {
      await tx.productImage.deleteMany({ where: { productId: id } });
      await tx.productImage.createMany({ data: imageUrls.map((url, index) => ({ url, index, productId: id })) });
    }
  });
  revalidatePath('/admin/products');
  redirect(`/admin/products/${id}`);
}

async function deleteProduct(formData: FormData) {
  'use server';
  const { requireAdminOrRedirect } = await import("@/lib/adminAuth");
  await requireAdminOrRedirect();
  const id = String(formData.get("id") || "");
  if (!id) return;
  await prisma.product.delete({ where: { id } });
  revalidatePath('/admin/products');
  redirect("/admin/products");
}

export default async function AdminEditProductPage({ params }: Props) {
  await requireAdminOrRedirect();
  const { id } = await params;
  const product = await prisma.product.findUnique({
    where: { id },
    include: { images: { orderBy: { index: "asc" } }, brand: true, category: true },
  });
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
          <label className="text-sm text-muted-foreground">Описание</label>
          <textarea name="description" defaultValue={product.description ?? ""} className="px-3 py-2 rounded-md bg-muted border border-border min-h-28" />
        </div>
        <div className="grid gap-2">
          <label className="text-sm text-muted-foreground">Цена</label>
          <input name="price" type="number" step="0.01" defaultValue={(product.priceCents/100).toString()} className="px-3 py-2 rounded-md bg-muted border border-border" required />
        </div>
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
        <label className="flex items-center gap-2 text-sm"><input type="checkbox" name="isFeatured" defaultChecked={product.isFeatured} /> Хит продаж</label>
        <div className="flex items-center gap-2 mt-2">
          <button className="px-4 py-2 glass-btn text-sm" type="submit">Сохранить</button>
        </div>
      </form>
    </div>
  );
}








