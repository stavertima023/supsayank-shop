"use client";

import { useState } from "react";

type ImageItem = { url: string | null };

export default function Gallery({ images }: { images: ImageItem[] }) {
  const urls = images.map((i) => i.url ?? "");
  const [active, setActive] = useState<string>(urls[0] ?? "");
  return (
    <div className="space-y-3">
      <div className="aspect-square rounded-xl overflow-hidden bg-muted">
        {active && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={active} alt="Фото товара" className="w-full h-full object-cover" />
        )}
      </div>
      <div className="grid grid-cols-4 gap-2 md:gap-3">
        {urls.slice(0, 8).map((src, idx) => (
          <button
            key={`${src}-${idx}`}
            type="button"
            onClick={() => setActive(src)}
            className="aspect-square rounded-md overflow-hidden border border-border hover:opacity-80"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={src} alt="" className="w-full h-full object-cover" />
          </button>
        ))}
      </div>
    </div>
  );
}






