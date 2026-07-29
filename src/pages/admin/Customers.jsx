import { useState } from "react";
import { Eye, Mail, Phone, MapPin, Search } from "lucide-react";
import { api, formatPrice, formatDate } from "@/lib/api";
import {
  Async, Card, Table, Td, EmptyRow, Modal, Pill, DetailRow, useApi,
} from "./shared.jsx";

export default function AdminCustomers() {
  const customers = useApi(() => api.admin.customers(), []);
  const [selected, setSelected] = useState(null);
  const [query, setQuery] = useState("");

  const list = customers.data || [];
  const filtered = query.trim()
    ? list.filter((c) =>
        `${c.name} ${c.email} ${c.city || ""}`.toLowerCase().includes(query.trim().toLowerCase())
      )
    : list;

  return (
    <>
      <div className="relative max-w-xs">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search customers…"
          className="w-full rounded-full border border-border bg-card py-2 pl-9 pr-4 text-sm outline-none focus:border-primary"
        />
      </div>

      <Card title="Customers" subtitle={`${list.length} registered customers`}>
        <Async loading={customers.loading} error={customers.error} onRetry={customers.reload} label="Loading customers…">
          <Table head={["Customer", "Contact", "City", "Orders", "Total Spent", "Last Order", "Joined", ""]} minWidth={980}>
            {filtered.map((c) => (
              <tr key={c.id} className="border-t border-border">
                <Td>
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-secondary text-sm font-bold text-secondary-foreground">
                      {c.name.charAt(0)}
                    </div>
                    <div className="min-w-0">
                      <p className="truncate font-medium">{c.name}</p>
                      <p className="truncate text-xs text-muted-foreground">{c.email}</p>
                    </div>
                  </div>
                </Td>
                <Td className="text-xs text-muted-foreground">{c.phone || "—"}</Td>
                <Td className="text-muted-foreground">{c.city || "—"}</Td>
                <Td>{c.orders}</Td>
                <Td className="whitespace-nowrap font-semibold">{formatPrice(c.spent)}</Td>
                <Td className="whitespace-nowrap text-muted-foreground">{formatDate(c.lastOrderAt)}</Td>
                <Td className="whitespace-nowrap text-muted-foreground">{formatDate(c.joined)}</Td>
                <Td>
                  <button
                    onClick={() => setSelected(c)}
                    className="rounded-lg p-2 text-muted-foreground transition hover:bg-muted hover:text-primary"
                    aria-label={`View ${c.name}`}
                  >
                    <Eye className="h-4 w-4" />
                  </button>
                </Td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <EmptyRow colSpan={8}>
                {query ? "No customers match that search." : "No customers yet."}
              </EmptyRow>
            )}
          </Table>
        </Async>
      </Card>

      {selected && <CustomerModal id={selected.id} onClose={() => setSelected(null)} />}
    </>
  );
}

function CustomerModal({ id, onClose }) {
  const detail = useApi(() => api.admin.customer(id), [id]);
  const d = detail.data;

  return (
    <Modal
      title={d?.customer?.name || "Customer"}
      subtitle={d?.customer?.email}
      onClose={onClose}
      wide
    >
      <Async loading={detail.loading} error={detail.error} onRetry={detail.reload} label="Loading customer…">
        {d && (
          <div className="space-y-6">
            {/* summary */}
            <div className="grid gap-3 sm:grid-cols-3">
              <Stat label="Orders" value={d.customer.orders} />
              <Stat label="Total spent" value={formatPrice(d.customer.spent)} />
              <Stat label="Customer since" value={formatDate(d.customer.joined)} />
            </div>

            {/* contact */}
            <section className="rounded-xl bg-secondary/50 p-4">
              <h3 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
                Contact
              </h3>
              <div className="mt-3 space-y-2 text-sm">
                <p className="flex items-center gap-2">
                  <Mail className="h-4 w-4 shrink-0 text-primary" />
                  <a href={`mailto:${d.customer.email}`} className="hover:text-primary">
                    {d.customer.email}
                  </a>
                </p>
                <p className="flex items-center gap-2">
                  <Phone className="h-4 w-4 shrink-0 text-primary" />
                  {d.customer.phone ? (
                    <a href={`tel:${d.customer.phone}`} className="hover:text-primary">
                      {d.customer.phone}
                    </a>
                  ) : (
                    <span className="text-muted-foreground">Not provided</span>
                  )}
                </p>
              </div>
            </section>

            {/* addresses */}
            <section>
              <h3 className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
                <MapPin className="h-4 w-4" /> Delivery addresses ({d.addresses.length})
              </h3>
              {d.addresses.length === 0 ? (
                <p className="mt-3 rounded-xl border border-dashed border-border p-4 text-sm text-muted-foreground">
                  No delivery address on file — this customer hasn't ordered yet.
                </p>
              ) : (
                <div className="mt-3 grid gap-3 sm:grid-cols-2">
                  {d.addresses.map((a, i) => (
                    <div key={i} className="rounded-xl border border-border p-4 text-sm leading-relaxed">
                      <p className="font-semibold">{a.fullName}</p>
                      <p className="text-muted-foreground">
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
              )}
            </section>

            {/* orders */}
            <section>
              <h3 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
                Order history
              </h3>
              {d.orders.length === 0 ? (
                <p className="mt-3 rounded-xl border border-dashed border-border p-4 text-sm text-muted-foreground">
                  No orders yet.
                </p>
              ) : (
                <div className="mt-3 overflow-x-auto rounded-xl border border-border">
                  <table className="w-full min-w-[560px] text-left text-sm">
                    <thead className="bg-secondary/50 text-xs uppercase text-muted-foreground">
                      <tr>
                        <th className="px-4 py-2.5 font-semibold">Order</th>
                        <th className="px-4 py-2.5 font-semibold">Date</th>
                        <th className="px-4 py-2.5 font-semibold">Items</th>
                        <th className="px-4 py-2.5 font-semibold">Total</th>
                        <th className="px-4 py-2.5 font-semibold">Status</th>
                        <th className="px-4 py-2.5 font-semibold">Tracking</th>
                      </tr>
                    </thead>
                    <tbody>
                      {d.orders.map((o) => (
                        <tr key={o.id} className="border-t border-border">
                          <td className="px-4 py-2.5 font-medium">{o.orderNumber}</td>
                          <td className="whitespace-nowrap px-4 py-2.5 text-muted-foreground">
                            {formatDate(o.createdAt)}
                          </td>
                          <td className="px-4 py-2.5">
                            {o.items?.reduce((n, i) => n + i.quantity, 0) || 0}
                          </td>
                          <td className="whitespace-nowrap px-4 py-2.5 font-medium">
                            {formatPrice(o.total)}
                            {o.discount > 0 && (
                              <span className="block text-xs text-accent">
                                −{formatPrice(o.discount)} {o.couponCode}
                              </span>
                            )}
                          </td>
                          <td className="px-4 py-2.5">
                            <Pill value={o.status} />
                          </td>
                          <td className="px-4 py-2.5 text-xs text-muted-foreground">
                            {o.delivery?.trackingNumber ? (
                              <>
                                {o.delivery.courier}
                                <br />
                                {o.delivery.trackingNumber}
                              </>
                            ) : (
                              "—"
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </section>
          </div>
        )}
      </Async>
    </Modal>
  );
}

function Stat({ label, value }) {
  return (
    <div className="rounded-xl border border-border p-4">
      <p className="font-display text-2xl">{value}</p>
      <p className="mt-1 text-xs text-muted-foreground">{label}</p>
    </div>
  );
}
