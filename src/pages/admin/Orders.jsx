import { useMemo, useState } from "react";
import { Truck, Eye, MapPin, PackageCheck } from "lucide-react";
import {
  api,
  formatPrice,
  formatDate,
  formatDateTime,
  toDateInput,
  fromDateInput,
} from "@/lib/api";
import { useStore } from "@/context/StoreContext";
import {
  Async, Card, Table, Td, EmptyRow, Modal, Pill, Field, fieldClass,
  DetailRow, orderStatusStyles, paymentStatusStyles, useApi,
} from "./shared.jsx";

const STATUSES = ["Pending", "Confirmed", "Processing", "Shipped", "Delivered", "Cancelled"];
const COURIERS = ["Delhivery", "Blue Dart", "DTDC", "Ekart", "India Post", "Professional Couriers", "Other"];

export default function AdminOrders() {
  const { toast, reportError } = useStore();
  const [filter, setFilter] = useState("");
  const orders = useApi(() => api.admin.orders(filter || undefined), [filter]);
  const [viewing, setViewing] = useState(null);
  const [delivering, setDelivering] = useState(null);

  const list = orders.data || [];
  const counts = useMemo(() => {
    const map = {};
    for (const o of list) map[o.status] = (map[o.status] || 0) + 1;
    return map;
  }, [list]);

  const setStatus = async (order, status) => {
    try {
      await api.admin.setOrderStatus(order.id, status);
      toast(`${order.orderNumber} → ${status}`);
      orders.reload();
    } catch (err) {
      reportError(err, "Could not update the order status.");
    }
  };

  return (
    <>
      <div className="flex flex-wrap gap-2">
        <FilterPill active={!filter} onClick={() => setFilter("")}>
          All ({list.length})
        </FilterPill>
        {STATUSES.map((s) => (
          <FilterPill key={s} active={filter === s} onClick={() => setFilter(s)}>
            {s} {filter === "" && counts[s] ? `(${counts[s]})` : ""}
          </FilterPill>
        ))}
      </div>

      <Card title="Orders" subtitle={`${list.length} ${filter ? filter.toLowerCase() : ""} orders`}>
        <Async loading={orders.loading} error={orders.error} onRetry={orders.reload} label="Loading orders…">
          <Table
            head={["Order", "Customer", "Date", "Items", "Discount", "Total", "Payment", "Delivery", "Status", ""]}
            minWidth={1180}
          >
            {list.map((o) => (
              <tr key={o.id} className="border-t border-border align-top">
                <Td className="whitespace-nowrap font-semibold">{o.orderNumber}</Td>
                <Td>
                  <p className="font-medium">{o.shipping?.fullName}</p>
                  <p className="text-xs text-muted-foreground">
                    {o.shipping?.email || o.shipping?.phone}
                  </p>
                </Td>
                <Td className="whitespace-nowrap text-muted-foreground">{formatDate(o.createdAt)}</Td>
                <Td>{o.items?.reduce((n, i) => n + i.quantity, 0) || 0}</Td>
                <Td className={o.discount > 0 ? "whitespace-nowrap text-accent" : "text-muted-foreground"}>
                  {o.discount > 0 ? (
                    <>
                      −{formatPrice(o.discount)}
                      <span className="block text-xs text-muted-foreground">{o.couponCode}</span>
                    </>
                  ) : (
                    "—"
                  )}
                </Td>
                <Td className="whitespace-nowrap font-semibold">{formatPrice(o.total)}</Td>
                <Td>
                  <Pill value={o.paymentStatus} styles={paymentStatusStyles} />
                  <span className="mt-1 block text-xs text-muted-foreground">
                    {o.paymentMethod === "CashOnDelivery" ? "COD" : "Online"}
                  </span>
                </Td>
                <Td className="text-xs">
                  {o.delivery?.trackingNumber ? (
                    <>
                      <p className="font-medium text-foreground">{o.delivery.courier}</p>
                      <p className="text-muted-foreground">{o.delivery.trackingNumber}</p>
                    </>
                  ) : (
                    <span className="text-muted-foreground">Not dispatched</span>
                  )}
                </Td>
                <Td>
                  <select
                    value={o.status}
                    onChange={(e) => setStatus(o, e.target.value)}
                    className={`rounded-full border-0 px-2.5 py-1 text-xs font-semibold outline-none ${
                      orderStatusStyles[o.status] || "bg-muted text-muted-foreground"
                    }`}
                  >
                    {STATUSES.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                </Td>
                <Td>
                  <div className="flex gap-1">
                    <button
                      onClick={() => setViewing(o)}
                      className="rounded-lg p-2 text-muted-foreground transition hover:bg-muted hover:text-primary"
                      aria-label={`View ${o.orderNumber}`}
                    >
                      <Eye className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => setDelivering(o)}
                      className="rounded-lg p-2 text-muted-foreground transition hover:bg-muted hover:text-primary"
                      aria-label={`Delivery details for ${o.orderNumber}`}
                    >
                      <Truck className="h-4 w-4" />
                    </button>
                  </div>
                </Td>
              </tr>
            ))}
            {list.length === 0 && <EmptyRow colSpan={10}>No orders here yet.</EmptyRow>}
          </Table>
        </Async>
      </Card>

      {viewing && <OrderModal order={viewing} onClose={() => setViewing(null)} />}
      {delivering && (
        <DeliveryModal
          order={delivering}
          onClose={() => setDelivering(null)}
          onSaved={() => {
            setDelivering(null);
            orders.reload();
          }}
        />
      )}
    </>
  );
}

function FilterPill({ active, onClick, children }) {
  return (
    <button
      onClick={onClick}
      className={`rounded-full border px-3.5 py-1.5 text-xs font-semibold transition ${
        active
          ? "border-primary bg-primary text-primary-foreground"
          : "border-border bg-card text-foreground hover:border-primary"
      }`}
    >
      {children}
    </button>
  );
}

export function OrderModal({ order, onClose }) {
  const s = order.shipping || {};
  const d = order.delivery || {};

  return (
    <Modal title={order.orderNumber} subtitle={formatDateTime(order.createdAt)} onClose={onClose} wide>
      <div className="grid gap-6 sm:grid-cols-2">
        <section>
          <h3 className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
            <MapPin className="h-4 w-4" /> Delivery address
          </h3>
          <div className="mt-3 rounded-xl bg-secondary/50 p-4 text-sm leading-relaxed">
            <p className="font-semibold">{s.fullName}</p>
            <p className="text-muted-foreground">
              {s.line1}
              {s.line2 ? `, ${s.line2}` : ""}
              <br />
              {s.city}, {s.state} {s.pincode}
              {s.landmark ? (
                <>
                  <br />
                  <span className="text-xs">Landmark: {s.landmark}</span>
                </>
              ) : null}
            </p>
            <p className="mt-2 text-muted-foreground">
              {s.phone}
              {s.email ? ` · ${s.email}` : ""}
            </p>
          </div>
        </section>

        <section>
          <h3 className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
            <PackageCheck className="h-4 w-4" /> Fulfilment
          </h3>
          <div className="mt-3 rounded-xl bg-secondary/50 p-4">
            <DetailRow label="Status" value={<Pill value={order.status} />} />
            <DetailRow
              label="Payment"
              value={
                <>
                  <Pill value={order.paymentStatus} styles={paymentStatusStyles} />{" "}
                  <span className="text-xs text-muted-foreground">
                    {order.paymentMethod === "CashOnDelivery" ? "COD" : "Online"}
                  </span>
                </>
              }
            />
            <DetailRow label="Courier" value={d.courier} />
            <DetailRow
              label="Tracking"
              value={
                d.trackingNumber ? (
                  d.trackingUrl ? (
                    <a href={d.trackingUrl} target="_blank" rel="noreferrer" className="text-primary hover:underline">
                      {d.trackingNumber}
                    </a>
                  ) : (
                    d.trackingNumber
                  )
                ) : null
              }
            />
            <DetailRow label="Expected" value={formatDate(d.expectedDate)} />
            <DetailRow label="Shipped" value={formatDate(d.shippedAt)} />
            <DetailRow label="Delivered" value={formatDate(d.deliveredAt)} />
            {d.notes && (
              <p className="mt-2 border-t border-border pt-2 text-xs text-muted-foreground">{d.notes}</p>
            )}
          </div>
        </section>
      </div>

      <section className="mt-6">
        <h3 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">Items</h3>
        <div className="mt-3 overflow-x-auto rounded-xl border border-border">
          <table className="w-full min-w-[420px] text-left text-sm">
            <thead className="bg-secondary/50 text-xs uppercase text-muted-foreground">
              <tr>
                <th className="px-4 py-2.5 font-semibold">Product</th>
                <th className="px-4 py-2.5 font-semibold">Unit</th>
                <th className="px-4 py-2.5 font-semibold">Qty</th>
                <th className="px-4 py-2.5 text-right font-semibold">Total</th>
              </tr>
            </thead>
            <tbody>
              {(order.items || []).map((i) => (
                <tr key={i.productId} className="border-t border-border">
                  <td className="px-4 py-2.5">{i.productName}</td>
                  <td className="px-4 py-2.5 text-muted-foreground">{formatPrice(i.unitPrice)}</td>
                  <td className="px-4 py-2.5">{i.quantity}</td>
                  <td className="px-4 py-2.5 text-right font-medium">{formatPrice(i.lineTotal)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-4 ml-auto max-w-xs">
          <DetailRow label="Subtotal" value={formatPrice(order.subtotal)} />
          {order.discount > 0 && (
            <DetailRow
              label={`Discount (${order.couponCode})`}
              value={<span className="text-accent">−{formatPrice(order.discount)}</span>}
            />
          )}
          <DetailRow
            label="Shipping"
            value={order.shippingFee === 0 ? <span className="text-accent">Free</span> : formatPrice(order.shippingFee)}
          />
          <div className="mt-1 border-t border-border pt-1">
            <DetailRow label="Total" value={<strong>{formatPrice(order.total)}</strong>} />
          </div>
        </div>
      </section>
    </Modal>
  );
}

function DeliveryModal({ order, onClose, onSaved }) {
  const { toast, reportError } = useStore();
  const d = order.delivery || {};
  const [busy, setBusy] = useState(false);
  const [form, setForm] = useState({
    courier: d.courier || "",
    trackingNumber: d.trackingNumber || "",
    trackingUrl: d.trackingUrl || "",
    expectedDate: toDateInput(d.expectedDate),
    shippedAt: toDateInput(d.shippedAt),
    deliveredAt: toDateInput(d.deliveredAt),
    notes: d.notes || "",
  });

  const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));

  const submit = async (e) => {
    e.preventDefault();
    setBusy(true);
    try {
      await api.admin.setDelivery(order.id, {
        courier: form.courier.trim() || null,
        trackingNumber: form.trackingNumber.trim() || null,
        trackingUrl: form.trackingUrl.trim() || null,
        expectedDate: fromDateInput(form.expectedDate),
        shippedAt: fromDateInput(form.shippedAt),
        deliveredAt: fromDateInput(form.deliveredAt),
        notes: form.notes.trim() || null,
      });
      toast("Delivery details updated");
      onSaved();
    } catch (err) {
      reportError(err, "Could not save the delivery details.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <Modal
      title="Delivery details"
      subtitle={`${order.orderNumber} · ${order.shipping?.city}, ${order.shipping?.state}`}
      onClose={onClose}
    >
      <form onSubmit={submit} className="space-y-4">
        <Field label="Courier">
          <select value={form.courier} onChange={set("courier")} className={fieldClass}>
            <option value="">Not assigned</option>
            {COURIERS.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </Field>

        <Field label="Tracking number">
          <input value={form.trackingNumber} onChange={set("trackingNumber")} placeholder="DLV4471209981" className={fieldClass} />
        </Field>

        <Field label="Tracking URL">
          <input value={form.trackingUrl} onChange={set("trackingUrl")} placeholder="https://…" className={fieldClass} />
        </Field>

        <Field label="Expected delivery">
          <input type="date" value={form.expectedDate} onChange={set("expectedDate")} className={fieldClass} />
        </Field>

        <div className="grid grid-cols-2 gap-4">
          <Field label="Dispatched on" hint="Sets the order to Shipped.">
            <input type="date" value={form.shippedAt} onChange={set("shippedAt")} className={fieldClass} />
          </Field>
          <Field label="Delivered on" hint="Sets the order to Delivered.">
            <input type="date" value={form.deliveredAt} onChange={set("deliveredAt")} className={fieldClass} />
          </Field>
        </div>

        <Field label="Notes">
          <textarea rows={3} value={form.notes} onChange={set("notes")} placeholder="Handle with care / customer asked for evening delivery…" className={fieldClass} />
        </Field>

        <div className="flex gap-3 pt-2">
          <button type="button" onClick={onClose} className="btn-outline flex-1">
            Cancel
          </button>
          <button type="submit" disabled={busy} className="btn-primary flex-1 disabled:opacity-60">
            {busy ? "Saving…" : "Save delivery details"}
          </button>
        </div>
      </form>
    </Modal>
  );
}
