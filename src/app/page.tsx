"use client";

import { useEffect, useState, useCallback } from "react";
import ProductCard from "@/components/ProductCard";

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

export default function HomePage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [sort, setSort] = useState("featured");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    const params = new URLSearchParams();
    if (search) params.set("search", search);
    if (category) params.set("category", category);
    if (sort) params.set("sort", sort);
    if (minPrice) params.set("minPrice", minPrice);
    if (maxPrice) params.set("maxPrice", maxPrice);

    const res = await fetch(`/api/products?${params}`);
    const data = await res.json();
    setProducts(Array.isArray(data) ? data : []);
    setLoading(false);
  }, [search, category, sort, minPrice, maxPrice]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  useEffect(() => {
    fetch("/api/categories")
      .then((r) => r.json())
      .then((data) => setCategories(Array.isArray(data) ? data : []));
  }, []);

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
      <div className="flex flex-col gap-6 lg:flex-row">
        {/* Sidebar Filters */}
        <aside className="w-full shrink-0 lg:w-64">
          <div className="sticky top-20 space-y-5 rounded-xl border border-card-border bg-card-bg p-5">
            <h2 className="text-sm font-bold uppercase tracking-wider text-muted">Filters</h2>

            <div>
              <label className="mb-1.5 block text-xs font-medium text-muted">Search</label>
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search accounts..."
                className="w-full rounded-lg border border-card-border bg-input-bg px-3 py-2 text-sm text-foreground placeholder-muted outline-none transition-colors focus:border-accent"
              />
            </div>

            {categories.length > 0 && (
              <div>
                <label className="mb-1.5 block text-xs font-medium text-muted">Category</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full rounded-lg border border-card-border bg-input-bg px-3 py-2 text-sm text-foreground outline-none transition-colors focus:border-accent"
                >
                  <option value="">All Categories</option>
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>
            )}

            <div>
              <label className="mb-1.5 block text-xs font-medium text-muted">Price Range</label>
              <div className="flex gap-2">
                <input
                  type="number"
                  value={minPrice}
                  onChange={(e) => setMinPrice(e.target.value)}
                  placeholder="Min"
                  min="0"
                  className="w-full rounded-lg border border-card-border bg-input-bg px-3 py-2 text-sm text-foreground placeholder-muted outline-none transition-colors focus:border-accent"
                />
                <input
                  type="number"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(e.target.value)}
                  placeholder="Max"
                  min="0"
                  className="w-full rounded-lg border border-card-border bg-input-bg px-3 py-2 text-sm text-foreground placeholder-muted outline-none transition-colors focus:border-accent"
                />
              </div>
            </div>

            <div>
              <label className="mb-1.5 block text-xs font-medium text-muted">Sort By</label>
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value)}
                className="w-full rounded-lg border border-card-border bg-input-bg px-3 py-2 text-sm text-foreground outline-none transition-colors focus:border-accent"
              >
                <option value="featured">Featured</option>
                <option value="newest">Newest</option>
                <option value="price_asc">Price: Low to High</option>
                <option value="price_desc">Price: High to Low</option>
              </select>
            </div>
          </div>
        </aside>

        {/* Product Grid */}
        <section className="flex-1">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-bold">
              {category || "All Accounts"}
              <span className="ml-2 text-sm font-normal text-muted">
                {products.length} {products.length === 1 ? "item" : "items"}
              </span>
            </h2>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="animate-pulse rounded-xl border border-card-border bg-card-bg">
                  <div className="aspect-square bg-input-bg" />
                  <div className="space-y-3 p-4">
                    <div className="h-3 w-16 rounded bg-input-bg" />
                    <div className="h-4 w-3/4 rounded bg-input-bg" />
                    <div className="h-5 w-20 rounded bg-input-bg" />
                  </div>
                </div>
              ))}
            </div>
          ) : products.length === 0 ? (
            <div className="flex flex-col items-center justify-center rounded-xl border border-card-border bg-card-bg py-20 text-center">
              <svg width="48" height="48" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24" className="mb-4 text-muted">
                <path d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
              </svg>
              <p className="text-muted">No accounts found matching your filters.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
