import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import Gallery from "@/app/product/_components/Gallery";
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
    <div className="mx-auto max-w-6xl px-4 py-6 md:py-10 grid gap-6 md:gap-10 md:grid-cols-2">
      <Gallery images={product.images} />

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

        <div className="flex flex-col sm:flex-row gap-3">
          <a href="https://t.me/mansionsell" target="_blank" rel="noopener noreferrer" className="px-5 py-3 bg-accent text-accent-foreground rounded-full text-sm text-center hover:bg-accent/90">
            Купить товар — напишите менеджеру в Telegram @mansionsell
          </a>
        </div>
      </div>
    </div>
  );
}


