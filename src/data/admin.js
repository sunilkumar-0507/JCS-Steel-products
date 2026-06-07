import { products } from "./products";

// Demo orders for the admin panel.
export const orders = [
  {
    id: "JCS-10428",
    customer: "Priya Raman",
    email: "customer@jcshome.in",
    date: "2026-06-05",
    items: 3,
    total: 2647,
    status: "Delivered",
    payment: "Paid",
  },
  {
    id: "JCS-10427",
    customer: "Arun Kumar",
    email: "arun.k@gmail.com",
    date: "2026-06-05",
    items: 1,
    total: 1099,
    status: "Shipped",
    payment: "Paid",
  },
  {
    id: "JCS-10426",
    customer: "Lakshmi Narayanan",
    email: "lakshmi.n@gmail.com",
    date: "2026-06-04",
    items: 2,
    total: 1448,
    status: "Processing",
    payment: "Paid",
  },
  {
    id: "JCS-10425",
    customer: "Mohammed Irfan",
    email: "irfan.m@outlook.com",
    date: "2026-06-04",
    items: 5,
    total: 4995,
    status: "Pending",
    payment: "COD",
  },
  {
    id: "JCS-10424",
    customer: "Deepa Shankar",
    email: "deepa.s@gmail.com",
    date: "2026-06-03",
    items: 1,
    total: 899,
    status: "Delivered",
    payment: "Paid",
  },
  {
    id: "JCS-10423",
    customer: "Vijay Anand",
    email: "vijay.a@gmail.com",
    date: "2026-06-02",
    items: 4,
    total: 3496,
    status: "Cancelled",
    payment: "Refunded",
  },
  {
    id: "JCS-10422",
    customer: "Sneha Pillai",
    email: "sneha.p@gmail.com",
    date: "2026-06-01",
    items: 2,
    total: 1798,
    status: "Delivered",
    payment: "Paid",
  },
];

export const customers = [
  {
    id: "CUST-2041",
    name: "Priya Raman",
    email: "customer@jcshome.in",
    city: "Chennai",
    orders: 8,
    spent: 12480,
    joined: "2024-11-12",
  },
  {
    id: "CUST-2040",
    name: "Arun Kumar",
    email: "arun.k@gmail.com",
    city: "Coimbatore",
    orders: 5,
    spent: 6240,
    joined: "2025-01-08",
  },
  {
    id: "CUST-2039",
    name: "Lakshmi Narayanan",
    email: "lakshmi.n@gmail.com",
    city: "Madurai",
    orders: 3,
    spent: 3890,
    joined: "2025-03-21",
  },
  {
    id: "CUST-2038",
    name: "Mohammed Irfan",
    email: "irfan.m@outlook.com",
    city: "Bengaluru",
    orders: 11,
    spent: 18760,
    joined: "2024-08-30",
  },
  {
    id: "CUST-2037",
    name: "Deepa Shankar",
    email: "deepa.s@gmail.com",
    city: "Chennai",
    orders: 2,
    spent: 1748,
    joined: "2025-05-02",
  },
  {
    id: "CUST-2036",
    name: "Vijay Anand",
    email: "vijay.a@gmail.com",
    city: "Trichy",
    orders: 6,
    spent: 8430,
    joined: "2025-02-14",
  },
];

export const statusStyles = {
  Delivered: "bg-accent/15 text-accent",
  Shipped: "bg-blue-100 text-blue-700",
  Processing: "bg-amber-100 text-amber-700",
  Pending: "bg-muted text-muted-foreground",
  Cancelled: "bg-destructive/10 text-destructive",
};

// Headline metrics derived from the demo data.
const revenue = orders
  .filter((o) => o.payment !== "Refunded")
  .reduce((sum, o) => sum + o.total, 0);

export const metrics = {
  revenue,
  orders: orders.length,
  customers: customers.length,
  products: products.length,
};
