import { Link } from "react-router-dom";
import { Minus, Plus, Trash2, ShoppingBag, ArrowRight, ShieldCheck } from "lucide-react";
import { formatPrice } from "@/data/products";
import { useStore } from "@/context/StoreContext";

export default function Cart() {
  const { cart, updateQty, removeFromCart, clearCart, cartTotal, toast } = useStore();

  if (cart.length === 0) {
    return (
      <div className="container-px flex flex-col items-center py-24 text-center">
        <div className="rounded-full bg-muted p-6">
          <ShoppingBag className="h-10 w-10 text-muted-foreground" />
        </div>
        <h1 className="mt-6 font-display text-3xl">Your cart is empty</h1>
        <p className="mt-2 text-muted-foreground">Add some products to get started.</p>
        <Link to="/products" className="btn-primary mt-6">
          Continue shopping <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    );
  }

  return (
    <div className="container-px py-12">
      <h1 className="font-display text-3xl sm:text-4xl">Shopping Cart</h1>

      <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_360px]">
        {/* items */}
        <div className="space-y-4">
          {cart.map((item) => (
            <div
              key={item.id}
              className="flex gap-4 rounded-2xl border border-border bg-card p-4 shadow-sm"
            >
              <Link to={`/product/${item.id}`} className="shrink-0">
                <img
                  src={item.image}
                  alt={item.name}
                  className="h-24 w-24 rounded-xl object-cover"
                />
              </Link>
              <div className="flex flex-1 flex-col">
                <div className="flex items-start justify-between gap-3">
                  <Link to={`/product/${item.id}`} className="font-display text-lg hover:text-primary">
                    {item.name}
                  </Link>
                  <button
                    onClick={() => removeFromCart(item.id)}
                    className="rounded-full p-1.5 text-muted-foreground transition hover:bg-muted hover:text-destructive"
                    aria-label="Remove"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
                <p className="text-sm text-muted-foreground">{formatPrice(item.price)} each</p>
                <div className="mt-auto flex items-center justify-between pt-3">
                  <div className="flex items-center rounded-full border border-border">
                    <button onClick={() => updateQty(item.id, item.qty - 1)} className="p-2" aria-label="Decrease">
                      <Minus className="h-3.5 w-3.5" />
                    </button>
                    <span className="w-8 text-center text-sm font-semibold">{item.qty}</span>
                    <button onClick={() => updateQty(item.id, item.qty + 1)} className="p-2" aria-label="Increase">
                      <Plus className="h-3.5 w-3.5" />
                    </button>
                  </div>
                  <span className="font-bold">{formatPrice(item.price * item.qty)}</span>
                </div>
              </div>
            </div>
          ))}

          <button onClick={clearCart} className="text-sm font-medium text-muted-foreground hover:text-destructive">
            Clear cart
          </button>
        </div>

        {/* summary */}
        <aside className="h-fit rounded-2xl border border-border bg-card p-6 shadow-sm lg:sticky lg:top-28">
          <h2 className="font-display text-xl">Order Summary</h2>
          <div className="mt-4 space-y-3 text-sm">
            <Row label="Subtotal" value={formatPrice(cartTotal)} />
            <Row label="Shipping" value={<span className="text-accent">Free</span>} />
            <div className="border-t border-border pt-3">
              <Row label="Total" value={formatPrice(cartTotal)} bold />
              <p className="mt-1 text-xs text-muted-foreground">Inclusive of all taxes</p>
            </div>
          </div>
          <button
            onClick={() => toast("Checkout coming soon")}
            className="btn-primary mt-6 w-full"
          >
            Proceed to Checkout <ArrowRight className="h-4 w-4" />
          </button>
          <Link to="/products" className="btn-outline mt-3 w-full">
            Continue shopping
          </Link>
          <div className="mt-5 flex items-center gap-2 text-xs text-muted-foreground">
            <ShieldCheck className="h-4 w-4 text-accent" />
            Secure checkout · 2-year warranty
          </div>
        </aside>
      </div>
    </div>
  );
}

function Row({ label, value, bold }) {
  return (
    <div className="flex items-center justify-between">
      <span className={bold ? "font-semibold text-foreground" : "text-muted-foreground"}>
        {label}
      </span>
      <span className={bold ? "text-lg font-bold" : "font-medium"}>{value}</span>
    </div>
  );
}
