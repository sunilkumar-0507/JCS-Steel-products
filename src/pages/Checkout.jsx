import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ArrowRight,
  BadgePercent,
  CheckCircle2,
  CreditCard,
  MapPin,
  ShieldCheck,
  Tag,
  Truck,
  Wallet,
  X,
} from "lucide-react";
import { api, formatPrice, ApiError } from "@/lib/api";
import { productImage } from "@/lib/images";
import { useStore } from "@/context/StoreContext";

const FREE_SHIPPING_THRESHOLD = 999;
const FLAT_SHIPPING_FEE = 49;

const STATES = [
  "Tamil Nadu", "Kerala", "Karnataka", "Andhra Pradesh", "Telangana",
  "Maharashtra", "Gujarat", "Delhi", "Uttar Pradesh", "West Bengal",
  "Rajasthan", "Madhya Pradesh", "Punjab", "Haryana", "Odisha", "Bihar",
  "Assam", "Goa", "Jharkhand", "Chhattisgarh", "Uttarakhand",
  "Himachal Pradesh", "Puducherry",
];

const blankAddress = {
  fullName: "", phone: "", email: "",
  line1: "", line2: "", city: "", state: "Tamil Nadu", pincode: "", landmark: "",
};

export default function Checkout() {
  const { cart, cartTotal, user, refreshCart, toast, reportError } = useStore();
  const navigate = useNavigate();

  const [address, setAddress] = useState(blankAddress);
  const [paymentMethod, setPaymentMethod] = useState("CashOnDelivery");
  const [couponInput, setCouponInput] = useState("");
  const [coupon, setCoupon] = useState(null);     // applied CouponPreviewDto
  const [couponError, setCouponError] = useState("");
  const [checkingCoupon, setCheckingCoupon] = useState(false);
  const [offers, setOffers] = useState([]);
  const [placing, setPlacing] = useState(false);
  const [placed, setPlaced] = useState(null);     // the OrderDto once confirmed

  // Prefill the contact fields from the signed-in account.
  useEffect(() => {
    if (!user) return;
    setAddress((a) => ({
      ...a,
      fullName: a.fullName || user.name || "",
      email: a.email || user.email || "",
      phone: a.phone || user.phone || "",
    }));
  }, [user]);

  useEffect(() => {
    api.publicCoupons().then(setOffers).catch(() => setOffers([]));
  }, []);

  // A cart change can invalidate an applied coupon's minimum, so re-check it.
  useEffect(() => {
    if (!coupon || cartTotal <= 0) return;
    let cancelled = false;
    api
      .validateCoupon(coupon.code, cartTotal)
      .then((preview) => !cancelled && setCoupon(preview))
      .catch((err) => {
        if (cancelled) return;
        setCoupon(null);
        setCouponError(err instanceof ApiError ? err.message : "Coupon no longer applies.");
      });
    return () => {
      cancelled = true;
    };
    // Only re-validate when the money changes, not when the preview updates.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cartTotal]);

  if (placed) return <OrderConfirmation order={placed} />;

  if (cart.length === 0) {
    return (
      <div className="container-px flex flex-col items-center py-24 text-center">
        <div className="rounded-full bg-muted p-6">
          <Truck className="h-10 w-10 text-muted-foreground" />
        </div>
        <h1 className="mt-6 font-display text-3xl">Nothing to check out</h1>
        <p className="mt-2 text-muted-foreground">Your cart is empty.</p>
        <Link to="/products" className="btn-primary mt-6">
          Browse products <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    );
  }

  const discount = coupon?.discount || 0;
  const afterDiscount = Math.max(0, cartTotal - discount);
  const freeShipping = coupon?.freeShipping || afterDiscount >= FREE_SHIPPING_THRESHOLD;
  const shippingFee = freeShipping ? 0 : FLAT_SHIPPING_FEE;
  const total = afterDiscount + shippingFee;

  const set = (key) => (e) => setAddress((a) => ({ ...a, [key]: e.target.value }));

  const applyCoupon = async (rawCode) => {
    const code = (rawCode ?? couponInput).trim();
    if (!code) return;
    setCheckingCoupon(true);
    setCouponError("");
    try {
      const preview = await api.validateCoupon(code, cartTotal);
      setCoupon(preview);
      setCouponInput("");
      toast(`Coupon ${preview.code} applied`);
    } catch (err) {
      setCoupon(null);
      setCouponError(err instanceof ApiError ? err.message : "Could not apply that coupon.");
    } finally {
      setCheckingCoupon(false);
    }
  };

  const removeCoupon = () => {
    setCoupon(null);
    setCouponError("");
  };

  const placeOrder = async (e) => {
    e.preventDefault();
    if (!/^\d{6}$/.test(address.pincode.trim())) {
      toast("Enter a valid 6-digit pincode");
      return;
    }
    setPlacing(true);
    try {
      const order = await api.checkout({
        shipping: {
          ...address,
          line2: address.line2 || null,
          landmark: address.landmark || null,
          email: address.email || null,
        },
        paymentMethod,
        couponCode: coupon?.code || null,
      });
      await refreshCart();
      setPlaced(order);
      window.scrollTo(0, 0);
    } catch (err) {
      reportError(err, "Could not place your order.");
    } finally {
      setPlacing(false);
    }
  };

  const field =
    "mt-1.5 w-full rounded-lg border border-input bg-background px-3 py-2.5 text-sm outline-none focus:border-primary";

  return (
    <div className="container-px py-12">
      <h1 className="font-display text-3xl sm:text-4xl">Checkout</h1>
      <p className="mt-2 text-muted-foreground">
        Tell us where to deliver and we'll take it from there.
      </p>

      <form onSubmit={placeOrder} className="mt-8 grid gap-8 lg:grid-cols-[1fr_380px]">
        <div className="space-y-6">
          {/* delivery address */}
          <section className="rounded-2xl border border-border bg-card p-6 shadow-sm">
            <h2 className="flex items-center gap-2 font-display text-xl">
              <MapPin className="h-5 w-5 text-primary" /> Delivery address
            </h2>

            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              <label className="block text-sm font-medium">
                Full name *
                <input required value={address.fullName} onChange={set("fullName")} placeholder="Priya Raman" className={field} />
              </label>
              <label className="block text-sm font-medium">
                Phone *
                <input required value={address.phone} onChange={set("phone")} placeholder="+91 98765 43210" className={field} />
              </label>
              <label className="block text-sm font-medium sm:col-span-2">
                Email
                <input type="email" value={address.email} onChange={set("email")} placeholder="you@email.com" className={field} />
              </label>
              <label className="block text-sm font-medium sm:col-span-2">
                Address line 1 *
                <input required value={address.line1} onChange={set("line1")} placeholder="Flat / house no., street" className={field} />
              </label>
              <label className="block text-sm font-medium sm:col-span-2">
                Address line 2
                <input value={address.line2} onChange={set("line2")} placeholder="Area, colony (optional)" className={field} />
              </label>
              <label className="block text-sm font-medium">
                City *
                <input required value={address.city} onChange={set("city")} placeholder="Chennai" className={field} />
              </label>
              <label className="block text-sm font-medium">
                State *
                <select required value={address.state} onChange={set("state")} className={field}>
                  {STATES.map((s) => (
                    <option key={s}>{s}</option>
                  ))}
                </select>
              </label>
              <label className="block text-sm font-medium">
                Pincode *
                <input
                  required
                  inputMode="numeric"
                  pattern="\d{6}"
                  maxLength={6}
                  value={address.pincode}
                  onChange={set("pincode")}
                  placeholder="600001"
                  className={field}
                />
              </label>
              <label className="block text-sm font-medium">
                Landmark
                <input value={address.landmark} onChange={set("landmark")} placeholder="Near the bus stop" className={field} />
              </label>
            </div>
          </section>

          {/* payment */}
          <section className="rounded-2xl border border-border bg-card p-6 shadow-sm">
            <h2 className="flex items-center gap-2 font-display text-xl">
              <Wallet className="h-5 w-5 text-primary" /> Payment method
            </h2>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              <PaymentOption
                icon={Wallet}
                title="Cash on delivery"
                text="Pay the courier when your order arrives."
                selected={paymentMethod === "CashOnDelivery"}
                onSelect={() => setPaymentMethod("CashOnDelivery")}
              />
              <PaymentOption
                icon={CreditCard}
                title="Pay online"
                text="Card, UPI or netbanking."
                selected={paymentMethod === "Online"}
                onSelect={() => setPaymentMethod("Online")}
              />
            </div>
            {paymentMethod === "Online" && (
              <p className="mt-3 rounded-lg bg-secondary/60 p-3 text-xs text-muted-foreground">
                No payment gateway is connected yet — online orders are recorded as paid so the
                flow can be tested end to end.
              </p>
            )}
          </section>
        </div>

        {/* summary */}
        <aside className="h-fit space-y-4 lg:sticky lg:top-28">
          <section className="rounded-2xl border border-border bg-card p-6 shadow-sm">
            <h2 className="font-display text-xl">Order summary</h2>

            <ul className="mt-4 space-y-3">
              {cart.map((item) => (
                <li key={item.productId} className="flex items-center gap-3">
                  <img
                    src={productImage({ id: item.productId, image: item.image })}
                    alt={item.name}
                    className="h-12 w-12 shrink-0 rounded-lg object-cover"
                  />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium">{item.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {item.quantity} × {formatPrice(item.price)}
                    </p>
                  </div>
                  <span className="text-sm font-semibold">{formatPrice(item.lineTotal)}</span>
                </li>
              ))}
            </ul>

            {/* coupon */}
            <div className="mt-5 border-t border-border pt-5">
              {coupon ? (
                <div className="flex items-start justify-between gap-3 rounded-xl border border-accent/30 bg-accent/10 p-3">
                  <div className="min-w-0">
                    <p className="flex items-center gap-1.5 text-sm font-semibold text-accent">
                      <CheckCircle2 className="h-4 w-4" /> {coupon.code}
                    </p>
                    <p className="mt-0.5 text-xs text-muted-foreground">
                      {coupon.description || "Discount applied"}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={removeCoupon}
                    className="rounded-full p-1 text-muted-foreground hover:text-destructive"
                    aria-label="Remove coupon"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              ) : (
                <>
                  <label className="flex items-center gap-2 text-sm font-medium">
                    <Tag className="h-4 w-4 text-primary" /> Have a coupon?
                  </label>
                  <div className="mt-2 flex gap-2">
                    <input
                      value={couponInput}
                      onChange={(e) => setCouponInput(e.target.value.toUpperCase())}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          applyCoupon();
                        }
                      }}
                      placeholder="WELCOME10"
                      className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm uppercase outline-none focus:border-primary"
                    />
                    <button
                      type="button"
                      onClick={() => applyCoupon()}
                      disabled={checkingCoupon || !couponInput.trim()}
                      className="btn-outline shrink-0 px-4 disabled:opacity-50"
                    >
                      {checkingCoupon ? "…" : "Apply"}
                    </button>
                  </div>
                  {couponError && (
                    <p className="mt-2 text-xs text-destructive">{couponError}</p>
                  )}
                </>
              )}
            </div>

            {/* totals */}
            <div className="mt-5 space-y-2.5 border-t border-border pt-5 text-sm">
              <Row label="Subtotal" value={formatPrice(cartTotal)} />
              {discount > 0 && (
                <Row
                  label={`Discount (${coupon.code})`}
                  value={<span className="text-accent">−{formatPrice(discount)}</span>}
                />
              )}
              <Row
                label="Shipping"
                value={
                  shippingFee === 0 ? <span className="text-accent">Free</span> : formatPrice(shippingFee)
                }
              />
              <div className="border-t border-border pt-3">
                <Row label="Total" value={formatPrice(total)} bold />
              </div>
            </div>

            <button
              type="submit"
              disabled={placing}
              className="btn-primary mt-6 w-full disabled:opacity-60"
            >
              {placing ? "Placing order…" : `Place order · ${formatPrice(total)}`}
            </button>
            <div className="mt-4 flex items-center gap-2 text-xs text-muted-foreground">
              <ShieldCheck className="h-4 w-4 text-accent" />
              Secure checkout · 7-day returns · 2-year warranty
            </div>
          </section>

          {/* available offers */}
          {offers.length > 0 && !coupon && (
            <section className="rounded-2xl border border-border bg-card p-5 shadow-sm">
              <h3 className="flex items-center gap-2 text-sm font-semibold">
                <BadgePercent className="h-4 w-4 text-primary" /> Available offers
              </h3>
              <ul className="mt-3 space-y-2">
                {offers.map((o) => (
                  <li key={o.id} className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="text-sm font-semibold">{o.code}</p>
                      <p className="text-xs text-muted-foreground">{o.description}</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => applyCoupon(o.code)}
                      className="shrink-0 text-xs font-semibold text-primary hover:underline"
                    >
                      Apply
                    </button>
                  </li>
                ))}
              </ul>
            </section>
          )}
        </aside>
      </form>
    </div>
  );
}

function PaymentOption({ icon: Icon, title, text, selected, onSelect }) {
  return (
    <button
      type="button"
      onClick={onSelect}
      className={`flex items-start gap-3 rounded-xl border p-4 text-left transition ${
        selected ? "border-primary bg-primary/5" : "border-border hover:border-primary/50"
      }`}
    >
      <Icon className={`mt-0.5 h-5 w-5 shrink-0 ${selected ? "text-primary" : "text-muted-foreground"}`} />
      <div>
        <p className="text-sm font-semibold">{title}</p>
        <p className="mt-0.5 text-xs text-muted-foreground">{text}</p>
      </div>
    </button>
  );
}

function Row({ label, value, bold }) {
  return (
    <div className="flex items-center justify-between">
      <span className={bold ? "font-semibold text-foreground" : "text-muted-foreground"}>
        {label}
      </span>
      <span className={bold ? "text-lg font-bold" : "font-medium"}>{value}</span>
    </div>
  );
}

function OrderConfirmation({ order }) {
  return (
    <div className="container-px py-16">
      <div className="mx-auto max-w-2xl rounded-3xl border border-border bg-card p-8 text-center shadow-sm sm:p-12">
        <div className="mx-auto inline-flex rounded-full bg-accent/15 p-4 text-accent">
          <CheckCircle2 className="h-10 w-10" />
        </div>
        <h1 className="mt-6 font-display text-3xl">Order confirmed</h1>
        <p className="mt-2 text-muted-foreground">
          Thanks! Your order <strong className="text-foreground">{order.orderNumber}</strong> is
          on its way.
        </p>

        <div className="mt-8 space-y-2.5 rounded-2xl bg-secondary/50 p-6 text-left text-sm">
          <Row label="Subtotal" value={formatPrice(order.subtotal)} />
          {order.discount > 0 && (
            <Row
              label={`Discount (${order.couponCode})`}
              value={<span className="text-accent">−{formatPrice(order.discount)}</span>}
            />
          )}
          <Row
            label="Shipping"
            value={
              order.shippingFee === 0 ? <span className="text-accent">Free</span> : formatPrice(order.shippingFee)
            }
          />
          <div className="border-t border-border pt-2.5">
            <Row label="Total" value={formatPrice(order.total)} bold />
          </div>
          <p className="pt-2 text-xs text-muted-foreground">
            Paying by {order.paymentMethod === "Online" ? "card / UPI" : "cash on delivery"} ·
            delivering to {order.shipping.city}, {order.shipping.state} {order.shipping.pincode}
          </p>
        </div>

        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link to="/account" className="btn-primary">
            Track my orders <ArrowRight className="h-4 w-4" />
          </Link>
          <Link to="/products" className="btn-outline">
            Continue shopping
          </Link>
        </div>
      </div>
    </div>
  );
}
