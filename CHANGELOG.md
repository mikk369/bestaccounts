# Changelog

## [1.0.1] - 2026-03-30

### Fixed
- Product images not displaying in production — replaced `next/image` `<Image>` with native `<img>` tags across ProductCard, product detail page, and admin dashboard
- Added dynamic `/uploads/[...path]` route handler to serve uploaded images at runtime (Next.js production server does not serve files added to `public/` after build time)

## [1.0.0] - 2026-03-30

### Added

#### Database
- SQLite database setup with `better-sqlite3` and WAL mode
- `admins` table with bcrypt-hashed passwords
- `products` table (title, description, price, image, category, stock, SKU, featured flag)
- `orders` table with Stripe session tracking
- Auto-migration on first run (tables created if not exists)
- Default admin account seeded on first run (username: `admin`, password: `admin123`)

#### Authentication
- JWT-based admin authentication using `jose` library
- Login endpoint (`POST /api/auth/login`) with bcrypt password verification
- Logout endpoint (`POST /api/auth/logout`) clears httpOnly cookie
- Auth check endpoint (`GET /api/auth/me`)
- Secure cookie settings: httpOnly, sameSite strict, secure in production

#### API Routes
- `GET /api/products` — list products with search, category filter, price range, and sorting (featured/newest/price asc/desc)
- `POST /api/products` — create product (admin only, validated)
- `GET /api/products/[id]` — get single product
- `PUT /api/products/[id]` — update product (admin only)
- `DELETE /api/products/[id]` — delete product (admin only)
- `POST /api/products/[id]/image` — upload product image (admin only, max 5MB, JPEG/PNG/WebP/GIF)
- `GET /api/categories` — list distinct product categories
- `POST /api/checkout` — create Stripe checkout session with stock validation
- `POST /api/webhook` — Stripe webhook handler for order completion and stock decrement

#### Frontend — Shop Page (`/`)
- Hero section with site description
- "How it works" steps (Browse, Pay, Get Details, Play)
- Product grid with responsive layout (1/2/3 columns)
- Sidebar filters: search, category dropdown, price range, sort by
- Loading skeleton states
- Empty state with search icon

#### Frontend — Product Detail Page (`/product/[id]`)
- Breadcrumb navigation
- Full-size product image
- Category badge, SKU display
- Price and stock status indicator (in stock / sold out / low stock)
- "Buy Now" button with Stripe checkout redirect
- Product description section
- "How It Works" ordered steps

#### Frontend — Admin Login (`/admin/login`)
- Login form with username and password fields
- Error message display
- Loading state on submit
- Redirects to dashboard on success

#### Frontend — Admin Dashboard (`/admin/dashboard`)
- Auth-gated (redirects to login if not authenticated)
- Product count summary
- "Add Product" button opens modal form
- Product form: title, description, price, stock, category, SKU, featured toggle, image upload with preview
- Products table with image thumbnail, category, price, stock, status badge, edit/delete actions
- Edit pre-fills form with existing product data
- Delete with confirmation dialog
- Empty state with prompt to add first product

#### Frontend — Checkout Success (`/checkout/success`)
- Success confirmation with checkmark icon
- Message about email delivery of account details
- "Back to Shop" link

#### Frontend — Layout & Components
- Global dark theme (background: `#0f0f13`, accent: `#6c5ce7`)
- Sticky header with logo, navigation, admin/logout button, mobile hamburger menu
- Footer with copyright
- `ProductCard` component with image, category, title, price, stock badges (sold out / low stock)
- Custom scrollbar styling
- Full responsive design (mobile-first)

#### Configuration
- `next.config.ts` — added `serverExternalPackages: ["better-sqlite3"]`
- `.env.local` — template with JWT_SECRET, Stripe keys, base URL
- `.gitignore` — added `data/` and `public/uploads/`
- Installed dependencies: `better-sqlite3`, `stripe`, `bcryptjs`, `jose`, `uuid`
- Installed dev dependencies: `@types/better-sqlite3`, `@types/bcryptjs`, `@types/uuid`

#### Security
- All SQL queries use parameterized statements (no injection risk)
- Image upload validates MIME type from allowed list (not user-provided extension)
- File size limit enforced (5MB)
- Price validation rejects NaN and negative values
- Admin routes verify JWT token before any mutation
- Stripe webhook verifies signature before processing
- Stock check before allowing checkout
