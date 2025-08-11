"use client";

import { useRef, useState } from "react";

interface Props {
  targetTextareaName?: string; // default: images
}

export default function UploadImage({ targetTextareaName = "images" }: Props) {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [isUploading, setUploading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [previews, setPreviews] = useState<string[]>([]);

  async function onUploadClick() {
    const fileInput = inputRef.current;
    if (!fileInput || !fileInput.files || fileInput.files.length === 0) {
      setMessage("Выберите файл");
      return;
    }
    const file = fileInput.files[0];
    const formData = new FormData();
    formData.append("file", file);
    try {
      setUploading(true);
      setMessage(null);
      const res = await fetch("/api/upload", { method: "POST", body: formData });
      if (!res.ok) throw new Error(await res.text());
      const data = (await res.json()) as { url: string };
      const url = data.url;
      // вставим URL в textarea с именем targetTextareaName
      const form = fileInput.closest("form");
      const textarea = form?.querySelector<HTMLTextAreaElement>(`textarea[name='${targetTextareaName}']`);
      if (textarea) {
        const prefix = textarea.value && !textarea.value.endsWith("\n") ? "\n" : "";
        textarea.value = `${textarea.value}${prefix}${url}`;
        textarea.dispatchEvent(new Event("input", { bubbles: true }));
      }
      setMessage("Загружено: " + url);
      setPreviews((arr) => [url, ...arr].slice(0, 6));
      fileInput.value = "";
    } catch (e) {
      const err = e as { message?: string } | undefined;
      setMessage("Ошибка загрузки: " + (err?.message || "unknown"));
    } finally {
      setUploading(false);
    }
  }

  return (
    <div className="mt-2 flex flex-col gap-2">
      <div className="flex items-center gap-2">
        <input ref={inputRef} type="file" accept="image/*" className="text-xs" />
        <button type="button" onClick={onUploadClick} disabled={isUploading} className="px-2 py-1 rounded bg-accent text-accent-foreground text-xs">
          {isUploading ? "Загрузка..." : "Загрузить фото"}
        </button>
      </div>
      {message && <div className="text-xs text-muted-foreground">{message}</div>}
      {previews.length > 0 && (
        <div className="mt-2 grid grid-cols-3 gap-2">
          {previews.map((src, i) => (
            <div key={`${src}-${i}`} className="w-full aspect-square rounded-md bg-cover bg-center" style={{ backgroundImage: `url(${src})` }} />
          ))}
        </div>
      )}
    </div>
  );
}


