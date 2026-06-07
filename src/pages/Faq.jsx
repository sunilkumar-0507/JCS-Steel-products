import { useState } from "react";
import { Link } from "react-router-dom";
import { ChevronDown, Phone, Mail } from "lucide-react";
import { PageHeader } from "@/components/ui.jsx";

const groups = [
  {
    title: "Products & Quality",
    faqs: [
      {
        q: "What grade of stainless steel do you use?",
        a: "We use only 304 food-grade stainless steel — the same grade used in premium cookware worldwide. It's safe, hygienic, and leaves no metal taste.",
      },
      {
        q: "Are your products safe for food storage?",
        a: "Yes. Food-grade 304 steel is safe and hygienic for food storage. Our products are food-safe and BPA-free.",
      },
      {
        q: "Do your tiffins leak?",
        a: "Our tiffins feature precision-engineered silicone seals and locking mechanisms designed to be 100% leak-proof. Each tiffin is tested before shipping. For best results, ensure the lid is properly aligned and all locks are engaged.",
      },
      {
        q: "How long do insulated bottles keep drinks cold/hot?",
        a: "Double-wall vacuum technology keeps drinks cold for 24 hours and hot for 12 hours. Every bottle is tested for 24-hour temperature retention.",
      },
      {
        q: "Why does my new bottle have a slight smell?",
        a: "New stainless steel products may have a faint manufacturing smell. This is normal and safe. Simply wash with warm soapy water, rinse with a solution of baking soda and water, and air dry. The smell will disappear after 1-2 washes.",
      },
    ],
  },
  {
    title: "Ordering & Payment",
    faqs: [
      {
        q: "What payment methods do you accept?",
        a: "We accept Credit/Debit Cards (Visa, Mastercard, RuPay), UPI (Google Pay, PhonePe, Paytm), Net Banking, and Cash on Delivery (COD) for eligible orders. All online payments are processed securely through Razorpay.",
      },
      {
        q: "Is Cash on Delivery available?",
        a: "Yes, Cash on Delivery is available for eligible orders. Enter your pin code at checkout to confirm availability for your location.",
      },
      {
        q: "Do you sell on Amazon or Flipkart?",
        a: "Currently, we sell exclusively through our website jcshome.in. This allows us to offer the best prices directly to you. We may expand to marketplaces in the future, but our website will always have the best deals.",
      },
      {
        q: "Why should I buy from JCS Home instead of other brands?",
        a: "We are the actual manufacturer. We manufacture everything in-house — no middlemen means better prices and quality you can trust for generations.",
      },
    ],
  },
  {
    title: "Shipping & Delivery",
    faqs: [
      {
        q: "How long does delivery take?",
        a: "Delivery times vary by location: Metro cities (Chennai, Bangalore, Mumbai, Delhi, etc.) receive orders in 2-4 days. Tier 2 cities take 4-6 days, and other locations may take 6-10 days. Orders are processed within 1-2 business days.",
      },
      {
        q: "Do you offer free shipping?",
        a: "Yes, we offer free shipping with no minimum order for standard shipping across India.",
      },
      {
        q: "Do you ship internationally?",
        a: "Currently we deliver across India to all serviceable pin codes. International shipping is not available at this time.",
      },
      {
        q: "How do I track my order?",
        a: "Once your order is shipped, you'll receive an email confirmation with a tracking number plus SMS updates on delivery status and real-time delivery updates.",
      },
    ],
  },
  {
    title: "Returns & Warranty",
    faqs: [
      {
        q: "What is your return policy?",
        a: "Easy 7-day return policy. Products must be unused and in original packaging. Refunds are processed within 5-7 business days of us receiving and inspecting the returned product.",
      },
      {
        q: "What warranty do you offer?",
        a: "We offer up to 2 years warranty depending on the product. Insulated bottles have a 2-year warranty, tiffins and drinkware have 1-year warranty, and bowls have a 6-month warranty. The warranty covers manufacturing defects and workmanship issues.",
      },
      {
        q: "How do I claim warranty?",
        a: "Contact our customer support with your order details and photos/videos of the defect. Our team will verify your purchase and assess the warranty claim. If approved, we'll offer a replacement, repair, or store credit.",
      },
      {
        q: "Can I exchange for a different product?",
        a: "Yes, exchanges are available for size/color variations subject to availability. If you want a completely different product, we recommend returning for a refund and placing a new order.",
      },
    ],
  },
  {
    title: "Care & Maintenance",
    faqs: [
      {
        q: "How should I clean my stainless steel products?",
        a: "Hand wash with mild dish soap and warm water. Avoid abrasive scrubbers that can scratch the surface. For stubborn stains, use a paste of baking soda and water. Dry thoroughly after washing to prevent water spots.",
      },
      {
        q: "Are your products dishwasher safe?",
        a: "While technically dishwasher safe, we recommend hand washing for best results and longevity. Harsh dishwasher detergents can affect the finish over time. For insulated bottles, hand washing is recommended to protect the vacuum seal.",
      },
      {
        q: "Can I put stainless steel in the microwave?",
        a: "No, never put stainless steel in a microwave. Metal reflects microwaves and can cause sparks and damage to the appliance. Transfer food to a microwave-safe container before heating.",
      },
    ],
  },
];

function Item({ q, a }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b border-border last:border-0">
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex w-full items-center justify-between gap-4 py-5 text-left"
      >
        <span className="font-medium text-foreground">{q}</span>
        <ChevronDown
          className={`h-5 w-5 shrink-0 text-primary transition-transform ${open ? "rotate-180" : ""}`}
        />
      </button>
      {open && <p className="pb-5 pr-8 text-muted-foreground">{a}</p>}
    </div>
  );
}

export default function Faq() {
  return (
    <>
      <PageHeader
        eyebrow="Help Center"
        title="Frequently Asked Questions"
        subtitle="Find answers to common questions about JCS Home products, ordering, shipping, returns, warranty, and more."
      />

      <section className="section">
        <div className="container-px mx-auto max-w-3xl space-y-12">
          {groups.map((g) => (
            <div key={g.title}>
              <h2 className="font-display text-2xl text-primary">{g.title}</h2>
              <div className="mt-3 rounded-2xl border border-border bg-card px-6 shadow-sm">
                {g.faqs.map((f) => (
                  <Item key={f.q} {...f} />
                ))}
              </div>
            </div>
          ))}

          <div className="rounded-2xl bg-secondary p-8 text-center">
            <h3 className="font-display text-2xl">Still have questions?</h3>
            <p className="mt-2 text-muted-foreground">
              Our team is here to help. Reach out and we'll get back to you quickly.
            </p>
            <div className="mt-6 flex flex-wrap justify-center gap-3">
              <a href="tel:+919360733544" className="btn-primary">
                <Phone className="h-4 w-4" /> Call +91 93607 33544
              </a>
              <a href="mailto:hello@jcshome.in" className="btn-outline">
                <Mail className="h-4 w-4" /> Email Support
              </a>
            </div>
            <p className="mt-4 text-sm text-muted-foreground">
              Looking for bulk orders?{" "}
              <Link to="/bulk-orders" className="font-medium text-primary hover:underline">
                Contact our B2B team
              </Link>
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
