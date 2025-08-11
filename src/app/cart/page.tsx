import Link from "next/link";
import { prisma } from "@/lib/prisma";

export default async function CartPage() {
  // For MVP, show empty cart placeholder
  const itemsCount = 0;
  const total = 0;

  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <h1 className="text-2xl font-semibold mb-6">Корзина</h1>
      {itemsCount === 0 ? (
        <div className="text-muted-foreground">
          Корзина пуста. Перейдите в <Link href="/catalog" className="underline">каталог</Link> и добавьте товары.
        </div>
      ) : (
        <div>Товары в корзине...</div>
      )}
      <div className="mt-8 flex items-center justify-between">
        <div className="text-lg font-semibold">Итого: {total.toLocaleString("ru-RU")} ₽</div>
        <Link href="/checkout" className="px-5 py-3 bg-accent text-accent-foreground rounded-full text-sm hover:bg-accent/90">Оформить</Link>
      </div>
    </div>
  );
}



