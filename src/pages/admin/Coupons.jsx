import { useState } from "react";
import { Plus, Pencil, Trash2, Power, Copy } from "lucide-react";
import { api, formatPrice, formatDate, toDateInput, fromDateInput } from "@/lib/api";
import { useStore } from "@/context/StoreContext";
import { Async, Card, Table, Td, EmptyRow, Modal, Field, fieldClass, useApi } from "./shared.jsx";

const emptyDraft = {
  code: "", description: "", type: "Percentage", value: "10",
  minOrderValue: "0", maxDiscount: "", freeShipping: false,
  usageLimit: "", startsAt: "", expiresAt: "", isPublic: true, isActive: true,
};

/** A coupon can be live, scheduled, expired, used up, or switched off. */
function couponState(c) {
  const now = new Date();
  if (!c.isActive) return { label: "Inactive", cls: "bg-muted text-muted-foreground" };
  if (c.startsAt && new Date(c.startsAt) > now)
    return { label: "Scheduled", cls: "bg-blue-100 text-blue-700" };
  if (c.expiresAt && new Date(c.expiresAt) < now)
    return { label: "Expired", cls: "bg-destructive/10 text-destructive" };
  if (c.usageLimit !== null && c.usageLimit !== undefined && c.timesUsed >= c.usageLimit)
    return { label: "Used up", cls: "bg-amber-100 text-amber-700" };
  return { label: "Active", cls: "bg-accent/15 text-accent" };
}

export default function AdminCoupons() {
  const { toast, reportError } = useStore();
  const coupons = useApi(() => api.admin.coupons(), []);
  const [editing, setEditing] = useState(null);

  const list = coupons.data || [];

  const remove = async (c) => {
    if (!window.confirm(`Delete coupon "${c.code}"?`)) return;
    try {
      await api.admin.deleteCoupon(c.id);
      toast("Coupon deleted");
      coupons.reload();
    } catch (err) {
      reportError(err, "Could not delete that coupon.");
    }
  };

  const toggleActive = async (c) => {
    try {
      await api.admin.updateCoupon(c.id, { ...toPayload(c), isActive: !c.isActive });
      toast(c.isActive ? `${c.code} switched off` : `${c.code} switched on`);
      coupons.reload();
    } catch (err) {
      reportError(err, "Could not update that coupon.");
    }
  };

  const copy = (code) => {
    navigator.clipboard?.writeText(code);
    toast(`${code} copied`);
  };

  return (
    <>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <p className="text-sm text-muted-foreground">
          {list.filter((c) => couponState(c).label === "Active").length} of {list.length} coupons
          are live
        </p>
        <button onClick={() => setEditing("new")} className="btn-primary">
          <Plus className="h-4 w-4" /> New Coupon
        </button>
      </div>

      <Card title="Coupons & discounts" subtitle="Codes customers can apply at checkout">
        <Async loading={coupons.loading} error={coupons.error} onRetry={coupons.reload} label="Loading coupons…">
          <Table
            head={["Code", "Discount", "Conditions", "Used", "Validity", "Visibility", "State", ""]}
            minWidth={1080}
          >
            {list.map((c) => {
              const state = couponState(c);
              return (
                <tr key={c.id} className="border-t border-border align-top">
                  <Td>
                    <button
                      onClick={() => copy(c.code)}
                      className="group flex items-center gap-1.5 font-mono text-sm font-bold"
                      title="Copy code"
                    >
                      {c.code}
                      <Copy className="h-3 w-3 text-muted-foreground opacity-0 transition group-hover:opacity-100" />
                    </button>
                    <p className="mt-0.5 max-w-[220px] text-xs text-muted-foreground">
                      {c.description}
                    </p>
                  </Td>
                  <Td className="whitespace-nowrap font-semibold">
                    {c.type === "Percentage" ? `${c.value}%` : formatPrice(c.value)}
                    {c.freeShipping && (
                      <span className="mt-0.5 block text-xs font-medium text-accent">
                        + free shipping
                      </span>
                    )}
                  </Td>
                  <Td className="text-xs text-muted-foreground">
                    {c.minOrderValue > 0 ? <p>Min. order {formatPrice(c.minOrderValue)}</p> : <p>No minimum</p>}
                    {c.maxDiscount ? <p>Max. {formatPrice(c.maxDiscount)} off</p> : null}
                  </Td>
                  <Td className="whitespace-nowrap">
                    {c.timesUsed}
                    {c.usageLimit ? ` / ${c.usageLimit}` : ""}
                  </Td>
                  <Td className="whitespace-nowrap text-xs text-muted-foreground">
                    <p>From {formatDate(c.startsAt) === "—" ? "now" : formatDate(c.startsAt)}</p>
                    <p>Until {formatDate(c.expiresAt) === "—" ? "no end date" : formatDate(c.expiresAt)}</p>
                  </Td>
                  <Td className="text-xs text-muted-foreground">
                    {c.isPublic ? "Shown in storefront" : "Private code"}
                  </Td>
                  <Td>
                    <span className={`inline-flex whitespace-nowrap rounded-full px-2.5 py-0.5 text-xs font-semibold ${state.cls}`}>
                      {state.label}
                    </span>
                  </Td>
                  <Td>
                    <div className="flex gap-1">
                      <button
                        onClick={() => toggleActive(c)}
                        className={`rounded-lg p-2 transition hover:bg-muted ${
                          c.isActive ? "text-accent" : "text-muted-foreground"
                        }`}
                        aria-label={c.isActive ? `Disable ${c.code}` : `Enable ${c.code}`}
                        title={c.isActive ? "Switch off" : "Switch on"}
                      >
                        <Power className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => setEditing(c)}
                        className="rounded-lg p-2 text-muted-foreground transition hover:bg-muted hover:text-primary"
                        aria-label={`Edit ${c.code}`}
                      >
                        <Pencil className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => remove(c)}
                        className="rounded-lg p-2 text-muted-foreground transition hover:bg-destructive/10 hover:text-destructive"
                        aria-label={`Delete ${c.code}`}
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </Td>
                </tr>
              );
            })}
            {list.length === 0 && (
              <EmptyRow colSpan={8}>No coupons yet — create your first discount code.</EmptyRow>
            )}
          </Table>
        </Async>
      </Card>

      {editing && (
        <CouponModal
          coupon={editing === "new" ? null : editing}
          onClose={() => setEditing(null)}
          onSaved={() => {
            setEditing(null);
            coupons.reload();
          }}
        />
      )}
    </>
  );
}

/** Coupon record -> update payload (the API needs every field on PUT). */
function toPayload(c) {
  return {
    code: c.code,
    description: c.description,
    type: c.type,
    value: c.value,
    minOrderValue: c.minOrderValue,
    maxDiscount: c.maxDiscount,
    freeShipping: c.freeShipping,
    usageLimit: c.usageLimit,
    startsAt: c.startsAt,
    expiresAt: c.expiresAt,
    isPublic: c.isPublic,
    isActive: c.isActive,
  };
}

function CouponModal({ coupon, onClose, onSaved }) {
  const { toast, reportError } = useStore();
  const [busy, setBusy] = useState(false);
  const [form, setForm] = useState(() =>
    coupon
      ? {
          code: coupon.code,
          description: coupon.description || "",
          type: coupon.type,
          value: String(coupon.value),
          minOrderValue: String(coupon.minOrderValue ?? 0),
          maxDiscount: coupon.maxDiscount != null ? String(coupon.maxDiscount) : "",
          freeShipping: coupon.freeShipping,
          usageLimit: coupon.usageLimit != null ? String(coupon.usageLimit) : "",
          startsAt: toDateInput(coupon.startsAt),
          expiresAt: toDateInput(coupon.expiresAt),
          isPublic: coupon.isPublic,
          isActive: coupon.isActive,
        }
      : emptyDraft
  );

  const set = (key) => (e) =>
    setForm((f) => ({
      ...f,
      [key]: e.target.type === "checkbox" ? e.target.checked : e.target.value,
    }));

  const submit = async (e) => {
    e.preventDefault();
    setBusy(true);
    const payload = {
      code: form.code.trim().toUpperCase(),
      description: form.description.trim(),
      type: form.type,
      value: Number(form.value) || 0,
      minOrderValue: Number(form.minOrderValue) || 0,
      maxDiscount: form.maxDiscount ? Number(form.maxDiscount) : null,
      freeShipping: form.freeShipping,
      usageLimit: form.usageLimit ? Number(form.usageLimit) : null,
      startsAt: fromDateInput(form.startsAt),
      expiresAt: fromDateInput(form.expiresAt),
      isPublic: form.isPublic,
      isActive: form.isActive,
    };
    try {
      if (coupon) await api.admin.updateCoupon(coupon.id, payload);
      else await api.admin.createCoupon(payload);
      toast(coupon ? "Coupon updated" : "Coupon created");
      onSaved();
    } catch (err) {
      reportError(err, "Could not save the coupon.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <Modal
      title={coupon ? "Edit coupon" : "New coupon"}
      subtitle={
        coupon
          ? `Used ${coupon.timesUsed} time${coupon.timesUsed === 1 ? "" : "s"}`
          : "Customers enter this code at checkout."
      }
      onClose={onClose}
    >
      <form onSubmit={submit} className="space-y-4">
        <Field label="Code *" hint="Always stored in upper case.">
          <input
            required
            value={form.code}
            onChange={(e) => setForm((f) => ({ ...f, code: e.target.value.toUpperCase() }))}
            placeholder="WELCOME10"
            className={`${fieldClass} font-mono uppercase`}
          />
        </Field>

        <Field label="Description">
          <input
            value={form.description}
            onChange={set("description")}
            placeholder="10% off your first order"
            className={fieldClass}
          />
        </Field>

        <div className="grid grid-cols-2 gap-4">
          <Field label="Discount type">
            <select value={form.type} onChange={set("type")} className={fieldClass}>
              <option value="Percentage">Percentage (%)</option>
              <option value="Fixed">Fixed amount (₹)</option>
            </select>
          </Field>
          <Field label={form.type === "Percentage" ? "Percent off *" : "Amount off (₹) *"}>
            <input
              required
              type="number"
              min="0"
              max={form.type === "Percentage" ? 100 : undefined}
              step="1"
              value={form.value}
              onChange={set("value")}
              className={fieldClass}
            />
          </Field>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <Field label="Minimum order (₹)">
            <input type="number" min="0" step="1" value={form.minOrderValue} onChange={set("minOrderValue")} className={fieldClass} />
          </Field>
          <Field
            label="Max discount (₹)"
            hint={form.type === "Percentage" ? "Caps a percentage discount." : "Not used for fixed amounts."}
          >
            <input
              type="number"
              min="0"
              step="1"
              value={form.maxDiscount}
              onChange={set("maxDiscount")}
              placeholder="No cap"
              className={fieldClass}
            />
          </Field>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <Field label="Starts on" hint="Blank = active immediately.">
            <input type="date" value={form.startsAt} onChange={set("startsAt")} className={fieldClass} />
          </Field>
          <Field label="Expires on" hint="Blank = never expires.">
            <input type="date" value={form.expiresAt} onChange={set("expiresAt")} className={fieldClass} />
          </Field>
        </div>

        <Field label="Usage limit" hint="Total redemptions across all customers. Blank = unlimited.">
          <input type="number" min="0" step="1" value={form.usageLimit} onChange={set("usageLimit")} placeholder="Unlimited" className={fieldClass} />
        </Field>

        <div className="space-y-2 rounded-xl bg-secondary/50 p-4">
          <label className="flex items-center gap-2 text-sm font-medium">
            <input type="checkbox" checked={form.freeShipping} onChange={set("freeShipping")} className="h-4 w-4 rounded border-input" />
            Also waive the shipping fee
          </label>
          <label className="flex items-center gap-2 text-sm font-medium">
            <input type="checkbox" checked={form.isPublic} onChange={set("isPublic")} className="h-4 w-4 rounded border-input" />
            Advertise in the storefront
          </label>
          <label className="flex items-center gap-2 text-sm font-medium">
            <input type="checkbox" checked={form.isActive} onChange={set("isActive")} className="h-4 w-4 rounded border-input" />
            Active
          </label>
        </div>

        <div className="flex gap-3 pt-2">
          <button type="button" onClick={onClose} className="btn-outline flex-1">
            Cancel
          </button>
          <button type="submit" disabled={busy} className="btn-primary flex-1 disabled:opacity-60">
            {busy ? "Saving…" : coupon ? "Save changes" : "Create coupon"}
          </button>
        </div>
      </form>
    </Modal>
  );
}
