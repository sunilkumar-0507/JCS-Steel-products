import { useState } from "react";
import { Link, Navigate } from "react-router-dom";
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Users,
  TicketPercent,
  Building2,
  Mail,
  Store,
  LogOut,
  ArrowUpRight,
  Menu,
  X,
} from "lucide-react";
import LogoMark from "@/components/Logo.jsx";
import { Loader } from "@/components/ui.jsx";
import { useStore } from "@/context/StoreContext";
import Dashboard from "./admin/Dashboard.jsx";
import AdminProducts from "./admin/Products.jsx";
import AdminOrders from "./admin/Orders.jsx";
import AdminCustomers from "./admin/Customers.jsx";
import AdminCoupons from "./admin/Coupons.jsx";
import { AdminBulkOrders, AdminMessages } from "./admin/Leads.jsx";

const navItems = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { id: "products", label: "Products", icon: Package },
  { id: "orders", label: "Orders", icon: ShoppingCart },
  { id: "customers", label: "Customers", icon: Users },
  { id: "coupons", label: "Coupons", icon: TicketPercent },
  { id: "bulk", label: "Bulk Orders", icon: Building2 },
  { id: "messages", label: "Messages", icon: Mail },
];

const titles = {
  dashboard: "Dashboard",
  products: "Products",
  orders: "Orders",
  customers: "Customers",
  coupons: "Coupons & Discounts",
  bulk: "Bulk Orders",
  messages: "Messages",
};

export default function Admin() {
  const { user, isAdmin, authReady, logout } = useStore();
  const [tab, setTab] = useState("dashboard");
  const [menuOpen, setMenuOpen] = useState(false);

  // Wait for the session check before deciding whether to redirect.
  if (!authReady) return <Loader label="Checking your session…" className="min-h-screen" />;
  if (!user || !isAdmin) return <Navigate to="/account" replace />;

  const go = (id) => {
    setTab(id);
    setMenuOpen(false);
  };

  return (
    <div className="min-h-screen bg-secondary/30 lg:grid lg:grid-cols-[260px_1fr]">
      {/* Sidebar */}
      <aside
        className={`flex flex-col border-r border-border bg-card lg:sticky lg:top-0 lg:h-screen ${
          menuOpen ? "" : "max-lg:pb-0"
        }`}
      >
        <div className="flex items-center gap-3 border-b border-border px-6 py-5">
          <LogoMark className="h-9 w-9 shrink-0" />
          <div className="leading-none">
            <span className="block logo-script text-2xl text-primary">Daily Pans</span>
            <span className="block text-[10px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
              Admin Portal
            </span>
          </div>
          <button
            onClick={() => setMenuOpen((o) => !o)}
            className="ml-auto rounded-lg p-2 text-muted-foreground hover:bg-muted lg:hidden"
            aria-label="Toggle menu"
          >
            {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>

        <nav className={`flex-col gap-1 p-3 lg:flex ${menuOpen ? "flex" : "hidden"}`}>
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => go(item.id)}
              className={`flex shrink-0 items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition ${
                tab === item.id
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "text-foreground hover:bg-muted"
              }`}
            >
              <item.icon className="h-4 w-4" />
              {item.label}
            </button>
          ))}
        </nav>

        <div className={`mt-auto space-y-1 border-t border-border p-3 lg:block ${menuOpen ? "block" : "hidden"}`}>
          <Link
            to="/"
            className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-foreground transition hover:bg-muted"
          >
            <Store className="h-4 w-4" />
            View Store
            <ArrowUpRight className="ml-auto h-4 w-4 text-muted-foreground" />
          </Link>
          <button
            onClick={logout}
            className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-destructive transition hover:bg-destructive/10"
          >
            <LogOut className="h-4 w-4" />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main */}
      <div className="flex min-w-0 flex-col">
        <header className="sticky top-0 z-10 flex items-center justify-between gap-4 border-b border-border bg-card/90 px-5 py-4 backdrop-blur sm:px-8">
          <div>
            <h1 className="font-display text-2xl">{titles[tab]}</h1>
            <p className="text-sm text-muted-foreground">
              Welcome back, {user.name.split(" ")[0]}
            </p>
          </div>
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-bold text-primary-foreground">
            {user.name.charAt(0)}
          </div>
        </header>

        <main className="min-w-0 flex-1 space-y-6 p-5 sm:p-8">
          {tab === "dashboard" && <Dashboard onNavigate={setTab} />}
          {tab === "products" && <AdminProducts />}
          {tab === "orders" && <AdminOrders />}
          {tab === "customers" && <AdminCustomers />}
          {tab === "coupons" && <AdminCoupons />}
          {tab === "bulk" && <AdminBulkOrders />}
          {tab === "messages" && <AdminMessages />}
        </main>
      </div>
    </div>
  );
}
