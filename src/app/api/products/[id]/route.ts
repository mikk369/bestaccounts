import { getDb } from "@/lib/db";
import { verifyToken } from "@/lib/auth";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const db = getDb();
    const product = db.prepare("SELECT * FROM products WHERE id = ?").get(id);

    if (!product) {
      return Response.json({ error: "Product not found" }, { status: 404 });
    }

    return Response.json(product);
  } catch {
    return Response.json({ error: "Failed to fetch product" }, { status: 500 });
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const admin = await verifyToken();
    if (!admin) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const body = await request.json();
    const { title, description, price, category, stock, sku, featured, image_url } = body;

    const db = getDb();
    const existing = db.prepare("SELECT * FROM products WHERE id = ?").get(id);
    if (!existing) {
      return Response.json({ error: "Product not found" }, { status: 404 });
    }

    db.prepare(
      `UPDATE products SET title = ?, description = ?, price = ?, category = ?,
       stock = ?, sku = ?, featured = ?, image_url = ? WHERE id = ?`
    ).run(
      title, description || "", Number(price), category || "General",
      stock ?? 1, sku || "", featured ? 1 : 0, image_url || "", id
    );

    const product = db.prepare("SELECT * FROM products WHERE id = ?").get(id);
    return Response.json(product);
  } catch {
    return Response.json({ error: "Failed to update product" }, { status: 500 });
  }
}

export async function DELETE(
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

    db.prepare("DELETE FROM products WHERE id = ?").run(id);
    return Response.json({ success: true });
  } catch {
    return Response.json({ error: "Failed to delete product" }, { status: 500 });
  }
}
