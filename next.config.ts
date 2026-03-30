import type { NextConfig } from "next";
import { resolve } from "path";

const nextConfig: NextConfig = {
  reactCompiler: true,
  serverExternalPackages: ["better-sqlite3"],
  turbopack: {
    root: resolve(import.meta.dirname ?? __dirname),
  },
};

export default nextConfig;
