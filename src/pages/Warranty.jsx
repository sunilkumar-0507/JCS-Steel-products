import { PolicyLayout, PolicySection } from "@/components/ui.jsx";
import { ShieldCheck, CheckCircle2, XCircle } from "lucide-react";

const coverage = [
  { product: "Insulated Bottles", period: "2 Years", covers: "Insulation performance, leakage, manufacturing defects" },
  { product: "Tiffins & Lunch Boxes", period: "1 Year", covers: "Lid seal, structural integrity" },
  { product: "Drinkware", period: "1 Year", covers: "Manufacturing defects, finish quality" },
  { product: "Storage Containers", period: "1 Year", covers: "Locking mechanism, seal integrity, structural defects" },
  { product: "Bowls & Serving", period: "6 Months", covers: "Manufacturing defects, finish quality" },
];

const covered = [
  "Manufacturing defects",
  "Double-wall integrity, manufacturing defects",
  "Workmanship issues",
  "Seal & locking mechanism failures",
];

const notCovered = [
  "Normal wear and tear from regular use",
  "Damage from drops, impacts, or accidents",
  "Damage from improper use (e.g., microwave, direct flame)",
  "Minor scratches or cosmetic imperfections from use",
  "Discoloration from exposure to harsh chemicals or bleach",
  "Products purchased from unauthorized sellers",
];

const claim = [
  "Contact us with your order details and a description of the issue.",
  "Our team will verify your purchase and assess the warranty claim. We may request additional photos or videos of the defect.",
  "If your claim is approved, we will offer a replacement product or repair. In some cases, we may provide a store credit for the product value.",
];

export default function Warranty() {
  return (
    <PolicyLayout eyebrow="Quality Promise" title="Warranty & Care" updated="December 2024">
      <p className="leading-relaxed text-muted-foreground">
        Every JCS Home product is backed by our quality guarantee. We stand behind the
        craftsmanship and durability of our stainless steel kitchenware. We offer up to 2
        years warranty against manufacturing defects, depending on the product.
      </p>

      <PolicySection title="Warranty Coverage by Product">
        <div className="overflow-hidden rounded-xl border border-border">
          <table className="w-full text-sm">
            <thead className="bg-secondary text-left">
              <tr>
                <th className="p-3 font-semibold">Product</th>
                <th className="p-3 font-semibold">Warranty Period</th>
                <th className="p-3 font-semibold">Coverage</th>
              </tr>
            </thead>
            <tbody>
              {coverage.map((c) => (
                <tr key={c.product} className="border-t border-border">
                  <td className="p-3 font-medium">{c.product}</td>
                  <td className="p-3 font-medium text-primary">{c.period}</td>
                  <td className="p-3 text-muted-foreground">{c.covers}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </PolicySection>

      <div className="grid gap-6 md:grid-cols-2">
        <div className="rounded-2xl border border-border bg-card p-6">
          <h3 className="flex items-center gap-2 font-display text-xl text-accent">
            <CheckCircle2 className="h-5 w-5" /> What is Covered
          </h3>
          <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
            {covered.map((t) => (
              <li key={t} className="flex gap-2">
                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-accent" /> {t}
              </li>
            ))}
          </ul>
        </div>
        <div className="rounded-2xl border border-border bg-card p-6">
          <h3 className="flex items-center gap-2 font-display text-xl text-destructive">
            <XCircle className="h-5 w-5" /> What is NOT Covered
          </h3>
          <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
            {notCovered.map((t) => (
              <li key={t} className="flex gap-2">
                <XCircle className="mt-0.5 h-4 w-4 shrink-0 text-destructive" /> {t}
              </li>
            ))}
          </ul>
        </div>
      </div>

      <PolicySection title="How to Claim Warranty">
        <ol className="list-decimal space-y-2 pl-5">
          {claim.map((c) => (
            <li key={c}>{c}</li>
          ))}
        </ol>
      </PolicySection>

      <PolicySection title="Care Tips for Longevity">
        <ul className="list-disc space-y-1 pl-5">
          <li>Hand wash with mild soap and warm water for best results</li>
          <li>Avoid abrasive cleaners or steel wool</li>
          <li>Dry thoroughly after washing to prevent water spots</li>
          <li>Do not use in microwave or expose to direct flame</li>
          <li>For insulated products, do not overfill with hot liquids</li>
          <li>Store in a dry place away from direct sunlight</li>
        </ul>
      </PolicySection>

      <div className="flex items-center gap-3 rounded-xl bg-secondary p-5">
        <ShieldCheck className="h-6 w-6 text-primary" />
        <p className="text-sm">
          Warranty questions? For warranty claims, contact us at{" "}
          <a className="text-primary hover:underline" href="mailto:hello@jcshome.in">hello@jcshome.in</a> or +91 93607 33544.
        </p>
      </div>
    </PolicyLayout>
  );
}
