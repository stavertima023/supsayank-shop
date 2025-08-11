import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
export const dynamic = "force-dynamic";

interface Props {
  params: Promise<{ slug: string }>;
}

type ProductImageLite = { id: string; url: string | null };
type VariantLite = { id: string; size?: string | null };
interface ProductDetail {
  title: string;
  slug: string;
  description?: string | null;
  priceCents: number;
  currency: string;
  images: ProductImageLite[];
  variants: VariantLite[];
  brand: { name: string };
  category: { name: string };
}

export default async function ProductPage({ params }: Props) {
  const { slug } = await params;
  let product: ProductDetail | null = null;
  try {
    product = await prisma.product.findUnique({
      where: { slug },
      include: {
        images: { orderBy: { index: "asc" } },
        variants: true,
        brand: true,
        category: true,
      },
    });
  } catch {
    // ignore
  }
  if (!product) return notFound();

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 grid gap-10 md:grid-cols-2">
      <div className="space-y-3">
        <div
          className="aspect-square rounded-xl bg-cover bg-center"
          style={{ backgroundImage: `url(${product.images[0]?.url ?? "https://images.unsplash.com/photo-1512436991641-6745cdb1723f"})` }}
        />
        <div className="grid grid-cols-4 gap-3">
          {product.images.slice(0, 4).map((img: ProductImageLite) => (
            <div key={img.id} className="aspect-square rounded-lg bg-cover bg-center" style={{ backgroundImage: `url(${img.url ?? ""})` }} />
          ))}
        </div>
      </div>

      <div className="space-y-6">
        <div className="space-y-1">
          <div className="text-sm text-muted-foreground">{product.brand.name} • {product.category.name}</div>
          <h1 className="text-2xl font-semibold">{product.title}</h1>
        </div>
        <div className="text-xl font-semibold">{(product.priceCents / 100).toLocaleString("ru-RU", { style: "currency", currency: 'RUB' })}</div>
        <p className="text-muted-foreground">{product.description ?? ""}</p>

        {product.variants.length > 0 && (
          <div className="space-y-2">
            <div className="text-sm">Размер</div>
            <div className="flex flex-wrap gap-2">
              {product.variants.map((v: VariantLite) => (
                <button key={v.id} className="px-3 py-2 rounded-full border border-border text-sm hover:bg-muted">
                  {v.size ?? "OS"}
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="flex gap-3">
          <form action={async () => { 'use server'; /* placeholder for server action */ }}>
            <button className="px-5 py-3 bg-accent text-accent-foreground rounded-full text-sm hover:bg-accent/90">В корзину</button>
          </form>
          <Link href="/cart" className="px-5 py-3 border border-border rounded-full text-sm hover:bg-muted">Перейти в корзину</Link>
        </div>
      </div>
    </div>
  );
}


