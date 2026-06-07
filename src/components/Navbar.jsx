import { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { ShoppingBag, Heart, User, Menu, X, Search, LayoutDashboard } from "lucide-react";
import logo from "@/assets/jcs-home-logo.png";
import { useStore } from "@/context/StoreContext";

const navLinks = [
  { to: "/", label: "Home" },
  { to: "/products", label: "Products" },
  { to: "/about", label: "About" },
  { to: "/bulk-orders", label: "Bulk Orders" },
  { to: "/faq", label: "FAQs" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const { cartCount, wishlist, isAdmin } = useStore();
  const navigate = useNavigate();

  const onSearch = (e) => {
    e.preventDefault();
    if (search.trim()) {
      navigate(`/products?q=${encodeURIComponent(search.trim())}`);
      setSearch("");
      setOpen(false);
    }
  };

  return (
    <header className="sticky top-0 z-50 border-b border-border/60 bg-background/90 backdrop-blur-md">
      {/* announcement bar */}
      <div className="bg-foreground text-background">
        <div className="container-px flex items-center justify-center py-2 text-center text-xs font-medium tracking-wide">
          Factory-Direct Pricing · Free Shipping Across India · 2-Year Warranty
        </div>
      </div>

      <div className="container-px flex h-20 items-center justify-between gap-4">
        <Link to="/" className="flex items-center gap-3">
          <img src={logo} alt="JCS Home" className="h-11 w-auto" />
          <div className="leading-none">
            <span className="block logo-script text-3xl text-primary">JCS Home</span>
            <span className="block text-[10px] font-medium uppercase tracking-[0.2em] text-muted-foreground">
              Stainless Steel Kitchenware
            </span>
          </div>
        </Link>

        {/* desktop nav */}
        <nav className="hidden items-center gap-8 lg:flex">
          {navLinks.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              className={({ isActive }) =>
                `text-sm font-medium transition-colors hover:text-primary ${
                  isActive ? "text-primary" : "text-foreground"
                }`
              }
            >
              {l.label}
            </NavLink>
          ))}
        </nav>

        <div className="flex items-center gap-1 sm:gap-2">
          {isAdmin && (
            <Link
              to="/admin"
              className="hidden items-center gap-1.5 rounded-full bg-foreground px-3 py-2 text-xs font-semibold text-background transition hover:brightness-110 sm:inline-flex"
            >
              <LayoutDashboard className="h-3.5 w-3.5" />
              Admin
            </Link>
          )}

          <form onSubmit={onSearch} className="hidden md:block">
            <div className="relative">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search products..."
                className="w-44 rounded-full border border-border bg-muted/50 py-2 pl-9 pr-4 text-sm outline-none transition focus:w-56 focus:border-primary"
              />
            </div>
          </form>

          <Link
            to="/account"
            className="rounded-full p-2.5 text-foreground transition hover:bg-muted"
            aria-label="Account"
          >
            <User className="h-5 w-5" />
          </Link>

          <Link
            to="/account"
            className="relative rounded-full p-2.5 text-foreground transition hover:bg-muted"
            aria-label="Wishlist"
          >
            <Heart className="h-5 w-5" />
            {wishlist.length > 0 && (
              <span className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-accent text-[10px] font-bold text-accent-foreground">
                {wishlist.length}
              </span>
            )}
          </Link>

          <Link
            to="/cart"
            className="relative rounded-full p-2.5 text-foreground transition hover:bg-muted"
            aria-label="Cart"
          >
            <ShoppingBag className="h-5 w-5" />
            {cartCount > 0 && (
              <span className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground">
                {cartCount}
              </span>
            )}
          </Link>

          <button
            onClick={() => setOpen((o) => !o)}
            className="rounded-full p-2.5 text-foreground transition hover:bg-muted lg:hidden"
            aria-label="Menu"
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* mobile menu */}
      {open && (
        <div className="border-t border-border bg-background lg:hidden">
          <div className="container-px flex flex-col gap-1 py-4">
            <form onSubmit={onSearch} className="mb-3 md:hidden">
              <div className="relative">
                <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search products..."
                  className="w-full rounded-full border border-border bg-muted/50 py-2.5 pl-9 pr-4 text-sm outline-none focus:border-primary"
                />
              </div>
            </form>
            {navLinks.map((l) => (
              <NavLink
                key={l.to}
                to={l.to}
                onClick={() => setOpen(false)}
                className={({ isActive }) =>
                  `rounded-lg px-3 py-3 text-sm font-medium transition ${
                    isActive ? "bg-muted text-primary" : "text-foreground hover:bg-muted"
                  }`
                }
              >
                {l.label}
              </NavLink>
            ))}
          </div>
        </div>
      )}
    </header>
  );
}
