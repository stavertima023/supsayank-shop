"use client";

import { useEffect, useRef } from "react";
import { slugify } from "@/lib/slugify";

interface Props {
  titleName?: string; // default: title
  slugName?: string; // default: slug
}

export default function AutoSlug({ titleName = "title", slugName = "slug" }: Props) {
  const lastAuto = useRef<string>("");
  useEffect(() => {
    const form = document.querySelector("form");
    if (!form) return;
    const titleInput = form.querySelector<HTMLInputElement>(`input[name='${titleName}']`);
    const slugInput = form.querySelector<HTMLInputElement>(`input[name='${slugName}']`);
    if (!titleInput || !slugInput) return;

    const onTitle = () => {
      const candidate = slugify(titleInput.value || "");
      const current = slugInput.value || "";
      if (!current || current === lastAuto.current) {
        slugInput.value = candidate;
        slugInput.dispatchEvent(new Event("input", { bubbles: true }));
        lastAuto.current = candidate;
      }
    };
    titleInput.addEventListener("input", onTitle);
    return () => {
      titleInput.removeEventListener("input", onTitle);
    };
  }, [slugName, titleName]);
  return null;
}


