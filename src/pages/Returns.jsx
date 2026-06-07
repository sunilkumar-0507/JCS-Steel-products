import { PolicyLayout, PolicySection } from "@/components/ui.jsx";
import { CheckCircle2, XCircle } from "lucide-react";

const eligible = [
  "Return request is made within 7 days of delivery",
  "Product is unused and in original packaging",
  "Product has a manufacturing defect",
  "Product arrived damaged during transit",
  "Wrong product was delivered",
  "Product does not match the description",
];

const notEligible = [
  "Return request is made after 7 days of delivery",
  "Product has been used or shows signs of use",
  "Original packaging is missing or damaged by customer",
  "Product labels or tags have been removed",
  "Product is from the Festive/Gifting collection (unless defective)",
  "Products purchased from unauthorized sellers",
];

const steps = [
  { title: "Initiate Return", text: "Contact us within 7 days of delivery. Our team will review your request and send a return authorization within 24 hours. For defects, we may ask for photos." },
  { title: "Ship the Product", text: "Pack the product securely in its original packaging. We will arrange a reverse pickup at no extra cost for eligible returns." },
  { title: "Receive Refund/Exchange", text: "Once we receive and inspect the product, we will process your refund or exchange within 5-7 business days." },
];

export default function Returns() {
  return (
    <PolicyLayout eyebrow="Customer Care" title="Returns & Refunds" updated="December 2024">
      <p className="leading-relaxed text-muted-foreground">
        We want you to love your purchase. If something is not right, we are here to make
        it right with an easy, hassle-free 7-day return process.
      </p>

      <div className="grid gap-6 md:grid-cols-2">
        <div className="rounded-2xl border border-border bg-card p-6">
          <h3 className="flex items-center gap-2 font-display text-xl text-accent">
            <CheckCircle2 className="h-5 w-5" /> Eligible for Return
          </h3>
          <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
            {eligible.map((t) => (
              <li key={t} className="flex gap-2">
                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-accent" /> {t}
              </li>
            ))}
          </ul>
        </div>
        <div className="rounded-2xl border border-border bg-card p-6">
          <h3 className="flex items-center gap-2 font-display text-xl text-destructive">
            <XCircle className="h-5 w-5" /> Not Eligible for Return
          </h3>
          <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
            {notEligible.map((t) => (
              <li key={t} className="flex gap-2">
                <XCircle className="mt-0.5 h-4 w-4 shrink-0 text-destructive" /> {t}
              </li>
            ))}
          </ul>
        </div>
      </div>

      <PolicySection title="How to Return & Get a Refund">
        <div className="grid gap-4 sm:grid-cols-3">
          {steps.map((s, i) => (
            <div key={s.title} className="rounded-xl bg-secondary/50 p-5">
              <span className="font-display text-2xl text-primary">{i + 1}</span>
              <h4 className="mt-1 font-semibold text-foreground">{s.title}</h4>
              <p className="mt-1 text-sm">{s.text}</p>
            </div>
          ))}
        </div>
      </PolicySection>

      <PolicySection title="Refund Timeline">
        <p>Once we receive and inspect the returned product, refunds are processed within 5-7 business days. UPI/Net Banking refunds reflect in 3-5 days, card refunds in 5-7 days, and COD refunds to your bank account in 7-10 days.</p>
      </PolicySection>

      <PolicySection title="Exchange Policy">
        <p>We offer exchanges for size or color variations (subject to availability). If you prefer a different product, you can opt for a refund and place a new order.</p>
      </PolicySection>

      <PolicySection title="Need Help?">
        <p>For return or refund queries, contact us at <a className="text-primary hover:underline" href="mailto:hello@jcshome.in">hello@jcshome.in</a> or call +91 93607 33544.</p>
      </PolicySection>
    </PolicyLayout>
  );
}
