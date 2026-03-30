import { readFile } from "fs/promises";
import path from "path";

const MIME_TYPES: Record<string, string> = {
  jpg: "image/jpeg",
  jpeg: "image/jpeg",
  png: "image/png",
  webp: "image/webp",
  gif: "image/gif",
};

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ path: string[] }> }
) {
  const segments = (await params).path;
  const fileName = segments[segments.length - 1];

  if (!fileName || fileName.includes("..") || segments.some((s) => s.includes(".."))) {
    return new Response("Not found", { status: 404 });
  }

  const ext = fileName.split(".").pop()?.toLowerCase() ?? "";
  const contentType = MIME_TYPES[ext];
  if (!contentType) {
    return new Response("Not found", { status: 404 });
  }

  try {
    const filePath = path.join(process.cwd(), "public", "uploads", ...segments);
    const buffer = await readFile(filePath);

    return new Response(buffer, {
      headers: {
        "Content-Type": contentType,
        "Cache-Control": "public, max-age=31536000, immutable",
      },
    });
  } catch {
    return new Response("Not found", { status: 404 });
  }
}
