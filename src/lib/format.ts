import type { MarketplaceTour } from "@/lib/types";

const UNKNOWN = "Тодорхойгүй";

export function toNumber(value: number | string | null | undefined) {
  if (value === null || value === undefined || value === "") {
    return null;
  }

  const numericValue = typeof value === "number" ? value : Number(value);
  return Number.isFinite(numericValue) ? numericValue : null;
}

export function formatPrice(
  price: number | string | null | undefined,
  currency: string | null | undefined
) {
  const numericPrice = toNumber(price);

  if (numericPrice === null) {
    return UNKNOWN;
  }

  const safeCurrency = currency || "MNT";

  try {
    return new Intl.NumberFormat("mn-MN", {
      style: "currency",
      currency: safeCurrency,
      maximumFractionDigits: 0
    }).format(numericPrice);
  } catch {
    return `${new Intl.NumberFormat("mn-MN").format(numericPrice)} ${safeCurrency}`;
  }
}

export function formatDate(date: string | null | undefined) {
  if (!date) {
    return UNKNOWN;
  }

  const parsedDate = new Date(date);
  if (Number.isNaN(parsedDate.getTime())) {
    return UNKNOWN;
  }

  const year = parsedDate.getFullYear();
  const month = String(parsedDate.getMonth() + 1).padStart(2, "0");
  const day = String(parsedDate.getDate()).padStart(2, "0");

  return `${year}.${month}.${day}`;
}

export function formatDuration(days: number | string | null | undefined) {
  const numericDays = toNumber(days);
  if (numericDays === null) {
    return UNKNOWN;
  }

  return `${numericDays} өдөр`;
}

export function formatCapacity(capacity: number | string | null | undefined) {
  const numericCapacity = toNumber(capacity);
  if (numericCapacity === null) {
    return UNKNOWN;
  }

  return `${numericCapacity} хүн`;
}

export function formatDestination(
  country: string | null | undefined,
  city: string | null | undefined
) {
  const parts = [city, country].filter(Boolean);
  return parts.length > 0 ? parts.join(", ") : UNKNOWN;
}

export function getDestination(tour: MarketplaceTour) {
  return formatDestination(tour.destination_country, tour.destination_city);
}

export function buildTenantTourUrl(tour: MarketplaceTour) {
  const tenantHost = tour.tenant_subdomain || tour.tenant_slug;

  if (!tenantHost || !tour.slug) {
    return "https://bolomj.space";
  }

  return `https://${tenantHost}.bolomj.space/tours/${tour.slug}`;
}

export function getTourId(tour: MarketplaceTour) {
  return tour.id;
}
