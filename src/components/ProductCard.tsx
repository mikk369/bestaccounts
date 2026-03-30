import Link from "next/link";
import Image from "next/image";

interface Product {
  id: string;
  title: string;
  price: number;
  image_url: string;
  stock: number;
  category: string;
  sku: string;
}

export default function ProductCard({ product }: { product: Product }) {
  return (
    <Link
      href={`/product/${product.id}`}
      className="group flex flex-col overflow-hidden rounded-xl border border-card-border bg-card-bg transition-all hover:border-accent/40 hover:shadow-lg hover:shadow-accent/5"
    >
      <div className="relative aspect-square overflow-hidden bg-input-bg">
        {product.image_url ? (
          <Image
            src={product.image_url}
            alt={product.title}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-muted">
            <svg width="48" height="48" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
              <path d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909M3.75 21h16.5A2.25 2.25 0 0022.5 18.75V5.25A2.25 2.25 0 0020.25 3H3.75A2.25 2.25 0 001.5 5.25v13.5A2.25 2.25 0 003.75 21z" />
            </svg>
          </div>
        )}
        {product.stock <= 0 && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/60">
            <span className="rounded-full bg-danger px-3 py-1 text-xs font-bold uppercase tracking-wider text-white">
              Sold Out
            </span>
          </div>
        )}
        {product.stock > 0 && product.stock <= 3 && (
          <div className="absolute right-2 top-2 rounded-full bg-danger/90 px-2 py-0.5 text-xs font-medium text-white">
            {product.stock} left
          </div>
        )}
      </div>
      <div className="flex flex-1 flex-col gap-2 p-4">
        <span className="text-xs font-medium uppercase tracking-wider text-accent">
          {product.category}
        </span>
        <h3 className="line-clamp-2 text-sm font-semibold leading-snug text-foreground">
          {product.title}
        </h3>
        <div className="mt-auto flex items-center justify-between pt-2">
          <span className="text-lg font-bold text-accent">
            ${product.price.toFixed(2)}
          </span>
          {product.sku && (
            <span className="text-xs text-muted">{product.sku}</span>
          )}
        </div>
      </div>
    </Link>
  );
}
