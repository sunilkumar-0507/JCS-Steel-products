import { useEffect, useState } from "react";
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
  MessageSquarePlus,
} from "lucide-react";
import { Crumbs, Loader, ErrorState } from "@/components/ui.jsx";
import ProductCard from "@/components/ProductCard.jsx";
import { useStore } from "@/context/StoreContext";
import { api, formatPrice, formatDate } from "@/lib/api";
import { productImage } from "@/lib/images";

const perks = [
  { icon: Truck, label: "Free shipping across India on orders over ₹999" },
  { icon: ShieldCheck, label: "2-year warranty on manufacturing defects" },
  { icon: RotateCcw, label: "Easy 7-day returns" },
];

export default function ProductDetail() {
  const { id } = useParams();
  const [qty, setQty] = useState(1);
  const {
    products,
    getCategory,
    catalogLoading,
    catalogError,
    reloadCatalog,
    addToCart,
    toggleWishlist,
    inWishlist,
    user,
    toast,
    reportError,
  } = useStore();

  const [reviews, setReviews] = useState([]);
  const product = products.find((p) => p.id === id);

  useEffect(() => {
    let cancelled = false;
    setReviews([]);
    api
      .reviews(id)
      .then((r) => !cancelled && setReviews(r || []))
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, [id]);

  if (catalogLoading) return <Loader label="Loading product…" />;
  if (catalogError) {
    return (
      <div className="container-px py-16">
        <ErrorState message={catalogError} onRetry={reloadCatalog} />
      </div>
    );
  }

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

  const category = getCategory(product.categoryId);
  const related = products
    .filter((p) => p.categoryId === product.categoryId && p.id !== product.id)
    .slice(0, 4);
  const wished = inWishlist(product.id);
  const discount = product.compareAt
    ? Math.round(((product.compareAt - product.price) / product.compareAt) * 100)
    : 0;
  const outOfStock = product.stock <= 0;

  const share = () => {
    navigator.clipboard?.writeText(window.location.href);
    toast("Link copied to clipboard");
  };

  const submitReview = async (payload) => {
    try {
      await api.addReview(product.id, payload);
      setReviews(await api.reviews(product.id));
      reloadCatalog(); // rating + review count are recomputed server-side
      toast("Thanks for your review!");
      return true;
    } catch (err) {
      reportError(err, "Could not submit your review.");
      return false;
    }
  };

  return (
    <>
      <Crumbs
        items={[
          { label: "Home", to: "/" },
          { label: "Products", to: "/products" },
          { label: category?.name, to: `/category/${product.categoryId}` },
          { label: product.name },
        ]}
      />

      <section className="pb-16">
        <div className="container-px grid gap-10 lg:grid-cols-2">
          {/* image */}
          <div className="relative overflow-hidden rounded-3xl border border-border bg-card shadow-sm">
            <img
              src={productImage(product)}
              alt={product.name}
              className="aspect-square w-full object-cover"
            />
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
              <Stars rating={product.rating} />
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

            <p className="mt-2 text-sm font-medium">
              {outOfStock ? (
                <span className="text-destructive">Out of stock</span>
              ) : product.stock <= 10 ? (
                <span className="text-amber-600">Only {product.stock} left in stock</span>
              ) : (
                <span className="text-accent">In stock</span>
              )}
            </p>

            <p className="mt-5 leading-relaxed text-muted-foreground">{product.description}</p>

            {/* features */}
            <div className="mt-6 flex flex-wrap gap-2">
              {(product.features || []).map((f) => (
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
                  onClick={() => setQty((q) => Math.min(product.stock || 99, q + 1))}
                  className="p-3 text-foreground hover:text-primary"
                  aria-label="Increase"
                >
                  <Plus className="h-4 w-4" />
                </button>
              </div>

              <button
                onClick={() => addToCart(product, qty)}
                disabled={outOfStock}
                className="btn-primary min-w-[180px] flex-1 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <ShoppingBag className="h-4 w-4" />
                {outOfStock ? "Out of stock" : "Add to cart"}
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
              <button
                onClick={share}
                className="btn rounded-full border border-border p-3"
                aria-label="Share"
              >
                <Share2 className="h-5 w-5" />
              </button>
            </div>

            {/* perks */}
            <div className="mt-8 space-y-3 rounded-2xl border border-border bg-secondary/40 p-5">
              {perks.map((p) => (
                <div key={p.label} className="flex items-center gap-3 text-sm">
                  <p.icon className="h-5 w-5 shrink-0 text-primary" />
                  <span>{p.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* reviews */}
      <section className="section border-t border-border">
        <div className="container-px grid gap-10 lg:grid-cols-[1fr_360px]">
          <div>
            <h2 className="font-display text-2xl sm:text-3xl">
              Customer reviews{" "}
              <span className="text-base font-normal text-muted-foreground">
                ({reviews.length})
              </span>
            </h2>
            {reviews.length === 0 ? (
              <p className="mt-6 rounded-2xl border border-dashed border-border bg-card p-8 text-center text-sm text-muted-foreground">
                No reviews yet — be the first to share your thoughts.
              </p>
            ) : (
              <ul className="mt-6 space-y-4">
                {reviews.map((r) => (
                  <li key={r.id} className="rounded-2xl border border-border bg-card p-5">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div className="flex items-center gap-3">
                        <span className="flex h-9 w-9 items-center justify-center rounded-full bg-secondary text-sm font-bold">
                          {(r.authorName || "A").charAt(0)}
                        </span>
                        <div>
                          <p className="text-sm font-semibold">{r.authorName}</p>
                          <Stars rating={r.rating} size="sm" />
                        </div>
                      </div>
                      <span className="text-xs text-muted-foreground">
                        {formatDate(r.createdAt)}
                      </span>
                    </div>
                    {r.comment && (
                      <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                        {r.comment}
                      </p>
                    )}
                  </li>
                ))}
              </ul>
            )}
          </div>

          <ReviewForm defaultName={user?.name} onSubmit={submitReview} />
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

function Stars({ rating, size = "md" }) {
  const cls = size === "sm" ? "h-3 w-3" : "h-4 w-4";
  return (
    <div className="flex">
      {[...Array(5)].map((_, i) => (
        <Star
          key={i}
          className={`${cls} ${
            i < Math.round(rating) ? "fill-primary text-primary" : "text-border"
          }`}
        />
      ))}
    </div>
  );
}

function ReviewForm({ defaultName, onSubmit }) {
  const [rating, setRating] = useState(5);
  const [authorName, setAuthorName] = useState(defaultName || "");
  const [comment, setComment] = useState("");
  const [busy, setBusy] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setBusy(true);
    const ok = await onSubmit({
      rating,
      authorName: authorName.trim() || "Anonymous",
      comment: comment.trim(),
    });
    setBusy(false);
    if (ok) {
      setComment("");
      setRating(5);
    }
  };

  const field =
    "mt-1.5 w-full rounded-lg border border-input bg-background px-3 py-2.5 text-sm outline-none focus:border-primary";

  return (
    <form
      onSubmit={submit}
      className="h-fit rounded-2xl border border-border bg-card p-6 shadow-sm lg:sticky lg:top-28"
    >
      <h3 className="flex items-center gap-2 font-display text-xl">
        <MessageSquarePlus className="h-5 w-5 text-primary" /> Write a review
      </h3>

      <div className="mt-4">
        <span className="text-sm font-medium">Your rating</span>
        <div className="mt-2 flex gap-1">
          {[1, 2, 3, 4, 5].map((n) => (
            <button
              key={n}
              type="button"
              onClick={() => setRating(n)}
              aria-label={`${n} star${n > 1 ? "s" : ""}`}
            >
              <Star
                className={`h-6 w-6 transition ${
                  n <= rating ? "fill-primary text-primary" : "text-border hover:text-primary/50"
                }`}
              />
            </button>
          ))}
        </div>
      </div>

      <label className="mt-4 block text-sm font-medium">
        Your name
        <input
          value={authorName}
          onChange={(e) => setAuthorName(e.target.value)}
          placeholder="Anonymous"
          className={field}
        />
      </label>

      <label className="mt-4 block text-sm font-medium">
        Your review
        <textarea
          rows={4}
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="What did you think of this product?"
          className={`${field} resize-none`}
        />
      </label>

      <button disabled={busy} className="btn-primary mt-5 w-full disabled:opacity-60">
        {busy ? "Submitting…" : "Submit review"}
      </button>
    </form>
  );
}
