"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

export default function Header() {
  const pathname = usePathname();
  const [isAdmin, setIsAdmin] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    fetch("/api/auth/me")
      .then((r) => r.json())
      .then((data) => setIsAdmin(data.authenticated))
      .catch(() => setIsAdmin(false));
  }, [pathname]);

  return (
    <header className="sticky top-0 z-50 border-b border-card-border bg-header-bg backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3">
        <Link href="/" className="flex items-center gap-2 text-xl font-bold tracking-tight">
          <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-accent text-sm font-black text-white">
            BA
          </span>
          <span className="hidden sm:inline">
            Best<span className="text-accent">Accounts</span>
          </span>
        </Link>

        <nav className="hidden items-center gap-6 md:flex">
          <Link
            href="/"
            className={`text-sm font-medium transition-colors hover:text-accent ${
              pathname === "/" ? "text-accent" : "text-muted"
            }`}
          >
            Shop
          </Link>
          {isAdmin && (
            <Link
              href="/admin/dashboard"
              className={`text-sm font-medium transition-colors hover:text-accent ${
                pathname?.startsWith("/admin") ? "text-accent" : "text-muted"
              }`}
            >
              Dashboard
            </Link>
          )}
        </nav>

        <div className="flex items-center gap-3">
          {isAdmin ? (
            <button
              onClick={async () => {
                await fetch("/api/auth/logout", { method: "POST" });
                setIsAdmin(false);
                window.location.href = "/";
              }}
              className="rounded-lg border border-card-border px-4 py-1.5 text-sm text-muted transition-colors hover:border-danger hover:text-danger"
            >
              Log Out
            </button>
          ) : (
            <Link
              href="/admin/login"
              className="rounded-lg bg-accent px-4 py-1.5 text-sm font-medium text-white transition-colors hover:bg-accent-hover"
            >
              Admin
            </Link>
          )}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-card-border text-muted md:hidden"
            aria-label="Toggle menu"
          >
            <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              {menuOpen ? (
                <path d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {menuOpen && (
        <div className="border-t border-card-border px-4 py-3 md:hidden">
          <Link href="/" className="block py-2 text-sm text-muted hover:text-accent" onClick={() => setMenuOpen(false)}>
            Shop
          </Link>
          {isAdmin && (
            <Link href="/admin/dashboard" className="block py-2 text-sm text-muted hover:text-accent" onClick={() => setMenuOpen(false)}>
              Dashboard
            </Link>
          )}
        </div>
      )}
    </header>
  );
}
