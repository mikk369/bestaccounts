# BestAccounts

A webshop for selling gaming accounts. Built with Next.js 16, SQLite, and Stripe.

## Tech Stack

- **Framework:** Next.js 16.2.1 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS v4
- **Database:** SQLite via better-sqlite3
- **Auth:** JWT (jose) with httpOnly cookies
- **Payments:** Stripe Checkout

## Quick Start

### 1. Install dependencies

```bash
npm install
```

### 2. Configure environment

Copy and edit `.env.local`:

```
JWT_SECRET=your-random-secret-at-least-32-chars
STRIPE_SECRET_KEY=sk_test_...
STRIPE_PUBLISHABLE_KEY=pk_test_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
NEXT_PUBLIC_BASE_URL=http://localhost:3000
```

Get your Stripe keys from [dashboard.stripe.com/apikeys](https://dashboard.stripe.com/apikeys).

### 3. Run dev server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### 4. Log in as admin

Go to [http://localhost:3000/admin/login](http://localhost:3000/admin/login).

Default credentials (change after first login):
- **Username:** `admin`
- **Password:** `admin123`

## Project Structure

```
src/
  app/
    page.tsx                    # Shop listing page
    layout.tsx                  # Root layout with header/footer
    product/[id]/page.tsx       # Product detail page
    admin/login/page.tsx        # Admin login
    admin/dashboard/page.tsx    # Product management (CRUD)
    checkout/success/page.tsx   # Post-payment confirmation
    api/
      auth/login/route.ts      # POST - admin login
      auth/logout/route.ts     # POST - admin logout
      auth/me/route.ts         # GET  - auth check
      products/route.ts        # GET  - list, POST - create
      products/[id]/route.ts   # GET, PUT, DELETE
      products/[id]/image/route.ts  # POST - image upload
      categories/route.ts      # GET  - distinct categories
      checkout/route.ts        # POST - Stripe session
      webhook/route.ts         # POST - Stripe webhook
  components/
    Header.tsx                  # Navigation bar
    ProductCard.tsx             # Product grid card
  lib/
    db.ts                       # SQLite connection + schema
    auth.ts                     # JWT create/verify helpers
data/
  shop.db                       # SQLite database (auto-created)
public/
  uploads/                      # Product images (auto-created)
```

## Database

SQLite database is created automatically on first request at `data/shop.db`.

**Tables:**

| Table | Purpose |
|-------|---------|
| `admins` | Admin accounts (id, username, password_hash) |
| `products` | Product listings (title, description, price, image_url, category, stock, sku, featured) |
| `orders` | Purchase records (product_id, stripe_session_id, customer_email, status) |

## Admin Dashboard

Located at `/admin/dashboard`. Requires login.

Features:
- Add/edit/delete products
- Upload product images (JPEG, PNG, WebP, GIF, max 5MB)
- Set price, stock, category, SKU, featured status
- View all products in a sortable table

## Stripe Integration

**Testing locally:**

1. Install [Stripe CLI](https://stripe.com/docs/stripe-cli)
2. Forward webhooks to your local server:
   ```bash
   stripe listen --forward-to localhost:3000/api/webhook
   ```
3. Copy the webhook signing secret to `STRIPE_WEBHOOK_SECRET` in `.env.local`
4. Use test card `4242 4242 4242 4242` with any future date and CVC

**What happens on purchase:**
1. Customer clicks "Buy Now" on a product
2. Redirected to Stripe Checkout
3. On success, webhook fires: order marked completed, stock decremented
4. Customer sees success page

## Deployment (VPS)

This app requires a Node.js server (not static hosting).

```bash
# On your server
git clone <repo> /var/www/bestaccounts
cd /var/www/bestaccounts
npm install
# Create .env.local with production values
npm run build
npm start

# Keep running with PM2
npm install -g pm2
pm2 start npm --name "bestaccounts" -- start
pm2 save && pm2 startup
```

Set up Nginx as a reverse proxy to port 3000.

**Persistent data** (do not delete on redeploy):
- `data/shop.db` — your database
- `public/uploads/` — uploaded product images

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start dev server with hot reload |
| `npm run build` | Create production build |
| `npm start` | Start production server |
| `npm run lint` | Run ESLint |
