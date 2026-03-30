import { getDb } from "@/lib/db";
import ShopFilters from "@/components/ShopFilters";

interface Product {
  id: string;
  title: string;
  description: string;
  price: number;
  image_url: string;
  stock: number;
  category: string;
  sku: string;
  featured: number;
}

export const dynamic = "force-dynamic";

export default function HomePage() {
  const db = getDb();
  const products = db.prepare("SELECT * FROM products ORDER BY featured DESC, created_at DESC").all() as Product[];
  const categories = db.prepare("SELECT DISTINCT category FROM products ORDER BY category").all() as { category: string }[];

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      {/* Hero */}
      <section className="mb-10 rounded-2xl border border-card-border bg-gradient-to-br from-accent/10 via-card-bg to-card-bg p-8 sm:p-12">
        <h1 className="mb-3 text-3xl font-bold tracking-tight sm:text-4xl">
          Premium Gaming Accounts
        </h1>
        <p className="max-w-2xl text-muted">
          Browse our selection of verified gaming accounts. Secure checkout, instant delivery, and dedicated support for every purchase.
        </p>

        {/* How it works */}
        <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { icon: "M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z", title: "Browse", desc: "Find the perfect account for your needs" },
            { icon: "M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25v10.5A2.25 2.25 0 004.5 19.5z", title: "Pay Securely", desc: "Checkout powered by Stripe" },
            { icon: "M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75", title: "Get Details", desc: "Account info delivered to your email" },
            { icon: "M5.25 5.653c0-.856.917-1.398 1.667-.986l11.54 6.347a1.125 1.125 0 010 1.972l-11.54 6.347a1.125 1.125 0 01-1.667-.986V5.653z", title: "Play", desc: "Jump in and start enjoying" },
          ].map((step, i) => (
            <div key={i} className="flex items-start gap-3 rounded-lg bg-background/50 p-4">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-accent/20">
                <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24" className="text-accent">
                  <path strokeLinecap="round" strokeLinejoin="round" d={step.icon} />
                </svg>
              </div>
              <div>
                <h3 className="text-sm font-semibold">{step.title}</h3>
                <p className="text-xs text-muted">{step.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Filters and Products */}
      <ShopFilters
        initialProducts={products}
        initialCategories={categories.map((c) => c.category)}
      />
    </div>
  );
}
