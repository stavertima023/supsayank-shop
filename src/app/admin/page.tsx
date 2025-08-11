import Link from "next/link";
import { requireAdminOrRedirect } from "@/lib/adminAuth";

export const dynamic = "force-dynamic";

export default function AdminHomePage() {
  requireAdminOrRedirect();
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <Link href="/admin/products" className="p-4 rounded-lg border border-border hover:bg-muted">
        <div className="text-lg font-semibold">Товары</div>
        <div className="text-sm text-muted-foreground">Добавление, редактирование, удаление товаров</div>
      </Link>
      <Link href="/admin/brands" className="p-4 rounded-lg border border-border hover:bg-muted">
        <div className="text-lg font-semibold">Бренды</div>
        <div className="text-sm text-muted-foreground">Управление брендами</div>
      </Link>
      <Link href="/admin/categories" className="p-4 rounded-lg border border-border hover:bg-muted">
        <div className="text-lg font-semibold">Категории</div>
        <div className="text-sm text-muted-foreground">Управление категориями</div>
      </Link>
    </div>
  );
}


