import { getDb } from "@/lib/db";
import { notFound } from "next/navigation";
import Link from "next/link";
import BuyButton from "@/components/BuyButton";
import type { Metadata } from "next";

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

type Props = { params: Promise<{ id: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const db = getDb();
  const product = db.prepare("SELECT * FROM products WHERE id = ?").get(id) as Product | undefined;

  if (!product) {
    return { title: "Product Not Found" };
  }

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://webcodes.ee";

  return {
    title: `${product.title} — BestAccounts`,
    description: product.description || `Buy ${product.title} for $${product.price.toFixed(2)}. Verified gaming account with instant delivery.`,
    openGraph: {
      title: product.title,
      description: product.description || `Buy ${product.title} for $${product.price.toFixed(2)}.`,
      url: `${baseUrl}/product/${product.id}`,
      images: product.image_url
        ? [{ url: `${baseUrl}${product.image_url}`, alt: product.title }]
        : undefined,
    },
  };
}

export default async function ProductDetailPage({ params }: Props) {
  const { id } = await params;
  const db = getDb();
  const product = db.prepare("SELECT * FROM products WHERE id = ?").get(id) as Product | undefined;

  if (!product) {
    notFound();
  }

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://webcodes.ee";

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.title,
    description: product.description || undefined,
    image: product.image_url ? `${baseUrl}${product.image_url}` : undefined,
    sku: product.sku || undefined,
    offers: {
      "@type": "Offer",
      price: product.price.toFixed(2),
      priceCurrency: "USD",
      availability: product.stock > 0
        ? "https://schema.org/InStock"
        : "https://schema.org/OutOfStock",
    },
  };

  return (
    <div className="mx-auto max-w-5xl px-4 py-8">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Breadcrumb */}
      <nav className="mb-6 flex items-center gap-2 text-sm text-muted">
        <Link href="/" className="transition-colors hover:text-accent">Shop</Link>
        <span>/</span>
        <span className="text-foreground">{product.title}</span>
      </nav>

      <div className="grid gap-8 md:grid-cols-2">
        {/* Image */}
        <div className="relative aspect-video overflow-hidden rounded-xl border border-card-border bg-card-bg">
          {product.image_url ? (
            <img
              src={product.image_url}
              alt={product.title}
              className="absolute inset-0 h-full w-full object-contain"
            />
          ) : (
            <div className="flex h-full items-center justify-center text-muted">
              <svg width="80" height="80" fill="none" stroke="currentColor" strokeWidth="1" viewBox="0 0 24 24">
                <path d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909M3.75 21h16.5A2.25 2.25 0 0022.5 18.75V5.25A2.25 2.25 0 0020.25 3H3.75A2.25 2.25 0 001.5 5.25v13.5A2.25 2.25 0 003.75 21z" />
              </svg>
            </div>
          )}
        </div>

        {/* Details */}
        <div className="flex flex-col gap-5">
          <div>
            <span className="mb-2 inline-block rounded-full bg-accent-light px-3 py-1 text-xs font-semibold uppercase tracking-wider text-accent">
              {product.category}
            </span>
            <h1 className="mt-2 text-2xl font-bold leading-tight sm:text-3xl">{product.title}</h1>
          </div>

          {product.sku && (
            <div className="flex items-center gap-2 text-sm text-muted">
              <span className="rounded bg-card-bg px-2 py-0.5 font-mono text-xs">
                SKU: {product.sku}
              </span>
            </div>
          )}

          <div className="rounded-xl border border-card-border bg-card-bg p-5">
            <div className="mb-3 flex items-end gap-2">
              <span className="text-3xl font-bold text-accent">${product.price.toFixed(2)}</span>
              <span className="text-sm text-muted">USD</span>
            </div>
            <div className="mb-4 flex items-center gap-2">
              {product.stock > 0 ? (
                <>
                  <span className="inline-block h-2 w-2 rounded-full bg-success" />
                  <span className="text-sm text-success">{product.stock} in stock</span>
                </>
              ) : (
                <>
                  <span className="inline-block h-2 w-2 rounded-full bg-danger" />
                  <span className="text-sm text-danger">Out of stock</span>
                </>
              )}
            </div>
            <BuyButton productId={product.id} stock={product.stock} />
          </div>

          {product.description && (
            <div>
              <h2 className="mb-3 text-sm font-bold uppercase tracking-wider text-muted">Description</h2>
              <div className="whitespace-pre-wrap rounded-xl border border-card-border bg-card-bg p-5 text-sm leading-relaxed text-foreground/80">
                {product.description}
              </div>
            </div>
          )}

          {/* How it works */}
          <div className="rounded-xl border border-card-border bg-gradient-to-br from-accent/5 to-card-bg p-5">
            <h2 className="mb-3 text-sm font-bold uppercase tracking-wider text-muted">How It Works</h2>
            <ol className="space-y-2 text-sm text-muted">
              <li className="flex gap-3">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-accent/20 text-xs font-bold text-accent">1</span>
                Click Buy Now and complete payment via Stripe
              </li>
              <li className="flex gap-3">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-accent/20 text-xs font-bold text-accent">2</span>
                Account details sent to your email
              </li>
              <li className="flex gap-3">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-accent/20 text-xs font-bold text-accent">3</span>
                Log in and enjoy your new account
              </li>
            </ol>
          </div>
        </div>
      </div>
    </div>
  );
}
