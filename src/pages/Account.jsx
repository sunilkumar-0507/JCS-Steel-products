import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Heart,
  Package,
  MapPin,
  Shield,
  LogIn,
  LogOut,
  Sparkles,
  LayoutDashboard,
  Truck,
  UserPlus,
} from "lucide-react";
import { PageHeader, Loader } from "@/components/ui.jsx";
import ProductCard from "@/components/ProductCard.jsx";
import { useStore } from "@/context/StoreContext";
import { api, formatPrice, formatDate } from "@/lib/api";
import {
  Pill,
  orderStatusStyles,
  paymentStatusStyles,
} from "@/pages/admin/shared.jsx";

const tabs = [
  { id: "signin", label: "Sign In", icon: LogIn },
  { id: "orders", label: "Orders", icon: Package },
  { id: "wishlist", label: "Wishlist", icon: Heart },
  { id: "addresses", label: "Addresses", icon: MapPin },
];

const benefits = [
  "Faster checkout",
  "Save addresses for quick ordering",
  "Real-time order tracking",
  "Member-only discounts & exclusive offers",
];

export default function Account() {
  const { wishlist, user, isAdmin, authReady, logout } = useStore();
  const [tab, setTab] = useState("signin");

  useEffect(() => {
    if (user) setTab((t) => (t === "signin" ? "orders" : t));
    else setTab("signin");
  }, [user]);

  if (!authReady) return <Loader label="Loading your account…" />;

  const visibleTabs = user ? tabs.filter((t) => t.id !== "signin") : tabs;

  return (
    <>
      <PageHeader
        eyebrow="My Account"
        title={user ? `Hello, ${user.name.split(" ")[0]}` : "Access Your Account"}
        subtitle={
          user
            ? "Manage your orders, addresses, and saved items."
            : "Manage your orders, addresses, and preferences. Sign in to track orders and enjoy faster checkout."
        }
      />

      <section className="section">
        <div className="container-px grid gap-8 lg:grid-cols-[240px_1fr]">
          {/* sidebar */}
          <aside className="h-fit space-y-2">
            {isAdmin && (
              <Link
                to="/admin"
                className="flex w-full items-center gap-3 rounded-xl bg-foreground px-4 py-3 text-sm font-medium text-background transition hover:brightness-110"
              >
                <LayoutDashboard className="h-4 w-4" />
                Admin Panel
              </Link>
            )}
            <div className="rounded-2xl border border-border bg-card p-2 shadow-sm">
              {visibleTabs.map((t) => (
                <button
                  key={t.id}
                  onClick={() => setTab(t.id)}
                  className={`flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition ${
                    tab === t.id
                      ? "bg-primary text-primary-foreground"
                      : "text-foreground hover:bg-muted"
                  }`}
                >
                  <t.icon className="h-4 w-4" />
                  {t.label}
                  {t.id === "wishlist" && wishlist.length > 0 && (
                    <span className="ml-auto rounded-full bg-accent px-2 text-xs text-accent-foreground">
                      {wishlist.length}
                    </span>
                  )}
                </button>
              ))}
              {user && (
                <button
                  onClick={logout}
                  className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-destructive transition hover:bg-destructive/10"
                >
                  <LogOut className="h-4 w-4" />
                  Sign Out
                </button>
              )}
            </div>
          </aside>

          {/* content */}
          <div className="min-w-0">
            {tab === "signin" && !user && <AuthPanel />}
            {tab === "orders" && <OrdersPanel signedIn={!!user} />}
            {tab === "wishlist" && <WishlistPanel signedIn={!!user} wishlist={wishlist} />}
            {tab === "addresses" && <AddressesPanel signedIn={!!user} />}
          </div>
        </div>
      </section>
    </>
  );
}

/* ---------- sign in / register ---------- */

function AuthPanel() {
  const { login, register } = useStore();
  const navigate = useNavigate();
  const [mode, setMode] = useState("signin");
  const [busy, setBusy] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", phone: "", password: "" });

  const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));

  const onSubmit = async (e) => {
    e.preventDefault();
    setBusy(true);
    const res =
      mode === "signin"
        ? await login(form.email, form.password)
        : await register({
            name: form.name.trim(),
            email: form.email.trim(),
            phone: form.phone.trim() || null,
            password: form.password,
          });
    setBusy(false);
    if (res.ok) {
      setForm((f) => ({ ...f, password: "" }));
      if (res.isAdmin) navigate("/admin");
    }
  };

  const field =
    "mt-1.5 w-full rounded-lg border border-input bg-background px-3 py-2.5 text-sm outline-none focus:border-primary";

  return (
    <div className="grid gap-8 md:grid-cols-2">
      <form onSubmit={onSubmit} className="rounded-2xl border border-border bg-card p-7 shadow-sm">
        <div className="flex gap-2 rounded-xl bg-muted p-1">
          <button
            type="button"
            onClick={() => setMode("signin")}
            className={`flex-1 rounded-lg px-3 py-2 text-sm font-semibold transition ${
              mode === "signin" ? "bg-card shadow-sm" : "text-muted-foreground"
            }`}
          >
            Sign in
          </button>
          <button
            type="button"
            onClick={() => setMode("register")}
            className={`flex-1 rounded-lg px-3 py-2 text-sm font-semibold transition ${
              mode === "register" ? "bg-card shadow-sm" : "text-muted-foreground"
            }`}
          >
            Create account
          </button>
        </div>

        <h2 className="mt-6 font-display text-2xl">
          {mode === "signin" ? "Welcome back" : "Join Daily Pans"}
        </h2>
        <p className="mt-1 text-sm text-muted-foreground">
          {mode === "signin"
            ? "Sign in to track orders, manage addresses, and enjoy faster checkout."
            : "Create an account to track orders and save your delivery addresses."}
        </p>

        {mode === "register" && (
          <>
            <label className="mt-6 block text-sm font-medium">
              Full name
              <input required value={form.name} onChange={set("name")} placeholder="Priya Raman" className={field} />
            </label>
            <label className="mt-4 block text-sm font-medium">
              Phone
              <input value={form.phone} onChange={set("phone")} placeholder="+91 98765 43210" className={field} />
            </label>
          </>
        )}

        <label className={`${mode === "register" ? "mt-4" : "mt-6"} block text-sm font-medium`}>
          Email address
          <input type="email" required value={form.email} onChange={set("email")} placeholder="you@email.com" className={field} />
        </label>
        <label className="mt-4 block text-sm font-medium">
          Password
          <input
            type="password"
            required
            minLength={mode === "register" ? 6 : undefined}
            value={form.password}
            onChange={set("password")}
            placeholder="••••••••"
            className={field}
          />
        </label>

        <button disabled={busy} className="btn-primary mt-6 w-full disabled:opacity-60">
          {busy ? (
            "Please wait…"
          ) : mode === "signin" ? (
            <>
              <LogIn className="h-4 w-4" /> Sign In
            </>
          ) : (
            <>
              <UserPlus className="h-4 w-4" /> Create Account
            </>
          )}
        </button>

        {mode === "signin" && (
          <div className="mt-6 rounded-xl border border-dashed border-border bg-muted/40 p-4 text-xs">
            <p className="font-semibold text-foreground">Demo credentials</p>
            <p className="mt-2 text-muted-foreground">
              <span className="font-medium text-foreground">Admin</span> — admin@dailypans.in / Admin@123
            </p>
            <p className="mt-1 text-muted-foreground">
              <span className="font-medium text-foreground">Customer</span> — customer@dailypans.in / customer123
            </p>
          </div>
        )}

        <p className="mt-4 flex items-center justify-center gap-1.5 text-xs text-muted-foreground">
          <Shield className="h-3.5 w-3.5 text-accent" />
          Your details are stored on the Daily Pans server
        </p>
      </form>

      <div className="rounded-2xl bg-secondary p-7">
        <Sparkles className="h-8 w-8 text-primary" />
        <h3 className="mt-4 font-display text-2xl">Member Benefits</h3>
        <ul className="mt-4 space-y-3">
          {benefits.map((b) => (
            <li key={b} className="flex items-center gap-3 text-sm">
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-accent/15 text-accent">
                ✓
              </span>
              {b}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

/* ---------- orders ---------- */

function OrdersPanel({ signedIn }) {
  const [orders, setOrders] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!signedIn) return;
    let cancelled = false;
    api
      .myOrders()
      .then((o) => !cancelled && setOrders(o || []))
      .catch((e) => !cancelled && setError(e.message));
    return () => {
      cancelled = true;
    };
  }, [signedIn]);

  if (!signedIn) {
    return (
      <EmptyState
        icon={Package}
        title="Sign in required"
        text="Sign in to track orders, view order history, and manage returns."
      />
    );
  }
  if (error) return <EmptyState icon={Package} title="Could not load orders" text={error} />;
  if (orders === null) return <Loader label="Loading your orders…" />;
  if (orders.length === 0) {
    return (
      <EmptyState
        icon={Package}
        title="No orders yet"
        text="When you place an order it will appear here for tracking."
      />
    );
  }

  return (
    <div>
      <h2 className="font-display text-2xl">Your Orders</h2>
      <div className="mt-6 space-y-4">
        {orders.map((o) => (
          <article key={o.id} className="rounded-2xl border border-border bg-card p-5 shadow-sm">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="font-display text-lg">{o.orderNumber}</p>
                <p className="text-xs text-muted-foreground">
                  Placed {formatDate(o.createdAt)} ·{" "}
                  {o.paymentMethod === "CashOnDelivery" ? "Cash on delivery" : "Paid online"}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Pill value={o.status} styles={orderStatusStyles} />
                <Pill value={o.paymentStatus} styles={paymentStatusStyles} />
              </div>
            </div>

            <ul className="mt-4 space-y-1.5 text-sm">
              {o.items.map((i) => (
                <li key={i.productId} className="flex justify-between gap-4">
                  <span className="text-muted-foreground">
                    {i.quantity} × {i.productName}
                  </span>
                  <span className="font-medium">{formatPrice(i.lineTotal)}</span>
                </li>
              ))}
            </ul>

            <div className="mt-4 space-y-1 border-t border-border pt-3 text-sm">
              {o.discount > 0 && (
                <div className="flex justify-between text-accent">
                  <span>Discount ({o.couponCode})</span>
                  <span>−{formatPrice(o.discount)}</span>
                </div>
              )}
              <div className="flex justify-between text-muted-foreground">
                <span>Shipping</span>
                <span>{o.shippingFee === 0 ? "Free" : formatPrice(o.shippingFee)}</span>
              </div>
              <div className="flex justify-between font-semibold">
                <span>Total</span>
                <span>{formatPrice(o.total)}</span>
              </div>
            </div>

            {/* delivery tracking */}
            <div className="mt-4 rounded-xl bg-secondary/50 p-4 text-sm">
              <p className="flex items-center gap-2 font-medium">
                <Truck className="h-4 w-4 text-primary" /> Delivery
              </p>
              <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
                {o.shipping.fullName}, {o.shipping.line1}
                {o.shipping.line2 ? `, ${o.shipping.line2}` : ""}, {o.shipping.city},{" "}
                {o.shipping.state} {o.shipping.pincode}
              </p>
              {o.delivery?.trackingNumber ? (
                <p className="mt-2 text-xs">
                  <span className="font-medium">{o.delivery.courier}</span> ·{" "}
                  {o.delivery.trackingUrl ? (
                    <a
                      href={o.delivery.trackingUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="text-primary hover:underline"
                    >
                      {o.delivery.trackingNumber}
                    </a>
                  ) : (
                    o.delivery.trackingNumber
                  )}
                  {o.delivery.deliveredAt
                    ? ` · delivered ${formatDate(o.delivery.deliveredAt)}`
                    : o.delivery.expectedDate
                    ? ` · expected ${formatDate(o.delivery.expectedDate)}`
                    : ""}
                </p>
              ) : (
                <p className="mt-2 text-xs text-muted-foreground">
                  {o.status === "Cancelled"
                    ? "This order was cancelled."
                    : "Not dispatched yet — we'll add tracking here as soon as it ships."}
                </p>
              )}
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}

/* ---------- wishlist ---------- */

function WishlistPanel({ signedIn, wishlist }) {
  if (!signedIn) {
    return (
      <EmptyState
        icon={Heart}
        title="Sign in required"
        text="Sign in to save products to your wishlist and find them on any device."
      />
    );
  }
  return (
    <div>
      <h2 className="font-display text-2xl">Your Wishlist</h2>
      {wishlist.length > 0 ? (
        <div className="mt-6 grid grid-cols-2 gap-5 lg:grid-cols-3">
          {wishlist.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      ) : (
        <EmptyState
          icon={Heart}
          title="Your wishlist is empty"
          text="Save your favorite products to find them here later."
        />
      )}
    </div>
  );
}

/* ---------- addresses (derived from order history) ---------- */

function AddressesPanel({ signedIn }) {
  const [addresses, setAddresses] = useState(null);

  useEffect(() => {
    if (!signedIn) return;
    let cancelled = false;
    api
      .myOrders()
      .then((orders) => {
        if (cancelled) return;
        // De-duplicate the addresses this account has ordered to, newest first.
        const seen = new Map();
        for (const o of orders || []) {
          const a = o.shipping;
          if (!a) continue;
          const key = `${a.line1}|${a.line2}|${a.city}|${a.pincode}`;
          if (!seen.has(key)) seen.set(key, a);
        }
        setAddresses([...seen.values()]);
      })
      .catch(() => !cancelled && setAddresses([]));
    return () => {
      cancelled = true;
    };
  }, [signedIn]);

  if (!signedIn) {
    return (
      <EmptyState
        icon={MapPin}
        title="Sign in required"
        text="Sign in to save addresses for quick and easy ordering."
      />
    );
  }
  if (addresses === null) return <Loader label="Loading your addresses…" />;
  if (addresses.length === 0) {
    return (
      <EmptyState
        icon={MapPin}
        title="No saved addresses"
        text="Addresses you use at checkout are saved here automatically."
      />
    );
  }

  return (
    <div>
      <h2 className="font-display text-2xl">Your Addresses</h2>
      <p className="mt-1 text-sm text-muted-foreground">
        Saved automatically from your past orders.
      </p>
      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        {addresses.map((a, i) => (
          <div key={i} className="rounded-2xl border border-border bg-card p-5 text-sm shadow-sm">
            <p className="font-semibold">{a.fullName}</p>
            <p className="mt-1 leading-relaxed text-muted-foreground">
              {a.line1}
              {a.line2 ? `, ${a.line2}` : ""}
              <br />
              {a.city}, {a.state} {a.pincode}
              {a.landmark ? (
                <>
                  <br />
                  <span className="text-xs">Landmark: {a.landmark}</span>
                </>
              ) : null}
            </p>
            <p className="mt-2 text-xs text-muted-foreground">
              {a.phone}
              {a.email ? ` · ${a.email}` : ""}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

function EmptyState({ icon: Icon, title, text }) {
  return (
    <div className="mt-6 flex flex-col items-center rounded-2xl border border-dashed border-border bg-card py-16 text-center">
      <div className="rounded-full bg-muted p-5">
        <Icon className="h-8 w-8 text-muted-foreground" />
      </div>
      <h3 className="mt-5 font-display text-xl">{title}</h3>
      <p className="mt-2 max-w-sm text-sm text-muted-foreground">{text}</p>
      <Link to="/products" className="btn-primary mt-6">
        Start Shopping
      </Link>
    </div>
  );
}
