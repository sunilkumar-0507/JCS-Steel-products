import { Link } from "react-router-dom";
import {
  ArrowRight,
  ShieldCheck,
  Factory,
  Truck,
  Leaf,
  Recycle,
  Award,
  Gift,
  Building2,
  CheckCircle2,
  Sparkles,
  Thermometer,
} from "lucide-react";
import { SectionHeading } from "@/components/ui.jsx";
import ProductCard from "@/components/ProductCard.jsx";
import { products, categories } from "@/data/products";
import heroPremium from "@/assets/hero-premium.jpg";
import rawMaterial from "@/assets/raw-material.jpg";
import factoryProcess from "@/assets/factory-process.jpg";
import qualityCheck from "@/assets/quality-check.jpg";
import finalProducts from "@/assets/final-products.jpg";

const marquee = [
  "Built to Last",
  "Factory Direct",
  "304 Food-Grade Steel",
  "2-Year Warranty",
  "Free Shipping",
  "Made in India",
];

const valueProps = [
  {
    icon: ShieldCheck,
    title: "304 Food-Grade Steel",
    text: "Safe, hygienic, and completely free from any metallic taste or harmful chemicals.",
  },
  {
    icon: Thermometer,
    title: "Lasting Insulation",
    text: "Double-wall designs keep your drinks hot for 12 hours and cold for 24.",
  },
  {
    icon: Factory,
    title: "Factory Direct",
    text: "Made in our own Chennai facility. No middlemen means better prices for you.",
  },
  {
    icon: Recycle,
    title: "Eco-Friendly",
    text: "One purchase, zero plastic waste. Built to last for generations.",
  },
];

const trustBadges = [
  { icon: ShieldCheck, label: "Food-Grade", value: "304 Steel" },
  { icon: Factory, label: "Proudly", value: "Made in India" },
  { icon: Sparkles, label: "Trusted by", value: "10,000+ Families" },
  { icon: Award, label: "Lifetime", value: "Durability" },
];

const process = [
  {
    img: rawMaterial,
    step: "01",
    title: "Steel Sourcing",
    text: "Premium 304 stainless steel sheets sourced from certified mills.",
  },
  {
    img: factoryProcess,
    step: "02",
    title: "Precision Forming",
    text: "Deep-drawn using industrial presses for seamless construction.",
  },
  {
    img: qualityCheck,
    step: "03",
    title: "Quality Check",
    text: "Rigorous leak and durability testing before any product ships.",
  },
  {
    img: finalProducts,
    step: "04",
    title: "Ready for You",
    text: "Carefully packaged and shipped directly to your home.",
  },
];

const stats = [
  { value: "10,000+", label: "Happy Families" },
  { value: "100%", label: "Food-Grade 304" },
  { value: "2 Yr", label: "Warranty" },
  { value: "50%", label: "Less Than Retail" },
];

export default function Home() {
  const featured = products.slice(0, 8);

  return (
    <>
      {/* HERO */}
      <section className="relative isolate overflow-hidden">
        {/* Full-bleed background */}
        <img
          src={heroPremium}
          alt="Premium stainless steel kitchenware"
          className="absolute inset-0 -z-10 h-full w-full object-cover"
        />
        <div className="absolute inset-0 -z-10 bg-gradient-to-b from-foreground/40 via-foreground/10 to-background" />

        <div className="container-px pb-10 pt-16 sm:pt-20">
          {/* Glass card */}
          <div className="max-w-xl animate-fade-up rounded-3xl border border-white/20 bg-white/10 p-7 shadow-xl backdrop-blur-md sm:p-10">
            <span className="inline-flex items-center gap-2 rounded-full bg-foreground/50 px-4 py-1.5 text-xs font-semibold text-white backdrop-blur">
              <Factory className="h-3.5 w-3.5" />
              Factory Direct · Chennai
            </span>
            <h1 className="mt-6 font-display text-4xl leading-[1.02] sm:text-6xl">
              <span className="block text-white drop-shadow-sm">Steel that tells</span>
              <span className="block text-primary">a story of craft.</span>
            </h1>
            <p className="mt-5 max-w-md text-base text-white/85 sm:text-lg">
              Premium 304-grade stainless steel kitchenware, engineered in our Chennai
              factory. No middlemen. Just quality you can trust for generations.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                to="/products"
                className="btn rounded-full bg-white text-foreground shadow-md hover:bg-white/90"
              >
                Shop Collection <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                to="/about"
                className="btn rounded-full border border-white/50 text-white hover:bg-white/10"
              >
                Our Story
              </Link>
            </div>
          </div>

          {/* Trust badges */}
          <div className="mt-14 grid grid-cols-2 gap-4 sm:mt-20 sm:grid-cols-4">
            {trustBadges.map((b) => (
              <div
                key={b.value}
                className="flex items-center gap-3 rounded-2xl border border-white/15 bg-white/5 p-4 backdrop-blur-sm"
              >
                <span className="inline-flex shrink-0 rounded-xl bg-foreground/50 p-2.5 text-white">
                  <b.icon className="h-5 w-5" />
                </span>
                <div className="leading-tight">
                  <p className="text-xs text-white/70">{b.label}</p>
                  <p className="text-sm font-bold text-white">{b.value}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Pill bar */}
          <div className="mt-5 flex flex-wrap items-center justify-center gap-x-8 gap-y-2 rounded-full border border-white/15 bg-foreground/30 px-6 py-3 text-sm font-medium text-white backdrop-blur">
            <span className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-accent" /> Free Shipping ₹499+
            </span>
            <span className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-primary" /> 2-Year Warranty
            </span>
            <span className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-white/60" /> Easy Returns
            </span>
          </div>
        </div>
      </section>

      {/* MARQUEE */}
      <div className="border-y border-border bg-foreground py-4 text-background">
        <div className="flex w-max animate-marquee gap-12 whitespace-nowrap">
          {[...marquee, ...marquee].map((m, i) => (
            <span key={i} className="flex items-center gap-3 text-sm font-semibold uppercase tracking-wider">
              <CheckCircle2 className="h-4 w-4 text-primary" /> {m}
            </span>
          ))}
        </div>
      </div>

      {/* CATEGORIES */}
      <section className="section">
        <div className="container-px">
          <SectionHeading
            center
            eyebrow="Shop by category"
            title="Explore by category"
            subtitle="Curated collections of factory-direct stainless steel essentials for every Indian kitchen."
          />
          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {categories.map((c) => (
              <Link
                key={c.id}
                to={`/category/${c.id}`}
                className="group relative overflow-hidden rounded-2xl shadow-sm"
              >
                <div className="aspect-[4/3] overflow-hidden">
                  <img
                    src={c.image}
                    alt={c.name}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-foreground/85 via-foreground/20 to-transparent" />
                <div className="absolute inset-x-0 bottom-0 p-5 text-background">
                  <p className="text-xs font-semibold uppercase tracking-wider text-primary-foreground/80">
                    {c.tagline}
                  </p>
                  <h3 className="mt-1 font-display text-2xl">{c.name}</h3>
                  <span className="mt-2 inline-flex items-center gap-1 text-sm font-medium opacity-0 transition group-hover:opacity-100">
                    Shop now <ArrowRight className="h-4 w-4" />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURED */}
      <section className="section bg-secondary/40">
        <div className="container-px">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <SectionHeading
              eyebrow="Customer Favorites"
              title="Bestselling kitchenware"
              subtitle="The pieces our customers reach for every single day."
            />
            <Link to="/products" className="btn-outline shrink-0">
              View all products <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          <div className="mt-12 grid grid-cols-2 gap-5 lg:grid-cols-4">
            {featured.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </div>
      </section>

      {/* VALUE PROPS / THE JCS DIFFERENCE */}
      <section className="section">
        <div className="container-px">
          <p className="eyebrow text-accent">The JCS Difference</p>
          <h2 className="mt-3 max-w-xl font-display text-3xl leading-tight sm:text-4xl">
            Why we're not just another kitchenware brand
          </h2>
          <div className="mt-14 grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
            {valueProps.map((v) => (
              <div key={v.title} className="text-center">
                <div className="mx-auto inline-flex h-16 w-16 items-center justify-center rounded-full bg-card text-primary shadow-md">
                  <v.icon className="h-7 w-7" />
                </div>
                <h3 className="mt-5 font-display text-xl">{v.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{v.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PROCESS */}
      <section className="section bg-foreground text-background">
        <div className="container-px">
          <SectionHeading
            center
            eyebrow="Factory Process"
            title="From raw steel to your kitchen"
          />
          <p className="mx-auto mt-3 max-w-2xl text-center text-background/70">
            Every JCS Home product goes through a meticulous process to ensure the
            highest quality reaches your hands.
          </p>
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {process.map((p) => (
              <div key={p.step} className="overflow-hidden rounded-2xl bg-background/5">
                <div className="relative aspect-[4/3] overflow-hidden">
                  <img src={p.img} alt={p.title} className="h-full w-full object-cover" />
                  <span className="absolute left-3 top-3 rounded-full bg-primary px-3 py-1 text-sm font-bold text-primary-foreground">
                    {p.step}
                  </span>
                </div>
                <div className="p-5">
                  <h3 className="font-display text-xl">{p.title}</h3>
                  <p className="mt-2 text-sm text-background/70">{p.text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FESTIVE + BULK banners */}
      <section className="section">
        <div className="container-px grid gap-6 lg:grid-cols-2">
          <div className="relative overflow-hidden rounded-3xl bg-secondary p-8 sm:p-10">
            <Gift className="absolute -right-4 -top-4 h-32 w-32 text-primary/10" />
            <p className="eyebrow">Festive Favorites</p>
            <h3 className="mt-3 font-display text-3xl">Celebrate with Steel</h3>
            <p className="mt-3 max-w-md text-muted-foreground">
              Premium stainless steel gifts for weddings, housewarmings, festivals &
              corporate events. Elegantly packaged, built to last forever.
            </p>
            <Link to="/category/festive" className="btn-accent mt-6">
              Browse Gift Collection <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          <div className="relative overflow-hidden rounded-3xl bg-foreground p-8 text-background sm:p-10">
            <Building2 className="absolute -right-4 -top-4 h-32 w-32 text-background/5" />
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">
              For Businesses
            </p>
            <h3 className="mt-3 font-display text-3xl">Gifting at Scale?</h3>
            <p className="mt-3 max-w-md text-background/70">
              Partner with the manufacturer. Get factory-direct pricing, custom
              branding, and dedicated support for orders of 50+ units.
            </p>
            <Link to="/bulk-orders" className="btn mt-6 bg-primary text-primary-foreground hover:brightness-110">
              Request a Quote <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* STATS */}
      <section className="border-y border-border bg-secondary/40">
        <div className="container-px grid grid-cols-2 gap-8 py-14 lg:grid-cols-4">
          {stats.map((s) => (
            <div key={s.label} className="text-center">
              <p className="font-display text-4xl text-primary sm:text-5xl">{s.value}</p>
              <p className="mt-1 text-sm font-medium text-muted-foreground">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="section">
        <div className="container-px">
          <div className="relative overflow-hidden rounded-3xl bg-primary px-6 py-16 text-center text-primary-foreground sm:px-10">
            <Leaf className="absolute -left-6 -top-6 h-40 w-40 text-primary-foreground/10" />
            <h2 className="font-display text-3xl sm:text-4xl">
              Ready for kitchenware that lasts generations?
            </h2>
            <p className="mx-auto mt-3 max-w-xl text-primary-foreground/80">
              Shop our collection of factory-direct stainless steel kitchenware and
              discover why thousands trust JCS Home.
            </p>
            <Link
              to="/products"
              className="btn mt-8 bg-background text-foreground hover:brightness-95"
            >
              Start Shopping <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
