import Database from "better-sqlite3";
import path from "path";
import bcryptjs from "bcryptjs";

const DB_PATH = path.join(process.cwd(), "data", "shop.db");

let db: Database.Database | null = null;

export function getDb(): Database.Database {
  if (!db) {
    // Ensure data directory exists
    const fs = require("fs");
    const dir = path.dirname(DB_PATH);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    db = new Database(DB_PATH);
    db.pragma("journal_mode = WAL");
    db.pragma("foreign_keys = ON");
    initializeDb(db);
  }
  return db;
}

function initializeDb(db: Database.Database) {
  db.exec(`
    CREATE TABLE IF NOT EXISTS admins (
      id TEXT PRIMARY KEY,
      username TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      created_at TEXT DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS products (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      description TEXT NOT NULL DEFAULT '',
      price REAL NOT NULL,
      image_url TEXT DEFAULT '',
      category TEXT DEFAULT 'General',
      stock INTEGER DEFAULT 1,
      sku TEXT DEFAULT '',
      featured INTEGER DEFAULT 0,
      created_at TEXT DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS orders (
      id TEXT PRIMARY KEY,
      product_id TEXT NOT NULL,
      stripe_session_id TEXT,
      customer_email TEXT,
      status TEXT DEFAULT 'pending',
      created_at TEXT DEFAULT (datetime('now')),
      FOREIGN KEY (product_id) REFERENCES products(id)
    );
  `);

  // Seed a default admin if none exists
  const adminCount = db.prepare("SELECT COUNT(*) as count FROM admins").get() as { count: number };
  if (adminCount.count === 0) {
    const { v4: uuidv4 } = require("uuid");
    const hash = bcryptjs.hashSync("admin123", 10);
    db.prepare("INSERT INTO admins (id, username, password_hash) VALUES (?, ?, ?)").run(
      uuidv4(),
      "admin",
      hash
    );
  }
}
