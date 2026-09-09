import { NextRequest, NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import path from "path";

const ALLOWED_TYPES: Record<string, string[]> = {
  photos: [".jpg", ".jpeg", ".png", ".webp", ".gif"],
  documents: [".pdf", ".docx", ".txt"],
  videos: [".mp4", ".mov", ".webm"],
  certificates: [".jpg", ".jpeg", ".png", ".webp", ".gif", ".pdf"],
  snippets: [".tf", ".yml", ".yaml", ".py", ".sh", ".bash", ".js", ".ts", ".go", ".dockerfile"],
};

const MAX_SIZE: Record<string, number> = {
  photos: 10 * 1024 * 1024,
  documents: 10 * 1024 * 1024,
  videos: 50 * 1024 * 1024,
  certificates: 10 * 1024 * 1024,
  snippets: 5 * 1024 * 1024,
};

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File | null;
    const mediaType = formData.get("type") as string | null;

    if (!file || !mediaType) {
      return NextResponse.json({ error: "Missing file or type" }, { status: 400 });
    }

    if (!ALLOWED_TYPES[mediaType]) {
      return NextResponse.json({ error: "Invalid media type" }, { status: 400 });
    }

    const ext = path.extname(file.name).toLowerCase();
    const baseName = path.basename(file.name).toLowerCase();
    const isDockerfile = mediaType === "snippets" && (baseName === "dockerfile" || baseName.startsWith("dockerfile."));

    if (!isDockerfile && !ALLOWED_TYPES[mediaType].includes(ext)) {
      return NextResponse.json(
        { error: `File type ${ext || baseName} not allowed for ${mediaType}` },
        { status: 400 }
      );
    }

    if (file.size > MAX_SIZE[mediaType]) {
      const maxMB = MAX_SIZE[mediaType] / (1024 * 1024);
      return NextResponse.json(
        { error: `File exceeds ${maxMB}MB limit` },
        { status: 400 }
      );
    }

    const timestamp = Date.now();
    const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, "_");
    const filename = `${timestamp}-${safeName}`;

    const uploadDir = path.join(process.cwd(), "public", "uploads", mediaType);
    await mkdir(uploadDir, { recursive: true });

    const buffer = Buffer.from(await file.arrayBuffer());
    const filePath = path.join(uploadDir, filename);
    await writeFile(filePath, buffer);

    return NextResponse.json({
      url: `/uploads/${mediaType}/${filename}`,
      name: file.name,
      size: file.size,
      type: mediaType,
    });
  } catch {
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }
}
