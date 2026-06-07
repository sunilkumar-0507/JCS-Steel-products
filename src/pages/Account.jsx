import { useState } from "react";
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
} from "lucide-react";
import { PageHeader } from "@/components/ui.jsx";
import ProductCard from "@/components/ProductCard.jsx";
import { useStore } from "@/context/StoreContext";

const tabs = [
  { id: "signin", label: "Sign In", icon: LogIn },
  { id: "wishlist", label: "Wishlist", icon: Heart },
  { id: "orders", label: "Orders", icon: Package },
  { id: "addresses", label: "Addresses", icon: MapPin },
];

const benefits = [
  "Faster checkout",
  "Save addresses for quick ordering",
  "Real-time order tracking",
  "Member-only discounts & exclusive offers",
];

export default function Account() {
  const { wishlist, user, login, logout } = useStore();
  const navigate = useNavigate();
  const [tab, setTab] = useState(
    user ? "wishlist" : wishlist.length ? "wishlist" : "signin"
  );
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const onSubmit = (e) => {
    e.preventDefault();
    const res = login(email, password);
    if (res.ok) {
      setPassword("");
      if (res.role === "admin") navigate("/admin");
      else setTab("wishlist");
    }
  };

  // Signed-in tabs hide "Sign In", add nothing else.
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
            {user?.role === "admin" && (
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
                  onClick={() => {
                    logout();
                    setTab("signin");
                  }}
                  className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-destructive transition hover:bg-destructive/10"
                >
                  <LogOut className="h-4 w-4" />
                  Sign Out
                </button>
              )}
            </div>
          </aside>

          {/* content */}
          <div>
            {tab === "signin" && !user && (
              <div className="grid gap-8 md:grid-cols-2">
                <form
                  onSubmit={onSubmit}
                  className="rounded-2xl border border-border bg-card p-7 shadow-sm"
                >
                  <h2 className="font-display text-2xl">Sign in</h2>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Sign in to track orders, manage addresses, and enjoy faster checkout.
                  </p>
                  <label className="mt-6 block text-sm font-medium">
                    Email address
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="you@email.com"
                      className="mt-1.5 w-full rounded-lg border border-input bg-background px-3 py-2.5 text-sm outline-none focus:border-primary"
                    />
                  </label>
                  <label className="mt-4 block text-sm font-medium">
                    Password
                    <input
                      type="password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="mt-1.5 w-full rounded-lg border border-input bg-background px-3 py-2.5 text-sm outline-none focus:border-primary"
                    />
                  </label>
                  <button className="btn-primary mt-6 w-full">Sign In</button>

                  {/* Demo credentials */}
                  <div className="mt-6 rounded-xl border border-dashed border-border bg-muted/40 p-4 text-xs">
                    <p className="font-semibold text-foreground">Demo credentials</p>
                    <p className="mt-2 text-muted-foreground">
                      <span className="font-medium text-foreground">Admin</span> —
                      admin@jcshome.in / admin123
                    </p>
                    <p className="mt-1 text-muted-foreground">
                      <span className="font-medium text-foreground">Customer</span> —
                      customer@jcshome.in / customer123
                    </p>
                  </div>

                  <p className="mt-4 flex items-center justify-center gap-1.5 text-xs text-muted-foreground">
                    <Shield className="h-3.5 w-3.5 text-accent" />
                    Demo store — credentials are for preview only
                  </p>
                </form>

                <div className="rounded-2xl bg-secondary p-7">
                  <Sparkles className="h-8 w-8 text-primary" />
                  <h3 className="mt-4 font-display text-2xl">Member Benefits</h3>
                  <ul className="mt-4 space-y-3">
                    {benefits.map((b) => (
                      <li key={b} className="flex items-center gap-3 text-sm">
                        <span className="flex h-6 w-6 items-center justify-center rounded-full bg-accent/15 text-accent">
                          ✓
                        </span>
                        {b}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}

            {tab === "wishlist" && (
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
            )}

            {tab === "orders" && (
              <EmptyState
                icon={Package}
                title={user ? "No orders yet" : "Sign in required"}
                text={
                  user
                    ? "When you place an order it will appear here for tracking."
                    : "Sign in to track orders, view order history, and manage returns."
                }
              />
            )}

            {tab === "addresses" && (
              <EmptyState
                icon={MapPin}
                title={user ? "No saved addresses" : "Sign in required"}
                text={
                  user
                    ? "Add an address to make checkout faster next time."
                    : "Sign in to save addresses for quick and easy ordering."
                }
              />
            )}
          </div>
        </div>
      </section>
    </>
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
