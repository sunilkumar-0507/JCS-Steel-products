import { Link } from "react-router-dom";
import { Heart, Star, ShoppingBag } from "lucide-react";
import { formatPrice } from "@/data/products";
import { useStore } from "@/context/StoreContext";

export default function ProductCard({ product }) {
  const { addToCart, toggleWishlist, inWishlist } = useStore();
  const wished = inWishlist(product.id);
  const discount = product.compareAt
    ? Math.round(((product.compareAt - product.price) / product.compareAt) * 100)
    : 0;

  return (
    <div className="group relative flex flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
      <Link to={`/product/${product.id}`} className="relative block overflow-hidden">
        <div className="aspect-square overflow-hidden bg-muted">
          <img
            src={product.image}
            alt={product.name}
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        </div>
        {product.badge && (
          <span className="absolute left-3 top-3 rounded-full bg-foreground px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-background">
            {product.badge}
          </span>
        )}
        {discount > 0 && (
          <span className="absolute right-3 top-3 rounded-full bg-primary px-2.5 py-1 text-[10px] font-bold text-primary-foreground">
            -{discount}%
          </span>
        )}
      </Link>

      <button
        onClick={() => toggleWishlist(product)}
        aria-label="Add to wishlist"
        className={`absolute right-3 top-12 rounded-full p-2 shadow-sm transition ${
          wished ? "bg-primary text-primary-foreground" : "bg-background/90 text-foreground hover:bg-background"
        }`}
      >
        <Heart className={`h-4 w-4 ${wished ? "fill-current" : ""}`} />
      </button>

      <div className="flex flex-1 flex-col p-4">
        <p className="text-[11px] font-semibold uppercase tracking-wider text-accent">
          {product.features?.[0]}
        </p>
        <Link to={`/product/${product.id}`}>
          <h3 className="mt-1 line-clamp-2 font-display text-lg leading-snug text-foreground transition hover:text-primary">
            {product.name}
          </h3>
        </Link>

        <div className="mt-2 flex items-center gap-1 text-xs text-muted-foreground">
          <Star className="h-3.5 w-3.5 fill-primary text-primary" />
          <span className="font-medium text-foreground">{product.rating}</span>
          <span>({product.reviews})</span>
        </div>

        <div className="mt-auto flex items-end justify-between pt-4">
          <div>
            <span className="text-lg font-bold text-foreground">
              {formatPrice(product.price)}
            </span>
            {product.compareAt && (
              <span className="ml-2 text-sm text-muted-foreground line-through">
                {formatPrice(product.compareAt)}
              </span>
            )}
          </div>
          <button
            onClick={() => addToCart(product)}
            aria-label="Add to cart"
            className="rounded-full bg-primary p-2.5 text-primary-foreground shadow-sm transition hover:brightness-110"
          >
            <ShoppingBag className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
