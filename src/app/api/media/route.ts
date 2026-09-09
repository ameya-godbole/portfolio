import { NextResponse } from "next/server";
import { readdir, stat, readFile } from "fs/promises";
import path from "path";

type MediaFile = {
  name: string;
  url: string;
  size: number;
  type: string;
  preview?: string;
};

const MEDIA_TYPES = ["photos", "documents", "videos", "certificates", "snippets"];

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const result: Record<string, MediaFile[]> = {};

    for (const type of MEDIA_TYPES) {
      const dir = path.join(process.cwd(), "public", "uploads", type);
      try {
        const files = await readdir(dir);
        const mediaFiles: MediaFile[] = [];

        for (const file of files) {
          if (file.startsWith(".")) continue;
          const filePath = path.join(dir, file);
          const fileStat = await stat(filePath);
          if (fileStat.isFile()) {
            const entry: MediaFile = {
              name: file,
              url: `/uploads/${type}/${file}`,
              size: fileStat.size,
              type,
            };

            if (type === "snippets") {
              try {
                const content = await readFile(filePath, "utf-8");
                const lines = content.split("\n").slice(0, 5);
                entry.preview = lines.join("\n");
              } catch {
                entry.preview = "";
              }
            }

            mediaFiles.push(entry);
          }
        }

        result[type] = mediaFiles.sort((a, b) => b.name.localeCompare(a.name));
      } catch {
        result[type] = [];
      }
    }

    return NextResponse.json(result);
  } catch {
    return NextResponse.json({ error: "Failed to list media" }, { status: 500 });
  }
}
