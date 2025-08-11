import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function run() {
  // No default brands/categories — only admin-created

  // Example products
  const supreme = await prisma.brand.findFirst({ where: { slug: "supreme" } });
  const hoodies = await prisma.category.findFirst({ where: { slug: "hoodies" } });
  const tshirts = await prisma.category.findFirst({ where: { slug: "t-shirts" } });

  if (!supreme || !hoodies || !tshirts) throw new Error("Seed prerequisites missing");

  await prisma.product.upsert({
    where: { slug: "supreme-box-logo-hoodie" },
    update: {},
    create: {
      title: "Supreme Box Logo Hoodie",
      slug: "supreme-box-logo-hoodie",
      description: "Культовый худи Supreme с логотипом Box Logo.",
      priceCents: 18900,
      brandId: supreme.id,
      categoryId: hoodies.id,
      images: {
        create: [
          { url: "https://images.unsplash.com/photo-1541099649105-f69ad21f3246", alt: "Supreme hoodie" },
        ],
      },
      variants: {
        create: [
          { sku: "SUP-HOODIE-BLACK-M", size: "M", color: "Black", stock: 10 },
          { sku: "SUP-HOODIE-BLACK-L", size: "L", color: "Black", stock: 8 },
        ],
      },
    },
  });

  await prisma.product.upsert({
    where: { slug: "supreme-logo-tee" },
    update: {},
    create: {
      title: "Supreme Logo Tee",
      slug: "supreme-logo-tee",
      description: "Базовая футболка Supreme с логотипом.",
      priceCents: 6900,
      brandId: supreme.id,
      categoryId: tshirts.id,
      images: {
        create: [
          { url: "https://images.unsplash.com/photo-1512436991641-6745cdb1723f", alt: "Supreme tee" },
        ],
      },
      variants: {
        create: [
          { sku: "SUP-TEE-WHITE-M", size: "M", color: "White", stock: 25 },
          { sku: "SUP-TEE-WHITE-L", size: "L", color: "White", stock: 20 },
        ],
      },
    },
  });
}

run()
  .then(async () => {
    await prisma.$disconnect();
    // eslint-disable-next-line no-console
    console.log("Seed completed");
  })
  .catch(async (e) => {
    // eslint-disable-next-line no-console
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });


