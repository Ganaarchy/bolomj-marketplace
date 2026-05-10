import { getStoredUser, getToken, logout } from "@/lib/auth";
import type {
  ApiErrorResponse,
  ApiResponse,
  AuthUser,
  BookingCreatePayload,
  BookingCreateResponse,
  CustomerRegisterPayload,
  LoginPayload,
  LoginResponse,
  MarketplaceTour,
  MyBooking
} from "@/lib/types";

const DEFAULT_API_BASE_URL = "https://api.bolomj.space";

type ApiFetchOptions = Omit<RequestInit, "body"> & {
  auth?: boolean | "customer";
  body?: unknown;
  next?: {
    revalidate?: number;
  };
};

export function getApiBaseUrl() {
  return (process.env.NEXT_PUBLIC_API_BASE_URL || DEFAULT_API_BASE_URL).replace(
    /\/$/,
    ""
  );
}

export function unwrapApiResponse<T>(payload: ApiResponse<T>): T {
  if (
    payload &&
    typeof payload === "object" &&
    !Array.isArray(payload) &&
    "data" in payload
  ) {
    return payload.data;
  }

  return payload as T;
}

async function readErrorMessage(response: Response) {
  const fallback = `API хүсэлт амжилтгүй боллоо (${response.status})`;

  try {
    const text = await response.text();
    if (!text) {
      return fallback;
    }

    const payload = JSON.parse(text) as ApiErrorResponse;

    if (typeof payload.message === "string") {
      return payload.message;
    }

    if (typeof payload.error === "string") {
      return payload.error;
    }

    return text;
  } catch {
    return fallback;
  }
}

function redirectToLogin() {
  if (typeof window !== "undefined") {
    window.location.assign("/login");
  }
}

export async function apiFetch<T>(path: string, options: ApiFetchOptions = {}) {
  const { auth = false, body, headers, next, ...init } = options;
  const requestHeaders = new Headers(headers);
  requestHeaders.set("Accept", "application/json");

  if (body !== undefined && !requestHeaders.has("Content-Type")) {
    requestHeaders.set("Content-Type", "application/json");
  }

  if (auth) {
    const token = getToken();
    const shouldSendToken =
      auth === true || (auth === "customer" && getStoredUser()?.role === "customer");

    if (token && shouldSendToken) {
      requestHeaders.set("Authorization", `Bearer ${token}`);
    }
  }

  const response = await fetch(`${getApiBaseUrl()}${path}`, {
    ...init,
    body: body === undefined ? undefined : JSON.stringify(body),
    headers: requestHeaders,
    next: next ?? { revalidate: 60 }
  });

  if (!response.ok) {
    const message = await readErrorMessage(response);

    if (response.status === 401) {
      logout();
      redirectToLogin();
    }

    throw new Error(message);
  }

  if (response.status === 204) {
    return undefined as T;
  }

  const text = await response.text();
  if (!text) {
    return undefined as T;
  }

  const payload = JSON.parse(text) as ApiResponse<T>;
  return unwrapApiResponse<T>(payload);
}

export function fetchMarketplaceTours() {
  return apiFetch<MarketplaceTour[]>("/public/marketplace/tours");
}

export function fetchMarketplaceTour(id: string) {
  return apiFetch<MarketplaceTour>(
    `/public/marketplace/tours/${encodeURIComponent(id)}`
  );
}

export function loginCustomer(payload: LoginPayload) {
  return apiFetch<LoginResponse>("/auth/customer/login", {
    method: "POST",
    body: payload
  });
}

export function registerCustomer(payload: CustomerRegisterPayload) {
  return apiFetch<LoginResponse>("/auth/customer/register", {
    method: "POST",
    body: payload
  });
}

export function fetchCurrentUser() {
  return apiFetch<AuthUser>("/auth/me", {
    auth: true,
    next: { revalidate: 0 }
  });
}

export function createBooking(payload: BookingCreatePayload) {
  return apiFetch<BookingCreateResponse>("/bookings", {
    method: "POST",
    auth: "customer",
    body: payload,
    next: { revalidate: 0 }
  });
}

export function fetchCustomerBookings() {
  return apiFetch<MyBooking[]>("/customer/bookings", {
    auth: true,
    next: { revalidate: 0 }
  });
}

export function fetchCustomerBooking(id: string) {
  return apiFetch<MyBooking>(`/customer/bookings/${encodeURIComponent(id)}`, {
    auth: true,
    next: { revalidate: 0 }
  });
}
