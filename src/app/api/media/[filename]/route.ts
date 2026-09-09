import { NextRequest, NextResponse } from "next/server";
import { unlink } from "fs/promises";
import { existsSync } from "fs";
import path from "path";

const MEDIA_TYPES = ["photos", "documents", "videos", "certificates", "snippets"];

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ filename: string }> }
) {
  try {
    const { filename } = await params;

    if (!filename || filename.includes("..") || filename.includes("/")) {
      return NextResponse.json({ error: "Invalid filename" }, { status: 400 });
    }

    for (const type of MEDIA_TYPES) {
      const filePath = path.join(process.cwd(), "public", "uploads", type, filename);
      if (existsSync(filePath)) {
        await unlink(filePath);
        return NextResponse.json({ success: true, deleted: filename });
      }
    }

    return NextResponse.json({ error: "File not found" }, { status: 404 });
  } catch {
    return NextResponse.json({ error: "Delete failed" }, { status: 500 });
  }
}
