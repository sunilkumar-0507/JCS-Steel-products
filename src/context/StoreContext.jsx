import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { api, getToken, setToken, resetCartId, ApiError } from "@/lib/api";

const StoreContext = createContext(null);

/**
 * Single source of truth for catalog, cart, wishlist and session — all of it
 * served by the REST API. Nothing here is seeded from local files any more; the
 * only thing kept in localStorage is the auth token and the guest cart id.
 */
export function StoreProvider({ children }) {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [catalogLoading, setCatalogLoading] = useState(true);
  const [catalogError, setCatalogError] = useState(null);

  const [cart, setCart] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const [user, setUser] = useState(null);
  const [authReady, setAuthReady] = useState(false);

  const [toasts, setToasts] = useState([]);
  const toastTimers = useRef([]);

  const toast = useCallback((message) => {
    if (!message) return;
    const id = `${Date.now()}-${Math.random()}`;
    setToasts((t) => [...t, { id, message: String(message) }]);
    const timer = setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 2800);
    toastTimers.current.push(timer);
  }, []);

  useEffect(() => () => toastTimers.current.forEach(clearTimeout), []);

  /** Surface an API failure to the user without crashing the page. */
  const reportError = useCallback(
    (err, fallback = "Something went wrong.") => {
      if (err?.name === "AbortError") return;
      toast(err instanceof ApiError ? err.message : fallback);
    },
    [toast]
  );

  /* ---------- catalog ---------- */

  const loadCatalog = useCallback(async () => {
    setCatalogLoading(true);
    try {
      const [cats, list] = await Promise.all([
        api.categories(),
        api.products({ pageSize: 100 }),
      ]);
      setCategories(cats || []);
      setProducts(list?.items || []);
      setCatalogError(null);
    } catch (err) {
      setCatalogError(err instanceof ApiError ? err.message : "Could not load the catalog.");
      setCategories([]);
      setProducts([]);
    } finally {
      setCatalogLoading(false);
    }
  }, []);

  useEffect(() => {
    loadCatalog();
  }, [loadCatalog]);

  /* ---------- cart ---------- */

  // The API returns cart lines already priced and named, so the UI can render
  // them without cross-referencing the catalog.
  const applyCart = useCallback((dto) => setCart(dto?.items || []), []);

  const refreshCart = useCallback(async () => {
    try {
      applyCart(await api.getCart());
    } catch (err) {
      reportError(err, "Could not load your cart.");
    }
  }, [applyCart, reportError]);

  const addToCart = useCallback(
    async (product, qty = 1) => {
      try {
        applyCart(await api.addToCart(product.id, qty));
        toast("Added to cart");
      } catch (err) {
        reportError(err, "Could not add that to your cart.");
      }
    },
    [applyCart, toast, reportError]
  );

  const updateQty = useCallback(
    async (productId, qty) => {
      try {
        applyCart(await api.setCartQty(productId, Math.max(0, qty)));
      } catch (err) {
        reportError(err, "Could not update the quantity.");
      }
    },
    [applyCart, reportError]
  );

  const removeFromCart = useCallback(
    async (productId) => {
      try {
        applyCart(await api.removeFromCart(productId));
        toast("Removed from cart");
      } catch (err) {
        reportError(err, "Could not remove that item.");
      }
    },
    [applyCart, toast, reportError]
  );

  const clearCart = useCallback(
    async ({ silent = false } = {}) => {
      try {
        applyCart(await api.clearCart());
        if (!silent) toast("Cart cleared");
      } catch (err) {
        reportError(err, "Could not clear your cart.");
      }
    },
    [applyCart, toast, reportError]
  );

  /* ---------- wishlist (server-side for signed-in users) ---------- */

  const refreshWishlist = useCallback(async () => {
    if (!getToken()) {
      setWishlist([]);
      return;
    }
    try {
      setWishlist((await api.wishlist()) || []);
    } catch {
      setWishlist([]);
    }
  }, []);

  const toggleWishlist = useCallback(
    async (product) => {
      if (!user) {
        toast("Sign in to save items to your wishlist");
        return;
      }
      const saved = wishlist.some((i) => i.id === product.id);
      try {
        if (saved) {
          await api.removeFromWishlist(product.id);
          setWishlist((w) => w.filter((i) => i.id !== product.id));
          toast("Removed from wishlist");
        } else {
          await api.addToWishlist(product.id);
          setWishlist((w) => [...w, product]);
          toast("Added to wishlist");
        }
      } catch (err) {
        reportError(err, "Could not update your wishlist.");
      }
    },
    [user, wishlist, toast, reportError]
  );

  const inWishlist = useCallback((id) => wishlist.some((i) => i.id === id), [wishlist]);

  /* ---------- session ---------- */

  // Restore the session on first paint if a token is already stored.
  useEffect(() => {
    let cancelled = false;
    (async () => {
      if (getToken()) {
        try {
          const me = await api.me();
          if (!cancelled) setUser(me);
        } catch {
          setToken(null);
        }
      }
      if (!cancelled) setAuthReady(true);
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  // Cart + wishlist belong to whoever is signed in, so reload them on change.
  useEffect(() => {
    if (!authReady) return;
    refreshCart();
    refreshWishlist();
  }, [authReady, user, refreshCart, refreshWishlist]);

  const login = useCallback(
    async (email, password) => {
      try {
        const res = await api.login(email, password);
        setToken(res.token);
        setUser(res.user);
        toast(`Welcome back, ${res.user.name.split(" ")[0]}`);
        return { ok: true, isAdmin: res.user.isAdmin, user: res.user };
      } catch (err) {
        reportError(err, "Could not sign you in.");
        return { ok: false };
      }
    },
    [toast, reportError]
  );

  const register = useCallback(
    async (payload) => {
      try {
        const res = await api.register(payload);
        setToken(res.token);
        setUser(res.user);
        toast(`Welcome to Daily Pans, ${res.user.name.split(" ")[0]}`);
        return { ok: true, isAdmin: res.user.isAdmin, user: res.user };
      } catch (err) {
        reportError(err, "Could not create your account.");
        return { ok: false };
      }
    },
    [toast, reportError]
  );

  const logout = useCallback(async () => {
    try {
      await api.logout();
    } catch {
      // A revoked/expired token is fine — sign out locally regardless.
    }
    setToken(null);
    resetCartId();
    setUser(null);
    setWishlist([]);
    setCart([]);
    toast("Signed out");
  }, [toast]);

  /* ---------- derived ---------- */

  const cartCount = useMemo(() => cart.reduce((sum, i) => sum + i.quantity, 0), [cart]);
  const cartTotal = useMemo(
    () => cart.reduce((sum, i) => sum + i.price * i.quantity, 0),
    [cart]
  );

  const value = {
    // catalog
    products,
    categories,
    catalogLoading,
    catalogError,
    reloadCatalog: loadCatalog,
    getCategory: (id) => categories.find((c) => c.id === id),

    // cart
    cart,
    cartCount,
    cartTotal,
    addToCart,
    updateQty,
    removeFromCart,
    clearCart,
    refreshCart,

    // wishlist
    wishlist,
    toggleWishlist,
    inWishlist,
    refreshWishlist,

    // session
    user,
    authReady,
    isAdmin: !!user?.isAdmin,
    login,
    register,
    logout,

    // ui
    toast,
    toasts,
    reportError,
  };

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

export const useStore = () => {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error("useStore must be used within StoreProvider");
  return ctx;
};
