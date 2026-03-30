import { getDb } from "@/lib/db";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "", {
  apiVersion: "2026-03-25.dahlia",
});

export async function POST(request: Request) {
  const body = await request.text();
  const signature = request.headers.get("stripe-signature");

  if (!signature) {
    return Response.json({ error: "Missing signature" }, { status: 400 });
  }

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET || ""
    );
  } catch {
    return Response.json({ error: "Invalid signature" }, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    const db = getDb();

    // Update order status
    db.prepare("UPDATE orders SET status = ?, customer_email = ? WHERE stripe_session_id = ?").run(
      "completed",
      session.customer_details?.email || "",
      session.id
    );

    // Decrease stock
    if (session.metadata?.product_id) {
      db.prepare("UPDATE products SET stock = stock - 1 WHERE id = ? AND stock > 0").run(
        session.metadata.product_id
      );
    }
  }

  return Response.json({ received: true });
}
