import { Link } from "react-router-dom";
import {
  IndianRupee,
  ShoppingCart,
  Users,
  Package,
  BadgePercent,
  Mail,
  Building2,
  TicketPercent,
  Clock,
} from "lucide-react";
import { api, formatPrice, formatDate } from "@/lib/api";
import { Async, Card, Table, Td, EmptyRow, Pill, useApi } from "./shared.jsx";

export default function Dashboard({ onNavigate }) {
  const stats = useApi(() => api.admin.dashboard(), []);
  const orders = useApi(() => api.admin.orders(), []);

  const d = stats.data;
  const cards = [
    { label: "Total Revenue", value: formatPrice(d?.revenue), icon: IndianRupee, note: `${formatPrice(d?.discountGiven)} in discounts` },
    { label: "Orders", value: d?.totalOrders ?? 0, icon: ShoppingCart, note: `${d?.pendingOrders ?? 0} awaiting dispatch` },
    { label: "Customers", value: d?.totalUsers ?? 0, icon: Users, note: `${d?.newsletterSubscribers ?? 0} newsletter subscribers` },
    { label: "Products", value: d?.totalProducts ?? 0, icon: Package, note: `${d?.activeCoupons ?? 0} active coupons` },
  ];

  const shortcuts = [
    { label: "Bulk enquiries", value: d?.bulkRequests ?? 0, icon: Building2, tab: "bulk" },
    { label: "Unread messages", value: d?.unreadMessages ?? 0, icon: Mail, tab: "messages" },
    { label: "Active coupons", value: d?.activeCoupons ?? 0, icon: TicketPercent, tab: "coupons" },
    { label: "Pending orders", value: d?.pendingOrders ?? 0, icon: Clock, tab: "orders" },
  ];

  return (
    <>
      <Async loading={stats.loading} error={stats.error} onRetry={stats.reload} label="Loading metrics…">
        <>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {cards.map((c) => (
              <div key={c.label} className="rounded-2xl border border-border bg-card p-5 shadow-sm">
                <span className="inline-flex rounded-xl bg-primary/10 p-2.5 text-primary">
                  <c.icon className="h-5 w-5" />
                </span>
                <p className="mt-4 font-display text-3xl">{c.value}</p>
                <p className="mt-1 text-sm text-muted-foreground">{c.label}</p>
                <p className="mt-2 flex items-center gap-1 text-xs text-accent">
                  <BadgePercent className="h-3.5 w-3.5" />
                  {c.note}
                </p>
              </div>
            ))}
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {shortcuts.map((s) => (
              <button
                key={s.label}
                onClick={() => onNavigate(s.tab)}
                className="flex items-center gap-3 rounded-2xl border border-border bg-card p-4 text-left shadow-sm transition hover:border-primary"
              >
                <span className="inline-flex rounded-xl bg-secondary p-2.5 text-foreground">
                  <s.icon className="h-4 w-4" />
                </span>
                <div>
                  <p className="font-display text-xl leading-none">{s.value}</p>
                  <p className="mt-1 text-xs text-muted-foreground">{s.label}</p>
                </div>
              </button>
            ))}
          </div>
        </>
      </Async>

      <Card
        title="Recent Orders"
        subtitle="Latest activity across your store"
        action={
          <button onClick={() => onNavigate("orders")} className="text-sm font-semibold text-primary hover:underline">
            View all
          </button>
        }
      >
        <Async loading={orders.loading} error={orders.error} onRetry={orders.reload} label="Loading orders…">
          <Table head={["Order", "Customer", "Date", "Discount", "Total", "Status"]}>
            {(orders.data || []).slice(0, 6).map((o) => (
              <tr key={o.id} className="border-t border-border">
                <Td className="font-semibold">{o.orderNumber}</Td>
                <Td>
                  <p className="font-medium">{o.shipping?.fullName}</p>
                  <p className="text-xs text-muted-foreground">{o.shipping?.city}</p>
                </Td>
                <Td className="whitespace-nowrap text-muted-foreground">{formatDate(o.createdAt)}</Td>
                <Td className={o.discount > 0 ? "text-accent" : "text-muted-foreground"}>
                  {o.discount > 0 ? `−${formatPrice(o.discount)}` : "—"}
                </Td>
                <Td className="font-semibold">{formatPrice(o.total)}</Td>
                <Td>
                  <Pill value={o.status} />
                </Td>
              </tr>
            ))}
            {(orders.data || []).length === 0 && <EmptyRow colSpan={6}>No orders yet.</EmptyRow>}
          </Table>
        </Async>
      </Card>

      <p className="text-center text-xs text-muted-foreground">
        Storefront:{" "}
        <Link to="/" className="font-medium text-primary hover:underline">
          dailypans.in
        </Link>
      </p>
    </>
  );
}
