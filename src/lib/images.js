/**
 * Product/category artwork.
 *
 * The API stores an optional `image` URL per record (admins can paste one when
 * creating a product). Seeded catalog rows have none, so we fall back to the
 * bundled photography — keyed by product slug first, then by category, then a
 * generic shot. That keeps the storefront looking right whatever the API returns.
 */
import heroBottle from "@/assets/hero-bottle.jpg";
import heroTiffin from "@/assets/hero-tiffin.jpg";
import heroDrinkware from "@/assets/hero-drinkware.jpg";
import heroPremium from "@/assets/hero-premium.jpg";
import finalProducts from "@/assets/final-products.jpg";

export const FALLBACK_IMAGE = heroPremium;

const BY_CATEGORY = {
  "insulated-bottles": heroBottle,
  tiffins: heroTiffin,
  drinkware: heroDrinkware,
  storage: heroPremium,
  bowls: finalProducts,
  festive: heroPremium,
};

const BY_PRODUCT = {
  "vacuum-bottle-750": heroBottle,
  "vacuum-bottle-1000": heroBottle,
  "bottle-kids-500": heroBottle,
  "tiffin-3-tier": heroTiffin,
  "tiffin-complete-kit": heroTiffin,
  "filter-coffee-set": heroDrinkware,
  "tumbler-set-6": heroDrinkware,
  "drinkware-cup-set": heroDrinkware,
  "storage-canister-set": heroPremium,
  "serving-bowl-set": finalProducts,
  "festive-gift-box": heroPremium,
  "wedding-collection": finalProducts,
};

const clean = (value) => (typeof value === "string" && value.trim() ? value.trim() : null);

export const productImage = (product) =>
  clean(product?.image) ||
  BY_PRODUCT[product?.id] ||
  BY_CATEGORY[product?.categoryId] ||
  FALLBACK_IMAGE;

export const categoryImage = (category) =>
  clean(category?.image) || BY_CATEGORY[category?.id] || FALLBACK_IMAGE;
