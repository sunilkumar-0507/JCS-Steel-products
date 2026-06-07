import { useState } from "react";
import { Link } from "react-router-dom";
import { MapPin, Phone, Mail, Instagram, Facebook, Send } from "lucide-react";
import logo from "@/assets/jcs-home-logo.png";
import { useStore } from "@/context/StoreContext";

export default function Footer() {
  const [email, setEmail] = useState("");
  const { toast } = useStore();

  const subscribe = (e) => {
    e.preventDefault();
    if (email.trim()) {
      toast("Welcome! Check your inbox for 10% off.");
      setEmail("");
    }
  };

  return (
    <footer className="mt-auto bg-foreground text-background">
      {/* newsletter */}
      <div className="border-b border-background/10">
        <div className="container-px grid gap-8 py-14 md:grid-cols-2 md:items-center">
          <div>
            <h3 className="font-display text-3xl">Get 10% off your first order</h3>
            <p className="mt-2 max-w-md text-background/70">
              Join our newsletter for exclusive offers, new arrivals, and kitchen
              inspiration.
            </p>
          </div>
          <form onSubmit={subscribe} className="flex gap-3">
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email address"
              className="w-full rounded-lg border border-background/20 bg-background/10 px-4 py-3 text-sm text-background placeholder:text-background/50 outline-none focus:border-primary"
            />
            <button className="btn bg-primary text-primary-foreground hover:brightness-110">
              <Send className="h-4 w-4" /> Subscribe
            </button>
          </form>
        </div>
      </div>

      <div className="container-px grid gap-10 py-14 md:grid-cols-2 lg:grid-cols-4">
        <div>
          <div className="flex items-center gap-3">
            <img src={logo} alt="JCS Home" className="h-10 w-auto brightness-0 invert" />
            <span className="logo-script text-3xl text-primary">JCS Home</span>
          </div>
          <p className="mt-4 max-w-xs text-sm text-background/70">
            Premium stainless steel kitchenware, crafted in Chennai. Factory-direct
            quality you can trust for generations.
          </p>
          <div className="mt-5 flex gap-3">
            <a href="#" className="rounded-full bg-background/10 p-2.5 transition hover:bg-primary" aria-label="Instagram">
              <Instagram className="h-4 w-4" />
            </a>
            <a href="#" className="rounded-full bg-background/10 p-2.5 transition hover:bg-primary" aria-label="Facebook">
              <Facebook className="h-4 w-4" />
            </a>
          </div>
        </div>

        <div>
          <h4 className="text-sm font-semibold uppercase tracking-wider text-background">Shop</h4>
          <ul className="mt-4 space-y-3 text-sm text-background/70">
            <li><Link to="/category/insulated-bottles" className="hover:text-primary">Insulated Bottles</Link></li>
            <li><Link to="/category/tiffins" className="hover:text-primary">Tiffins & Lunch Boxes</Link></li>
            <li><Link to="/category/drinkware" className="hover:text-primary">Drinkware</Link></li>
            <li><Link to="/category/storage" className="hover:text-primary">Storage Containers</Link></li>
            <li><Link to="/category/festive" className="hover:text-primary">Festive & Gifting</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="text-sm font-semibold uppercase tracking-wider text-background">Company</h4>
          <ul className="mt-4 space-y-3 text-sm text-background/70">
            <li><Link to="/about" className="hover:text-primary">About JCS Home</Link></li>
            <li><Link to="/bulk-orders" className="hover:text-primary">Bulk Orders</Link></li>
            <li><Link to="/faq" className="hover:text-primary">FAQs</Link></li>
            <li><Link to="/warranty" className="hover:text-primary">Warranty</Link></li>
            <li><Link to="/shipping" className="hover:text-primary">Shipping</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="text-sm font-semibold uppercase tracking-wider text-background">Get in Touch</h4>
          <ul className="mt-4 space-y-3 text-sm text-background/70">
            <li className="flex gap-2">
              <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
              JCS Enterprises, Gummidipoondi, Chennai, Tamil Nadu
            </li>
            <li className="flex gap-2">
              <Phone className="h-4 w-4 shrink-0 text-primary" />
              <a href="tel:+919360733544" className="hover:text-primary">+91 93607 33544</a>
            </li>
            <li className="flex gap-2">
              <Mail className="h-4 w-4 shrink-0 text-primary" />
              <a href="mailto:hello@jcshome.in" className="hover:text-primary">hello@jcshome.in</a>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-background/10">
        <div className="container-px flex flex-col items-center justify-between gap-3 py-6 text-xs text-background/60 sm:flex-row">
          <p>© {new Date().getFullYear()} JCS Enterprises. All rights reserved.</p>
          <div className="flex gap-5">
            <Link to="/privacy" className="hover:text-primary">Privacy Policy</Link>
            <Link to="/terms" className="hover:text-primary">Terms of Service</Link>
            <Link to="/returns" className="hover:text-primary">Returns</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
