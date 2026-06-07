import { useState } from "react";
import { Link, Navigate } from "react-router-dom";
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Users,
  Store,
  LogOut,
  IndianRupee,
  TrendingUp,
  ArrowUpRight,
  Search,
} from "lucide-react";
import logo from "@/assets/jcs-home-logo.png";
import { useStore } from "@/context/StoreContext";
import { products, formatPrice } from "@/data/products";
import { orders, customers, metrics, statusStyles } from "@/data/admin";

const navItems = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { id: "products", label: "Products", icon: Package },
  { id: "orders", label: "Orders", icon: ShoppingCart },
  { id: "customers", label: "Customers", icon: Users },
];

export default function Admin() {
  const { user, isAdmin, logout } = useStore();
  const [tab, setTab] = useState("dashboard");

  // Guard: only admins may view this panel.
  if (!user) return <Navigate to="/account" replace />;
  if (!isAdmin) return <Navigate to="/account" replace />;

  return (
    <div className="min-h-screen bg-secondary/30 lg:grid lg:grid-cols-[260px_1fr]">
      {/* Sidebar */}
      <aside className="flex flex-col border-r border-border bg-card lg:sticky lg:top-0 lg:h-screen">
        <div className="flex items-center gap-3 border-b border-border px-6 py-5">
          <img src={logo} alt="JCS Home" className="h-9 w-auto" />
          <div className="leading-none">
            <span className="block logo-script text-2xl text-primary">JCS Home</span>
            <span className="block text-[10px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
              Admin Portal
            </span>
          </div>
        </div>

        <nav className="flex gap-1 overflow-x-auto p-3 lg:flex-col lg:overflow-visible">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setTab(item.id)}
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

        <div className="mt-auto space-y-1 border-t border-border p-3">
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
      <div className="flex flex-col">
        <header className="sticky top-0 z-10 flex items-center justify-between gap-4 border-b border-border bg-card/90 px-5 py-4 backdrop-blur sm:px-8">
          <div>
            <h1 className="font-display text-2xl capitalize">{tab}</h1>
            <p className="text-sm text-muted-foreground">
              Welcome back, {user.name.split(" ")[0]}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <div className="relative hidden sm:block">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <input
                placeholder="Search…"
                className="w-44 rounded-full border border-border bg-muted/40 py-2 pl-9 pr-4 text-sm outline-none focus:border-primary"
              />
            </div>
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-sm font-bold text-primary-foreground">
              {user.name.charAt(0)}
            </div>
          </div>
        </header>

        <main className="flex-1 space-y-8 p-5 sm:p-8">
          {tab === "dashboard" && <Dashboard />}
          {tab === "products" && <ProductsTable />}
          {tab === "orders" && <OrdersTable />}
          {tab === "customers" && <CustomersTable />}
        </main>
      </div>
    </div>
  );
}

/* ---------- Dashboard ---------- */

function Dashboard() {
  const cards = [
    {
      label: "Total Revenue",
      value: formatPrice(metrics.revenue),
      delta: "+12.4%",
      icon: IndianRupee,
    },
    {
      label: "Orders",
      value: metrics.orders,
      delta: "+8.1%",
      icon: ShoppingCart,
    },
    {
      label: "Customers",
      value: metrics.customers,
      delta: "+5.3%",
      icon: Users,
    },
    {
      label: "Products",
      value: metrics.products,
      delta: "Live",
      icon: Package,
    },
  ];

  return (
    <>
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map((c) => (
          <div
            key={c.label}
            className="rounded-2xl border border-border bg-card p-5 shadow-sm"
          >
            <div className="flex items-center justify-between">
              <span className="inline-flex rounded-xl bg-primary/10 p-2.5 text-primary">
                <c.icon className="h-5 w-5" />
              </span>
              <span className="inline-flex items-center gap-1 text-xs font-semibold text-accent">
                <TrendingUp className="h-3.5 w-3.5" />
                {c.delta}
              </span>
            </div>
            <p className="mt-4 font-display text-3xl">{c.value}</p>
            <p className="mt-1 text-sm text-muted-foreground">{c.label}</p>
          </div>
        ))}
      </div>

      <Card title="Recent Orders" subtitle="Latest activity across your store">
        <Table head={["Order", "Customer", "Date", "Total", "Status"]}>
          {orders.slice(0, 5).map((o) => (
            <tr key={o.id} className="border-t border-border">
              <Td className="font-semibold">{o.id}</Td>
              <Td>{o.customer}</Td>
              <Td className="text-muted-foreground">{o.date}</Td>
              <Td>{formatPrice(o.total)}</Td>
              <Td>
                <StatusPill status={o.status} />
              </Td>
            </tr>
          ))}
        </Table>
      </Card>
    </>
  );
}

/* ---------- Products ---------- */

function ProductsTable() {
  return (
    <Card title="Products" subtitle={`${products.length} items in catalog`}>
      <Table head={["Product", "Category", "Price", "MRP", "Stock", "Rating"]}>
        {products.map((p) => (
          <tr key={p.id} className="border-t border-border">
            <Td>
              <div className="flex items-center gap-3">
                <img
                  src={p.image}
                  alt={p.name}
                  className="h-10 w-10 rounded-lg object-cover"
                />
                <span className="font-medium">{p.name}</span>
              </div>
            </Td>
            <Td className="capitalize text-muted-foreground">
              {p.category.replace(/-/g, " ")}
            </Td>
            <Td className="font-semibold">{formatPrice(p.price)}</Td>
            <Td className="text-muted-foreground line-through">
              {formatPrice(p.compareAt)}
            </Td>
            <Td>
              <span className="inline-flex rounded-full bg-accent/15 px-2.5 py-0.5 text-xs font-semibold text-accent">
                In Stock
              </span>
            </Td>
            <Td>★ {p.rating}</Td>
          </tr>
        ))}
      </Table>
    </Card>
  );
}

/* ---------- Orders ---------- */

function OrdersTable() {
  return (
    <Card title="Orders" subtitle={`${orders.length} orders`}>
      <Table head={["Order", "Customer", "Date", "Items", "Total", "Payment", "Status"]}>
        {orders.map((o) => (
          <tr key={o.id} className="border-t border-border">
            <Td className="font-semibold">{o.id}</Td>
            <Td>
              <div>
                <p className="font-medium">{o.customer}</p>
                <p className="text-xs text-muted-foreground">{o.email}</p>
              </div>
            </Td>
            <Td className="text-muted-foreground">{o.date}</Td>
            <Td>{o.items}</Td>
            <Td className="font-semibold">{formatPrice(o.total)}</Td>
            <Td className="text-muted-foreground">{o.payment}</Td>
            <Td>
              <StatusPill status={o.status} />
            </Td>
          </tr>
        ))}
      </Table>
    </Card>
  );
}

/* ---------- Customers ---------- */

function CustomersTable() {
  return (
    <Card title="Customers" subtitle={`${customers.length} registered customers`}>
      <Table head={["Customer", "City", "Orders", "Total Spent", "Joined"]}>
        {customers.map((c) => (
          <tr key={c.id} className="border-t border-border">
            <Td>
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-secondary text-sm font-bold text-secondary-foreground">
                  {c.name.charAt(0)}
                </div>
                <div>
                  <p className="font-medium">{c.name}</p>
                  <p className="text-xs text-muted-foreground">{c.email}</p>
                </div>
              </div>
            </Td>
            <Td className="text-muted-foreground">{c.city}</Td>
            <Td>{c.orders}</Td>
            <Td className="font-semibold">{formatPrice(c.spent)}</Td>
            <Td className="text-muted-foreground">{c.joined}</Td>
          </tr>
        ))}
      </Table>
    </Card>
  );
}

/* ---------- Shared bits ---------- */

function Card({ title, subtitle, children }) {
  return (
    <section className="rounded-2xl border border-border bg-card shadow-sm">
      <div className="border-b border-border px-5 py-4 sm:px-6">
        <h2 className="font-display text-xl">{title}</h2>
        {subtitle && <p className="text-sm text-muted-foreground">{subtitle}</p>}
      </div>
      <div className="overflow-x-auto">{children}</div>
    </section>
  );
}

function Table({ head, children }) {
  return (
    <table className="w-full min-w-[640px] text-left text-sm">
      <thead>
        <tr className="text-xs uppercase tracking-wide text-muted-foreground">
          {head.map((h) => (
            <th key={h} className="px-5 py-3 font-semibold sm:px-6">
              {h}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>{children}</tbody>
    </table>
  );
}

function Td({ children, className = "" }) {
  return <td className={`px-5 py-3.5 sm:px-6 ${className}`}>{children}</td>;
}

function StatusPill({ status }) {
  return (
    <span
      className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold ${
        statusStyles[status] || "bg-muted text-muted-foreground"
      }`}
    >
      {status}
    </span>
  );
}
