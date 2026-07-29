import { useCallback, useEffect, useState } from "react";
import { X } from "lucide-react";
import { Loader, ErrorState } from "@/components/ui.jsx";

/* ---------- data loading ---------- */

/**
 * Runs an API call on mount and exposes { data, loading, error, reload }.
 * `deps` behaves like a useEffect dependency list.
 */
export function useApi(loader, deps = []) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const run = useCallback(async () => {
    setLoading(true);
    try {
      setData(await loader());
      setError(null);
    } catch (err) {
      setError(err?.message || "Could not load this data.");
    } finally {
      setLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  useEffect(() => {
    run();
  }, [run]);

  return { data, loading, error, reload: run, setData };
}

/** Wraps a section so every admin panel handles loading/error the same way. */
export function Async({ loading, error, onRetry, children, label = "Loading…" }) {
  if (loading) return <Loader label={label} />;
  if (error) return <ErrorState message={error} onRetry={onRetry} />;
  return children;
}

/* ---------- layout ---------- */

export function Card({ title, subtitle, action, children }) {
  return (
    <section className="rounded-2xl border border-border bg-card shadow-sm">
      {(title || action) && (
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border px-5 py-4 sm:px-6">
          <div>
            <h2 className="font-display text-xl">{title}</h2>
            {subtitle && <p className="text-sm text-muted-foreground">{subtitle}</p>}
          </div>
          {action}
        </div>
      )}
      <div className="overflow-x-auto">{children}</div>
    </section>
  );
}

export function Table({ head, children, minWidth = 640 }) {
  return (
    <table className="w-full text-left text-sm" style={{ minWidth }}>
      <thead>
        <tr className="text-xs uppercase tracking-wide text-muted-foreground">
          {head.map((h, i) => (
            <th key={i} className="px-5 py-3 font-semibold sm:px-6">
              {h}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>{children}</tbody>
    </table>
  );
}

export function Td({ children, className = "" }) {
  return <td className={`px-5 py-3.5 sm:px-6 ${className}`}>{children}</td>;
}

export function EmptyRow({ colSpan, children }) {
  return (
    <tr className="border-t border-border">
      <td colSpan={colSpan} className="px-6 py-12 text-center text-sm text-muted-foreground">
        {children}
      </td>
    </tr>
  );
}

/* ---------- status pills ---------- */

export const orderStatusStyles = {
  Delivered: "bg-accent/15 text-accent",
  Shipped: "bg-blue-100 text-blue-700",
  Processing: "bg-amber-100 text-amber-700",
  Confirmed: "bg-indigo-100 text-indigo-700",
  Pending: "bg-muted text-muted-foreground",
  Cancelled: "bg-destructive/10 text-destructive",
};

export const paymentStatusStyles = {
  Paid: "bg-accent/15 text-accent",
  Pending: "bg-amber-100 text-amber-700",
  Failed: "bg-destructive/10 text-destructive",
  Refunded: "bg-muted text-muted-foreground",
};

export const leadStatusStyles = {
  New: "bg-primary/10 text-primary",
  Contacted: "bg-amber-100 text-amber-700",
  Quoted: "bg-blue-100 text-blue-700",
  Closed: "bg-muted text-muted-foreground",
};

export function Pill({ value, styles = orderStatusStyles }) {
  return (
    <span
      className={`inline-flex whitespace-nowrap rounded-full px-2.5 py-0.5 text-xs font-semibold ${
        styles[value] || "bg-muted text-muted-foreground"
      }`}
    >
      {value}
    </span>
  );
}

/* ---------- modal ---------- */

export function Modal({ title, subtitle, onClose, children, wide }) {
  useEffect(() => {
    const onKey = (e) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-foreground/40 backdrop-blur-sm sm:items-center sm:p-6"
      onClick={onClose}
    >
      <div
        className={`max-h-[92vh] w-full overflow-y-auto rounded-t-3xl border border-border bg-card p-6 shadow-xl sm:rounded-3xl sm:p-8 ${
          wide ? "max-w-3xl" : "max-w-lg"
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="font-display text-2xl">{title}</h2>
            {subtitle && <p className="mt-1 text-sm text-muted-foreground">{subtitle}</p>}
          </div>
          <button
            onClick={onClose}
            className="rounded-full p-2 text-muted-foreground transition hover:bg-muted"
            aria-label="Close"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        <div className="mt-6">{children}</div>
      </div>
    </div>
  );
}

/* ---------- form bits ---------- */

export const fieldClass =
  "mt-1.5 w-full rounded-lg border border-input bg-background px-3 py-2.5 text-sm outline-none focus:border-primary";

export function Field({ label, children, className = "", hint }) {
  return (
    <label className={`block text-sm font-medium ${className}`}>
      {label}
      {children}
      {hint && <span className="mt-1 block text-xs font-normal text-muted-foreground">{hint}</span>}
    </label>
  );
}

export function DetailRow({ label, value }) {
  return (
    <div className="flex justify-between gap-4 py-1.5 text-sm">
      <span className="text-muted-foreground">{label}</span>
      <span className="text-right font-medium">{value ?? "—"}</span>
    </div>
  );
}
