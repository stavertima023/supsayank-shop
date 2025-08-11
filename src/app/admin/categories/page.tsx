import { prisma } from "@/lib/prisma";
import { requireAdminOrRedirect } from "@/lib/adminAuth";
import { slugify } from "@/lib/slugify";
import { revalidatePath } from "next/cache";

export const dynamic = "force-dynamic";

async function createCategory(formData: FormData) {
  'use server';
  const { requireAdminOrRedirect } = await import("@/lib/adminAuth");
  requireAdminOrRedirect();
  const name = String(formData.get("name") || "").trim();
  if (!name) return;
  let base = slugify(name);
  if (!base) base = Math.random().toString(36).slice(2, 8);
  let candidate = base;
  let n = 2;
  while (true) {
    const exists = await prisma.category.findUnique({ where: { slug: candidate } });
    if (!exists) break;
    candidate = `${base}-${n++}`;
  }
  await prisma.category.create({ data: { name, slug: candidate } });
  revalidatePath('/admin/categories');
}

async function deleteCategory(formData: FormData) {
  'use server';
  const { requireAdminOrRedirect } = await import("@/lib/adminAuth");
  requireAdminOrRedirect();
  const id = String(formData.get("id") || "");
  if (!id) return;
  await prisma.category.delete({ where: { id } });
  revalidatePath('/admin/categories');
}

export default async function AdminCategoriesPage() {
  await requireAdminOrRedirect();
  let categories: Array<{ id: string; name: string; slug: string }> = [];
  try {
    categories = await prisma.category.findMany({ orderBy: { name: "asc" } });
  } catch {
    categories = [];
  }
  return (
    <div className="grid gap-8">
      <div>
        <h1 className="text-2xl font-semibold mb-4">Категории</h1>
        <div className="grid gap-2">
          {categories.map((c) => (
            <form key={c.id} action={deleteCategory} className="flex items-center justify-between p-3 rounded-md border border-border">
              <div>
                <div className="font-medium">{c.name}</div>
                <div className="text-xs text-muted-foreground">{c.slug}</div>
              </div>
              <input type="hidden" name="id" value={c.id} />
              <button className="text-sm text-muted-foreground hover:text-foreground">Удалить</button>
            </form>
          ))}
        </div>
      </div>
      <div className="border-t border-border pt-6">
        <h2 className="text-lg font-semibold mb-3">Добавить категорию</h2>
        <form action={createCategory} className="grid gap-3 max-w-md">
          <input name="name" placeholder="Название" className="px-3 py-2 rounded-md bg-muted border border-border" required />
          <button className="px-4 py-2 bg-accent text-accent-foreground rounded-md text-sm" type="submit">Добавить</button>
        </form>
      </div>
    </div>
  );
}


