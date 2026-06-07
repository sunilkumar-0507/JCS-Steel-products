import { useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Search, SlidersHorizontal } from "lucide-react";
import { PageHeader } from "@/components/ui.jsx";
import ProductCard from "@/components/ProductCard.jsx";
import { products, categories } from "@/data/products";

const sortOptions = [
  { value: "featured", label: "Featured" },
  { value: "price-asc", label: "Price: Low to High" },
  { value: "price-desc", label: "Price: High to Low" },
  { value: "rating", label: "Top Rated" },
];

export default function Products() {
  const [params, setParams] = useSearchParams();
  const initialQ = params.get("q") || "";
  const [query, setQuery] = useState(initialQ);
  const [cat, setCat] = useState("all");
  const [sort, setSort] = useState("featured");

  const filtered = useMemo(() => {
    let list = [...products];
    if (cat !== "all") list = list.filter((p) => p.category === cat);
    if (query.trim()) {
      const q = query.toLowerCase();
      list = list.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q)
      );
    }
    if (sort === "price-asc") list.sort((a, b) => a.price - b.price);
    if (sort === "price-desc") list.sort((a, b) => b.price - a.price);
    if (sort === "rating") list.sort((a, b) => b.rating - a.rating);
    return list;
  }, [query, cat, sort]);

  return (
    <>
      <PageHeader
        eyebrow="Curated Collection"
        title="All Products"
        subtitle="Shop our complete collection of factory-direct stainless steel kitchenware."
      />

      <section className="section">
        <div className="container-px">
          {/* controls */}
          <div className="mb-8 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="relative max-w-md flex-1">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <input
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                  setParams(e.target.value ? { q: e.target.value } : {});
                }}
                placeholder="Search products..."
                className="w-full rounded-full border border-border bg-card py-2.5 pl-10 pr-4 text-sm outline-none focus:border-primary"
              />
            </div>
            <div className="flex items-center gap-2">
              <SlidersHorizontal className="h-4 w-4 text-muted-foreground" />
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value)}
                className="rounded-full border border-border bg-card px-4 py-2.5 text-sm outline-none focus:border-primary"
              >
                {sortOptions.map((o) => (
                  <option key={o.value} value={o.value}>
                    {o.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* category pills */}
          <div className="mb-8 flex flex-wrap gap-2">
            <Pill active={cat === "all"} onClick={() => setCat("all")}>
              All
            </Pill>
            {categories.map((c) => (
              <Pill key={c.id} active={cat === c.id} onClick={() => setCat(c.id)}>
                {c.name}
              </Pill>
            ))}
          </div>

          {filtered.length > 0 ? (
            <div className="grid grid-cols-2 gap-5 lg:grid-cols-4">
              {filtered.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          ) : (
            <div className="py-20 text-center">
              <p className="font-display text-2xl">No products found</p>
              <p className="mt-2 text-muted-foreground">Try a different search term.</p>
            </div>
          )}
        </div>
      </section>
    </>
  );
}

function Pill({ active, onClick, children }) {
  return (
    <button
      onClick={onClick}
      className={`rounded-full border px-4 py-2 text-sm font-medium transition ${
        active
          ? "border-primary bg-primary text-primary-foreground"
          : "border-border bg-card text-foreground hover:border-primary"
      }`}
    >
      {children}
    </button>
  );
}
