import { prisma } from "@/lib/prisma";
import { requireAdminOrRedirect } from "@/lib/adminAuth";

export const dynamic = "force-dynamic";

async function createBrand(formData: FormData) {
  'use server';
  const { requireAdminOrRedirect } = await import("@/lib/adminAuth");
  requireAdminOrRedirect();
  const name = String(formData.get("name") || "").trim();
  const slug = String(formData.get("slug") || "").trim();
  if (!name || !slug) return;
  await prisma.brand.create({ data: { name, slug } });
}

async function deleteBrand(formData: FormData) {
  'use server';
  const { requireAdminOrRedirect } = await import("@/lib/adminAuth");
  requireAdminOrRedirect();
  const id = String(formData.get("id") || "");
  if (!id) return;
  await prisma.brand.delete({ where: { id } });
}

export default async function AdminBrandsPage() {
  requireAdminOrRedirect();
  const brands = await prisma.brand.findMany({ orderBy: { name: "asc" } });
  return (
    <div className="grid gap-8">
      <div>
        <h1 className="text-2xl font-semibold mb-4">Бренды</h1>
        <div className="grid gap-2">
          {brands.map((b) => (
            <form key={b.id} action={deleteBrand} className="flex items-center justify-between p-3 rounded-md border border-border">
              <div>
                <div className="font-medium">{b.name}</div>
                <div className="text-xs text-muted-foreground">{b.slug}</div>
              </div>
              <input type="hidden" name="id" value={b.id} />
              <button className="text-sm text-muted-foreground hover:text-foreground">Удалить</button>
            </form>
          ))}
        </div>
      </div>
      <div className="border-t border-border pt-6">
        <h2 className="text-lg font-semibold mb-3">Добавить бренд</h2>
        <form action={createBrand} className="grid gap-3 max-w-md">
          <input name="name" placeholder="Название" className="px-3 py-2 rounded-md bg-muted border border-border" required />
          <input name="slug" placeholder="slug" className="px-3 py-2 rounded-md bg-muted border border-border" required />
          <button className="px-4 py-2 bg-accent text-accent-foreground rounded-md text-sm" type="submit">Добавить</button>
        </form>
      </div>
    </div>
  );
}


