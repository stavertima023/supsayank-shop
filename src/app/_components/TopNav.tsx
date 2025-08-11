"use client";

import Link from "next/link";
import { useMemo, useRef, useState } from "react";

type SimpleItem = { id: string; name: string; slug: string };

interface Props {
  brands: Array<SimpleItem>;
  categories: Array<SimpleItem>;
}

export default function TopNav({ brands, categories }: Props) {
  const [openMenu, setOpenMenu] = useState<"clothing" | "brands" | null>(null);
  const closeTimer = useRef<NodeJS.Timeout | null>(null);

  function open(name: "clothing" | "brands") {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    setOpenMenu(name);
  }
  function scheduleClose() {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    closeTimer.current = setTimeout(() => setOpenMenu(null), 150);
  }

  const sortedBrands = useMemo(
    () => [...brands].sort((a, b) => a.name.localeCompare(b.name)),
    [brands]
  );
  const sortedCategories = useMemo(
    () => [...categories].sort((a, b) => a.name.localeCompare(b.name)),
    [categories]
  );

  return (
    <nav className="hidden md:flex items-center gap-8 text-lg">
      <div
        className="relative"
        onMouseEnter={() => open("clothing")}
        onMouseLeave={scheduleClose}
      >
        <button className="px-4 py-2 rounded hover:bg-muted" onClick={() => setOpenMenu(openMenu === 'clothing' ? null : 'clothing')}>Одежда</button>
        {openMenu === "clothing" && (
          <div className="absolute left-0 mt-2 flex flex-col bg-background border border-border rounded-md shadow-md p-2 min-w-64 z-50">
            {sortedCategories.map((c) => (
              <Link
                key={c.id}
                href={`/category/${c.slug}`}
                className="px-4 py-2 rounded hover:bg-muted"
              >
                {c.name}
              </Link>
            ))}
          </div>
        )}
      </div>
      <div
        className="relative"
        onMouseEnter={() => open("brands")}
        onMouseLeave={scheduleClose}
      >
        <button className="px-4 py-2 rounded hover:bg-muted" onClick={() => setOpenMenu(openMenu === 'brands' ? null : 'brands')}>Бренды</button>
        {openMenu === "brands" && (
          <div className="absolute left-0 mt-2 flex max-h-96 overflow-auto flex-col bg-background border border-border rounded-md shadow-md p-2 min-w-64 z-50">
            {sortedBrands.map((b) => (
              <Link
                key={b.id}
                href={`/brands/${b.slug}`}
                className="px-4 py-2 rounded hover:bg-muted"
              >
                {b.name}
              </Link>
            ))}
          </div>
        )}
      </div>
    </nav>
  );
}


