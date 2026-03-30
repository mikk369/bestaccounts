import { getDb } from "@/lib/db";
import { verifyToken } from "@/lib/auth";
import { v4 as uuidv4 } from "uuid";

export async function GET(request: Request) {
  try {
    const db = getDb();
    const url = new URL(request.url);
    const category = url.searchParams.get("category");
    const search = url.searchParams.get("search");
    const sort = url.searchParams.get("sort") || "featured";
    const minPrice = url.searchParams.get("minPrice");
    const maxPrice = url.searchParams.get("maxPrice");

    let query = "SELECT * FROM products WHERE 1=1";
    const params: (string | number)[] = [];

    if (category) {
      query += " AND category = ?";
      params.push(category);
    }
    if (search) {
      query += " AND (title LIKE ? OR description LIKE ?)";
      params.push(`%${search}%`, `%${search}%`);
    }
    if (minPrice) {
      query += " AND price >= ?";
      params.push(Number(minPrice));
    }
    if (maxPrice) {
      query += " AND price <= ?";
      params.push(Number(maxPrice));
    }

    switch (sort) {
      case "price_asc":
        query += " ORDER BY price ASC";
        break;
      case "price_desc":
        query += " ORDER BY price DESC";
        break;
      case "newest":
        query += " ORDER BY created_at DESC";
        break;
      case "featured":
      default:
        query += " ORDER BY featured DESC, created_at DESC";
        break;
    }

    const products = db.prepare(query).all(...params);
    return Response.json(products);
  } catch {
    return Response.json({ error: "Failed to fetch products" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const admin = await verifyToken();
    if (!admin) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { title, description, price, category, stock, sku, featured } = body;

    if (!title || price === undefined || price === null || isNaN(Number(price)) || Number(price) < 0) {
      return Response.json({ error: "Title and a valid price are required" }, { status: 400 });
    }

    const db = getDb();
    const id = uuidv4();

    db.prepare(
      `INSERT INTO products (id, title, description, price, category, stock, sku, featured)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`
    ).run(id, title, description || "", Number(price), category || "General", stock ?? 1, sku || "", featured ? 1 : 0);

    const product = db.prepare("SELECT * FROM products WHERE id = ?").get(id);
    return Response.json(product, { status: 201 });
  } catch {
    return Response.json({ error: "Failed to create product" }, { status: 500 });
  }
}
