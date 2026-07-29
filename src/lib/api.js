/**
 * Thin client for the Daily Pans REST API.
 *
 * Every endpoint returns the envelope { success, message, data }; the helpers below
 * unwrap it and throw an `ApiError` (carrying the server's message) on failure, so
 * callers can just `try { await api.x() } catch (e) { toast(e.message) }`.
 */

const BASE_URL = (import.meta.env.VITE_API_URL || "http://localhost:5292").replace(/\/$/, "");

const TOKEN_KEY = "dp_token";
const CART_ID_KEY = "dp_cart_id";

export class ApiError extends Error {
  constructor(message, status, data) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.data = data;
  }
}

/* ---------- token + guest cart id ---------- */

export const getToken = () => localStorage.getItem(TOKEN_KEY) || null;
export const setToken = (token) => {
  if (token) localStorage.setItem(TOKEN_KEY, token);
  else localStorage.removeItem(TOKEN_KEY);
};

/** Guests get a stable cart id so their cart survives a refresh. */
export const getCartId = () => {
  let id = localStorage.getItem(CART_ID_KEY);
  if (!id) {
    id = `guest:${crypto.randomUUID().replace(/-/g, "")}`;
    localStorage.setItem(CART_ID_KEY, id);
  }
  return id;
};
export const resetCartId = () => localStorage.removeItem(CART_ID_KEY);

/* ---------- core request ---------- */

async function request(path, { method = "GET", body, auth = true, signal } = {}) {
  const headers = { "X-Cart-Id": getCartId() };
  if (body !== undefined) headers["Content-Type"] = "application/json";

  const token = getToken();
  if (auth && token) headers.Authorization = `Bearer ${token}`;

  let res;
  try {
    res = await fetch(`${BASE_URL}${path}`, {
      method,
      headers,
      signal,
      body: body === undefined ? undefined : JSON.stringify(body),
    });
  } catch (err) {
    if (err.name === "AbortError") throw err;
    throw new ApiError(
      "Can't reach the server. Is the API running on " + BASE_URL + "?",
      0
    );
  }

  // 204 and empty bodies are valid successes.
  const text = await res.text();
  let payload = null;
  if (text) {
    try {
      payload = JSON.parse(text);
    } catch {
      throw new ApiError("The server returned an unreadable response.", res.status);
    }
  }

  if (!res.ok || (payload && payload.success === false)) {
    const message =
      payload?.message ||
      (res.status === 401
        ? "Please sign in to continue."
        : res.status === 403
        ? "You don't have access to this."
        : `Request failed (${res.status}).`);
    throw new ApiError(message, res.status, payload?.data);
  }

  return payload ? payload.data : null;
}

const get = (path, opts) => request(path, { ...opts, method: "GET" });
const post = (path, body, opts) => request(path, { ...opts, method: "POST", body });
const put = (path, body, opts) => request(path, { ...opts, method: "PUT", body });
const del = (path, opts) => request(path, { ...opts, method: "DELETE" });

/* ---------- endpoints ---------- */

export const api = {
  baseUrl: BASE_URL,

  // Catalog
  categories: () => get("/api/categories"),
  category: (id) => get(`/api/categories/${id}`),
  products: (params = {}) => {
    const qs = new URLSearchParams(
      Object.entries(params).filter(([, v]) => v !== undefined && v !== null && v !== "")
    ).toString();
    return get(`/api/products${qs ? `?${qs}` : ""}`);
  },
  featured: (take = 8) => get(`/api/products/featured?take=${take}`),
  product: (id) => get(`/api/products/${id}`),
  related: (id, take = 4) => get(`/api/products/${id}/related?take=${take}`),
  reviews: (id) => get(`/api/products/${id}/reviews`),
  addReview: (id, review) => post(`/api/products/${id}/reviews`, review),

  // Cart
  getCart: () => get("/api/cart"),
  addToCart: (productId, quantity = 1) => post("/api/cart/items", { productId, quantity }),
  setCartQty: (productId, quantity) => put(`/api/cart/items/${productId}`, { quantity }),
  removeFromCart: (productId) => del(`/api/cart/items/${productId}`),
  clearCart: () => del("/api/cart"),

  // Coupons
  publicCoupons: () => get("/api/coupons"),
  validateCoupon: (code, subtotal) => post("/api/coupons/validate", { code, subtotal }),

  // Orders
  checkout: (payload) => post("/api/orders", { ...payload, cartId: getCartId() }),
  myOrders: () => get("/api/orders"),
  order: (id) => get(`/api/orders/${id}`),

  // Auth
  register: (payload) => post("/api/auth/register", payload, { auth: false }),
  login: (email, password) => post("/api/auth/login", { email, password }, { auth: false }),
  requestOtp: (phone) => post("/api/auth/otp/request", { phone }, { auth: false }),
  verifyOtp: (phone, code) => post("/api/auth/otp/verify", { phone, code }, { auth: false }),
  me: () => get("/api/auth/me"),
  logout: () => post("/api/auth/logout"),

  // Wishlist
  wishlist: () => get("/api/wishlist"),
  addToWishlist: (productId) => post(`/api/wishlist/${productId}`),
  removeFromWishlist: (productId) => del(`/api/wishlist/${productId}`),

  // Lead capture
  bulkOrder: (payload) => post("/api/bulk-orders", payload, { auth: false }),
  contact: (payload) => post("/api/contact", payload, { auth: false }),
  subscribe: (email) => post("/api/newsletter", { email }, { auth: false }),

  // ----- Admin -----
  admin: {
    dashboard: () => get("/api/admin/dashboard"),

    createProduct: (payload) => post("/api/admin/products", payload),
    updateProduct: (id, payload) => put(`/api/admin/products/${id}`, payload),
    deleteProduct: (id) => del(`/api/admin/products/${id}`),

    orders: (status) => get(`/api/admin/orders${status ? `?status=${status}` : ""}`),
    setOrderStatus: (id, status) => put(`/api/admin/orders/${id}/status`, { status }),
    setDelivery: (id, payload) => put(`/api/admin/orders/${id}/delivery`, payload),

    customers: () => get("/api/admin/customers"),
    customer: (id) => get(`/api/admin/customers/${id}`),

    coupons: () => get("/api/admin/coupons"),
    createCoupon: (payload) => post("/api/admin/coupons", payload),
    updateCoupon: (id, payload) => put(`/api/admin/coupons/${id}`, payload),
    deleteCoupon: (id) => del(`/api/admin/coupons/${id}`),

    bulkOrders: () => get("/api/admin/bulk-orders"),
    setBulkOrderStatus: (id, status) => put(`/api/admin/bulk-orders/${id}/status`, { status }),

    messages: () => get("/api/admin/messages"),
    markMessageRead: (id, isRead = true) => put(`/api/admin/messages/${id}/read?isRead=${isRead}`),

    newsletter: () => get("/api/admin/newsletter"),
  },
};

/* ---------- shared formatters ---------- */

export const formatPrice = (value) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(Number(value) || 0);

export const formatDate = (value) => {
  if (!value) return "—";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return "—";
  return d.toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });
};

export const formatDateTime = (value) => {
  if (!value) return "—";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return "—";
  return d.toLocaleString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

/** `2026-08-05T00:00:00Z` -> `2026-08-05`, for <input type="date">. */
export const toDateInput = (value) => (value ? String(value).slice(0, 10) : "");

/** `2026-08-05` -> ISO string the API can parse, or null when blank. */
export const fromDateInput = (value) =>
  value ? new Date(`${value}T00:00:00`).toISOString() : null;
