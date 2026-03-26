/** Canonical categories for filters and admin (Firestore `category` field). */
export const PRODUCT_CATEGORIES = [
  "Sofas",
  "Beds",
  "Dining Tables",
  "Tables",
  "Chairs",
  "Storage",
  "Decor",
  "Other",
];

export function parseProductPrice(price) {
  const n = Number(String(price ?? "").replace(/,/g, ""));
  return Number.isFinite(n) ? n : 0;
}

/**
 * Uses `product.category` when set; otherwise infers from name for older documents.
 */
export function resolveProductCategory(product) {
  const raw = (product?.category || "").trim();
  if (raw && PRODUCT_CATEGORIES.includes(raw)) return raw;
  if (raw) return raw;

  const n = (product?.name || "").toLowerCase();

  if (/\b(sofa|couch|sectional|loveseat|recliner)\b/.test(n)) return "Sofas";
  if (/\b(bed|mattress|headboard|bunk)\b/.test(n)) return "Beds";
  if (/\b(dining|dinner table|kitchen table)\b/.test(n)) return "Dining Tables";
  if (/\b(table|desk|coffee table|side table|console|nightstand)\b/.test(n))
    return "Tables";
  if (/\b(chair|stool|bench|ottoman)\b/.test(n)) return "Chairs";
  if (/\b(wardrobe|cabinet|shelf|bookshelf|storage|drawer|dresser)\b/.test(n))
    return "Storage";
  if (/\b(lamp|rug|mirror|vase|decor|wall art)\b/.test(n)) return "Decor";

  return "Other";
}
