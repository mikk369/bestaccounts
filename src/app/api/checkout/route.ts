import { getDb } from "@/lib/db";
import Stripe from "stripe";
import { v4 as uuidv4 } from "uuid";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "", {
  apiVersion: "2026-03-25.dahlia",
});

export async function POST(request: Request) {
  try {
    const { productId } = await request.json();

    if (!productId) {
      return Response.json({ error: "Product ID is required" }, { status: 400 });
    }

    const db = getDb();
    const product = db.prepare("SELECT * FROM products WHERE id = ?").get(productId) as {
      id: string;
      title: string;
      price: number;
      stock: number;
      image_url: string;
    } | undefined;

    if (!product) {
      return Response.json({ error: "Product not found" }, { status: 404 });
    }

    if (product.stock <= 0) {
      return Response.json({ error: "Product out of stock" }, { status: 400 });
    }

    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: product.title,
              ...(product.image_url ? { images: [`${baseUrl}${product.image_url}`] } : {}),
            },
            unit_amount: Math.round(product.price * 100),
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `${baseUrl}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${baseUrl}/product/${product.id}`,
      metadata: {
        product_id: product.id,
      },
    });

    // Create order record
    const orderId = uuidv4();
    db.prepare(
      "INSERT INTO orders (id, product_id, stripe_session_id, status) VALUES (?, ?, ?, ?)"
    ).run(orderId, product.id, session.id, "pending");

    return Response.json({ url: session.url });
  } catch (error) {
    console.error("Checkout error:", error);
    return Response.json({ error: "Failed to create checkout session" }, { status: 500 });
  }
}
