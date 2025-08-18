"use client";

import { useState } from "react";
import Link from "next/link";

type SimpleItem = { id: string; name: string; slug: string };

export default function MobileNav({ brands, categories }: { brands: SimpleItem[]; categories: SimpleItem[] }) {
  const [open, setOpen] = useState(false);
  const [openSection, setOpenSection] = useState<"clothing" | "brands" | null>(null);

  function toggleDrawer() {
    setOpen((v) => !v);
    if (!open) setOpenSection(null);
  }

  function toggleSection(s: "clothing" | "brands") {
    setOpenSection((v) => (v === s ? null : s));
  }

  return (
    <>
      <button
        aria-label="Открыть меню"
        className="md:hidden justify-self-end p-2 rounded glass-chip hover:opacity-90"
        onClick={toggleDrawer}
      >
        <span className="block w-6 h-0.5 bg-current mb-1"></span>
        <span className="block w-6 h-0.5 bg-current mb-1"></span>
        <span className="block w-6 h-0.5 bg-current"></span>
      </button>

      {open && (
        <>
          {/* Backdrop */}
          <div className="fixed inset-0 z-40 bg-black/30" onClick={toggleDrawer} />
          {/* Drawer */}
          <aside
            className="fixed z-50 inset-y-0 left-0 w-72 solid-menu bg-white p-3 menu-fade border border-border shadow-xl"
            style={{ backgroundColor: '#ffffff', opacity: 1, backdropFilter: 'none', WebkitBackdropFilter: 'none' }}
          >
            <div className="flex items-center justify-between mb-2">
              <div className="font-semibold">Меню</div>
              <button aria-label="Закрыть" onClick={toggleDrawer} className="p-2 rounded hover:bg-muted">✕</button>
            </div>
            <nav className="space-y-2">
              <div>
                <button onClick={() => toggleSection("clothing")} className="w-full text-left px-3 py-2 rounded hover:bg-muted font-medium">Одежда</button>
                {openSection === "clothing" && (
                  <div className="mt-1 pl-2 space-y-1">
                    {categories.map((c) => (
                      <Link key={c.id} href={`/category/${c.slug}`} onClick={() => setOpen(false)} className="block px-3 py-2 rounded hover:bg-muted">
                        {c.name}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
              <div>
                <button onClick={() => toggleSection("brands")} className="w-full text-left px-3 py-2 rounded hover:bg-muted font-medium">Бренды</button>
                {openSection === "brands" && (
                  <div className="mt-1 pl-2 max-h-80 overflow-auto space-y-1">
                    {brands.map((b) => (
                      <Link key={b.id} href={`/brands/${b.slug}`} onClick={() => setOpen(false)} className="block px-3 py-2 rounded hover:bg-muted">
                        {b.name}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            </nav>
          </aside>
        </>
      )}
    </>
  );
}


