import { PolicyLayout, PolicySection } from "@/components/ui.jsx";
import { Truck, Clock, MapPin, PackageCheck } from "lucide-react";

const zones = [
  { zone: "Metro Cities", places: "Chennai, Bangalore, Mumbai, Delhi, Hyderabad, Kolkata", time: "2-4 days" },
  { zone: "Tier 2 Cities", places: "Coimbatore, Pune, Ahmedabad, Jaipur, Lucknow, etc.", time: "4-6 days" },
  { zone: "Tier 3 & Rural", places: "Other locations across India", time: "6-10 days" },
];

export default function Shipping() {
  return (
    <PolicyLayout eyebrow="Customer Care" title="Shipping & Delivery" updated="December 2024">
      <p className="leading-relaxed text-muted-foreground">
        We deliver across India with reliable shipping partners to ensure your products
        reach you safely and on time. We offer free shipping with no minimum order for
        standard delivery.
      </p>

      <div className="grid gap-4 sm:grid-cols-3">
        {[
          { icon: Truck, title: "Free Shipping", text: "No minimum order for standard shipping" },
          { icon: Clock, title: "Fast Processing", text: "Orders processed within 1-2 business days" },
          { icon: MapPin, title: "Pan-India", text: "Delivery to all serviceable pin codes" },
        ].map((c) => (
          <div key={c.title} className="rounded-xl border border-border bg-card p-5 text-center">
            <c.icon className="mx-auto h-7 w-7 text-primary" />
            <h4 className="mt-2 font-semibold">{c.title}</h4>
            <p className="mt-1 text-sm text-muted-foreground">{c.text}</p>
          </div>
        ))}
      </div>

      <PolicySection title="Delivery Times">
        <div className="overflow-hidden rounded-xl border border-border">
          <table className="w-full text-sm">
            <thead className="bg-secondary text-left">
              <tr>
                <th className="p-3 font-semibold">Zone</th>
                <th className="p-3 font-semibold">Coverage</th>
                <th className="p-3 font-semibold">Delivery Time</th>
              </tr>
            </thead>
            <tbody>
              {zones.map((z) => (
                <tr key={z.zone} className="border-t border-border">
                  <td className="p-3 font-medium">{z.zone}</td>
                  <td className="p-3 text-muted-foreground">{z.places}</td>
                  <td className="p-3 font-medium text-primary">{z.time}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="text-sm">Orders are processed within 1-2 business days before dispatch.</p>
      </PolicySection>

      <PolicySection title="Order Tracking">
        <p>Once your order is shipped, you will receive:</p>
        <ul className="list-disc space-y-1 pl-5">
          <li>Email confirmation with tracking number</li>
          <li>SMS updates on delivery status</li>
          <li>Real-time delivery updates</li>
        </ul>
        <p>During checkout, enter your pin code to check delivery availability and estimated delivery date for your location.</p>
      </PolicySection>

      <PolicySection title="Shipping Partners">
        <p>We deliver to all serviceable pin codes across India through our trusted shipping partners and India Post (for remote areas).</p>
      </PolicySection>

      <PolicySection title="Failed Deliveries">
        <p>Our courier partners will attempt delivery 2-3 times. You can also reschedule delivery by contacting the courier directly using the tracking number. If all attempts fail, the package will be returned to us.</p>
      </PolicySection>

      <PolicySection title="Shipping Inquiries">
        <p className="flex items-center gap-2"><PackageCheck className="h-5 w-5 text-accent" /> For shipping inquiries, contact us at <a className="text-primary hover:underline" href="mailto:hello@jcshome.in">hello@jcshome.in</a> or +91 93607 33544.</p>
      </PolicySection>
    </PolicyLayout>
  );
}
