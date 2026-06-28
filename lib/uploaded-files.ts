import { readFile } from "fs/promises";
import path from "path";
import { prisma } from "@/lib/prisma";

const UPLOAD_FILENAME_PATTERN = /^\d+-[a-z0-9]+\.(jpe?g|png|webp|gif)$/i;

export function isSafeUploadFilename(filename: string): boolean {
  return UPLOAD_FILENAME_PATTERN.test(filename);
}

export function uploadPublicPath(filename: string): string {
  return `/uploads/${filename}`;
}

export async function saveUploadedFile(
  filename: string,
  mimeType: string,
  data: Buffer,
): Promise<{ url: string; filename: string }> {
  await prisma.uploadedFile.create({
    data: {
      filename,
      mimeType,
      data: new Uint8Array(data),
      size: data.byteLength,
    },
  });

  return { url: uploadPublicPath(filename), filename };
}

export async function getUploadedFile(filename: string) {
  if (!isSafeUploadFilename(filename)) {
    return null;
  }

  return prisma.uploadedFile.findUnique({
    where: { filename },
    select: {
      filename: true,
      mimeType: true,
      data: true,
      size: true,
    },
  });
}

export async function readLegacyUploadFile(filename: string): Promise<{
  mimeType: string;
  data: Buffer;
} | null> {
  if (!isSafeUploadFilename(filename)) {
    return null;
  }

  const filePath = path.join(process.cwd(), "public", "uploads", filename);
  try {
    const data = await readFile(filePath);
    const ext = filename.split(".").pop()?.toLowerCase() ?? "";
    const mimeType =
      ext === "png"
        ? "image/png"
        : ext === "webp"
          ? "image/webp"
          : ext === "gif"
            ? "image/gif"
            : "image/jpeg";
    return { mimeType, data };
  } catch {
    return null;
  }
}
