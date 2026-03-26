export const ORDER_STATUS_SEQUENCE = [
  "Awaiting Approval",
  "Confirmed",
  "Shipped",
  "Delivered",
];

export const ORDER_STATUSES = [...ORDER_STATUS_SEQUENCE, "Cancelled"];

export const PAYMENT_OPTIONS = [
  {
    value: "cod",
    label: "Cash on Delivery",
    description: "Pay when the product is delivered to your address.",
  },
  {
    value: "demo_card",
    label: "Demo Online Card",
    description: "A demo success flow for card payments in this project.",
  },
];

export const DEFAULT_ADDRESS = {
  fullName: "",
  phone: "",
  address: "",
  city: "",
  state: "",
  zipCode: "",
  country: "India",
  landmark: "",
};

const currencyFormatter = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  maximumFractionDigits: 0,
});

const dateFormatter = new Intl.DateTimeFormat("en-IN", {
  day: "2-digit",
  month: "short",
  year: "numeric",
});

export function formatOrderCurrency(value) {
  return currencyFormatter.format(Math.round(Number(value) || 0));
}

export function formatOrderDate(value) {
  const date = toDate(value);
  return date ? dateFormatter.format(date) : "N/A";
}

export function computeOrderShipping(subtotal) {
  return Number(subtotal) >= 50000 ? 0 : 2500;
}

export function createOrderNumber() {
  const stamp = Date.now().toString().slice(-8);
  const suffix = Math.floor(Math.random() * 900 + 100);
  return `MF-${stamp}-${suffix}`;
}

export function hasCompleteAddress(address = {}) {
  return ["fullName", "phone", "address", "city", "state", "zipCode", "country"].every(
    (key) => String(address[key] || "").trim()
  );
}

export function buildAddressText(address = {}) {
  return [
    address.address,
    address.landmark,
    address.city,
    address.state,
    address.zipCode,
    address.country,
  ]
    .filter(Boolean)
    .join(", ");
}

export function getOrderStatusTone(status) {
  switch (status) {
    case "Delivered":
      return "success";
    case "Shipped":
      return "info";
    case "Confirmed":
      return "accent";
    case "Cancelled":
      return "danger";
    case "Awaiting Approval":
    default:
      return "warning";
  }
}

export function getStatusSteps(status) {
  const currentIndex = ORDER_STATUS_SEQUENCE.indexOf(status);

  return ORDER_STATUS_SEQUENCE.map((step, index) => ({
    label: step,
    done: currentIndex > index,
    current: currentIndex === index,
  }));
}

export function toDate(value) {
  if (!value) return null;
  if (value instanceof Date) return value;
  if (typeof value?.toDate === "function") return value.toDate();
  if (typeof value?.seconds === "number") return new Date(value.seconds * 1000);
  if (typeof value?._seconds === "number") return new Date(value._seconds * 1000);

  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
}

export function normalizeOrderData(order = {}) {
  return {
    ...order,
    subtotal: Number(order.subtotal) || 0,
    shipping: Number(order.shipping) || 0,
    total: Number(order.total) || 0,
    createdAt: toDate(order.createdAt),
    updatedAt: toDate(order.updatedAt),
    items: Array.isArray(order.items) ? order.items : [],
    shippingAddress: order.shippingAddress || DEFAULT_ADDRESS,
    paymentMethod: order.paymentMethod || "Cash on Delivery",
    paymentStatus: order.paymentStatus || "Pending",
    status: order.status || "Awaiting Approval",
  };
}
