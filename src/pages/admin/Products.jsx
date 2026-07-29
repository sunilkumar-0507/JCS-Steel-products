import { useState } from "react";
import { Plus, Trash2, Pencil, Search } from "lucide-react";
import { api, formatPrice } from "@/lib/api";
import { productImage } from "@/lib/images";
import { useStore } from "@/context/StoreContext";
import { Async, Card, Table, Td, EmptyRow, Modal, Field, fieldClass, useApi } from "./shared.jsx";

const emptyDraft = {
  name: "", categoryId: "", price: "", compareAt: "", image: "",
  badge: "", features: "", description: "", stock: 100, isActive: true,
};

export default function AdminProducts() {
  const { categories, reloadCatalog, toast, reportError } = useStore();
  const list = useApi(() => api.products({ pageSize: 200 }), []);
  const [editing, setEditing] = useState(null); // product | "new" | null
  const [query, setQuery] = useState("");

  const products = list.data?.items || [];
  const filtered = query.trim()
    ? products.filter((p) => p.name.toLowerCase().includes(query.trim().toLowerCase()))
    : products;

  const refresh = async () => {
    await list.reload();
    reloadCatalog();
  };

  const remove = async (product) => {
    if (!window.confirm(`Delete "${product.name}"? This cannot be undone.`)) return;
    try {
      await api.admin.deleteProduct(product.id);
      toast("Product deleted");
      refresh();
    } catch (err) {
      reportError(err, "Could not delete that product.");
    }
  };

  return (
    <>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="relative max-w-xs flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search products…"
            className="w-full rounded-full border border-border bg-card py-2 pl-9 pr-4 text-sm outline-none focus:border-primary"
          />
        </div>
        <button onClick={() => setEditing("new")} className="btn-primary">
          <Plus className="h-4 w-4" /> Add Product
        </button>
      </div>

      <Card title="Products" subtitle={`${products.length} items in catalog`}>
        <Async loading={list.loading} error={list.error} onRetry={list.reload} label="Loading catalog…">
          <Table head={["Product", "Category", "Price", "MRP", "Stock", "Rating", ""]} minWidth={820}>
            {filtered.map((p) => (
              <tr key={p.id} className="border-t border-border">
                <Td>
                  <div className="flex items-center gap-3">
                    <img
                      src={productImage(p)}
                      alt={p.name}
                      className="h-10 w-10 shrink-0 rounded-lg object-cover"
                    />
                    <div className="min-w-0">
                      <p className="truncate font-medium">{p.name}</p>
                      {!p.isActive && (
                        <span className="text-xs text-muted-foreground">Hidden from storefront</span>
                      )}
                    </div>
                  </div>
                </Td>
                <Td className="capitalize text-muted-foreground">
                  {categories.find((c) => c.id === p.categoryId)?.name ||
                    p.categoryId.replace(/-/g, " ")}
                </Td>
                <Td className="font-semibold">{formatPrice(p.price)}</Td>
                <Td className="text-muted-foreground line-through">
                  {p.compareAt ? formatPrice(p.compareAt) : "—"}
                </Td>
                <Td>
                  <span
                    className={`inline-flex whitespace-nowrap rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                      p.stock <= 0
                        ? "bg-destructive/10 text-destructive"
                        : p.stock <= 10
                        ? "bg-amber-100 text-amber-700"
                        : "bg-accent/15 text-accent"
                    }`}
                  >
                    {p.stock <= 0 ? "Out of stock" : `${p.stock} in stock`}
                  </span>
                </Td>
                <Td className="whitespace-nowrap">★ {p.rating}</Td>
                <Td>
                  <div className="flex gap-1">
                    <button
                      onClick={() => setEditing(p)}
                      className="rounded-lg p-2 text-muted-foreground transition hover:bg-muted hover:text-primary"
                      aria-label={`Edit ${p.name}`}
                    >
                      <Pencil className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => remove(p)}
                      className="rounded-lg p-2 text-muted-foreground transition hover:bg-destructive/10 hover:text-destructive"
                      aria-label={`Delete ${p.name}`}
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </Td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <EmptyRow colSpan={7}>
                {query ? "No products match that search." : "No products yet."}
              </EmptyRow>
            )}
          </Table>
        </Async>
      </Card>

      {editing && (
        <ProductModal
          product={editing === "new" ? null : editing}
          categories={categories}
          onClose={() => setEditing(null)}
          onSaved={() => {
            setEditing(null);
            refresh();
          }}
        />
      )}
    </>
  );
}

function ProductModal({ product, categories, onClose, onSaved }) {
  const { toast, reportError } = useStore();
  const [busy, setBusy] = useState(false);
  const [form, setForm] = useState(() =>
    product
      ? {
          name: product.name,
          categoryId: product.categoryId,
          price: String(product.price),
          compareAt: product.compareAt ? String(product.compareAt) : "",
          image: product.image || "",
          badge: product.badge || "",
          features: (product.features || []).join(", "),
          description: product.description || "",
          stock: product.stock,
          isActive: product.isActive,
        }
      : { ...emptyDraft, categoryId: categories[0]?.id || "" }
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
      name: form.name.trim(),
      categoryId: form.categoryId,
      price: Number(form.price) || 0,
      compareAt: form.compareAt ? Number(form.compareAt) : null,
      image: form.image.trim() || null,
      badge: form.badge.trim() || null,
      features: form.features.split(",").map((f) => f.trim()).filter(Boolean),
      description: form.description.trim(),
      stock: Number(form.stock) || 0,
      isActive: form.isActive,
    };
    try {
      if (product) await api.admin.updateProduct(product.id, payload);
      else await api.admin.createProduct(payload);
      toast(product ? "Product updated" : "Product added");
      onSaved();
    } catch (err) {
      reportError(err, "Could not save the product.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <Modal
      title={product ? "Edit product" : "Add product"}
      subtitle={product ? product.id : "It will appear in the storefront immediately."}
      onClose={onClose}
    >
      <form onSubmit={submit} className="space-y-4">
        <Field label="Product name *">
          <input required value={form.name} onChange={set("name")} placeholder="Vacuum Insulated Bottle 750ml" className={fieldClass} />
        </Field>

        <Field label="Category *">
          <select required value={form.categoryId} onChange={set("categoryId")} className={fieldClass}>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </Field>

        <div className="grid grid-cols-2 gap-4">
          <Field label="Price (₹) *">
            <input required type="number" min="0" step="1" value={form.price} onChange={set("price")} placeholder="899" className={fieldClass} />
          </Field>
          <Field label="MRP / Compare-at (₹)">
            <input type="number" min="0" step="1" value={form.compareAt} onChange={set("compareAt")} placeholder="1199" className={fieldClass} />
          </Field>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <Field label="Stock">
            <input type="number" min="0" value={form.stock} onChange={set("stock")} className={fieldClass} />
          </Field>
          <Field label="Badge">
            <input value={form.badge} onChange={set("badge")} placeholder="Bestseller (optional)" className={fieldClass} />
          </Field>
        </div>

        <Field label="Image URL" hint="Leave blank to use the default photo for this category.">
          <input value={form.image} onChange={set("image")} placeholder="https://…" className={fieldClass} />
        </Field>

        <Field label="Features" hint="Comma separated.">
          <input value={form.features} onChange={set("features")} placeholder="24hr Cold, Double-Wall, Leak-Proof" className={fieldClass} />
        </Field>

        <Field label="Description">
          <textarea rows={3} value={form.description} onChange={set("description")} placeholder="Short product description…" className={fieldClass} />
        </Field>

        {product && (
          <label className="flex items-center gap-2 text-sm font-medium">
            <input type="checkbox" checked={form.isActive} onChange={set("isActive")} className="h-4 w-4 rounded border-input" />
            Visible in the storefront
          </label>
        )}

        <div className="flex gap-3 pt-2">
          <button type="button" onClick={onClose} className="btn-outline flex-1">
            Cancel
          </button>
          <button type="submit" disabled={busy} className="btn-primary flex-1 disabled:opacity-60">
            {busy ? "Saving…" : product ? "Save changes" : "Add product"}
          </button>
        </div>
      </form>
    </Modal>
  );
}
