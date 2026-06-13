import { createContext, useContext, useEffect, useMemo, useState, useCallback } from "react";
import { products as seedProducts } from "@/data/products";
import heroPremium from "@/assets/hero-premium.jpg";

const StoreContext = createContext(null);

const slugify = (str) =>
  String(str)
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

const load = (key, fallback) => {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
};

// Demo accounts — credentials shown to the user.
const DEMO_USERS = [
  {
    email: "admin@jcshome.in",
    password: "admin123",
    name: "JCS Admin",
    role: "admin",
  },
  {
    email: "customer@jcshome.in",
    password: "customer123",
    name: "Priya Raman",
    role: "customer",
  },
];

export function StoreProvider({ children }) {
  const [cart, setCart] = useState(() => load("jcs_cart", []));
  const [wishlist, setWishlist] = useState(() => load("jcs_wishlist", []));
  const [user, setUser] = useState(() => load("jcs_user", null));
  const [products, setProducts] = useState(() => load("jcs_products", seedProducts));
  const [toasts, setToasts] = useState([]);

  useEffect(() => {
    localStorage.setItem("jcs_products", JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    localStorage.setItem("jcs_cart", JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem("jcs_wishlist", JSON.stringify(wishlist));
  }, [wishlist]);

  useEffect(() => {
    if (user) localStorage.setItem("jcs_user", JSON.stringify(user));
    else localStorage.removeItem("jcs_user");
  }, [user]);

  const toast = useCallback((message) => {
    const id = Date.now() + Math.random();
    setToasts((t) => [...t, { id, message }]);
    setTimeout(() => {
      setToasts((t) => t.filter((x) => x.id !== id));
    }, 2600);
  }, []);

  const addToCart = useCallback(
    (product, qty = 1) => {
      setCart((prev) => {
        const existing = prev.find((i) => i.id === product.id);
        if (existing) {
          return prev.map((i) =>
            i.id === product.id ? { ...i, qty: i.qty + qty } : i
          );
        }
        return [...prev, { ...product, qty }];
      });
      toast("Added to cart");
    },
    [toast]
  );

  const removeFromCart = useCallback(
    (id) => {
      setCart((prev) => prev.filter((i) => i.id !== id));
      toast("Removed from cart");
    },
    [toast]
  );

  const updateQty = useCallback((id, qty) => {
    setCart((prev) =>
      prev
        .map((i) => (i.id === id ? { ...i, qty: Math.max(1, qty) } : i))
        .filter((i) => i.qty > 0)
    );
  }, []);

  const clearCart = useCallback(() => {
    setCart([]);
    toast("Cart cleared");
  }, [toast]);

  const toggleWishlist = useCallback(
    (product) => {
      setWishlist((prev) => {
        if (prev.find((i) => i.id === product.id)) {
          toast("Removed from wishlist");
          return prev.filter((i) => i.id !== product.id);
        }
        toast("Added to wishlist");
        return [...prev, product];
      });
    },
    [toast]
  );

  const inWishlist = useCallback(
    (id) => wishlist.some((i) => i.id === id),
    [wishlist]
  );

  const login = useCallback(
    (email, password) => {
      const match = DEMO_USERS.find(
        (u) =>
          u.email.toLowerCase() === String(email).trim().toLowerCase() &&
          u.password === password
      );
      if (!match) {
        toast("Invalid email or password");
        return { ok: false };
      }
      const { password: _pw, ...safe } = match;
      setUser(safe);
      toast(`Welcome back, ${safe.name}`);
      return { ok: true, role: safe.role };
    },
    [toast]
  );

  const logout = useCallback(() => {
    setUser(null);
    toast("Signed out");
  }, [toast]);

  const addProduct = useCallback(
    (draft) => {
      const baseId = slugify(draft.name) || `product-${Date.now()}`;
      setProducts((prev) => {
        // Ensure a unique id even if names collide.
        let id = baseId;
        let n = 2;
        while (prev.some((p) => p.id === id)) id = `${baseId}-${n++}`;
        const product = {
          id,
          name: draft.name.trim(),
          category: draft.category,
          price: Number(draft.price) || 0,
          compareAt: Number(draft.compareAt) || undefined,
          image: draft.image?.trim() || heroPremium,
          rating: 5.0,
          reviews: 0,
          badge: draft.badge?.trim() || undefined,
          features: (draft.features || "")
            .split(",")
            .map((f) => f.trim())
            .filter(Boolean),
          description: draft.description?.trim() || "",
        };
        return [product, ...prev];
      });
      toast("Product added");
      return baseId;
    },
    [toast]
  );

  const deleteProduct = useCallback(
    (id) => {
      setProducts((prev) => prev.filter((p) => p.id !== id));
      toast("Product deleted");
    },
    [toast]
  );

  const resetProducts = useCallback(() => {
    setProducts(seedProducts);
    toast("Catalog reset");
  }, [toast]);

  const cartCount = useMemo(
    () => cart.reduce((sum, i) => sum + i.qty, 0),
    [cart]
  );
  const cartTotal = useMemo(
    () => cart.reduce((sum, i) => sum + i.price * i.qty, 0),
    [cart]
  );

  const value = {
    cart,
    wishlist,
    user,
    isAdmin: user?.role === "admin",
    products,
    addProduct,
    deleteProduct,
    resetProducts,
    login,
    logout,
    toast,
    toasts,
    addToCart,
    removeFromCart,
    updateQty,
    clearCart,
    toggleWishlist,
    inWishlist,
    cartCount,
    cartTotal,
  };

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

export const useStore = () => {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error("useStore must be used within StoreProvider");
  return ctx;
};
