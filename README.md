# Daily Pans — Storefront + Admin

React (Vite) storefront and admin panel for **Daily Pans** — factory-direct stainless
steel kitchenware from Chennai. All data comes from the Daily Pans REST API
(ASP.NET Core, in `E:\RestApi(JCS)\JCS Steels`).

## Tech stack

- **React 18** + **Vite 5**
- **React Router v6**
- **Tailwind CSS**
- **lucide-react** icons
- Catalog, cart, wishlist, auth, orders, coupons and admin data all served by the API
  (`src/lib/api.js`). Only the auth token and the guest cart id live in `localStorage`.

## Getting started

The API must be running first:

```bash
# terminal 1 — API
cd "E:\RestApi(JCS)\JCS Steels"
dotnet run --project "JCS Steels" --urls http://localhost:5292

# terminal 2 — UI
npm install
cp .env.example .env     # VITE_API_URL=http://localhost:5292
npm run dev              # http://localhost:5173
npm run build            # production build -> dist/
npm run preview          # preview the build
```

### Environment

| Variable | Purpose | Default |
|---|---|---|
| `VITE_API_URL` | Base URL of the Daily Pans REST API | `http://localhost:5292` |

## Demo accounts

| Role | Email | Password |
|---|---|---|
| Admin | `admin@dailypans.in` | `Admin@123` |
| Customer | `customer@dailypans.in` | `customer123` |

## Routes

| Path | Page |
|------|------|
| `/` | Home |
| `/products` | All products (search, filter, sort) |
| `/category/:id` | Category listing |
| `/product/:id` | Product detail + reviews |
| `/cart` | Shopping cart |
| `/checkout` | Delivery address, coupon, payment, place order |
| `/account` | Sign in / register / orders / wishlist / addresses |
| `/admin` | Admin portal (admin accounts only) |
| `/about` | Our story |
| `/bulk-orders` | B2B / corporate gifting enquiry |
| `/faq` | FAQs |
| `/privacy` · `/terms` · `/returns` · `/shipping` · `/warranty` | Policies |

## Admin portal

`/admin` is guarded — non-admin sessions are redirected to `/account`. Sections:

- **Dashboard** — revenue, orders, customers, products, discounts given, subscribers
- **Products** — create / edit / delete, stock and visibility
- **Orders** — filter by status, change status, view the full order, and record
  **delivery details** (courier, tracking number & URL, expected / dispatched /
  delivered dates, notes)
- **Customers** — order counts and spend, plus a detail view with saved delivery
  addresses and full order history
- **Coupons** — create / edit / delete discount codes (percentage or fixed, minimum
  order, max discount cap, free shipping, usage limit, validity window, public/private)
- **Bulk Orders** — B2B enquiries with status workflow (New → Contacted → Quoted → Closed)
- **Messages** — contact-form messages with read/unread state

## Product images

The API stores an optional image URL per product. Seeded products have none, so
`src/lib/images.js` falls back to the bundled photography by product slug, then by
category. Paste a URL in the admin product form to override it.

## Deploy

Includes `vercel.json` with an SPA rewrite so deep links work on Vercel. Set
`VITE_API_URL` to your deployed API and add that origin to `Cors:Origins` in the
API's `appsettings.json`.
