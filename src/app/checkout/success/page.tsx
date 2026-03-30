"use client";

import Link from "next/link";

export default function CheckoutSuccessPage() {
  return (
    <div className="flex min-h-[calc(100vh-140px)] items-center justify-center px-4">
      <div className="w-full max-w-md text-center">
        <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-success/20">
          <svg width="40" height="40" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" className="text-success">
            <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
          </svg>
        </div>
        <h1 className="mb-3 text-3xl font-bold">Payment Successful</h1>
        <p className="mb-8 text-muted">
          Thank you for your purchase! Your account details will be sent to the email address you provided during checkout.
        </p>
        <Link
          href="/"
          className="inline-flex rounded-lg bg-accent px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-accent-hover"
        >
          Back to Shop
        </Link>
      </div>
    </div>
  );
}
