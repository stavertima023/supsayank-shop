import { NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/adminAuth";
import { getSupabaseAdmin } from "@/lib/supabaseAdmin";

export const dynamic = "force-dynamic";

// Expect env: CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET, optionally CLOUDINARY_FOLDER

export async function POST(req: Request) {
  if (!(await isAdminAuthenticated())) {
    return new NextResponse("Unauthorized", { status: 401 });
  }
  const contentType = req.headers.get("content-type") || "";
  if (!contentType.startsWith("multipart/form-data")) {
    return new NextResponse("Expected multipart/form-data", { status: 400 });
  }
  const form = await req.formData();
  const file = form.get("file");
  type FileLike = { arrayBuffer: () => Promise<ArrayBuffer>; name?: string; type?: string };
  const isFileLike = (v: unknown): v is FileLike => {
    return !!v && typeof (v as Record<string, unknown>).arrayBuffer === "function";
  };
  if (!isFileLike(file)) {
    return new NextResponse("Missing file", { status: 400 });
  }
  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);
  const bucket = process.env.SUPABASE_BUCKET || "images";
  const originalName = (file as FileLike).name || "upload.bin";
  const safeName = originalName.replace(/[^a-zA-Z0-9._-]/g, "_");
  const fileName = `${Date.now()}-${Math.random().toString(36).slice(2)}-${safeName}`;
  const supabase = getSupabaseAdmin();
  const { data, error } = await supabase.storage.from(bucket).upload(fileName, buffer, {
    contentType: (file as FileLike).type || "application/octet-stream",
    upsert: false,
  });
  if (error) {
    return new NextResponse(error.message, { status: 500 });
  }
  // Build public URL
  const urlBase = process.env.SUPABASE_URL?.replace(/\/$/, "");
  const publicUrl = `${urlBase}/storage/v1/object/public/${bucket}/${encodeURIComponent(fileName)}`;
  return NextResponse.json({ url: publicUrl });
}


