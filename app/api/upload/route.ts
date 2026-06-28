import { saveUploadedFile } from "@/lib/uploaded-files";

const MAX_FILE_SIZE = 5 * 1024 * 1024;
const ALLOWED_TYPES = new Set(["image/jpeg", "image/png", "image/webp", "image/gif"]);

export async function POST(req: Request) {
  const formData = await req.formData();
  const file = formData.get("file");

  if (!(file instanceof File)) {
    return Response.json({ error: "File is required." }, { status: 400 });
  }

  if (!ALLOWED_TYPES.has(file.type)) {
    return Response.json(
      { error: "Unsupported file type. Use jpg, png, webp, or gif." },
      { status: 400 },
    );
  }

  if (file.size > MAX_FILE_SIZE) {
    return Response.json({ error: "File too large (max 5MB)." }, { status: 400 });
  }

  const ext = file.name.includes(".") ? file.name.split(".").pop() : "png";
  const safeExt = (ext ?? "png").replace(/[^a-zA-Z0-9]/g, "").toLowerCase() || "png";
  const filename = `${Date.now()}-${Math.random().toString(36).slice(2)}.${safeExt}`;
  const buffer = Buffer.from(await file.arrayBuffer());

  try {
    const saved = await saveUploadedFile(filename, file.type, buffer);
    return Response.json(saved);
  } catch (error) {
    console.error("Upload save failed:", error);
    return Response.json({ error: "Could not save uploaded image." }, { status: 500 });
  }
}
