import { getDb } from "@/lib/db";

export async function GET() {
  try {
    const db = getDb();
    const categories = db.prepare("SELECT DISTINCT category FROM products ORDER BY category").all() as { category: string }[];
    return Response.json(categories.map((c) => c.category));
  } catch {
    return Response.json({ error: "Failed to fetch categories" }, { status: 500 });
  }
}
