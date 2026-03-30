"use client";

import { useState } from "react";

export default function BuyButton({ productId, stock }: { productId: string; stock: number }) {
  const [purchasing, setPurchasing] = useState(false);

  async function handleBuy() {
    setPurchasing(true);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId }),
      });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        alert(data.error || "Failed to start checkout");
      }
    } catch {
      alert("Something went wrong. Please try again.");
    } finally {
      setPurchasing(false);
    }
  }

  return (
    <button
      onClick={handleBuy}
      disabled={stock <= 0 || purchasing}
      className="w-full rounded-lg bg-accent px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-accent-hover disabled:cursor-not-allowed disabled:opacity-50"
    >
      {purchasing ? "Processing..." : stock <= 0 ? "Sold Out" : "Buy Now"}
    </button>
  );
}
