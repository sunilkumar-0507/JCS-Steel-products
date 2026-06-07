import { Link } from "react-router-dom";
import { ArrowRight, Target, Heart, Recycle, ShieldCheck, Factory, Users } from "lucide-react";
import { PageHeader, SectionHeading } from "@/components/ui.jsx";
import factoryInterior from "@/assets/factory-interior.jpg";
import team from "@/assets/team.jpg";
import rawMaterial from "@/assets/raw-material.jpg";

const timeline = [
  {
    year: "2021",
    title: "JCS Enterprises Founded",
    text: "In 2021, we established JCS Enterprises in Gummidipoondi, a thriving industrial hub just north of Chennai. Our mission was clear: to become a trusted name in precision metal manufacturing.",
  },
  {
    year: "2022",
    title: "Invested in Technology",
    text: "Invested in advanced metal pressing technology to deliver consistent, industrial-grade quality at scale.",
  },
  {
    year: "2023",
    title: "Grew Our Capabilities",
    text: "Grew our manufacturing capabilities and B2B client base, serving industrial clients across the region.",
  },
  {
    year: "2024",
    title: "JCS Home is Born",
    text: "Launched direct-to-consumer kitchenware brand, bringing factory-direct quality straight to Indian kitchens.",
  },
];

const values = [
  {
    icon: ShieldCheck,
    title: "Uncompromising Quality",
    text: "Only 304 food-grade stainless steel. Every product meets exacting industrial standards.",
  },
  {
    icon: Factory,
    title: "Factory-Direct",
    text: "We manufacture everything in-house. No middlemen means better prices for you.",
  },
  {
    icon: Recycle,
    title: "Sustainability",
    text: "Built to last generations. One purchase, zero plastic waste forever.",
  },
  {
    icon: Heart,
    title: "Made in India",
    text: "Supporting local manufacturing in Tamil Nadu and the communities around us.",
  },
];

export default function About() {
  return (
    <>
      <PageHeader
        eyebrow="Our Story"
        title="From Factory Floor to Your Kitchen"
        subtitle="Discover the story of JCS Enterprises — from industrial metal manufacturing in Gummidipoondi to premium stainless steel kitchenware for Indian homes."
      />

      {/* origin */}
      <section className="section">
        <div className="container-px grid items-center gap-12 lg:grid-cols-2">
          <div className="overflow-hidden rounded-3xl shadow-lg">
            <img src={factoryInterior} alt="JCS Enterprises manufacturing facility" className="aspect-[4/3] w-full object-cover" />
          </div>
          <div>
            <p className="eyebrow">Heritage Meets Precision</p>
            <h2 className="mt-3 font-display text-3xl sm:text-4xl">From industrial engineering to your kitchen table</h2>
            <p className="mt-4 leading-relaxed text-muted-foreground">
              JCS Enterprises was founded in Gummidipoondi, Chennai, with a focus on
              precision metal manufacturing. After years of serving industrial clients,
              we asked ourselves a simple question:
            </p>
            <blockquote className="my-6 border-l-4 border-primary pl-5 font-display text-2xl italic text-foreground">
              "Why should only industries benefit from our expertise?"
            </blockquote>
            <p className="leading-relaxed text-muted-foreground">
              As we honed our craft with high-grade stainless steel, a question emerged:
              why not bring the same precision engineering to Indian kitchens? That
              question gave birth to JCS Home. We brought the same precision engineering,
              quality control, and material standards to everyday kitchenware.
            </p>
          </div>
        </div>
      </section>

      {/* timeline */}
      <section className="section bg-secondary/40">
        <div className="container-px">
          <SectionHeading center eyebrow="Our Journey So Far" title="Building products that last generations" />
          <div className="mx-auto mt-12 max-w-3xl">
            {timeline.map((t, i) => (
              <div key={t.year} className="relative flex gap-6 pb-10 last:pb-0">
                <div className="flex flex-col items-center">
                  <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-primary font-display text-lg font-bold text-primary-foreground">
                    {t.year.slice(2)}
                  </div>
                  {i < timeline.length - 1 && <div className="mt-2 w-0.5 flex-1 bg-border" />}
                </div>
                <div className="pt-2">
                  <p className="text-sm font-bold text-primary">{t.year}</p>
                  <h3 className="mt-1 font-display text-xl">{t.title}</h3>
                  <p className="mt-2 text-muted-foreground">{t.text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* values */}
      <section className="section">
        <div className="container-px">
          <SectionHeading
            center
            eyebrow="What We Stand For"
            title="Our core values"
            subtitle="These principles guide every decision, from selecting materials to designing products."
          />
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {values.map((v) => (
              <div key={v.title} className="rounded-2xl border border-border bg-card p-6 text-center shadow-sm">
                <div className="mx-auto inline-flex rounded-xl bg-accent/10 p-3 text-accent">
                  <v.icon className="h-6 w-6" />
                </div>
                <h3 className="mt-4 font-display text-lg">{v.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{v.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* team */}
      <section className="section bg-secondary/40">
        <div className="container-px grid items-center gap-12 lg:grid-cols-2">
          <div className="order-2 lg:order-1">
            <p className="eyebrow">Skilled Hands, Passionate Hearts</p>
            <h2 className="mt-3 font-display text-3xl sm:text-4xl">The people behind every product</h2>
            <p className="mt-4 leading-relaxed text-muted-foreground">
              Behind every JCS Home product is a team of dedicated professionals who take
              pride in their craft. From our skilled machine operators to our quality
              inspectors, every team member understands the importance of precision and
              attention to detail.
            </p>
            <div className="mt-6 flex items-center gap-3 text-sm font-medium">
              <Users className="h-5 w-5 text-primary" />
              Trained manufacturing professionals · Chennai, Tamil Nadu
            </div>
          </div>
          <div className="order-1 overflow-hidden rounded-3xl shadow-lg lg:order-2">
            <img src={team} alt="JCS Enterprises team" className="aspect-[4/3] w-full object-cover" />
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section">
        <div className="container-px">
          <div className="relative grid items-center gap-8 overflow-hidden rounded-3xl bg-foreground p-8 text-background sm:p-12 lg:grid-cols-2">
            <div>
              <Target className="h-10 w-10 text-primary" />
              <h2 className="mt-4 font-display text-3xl">Quality you can trust for generations</h2>
              <p className="mt-3 text-background/70">
                Experience the difference of factory-direct stainless steel kitchenware
                crafted with precision in Chennai.
              </p>
              <Link to="/products" className="btn mt-6 bg-primary text-primary-foreground hover:brightness-110">
                Browse all products <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
            <div className="overflow-hidden rounded-2xl">
              <img src={rawMaterial} alt="Premium 304 stainless steel" className="aspect-video w-full object-cover" />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
