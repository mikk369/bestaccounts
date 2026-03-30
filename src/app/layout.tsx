import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "BestAccounts — Premium Gaming Accounts",
  description: "Buy premium gaming accounts securely. Fast delivery, verified accounts.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <Header />
        <main className="flex-1">{children}</main>
        <footer className="border-t border-card-border bg-card-bg py-8">
          <div className="mx-auto max-w-7xl px-4 text-center text-sm text-muted">
            <p>&copy; {new Date().getFullYear()} BestAccounts. All rights reserved.</p>
          </div>
        </footer>
      </body>
    </html>
  );
}
