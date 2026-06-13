import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import {
  Star,
  Heart,
  ShoppingBag,
  Minus,
  Plus,
  Truck,
  ShieldCheck,
  RotateCcw,
  CheckCircle2,
  Share2,
} from "lucide-react";
import { Crumbs } from "@/components/ui.jsx";
import ProductCard from "@/components/ProductCard.jsx";
import { getCategory, formatPrice } from "@/data/products";
import { useStore } from "@/context/StoreContext";

const perks = [
  { icon: Truck, label: "Free shipping across India" },
  { icon: ShieldCheck, label: "2-year warranty on manufacturing defects" },
  { icon: RotateCcw, label: "Easy 7-day returns" },
];

export default function ProductDetail() {
  const { id } = useParams();
  const [qty, setQty] = useState(1);
  const { products, addToCart, toggleWishlist, inWishlist, toast } = useStore();
  const product = products.find((p) => p.id === id);

  if (!product) {
    return (
      <div className="container-px py-24 text-center">
        <h1 className="font-display text-3xl">Product not found</h1>
        <Link to="/products" className="btn-primary mt-6">
          Browse all products
        </Link>
      </div>
    );
  }

  const category = getCategory(product.category);
  const related = products
    .filter((p) => p.category === product.category && p.id !== product.id)
    .slice(0, 4);
  const wished = inWishlist(product.id);
  const discount = product.compareAt
    ? Math.round(((product.compareAt - product.price) / product.compareAt) * 100)
    : 0;

  const share = () => {
    navigator.clipboard?.writeText(window.location.href);
    toast("Link copied to clipboard");
  };

  return (
    <>
      <Crumbs
        items={[
          { label: "Home", to: "/" },
          { label: "Products", to: "/products" },
          { label: category?.name, to: `/category/${product.category}` },
          { label: product.name },
        ]}
      />

      <section className="pb-16">
        <div className="container-px grid gap-10 lg:grid-cols-2">
          {/* image */}
          <div className="relative overflow-hidden rounded-3xl border border-border bg-card shadow-sm">
            <img src={product.image} alt={product.name} className="aspect-square w-full object-cover" />
            {product.badge && (
              <span className="absolute left-4 top-4 rounded-full bg-foreground px-3 py-1 text-xs font-bold uppercase tracking-wide text-background">
                {product.badge}
              </span>
            )}
          </div>

          {/* info */}
          <div>
            <p className="text-sm font-semibold uppercase tracking-wider text-accent">
              {category?.name}
            </p>
            <h1 className="mt-2 font-display text-3xl sm:text-4xl">{product.name}</h1>

            <div className="mt-3 flex items-center gap-2">
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`h-4 w-4 ${
                      i < Math.round(product.rating)
                        ? "fill-primary text-primary"
                        : "text-border"
                    }`}
                  />
                ))}
              </div>
              <span className="text-sm font-medium">{product.rating}</span>
              <span className="text-sm text-muted-foreground">
                ({product.reviews} reviews)
              </span>
            </div>

            <div className="mt-5 flex items-end gap-3">
              <span className="font-display text-4xl text-foreground">
                {formatPrice(product.price)}
              </span>
              {product.compareAt && (
                <>
                  <span className="text-lg text-muted-foreground line-through">
                    {formatPrice(product.compareAt)}
                  </span>
                  <span className="rounded-full bg-primary/10 px-2 py-0.5 text-sm font-semibold text-primary">
                    Save {discount}%
                  </span>
                </>
              )}
            </div>
            <p className="mt-1 text-xs text-muted-foreground">Inclusive of all taxes</p>

            <p className="mt-5 leading-relaxed text-muted-foreground">
              {product.description}
            </p>

            {/* features */}
            <div className="mt-6 flex flex-wrap gap-2">
              {product.features.map((f) => (
                <span
                  key={f}
                  className="inline-flex items-center gap-1.5 rounded-full border border-border bg-secondary/50 px-3 py-1.5 text-xs font-medium"
                >
                  <CheckCircle2 className="h-3.5 w-3.5 text-accent" /> {f}
                </span>
              ))}
            </div>

            {/* qty + actions */}
            <div className="mt-8 flex flex-wrap items-center gap-4">
              <div className="flex items-center rounded-full border border-border">
                <button
                  onClick={() => setQty((q) => Math.max(1, q - 1))}
                  className="p-3 text-foreground hover:text-primary"
                  aria-label="Decrease"
                >
                  <Minus className="h-4 w-4" />
                </button>
                <span className="w-10 text-center font-semibold">{qty}</span>
                <button
                  onClick={() => setQty((q) => q + 1)}
                  className="p-3 text-foreground hover:text-primary"
                  aria-label="Increase"
                >
                  <Plus className="h-4 w-4" />
                </button>
              </div>

              <button
                onClick={() => addToCart(product, qty)}
                className="btn-primary flex-1 min-w-[180px]"
              >
                <ShoppingBag className="h-4 w-4" /> Add to cart
              </button>

              <button
                onClick={() => toggleWishlist(product)}
                className={`btn rounded-full border p-3 ${
                  wished ? "border-primary bg-primary/10 text-primary" : "border-border"
                }`}
                aria-label="Wishlist"
              >
                <Heart className={`h-5 w-5 ${wished ? "fill-current" : ""}`} />
              </button>
              <button onClick={share} className="btn rounded-full border border-border p-3" aria-label="Share">
                <Share2 className="h-5 w-5" />
              </button>
            </div>

            {/* perks */}
            <div className="mt-8 space-y-3 rounded-2xl border border-border bg-secondary/40 p-5">
              {perks.map((p) => (
                <div key={p.label} className="flex items-center gap-3 text-sm">
                  <p.icon className="h-5 w-5 text-primary" />
                  <span>{p.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* related */}
      {related.length > 0 && (
        <section className="section bg-secondary/40">
          <div className="container-px">
            <h2 className="font-display text-2xl sm:text-3xl">You might also like</h2>
            <div className="mt-8 grid grid-cols-2 gap-5 lg:grid-cols-4">
              {related.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  );
}
