import heroBottle from "@/assets/hero-bottle.jpg";
import heroTiffin from "@/assets/hero-tiffin.jpg";
import heroDrinkware from "@/assets/hero-drinkware.jpg";
import heroPremium from "@/assets/hero-premium.jpg";
import finalProducts from "@/assets/final-products.jpg";

export const categories = [
  {
    id: "insulated-bottles",
    name: "Insulated Bottles",
    tagline: "Stay hydrated, stay cool",
    description:
      "Vacuum-insulated bottles that keep your drinks at the perfect temperature all day.",
    image: heroBottle,
  },
  {
    id: "tiffins",
    name: "Tiffins & Lunch Boxes",
    tagline: "Lunch, perfected",
    description:
      "Leak-proof, stackable containers designed for the Indian lunch tradition.",
    image: heroTiffin,
  },
  {
    id: "drinkware",
    name: "Drinkware",
    tagline: "Tradition meets craft",
    description:
      "From filter coffee dabaras to modern tumblers, drinkware for every occasion.",
    image: heroDrinkware,
  },
  {
    id: "storage",
    name: "Storage Containers",
    tagline: "Long-Term Fresh",
    description: "Airtight canisters for grains, spices, and more.",
    image: heroPremium,
  },
  {
    id: "bowls",
    name: "Bowls & Serving",
    tagline: "Heritage Design",
    description: "Prep bowls and serving bowls for every kitchen need.",
    image: finalProducts,
  },
  {
    id: "festive",
    name: "Festive & Gifting",
    tagline: "Gifts That Last",
    description: "Premium gifting collections for special occasions.",
    image: heroPremium,
  },
];

export const products = [
  {
    id: "vacuum-bottle-750",
    name: "Vacuum Insulated Bottle 750ml",
    category: "insulated-bottles",
    price: 899,
    compareAt: 1199,
    image: heroBottle,
    rating: 4.8,
    reviews: 214,
    badge: "Bestseller",
    features: ["24hr Cold / 12hr Hot", "Double-Wall Tech", "100% Leak-Proof"],
    description:
      "Double-wall vacuum technology keeps drinks cold for 24 hours, hot for 12. Cool exterior, perfect temperature inside.",
  },
  {
    id: "vacuum-bottle-1000",
    name: "Vacuum Insulated Bottle 1L",
    category: "insulated-bottles",
    price: 1099,
    compareAt: 1499,
    image: heroBottle,
    rating: 4.9,
    reviews: 168,
    badge: "Free Shipping",
    features: ["24-Hour Insulation", "Mirror Finish", "Rust-Resistant"],
    description:
      "Vacuum-insulated hydration solutions for every lifestyle. Built to last generations.",
  },
  {
    id: "tiffin-3-tier",
    name: "3-Tier Stainless Tiffin",
    category: "tiffins",
    price: 749,
    compareAt: 999,
    image: heroTiffin,
    rating: 4.7,
    reviews: 132,
    badge: "Leak-Proof",
    features: ["100% Leak-Proof", "Stackable Build", "Airtight Seal"],
    description:
      "Leak-proof lunch containers for office and school. Precision-engineered seals and locking mechanisms.",
  },
  {
    id: "tiffin-complete-kit",
    name: "Complete Lunch Kit with Bag",
    category: "tiffins",
    price: 1299,
    compareAt: 1799,
    image: heroTiffin,
    rating: 4.8,
    reviews: 96,
    badge: "Complete Kit",
    features: ["Insulated Bag", "Cutlery Included", "Modular Design"],
    description:
      "Complete lunch sets with bags and accessories. Curated components for the perfect lunch experience.",
  },
  {
    id: "filter-coffee-set",
    name: "South Indian Filter Coffee Set",
    category: "drinkware",
    price: 449,
    compareAt: 599,
    image: heroDrinkware,
    rating: 4.9,
    reviews: 287,
    badge: "Heritage",
    features: ["Traditional Shape", "Mirror Polish", "Made in Chennai"],
    description:
      "Tumblers, cups, and traditional South Indian coffee sets. Traditional shapes crafted with modern precision.",
  },
  {
    id: "tumbler-set-6",
    name: "Stainless Tumbler Set (6 pcs)",
    category: "drinkware",
    price: 599,
    compareAt: 799,
    image: heroDrinkware,
    rating: 4.6,
    reviews: 74,
    features: ["Food-Grade 304", "Dishwasher Safe", "Rolled Rim"],
    description:
      "Traditional shapes crafted with modern precision for everyday use.",
  },
  {
    id: "storage-canister-set",
    name: "Airtight Canister Set (3 pcs)",
    category: "storage",
    price: 999,
    compareAt: 1399,
    image: heroPremium,
    rating: 4.7,
    reviews: 58,
    badge: "Airtight",
    features: ["Airtight Design", "Stackable", "Food-Safe"],
    description:
      "Airtight canisters for grains, spices, and more. Precision-fit lids with silicone seals for freshness.",
  },
  {
    id: "serving-bowl-set",
    name: "Premium Serving Bowl Set",
    category: "bowls",
    price: 699,
    compareAt: 949,
    image: finalProducts,
    rating: 4.8,
    reviews: 41,
    features: ["Heavy-Gauge Steel", "Mirror Finish", "Rolled Edges"],
    description:
      "Prep bowls and serving bowls for every kitchen need. Hand-inspected for flawless finish.",
  },
  {
    id: "festive-gift-box",
    name: "Premium Festive Gift Box",
    category: "festive",
    price: 1999,
    compareAt: 2599,
    image: heroPremium,
    rating: 5.0,
    reviews: 33,
    badge: "Gift Ready",
    features: ["Premium Gift Box", "Elegant Packaging", "Bulk Available"],
    description:
      "Premium stainless steel gifts for weddings, housewarmings, festivals & corporate events. Elegantly packaged, built to last forever.",
  },
  {
    id: "wedding-collection",
    name: "Wedding Gift Collection",
    category: "festive",
    price: 3499,
    compareAt: 4499,
    image: finalProducts,
    rating: 4.9,
    reviews: 27,
    badge: "Curated",
    features: ["Heritage Design", "Premium Finish", "Gift Wrapped"],
    description:
      "Elegant steel essentials for new beginnings. Premium kitchenware for their new home.",
  },
  {
    id: "drinkware-cup-set",
    name: "Traditional Dabara Tumbler Set",
    category: "drinkware",
    price: 379,
    compareAt: 499,
    image: heroDrinkware,
    rating: 4.7,
    reviews: 119,
    features: ["Heritage Design", "Food-Grade 304", "Easy to Clean"],
    description: "From filter coffee dabaras to modern tumblers.",
  },
  {
    id: "bottle-kids-500",
    name: "Kids Insulated Bottle 500ml",
    category: "insulated-bottles",
    price: 649,
    compareAt: 849,
    image: heroBottle,
    rating: 4.8,
    reviews: 88,
    features: ["Leak-Proof", "Lightweight", "Food-Safe"],
    description: "Vacuum-insulated bottle sized perfectly for school bags.",
  },
];

export const formatPrice = (value) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(value);

export const getProduct = (id) => products.find((p) => p.id === id);
export const getByCategory = (cat) =>
  products.filter((p) => p.category === cat);
export const getCategory = (id) => categories.find((c) => c.id === id);
