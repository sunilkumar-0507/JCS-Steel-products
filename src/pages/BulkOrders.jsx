import { useState } from "react";
import {
  Building2,
  BadgePercent,
  Paintbrush,
  Headset,
  Package,
  Gift,
  CheckCircle2,
  Phone,
} from "lucide-react";
import { PageHeader } from "@/components/ui.jsx";
import { useStore } from "@/context/StoreContext";

const benefits = [
  { icon: BadgePercent, title: "Best Wholesale Rates", text: "Best wholesale rates with no middlemen — factory-direct pricing." },
  { icon: Paintbrush, title: "Custom Branding", text: "Add custom engraving or branding on bulk orders. Logo printing and custom packaging available." },
  { icon: Headset, title: "Dedicated Support", text: "Personal account manager for bulk orders and priority support." },
  { icon: Package, title: "Same Premium Quality", text: "Same premium quality at scale — every piece built to last." },
];

const useCases = [
  { icon: Gift, title: "Corporate Gifting", text: "Branded bulk orders for your team and corporate gifting programs." },
  { icon: Building2, title: "Hotels & Hospitality", text: "Durable stainless steel essentials for hotels and the hospitality industry." },
  { icon: Package, title: "Retail & Distribution", text: "Best wholesale rates for retail and distribution partners." },
];

const quantities = ["50 - 100 units", "100 - 250 units", "250 - 500 units", "500 - 1000 units", "1000+ units"];
const interests = ["Insulated Bottles", "Tiffins & Lunch Boxes", "Drinkware", "Storage Containers", "Bowls & Serving", "Festive & Gifting", "Mixed / Custom Selection"];

export default function BulkOrders() {
  const { toast } = useStore();
  const [submitting, setSubmitting] = useState(false);

  const onSubmit = (e) => {
    e.preventDefault();
    setSubmitting(true);
    setTimeout(() => {
      setSubmitting(false);
      toast("Inquiry submitted! Our B2B team will respond within 24 hours.");
      e.target.reset();
    }, 900);
  };

  return (
    <>
      <PageHeader
        eyebrow="B2B Partnership"
        title="Bulk Orders & Corporate Gifting"
        subtitle="Partner with the manufacturer. Get factory-direct pricing, custom branding, and dedicated support for orders of 50+ units."
      />

      {/* benefits */}
      <section className="section">
        <div className="container-px">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {benefits.map((b) => (
              <div key={b.title} className="rounded-2xl border border-border bg-card p-6 shadow-sm">
                <div className="inline-flex rounded-xl bg-primary/10 p-3 text-primary">
                  <b.icon className="h-6 w-6" />
                </div>
                <h3 className="mt-4 font-display text-lg">{b.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{b.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* use cases */}
      <section className="section bg-secondary/40">
        <div className="container-px">
          <h2 className="text-center font-display text-3xl sm:text-4xl">Why partner with us</h2>
          <p className="mx-auto mt-3 max-w-2xl text-center text-muted-foreground">
            From corporate gifting programs to hospitality and retail — we deliver premium
            steel at scale.
          </p>
          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {useCases.map((u) => (
              <div key={u.title} className="rounded-2xl bg-card p-7 text-center shadow-sm">
                <div className="mx-auto inline-flex rounded-full bg-accent/10 p-4 text-accent">
                  <u.icon className="h-7 w-7" />
                </div>
                <h3 className="mt-4 font-display text-xl">{u.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{u.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* form */}
      <section className="section">
        <div className="container-px grid gap-12 lg:grid-cols-2">
          <div>
            <p className="eyebrow">Contact Our B2B Team</p>
            <h2 className="mt-3 font-display text-3xl sm:text-4xl">Request a quote</h2>
            <p className="mt-4 text-muted-foreground">
              Fill in your details and our B2B team will get back to you within 24 hours
              with a customized quote.
            </p>
            <ul className="mt-8 space-y-4">
              {[
                "Special pricing for orders of 50+ units",
                "Custom branding, dedicated packaging, and priority support",
                "Our B2B team will review your requirements",
              ].map((t) => (
                <li key={t} className="flex gap-3 text-sm">
                  <CheckCircle2 className="h-5 w-5 shrink-0 text-accent" />
                  <span className="text-muted-foreground">{t}</span>
                </li>
              ))}
            </ul>
            <div className="mt-8 flex items-center gap-3 rounded-xl border border-border bg-secondary/50 p-4">
              <Phone className="h-5 w-5 text-primary" />
              <div>
                <p className="text-sm font-semibold">Prefer to talk? Call us:</p>
                <a href="tel:+919360733544" className="text-sm text-muted-foreground hover:text-primary">
                  +91 93607 33544
                </a>
              </div>
            </div>
          </div>

          <form onSubmit={onSubmit} className="rounded-2xl border border-border bg-card p-6 shadow-sm sm:p-8">
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Contact Person *">
                <input required className="field" placeholder="Your name" />
              </Field>
              <Field label="Company Name">
                <input className="field" placeholder="Your company name" />
              </Field>
              <Field label="Email *">
                <input required type="email" className="field" placeholder="you@company.com" />
              </Field>
              <Field label="Phone *">
                <input required className="field" placeholder="+91 ..." />
              </Field>
              <Field label="Quantity">
                <select className="field">
                  {quantities.map((q) => (
                    <option key={q}>{q}</option>
                  ))}
                </select>
              </Field>
              <Field label="Products of Interest">
                <select className="field">
                  {interests.map((i) => (
                    <option key={i}>{i}</option>
                  ))}
                </select>
              </Field>
            </div>
            <Field label="Additional Requirements" className="mt-4">
              <textarea
                rows={4}
                className="field resize-none"
                placeholder="Tell us about your requirements — custom branding, specific products, delivery timeline, etc."
              />
            </Field>
            <button disabled={submitting} className="btn-primary mt-6 w-full">
              {submitting ? "Submitting..." : "Submit Inquiry"}
            </button>
          </form>
        </div>
      </section>

      <style>{`.field{width:100%;border:1px solid hsl(var(--input));border-radius:0.5rem;background:hsl(var(--background));padding:0.65rem 0.85rem;font-size:0.875rem;outline:none}.field:focus{border-color:hsl(var(--primary))}`}</style>
    </>
  );
}

function Field({ label, children, className = "" }) {
  return (
    <label className={`block ${className}`}>
      <span className="mb-1.5 block text-sm font-medium">{label}</span>
      {children}
    </label>
  );
}
