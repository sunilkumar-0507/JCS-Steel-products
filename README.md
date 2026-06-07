# JCS Home — React Replica

A faithful React (Vite) replica of [jcshome.vercel.app](https://jcshome.vercel.app/) —
factory-direct stainless steel kitchenware from Chennai.

## Tech stack

- **React 18** + **Vite 5**
- **React Router v6** (14 routes)
- **Tailwind CSS** (theme tokens taken 1:1 from the original site)
- **lucide-react** icons
- Cart + wishlist state via React Context (persisted to `localStorage`)

The original site loads products from Shopify; this replica uses **sample product
data** (`src/data/products.js`) so it runs standalone with no backend or API keys.

## Design system

Lifted directly from the original bundle:

- Fonts: **Fraunces** (display), **DM Sans** (body), **Kristi** (script logo)
- Primary colour: terracotta `#ff6738` · Accent: teal-green · Warm off-white background
- All design tokens live in `src/index.css` (`:root`) and `tailwind.config.js`

## Assets

All real images, the logo, favicon, and OG image were downloaded from the live
site and live in `src/assets/` and `public/`.

## Getting started

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # production build -> dist/
npm run preview  # preview the build
```

## Routes

| Path | Page |
|------|------|
| `/` | Home |
| `/products` | All products (search, filter, sort) |
| `/category/:id` | Category listing |
| `/product/:id` | Product detail |
| `/cart` | Shopping cart |
| `/account` | Account / sign-in / wishlist |
| `/about` | Our story |
| `/bulk-orders` | B2B / corporate gifting |
| `/faq` | FAQs |
| `/privacy` · `/terms` · `/returns` · `/shipping` · `/warranty` | Policies |

## Deploy

Includes `vercel.json` with an SPA rewrite so deep links work on Vercel.
Push to a Git repo and import into Vercel, or run `vercel` from this folder.

## Connecting real Shopify products (optional)

Replace the data functions in `src/data/products.js` with calls to the Shopify
Storefront API. You'll need your store domain and a Storefront access token.
