import {
  getUploadedFile,
  isSafeUploadFilename,
  readLegacyUploadFile,
} from "@/lib/uploaded-files";

type RouteContext = {
  params: Promise<{ filename: string }>;
};

export async function GET(_req: Request, context: RouteContext) {
  const { filename } = await context.params;

  if (!isSafeUploadFilename(filename)) {
    return new Response("Not found", { status: 404 });
  }

  const stored = await getUploadedFile(filename);
  if (stored) {
    return new Response(new Uint8Array(stored.data), {
      headers: {
        "Content-Type": stored.mimeType,
        "Content-Length": String(stored.size),
        "Cache-Control": "public, max-age=31536000, immutable",
      },
    });
  }

  const legacy = await readLegacyUploadFile(filename);
  if (!legacy) {
    return new Response("Not found", { status: 404 });
  }

  return new Response(new Uint8Array(legacy.data), {
    headers: {
      "Content-Type": legacy.mimeType,
      "Content-Length": String(legacy.data.byteLength),
      "Cache-Control": "public, max-age=31536000, immutable",
    },
  });
}
