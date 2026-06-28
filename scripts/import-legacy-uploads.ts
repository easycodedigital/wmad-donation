import { readdir, readFile } from "fs/promises";
import path from "path";
import { prisma } from "@/lib/prisma";
import { isSafeUploadFilename, saveUploadedFile } from "@/lib/uploaded-files";

async function main() {
  const uploadsDir = path.join(process.cwd(), "public", "uploads");
  let entries: string[];

  try {
    entries = await readdir(uploadsDir);
  } catch {
    console.log("No public/uploads directory found.");
    return;
  }

  let imported = 0;
  let skipped = 0;

  for (const filename of entries) {
    if (!isSafeUploadFilename(filename)) {
      skipped += 1;
      continue;
    }

    const existing = await prisma.uploadedFile.findUnique({ where: { filename } });
    if (existing) {
      skipped += 1;
      continue;
    }

    const filePath = path.join(uploadsDir, filename);
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

    await saveUploadedFile(filename, mimeType, data);
    imported += 1;
    console.log(`Imported ${filename}`);
  }

  console.log(`Done. Imported: ${imported}, skipped: ${skipped}.`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
