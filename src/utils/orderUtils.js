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

const LOCAL_ORDER_STORAGE_KEY = "marutiFurniture.demoOrders";

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

export function isPermissionDeniedError(error) {
  return (
    error?.code === "permission-denied" ||
    /Missing or insufficient permissions/i.test(error?.message || "")
  );
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
    storageSource: order.storageSource || "firebase",
    syncLabel:
      order.storageSource === "local"
        ? "Saved on this device"
        : "Synced with Firebase",
  };
}

function canUseLocalStorage() {
  return typeof window !== "undefined" && Boolean(window.localStorage);
}

function serializeDate(value) {
  const normalizedDate = toDate(value);
  return normalizedDate ? normalizedDate.toISOString() : null;
}

function readStoredOrders() {
  if (!canUseLocalStorage()) return [];

  try {
    const raw = window.localStorage.getItem(LOCAL_ORDER_STORAGE_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch (error) {
    console.error("Failed to read local demo orders:", error);
    return [];
  }
}

function writeStoredOrders(orders) {
  if (!canUseLocalStorage()) return;

  try {
    window.localStorage.setItem(LOCAL_ORDER_STORAGE_KEY, JSON.stringify(orders));
  } catch (error) {
    console.error("Failed to write local demo orders:", error);
  }
}

function serializeOrder(order = {}) {
  return {
    ...order,
    createdAt: serializeDate(order.createdAt),
    updatedAt: serializeDate(order.updatedAt),
    storageSource: "local",
    statusHistory: Array.isArray(order.statusHistory)
      ? order.statusHistory.map((entry) => ({
          ...entry,
          createdAt: serializeDate(entry.createdAt),
        }))
      : [],
  };
}

export function saveLocalOrder(order = {}) {
  const currentOrders = readStoredOrders();
  const localOrder = serializeOrder({
    ...order,
    id:
      order.id ||
      `local-${Date.now()}-${Math.floor(Math.random() * 900 + 100)}`,
  });

  writeStoredOrders([localOrder, ...currentOrders]);
  return normalizeOrderData(localOrder);
}

export function getLocalOrders(userId = "") {
  return readStoredOrders()
    .filter((order) => !userId || order.userId === userId)
    .map((order) => normalizeOrderData(order));
}

export function updateLocalOrderStatus(orderId, nextStatus) {
  const currentOrders = readStoredOrders();
  let updatedOrder = null;

  const nextOrders = currentOrders.map((order) => {
    if (order.id !== orderId) return order;

    const statusHistory = Array.isArray(order.statusHistory)
      ? [...order.statusHistory]
      : [];

    const nextOrder = {
      ...order,
      status: nextStatus,
      updatedAt: new Date().toISOString(),
      statusHistory: [
        ...statusHistory,
        {
          status: nextStatus,
          note: `Admin changed demo order to ${nextStatus}.`,
          createdAt: new Date().toISOString(),
        },
      ],
    };

    updatedOrder = normalizeOrderData(nextOrder);
    return nextOrder;
  });

  writeStoredOrders(nextOrders);
  return updatedOrder;
}
