import { useParams, Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Crumbs } from "@/components/ui.jsx";
import ProductCard from "@/components/ProductCard.jsx";
import { getByCategory, getCategory } from "@/data/products";

export default function Category() {
  const { id } = useParams();
  const category = getCategory(id);
  const items = getByCategory(id);

  if (!category) {
    return (
      <div className="container-px py-24 text-center">
        <h1 className="font-display text-3xl">Category not found</h1>
        <Link to="/products" className="btn-primary mt-6">
          Browse all products
        </Link>
      </div>
    );
  }

  return (
    <>
      {/* hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0">
          <img src={category.image} alt={category.name} className="h-full w-full object-cover" />
          <div className="absolute inset-0 bg-foreground/65" />
        </div>
        <div className="container-px relative py-20 text-center text-background sm:py-28">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary-foreground/80">
            {category.tagline}
          </p>
          <h1 className="mt-3 font-display text-4xl sm:text-5xl">{category.name}</h1>
          <p className="mx-auto mt-4 max-w-2xl text-background/80">{category.description}</p>
        </div>
      </section>

      <Crumbs
        items={[
          { label: "Home", to: "/" },
          { label: "Products", to: "/products" },
          { label: category.name },
        ]}
      />

      <section className="pb-20">
        <div className="container-px">
          {items.length > 0 ? (
            <div className="grid grid-cols-2 gap-5 lg:grid-cols-4">
              {items.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          ) : (
            <div className="py-16 text-center">
              <p className="font-display text-2xl">No products found in this category</p>
              <p className="mt-2 text-muted-foreground">Check back soon!</p>
            </div>
          )}

          <div className="mt-12 text-center">
            <Link to="/products" className="btn-outline">
              <ArrowLeft className="h-4 w-4" /> Browse all products
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
