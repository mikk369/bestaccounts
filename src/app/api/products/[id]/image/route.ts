import { verifyToken } from "@/lib/auth";
import { getDb } from "@/lib/db";
import { writeFile, mkdir } from "fs/promises";
import path from "path";
import { v4 as uuidv4 } from "uuid";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const admin = await verifyToken();
    if (!admin) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const db = getDb();
    const existing = db.prepare("SELECT * FROM products WHERE id = ?").get(id);
    if (!existing) {
      return Response.json({ error: "Product not found" }, { status: 404 });
    }

    const formData = await request.formData();
    const file = formData.get("image") as File;
    if (!file) {
      return Response.json({ error: "No image file provided" }, { status: 400 });
    }

    const allowedTypes = ["image/jpeg", "image/png", "image/webp", "image/gif"];
    if (!allowedTypes.includes(file.type)) {
      return Response.json({ error: "Invalid file type. Use JPEG, PNG, WebP, or GIF" }, { status: 400 });
    }

    if (file.size > 5 * 1024 * 1024) {
      return Response.json({ error: "File too large. Max 5MB" }, { status: 400 });
    }

    const mimeToExt: Record<string, string> = {
      "image/jpeg": "jpg",
      "image/png": "png",
      "image/webp": "webp",
      "image/gif": "gif",
    };
    const ext = mimeToExt[file.type] || "jpg";
    const fileName = `${uuidv4()}.${ext}`;
    const uploadDir = path.join(process.cwd(), "public", "uploads");

    await mkdir(uploadDir, { recursive: true });

    const buffer = Buffer.from(await file.arrayBuffer());
    await writeFile(path.join(uploadDir, fileName), buffer);

    const imageUrl = `/uploads/${fileName}`;
    db.prepare("UPDATE products SET image_url = ? WHERE id = ?").run(imageUrl, id);

    return Response.json({ image_url: imageUrl });
  } catch {
    return Response.json({ error: "Failed to upload image" }, { status: 500 });
  }
}
