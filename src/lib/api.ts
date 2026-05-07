import type { ApiDataResponse, MarketplaceTour } from "@/lib/types";

const DEFAULT_API_BASE_URL = "https://api.bolomj.space";

type NextRequestInit = RequestInit & {
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

export function unwrapApiResponse<T>(payload: ApiDataResponse<T>): T {
  if (
    payload &&
    typeof payload === "object" &&
    !Array.isArray(payload) &&
    "data" in payload
  ) {
    return payload.data as T;
  }

  return payload as T;
}

async function readErrorMessage(response: Response) {
  const fallback = `API хүсэлт амжилтгүй боллоо (${response.status})`;

  try {
    const payload = (await response.json()) as {
      message?: unknown;
      error?: unknown;
    };

    if (typeof payload.message === "string") {
      return payload.message;
    }

    if (typeof payload.error === "string") {
      return payload.error;
    }
  } catch {
    try {
      const text = await response.text();
      if (text) {
        return text;
      }
    } catch {
      return fallback;
    }
  }

  return fallback;
}

export async function apiFetch<T>(path: string, init?: NextRequestInit) {
  const response = await fetch(`${getApiBaseUrl()}${path}`, {
    ...init,
    headers: {
      Accept: "application/json",
      ...init?.headers
    },
    next: init?.next ?? { revalidate: 60 }
  });

  if (!response.ok) {
    throw new Error(await readErrorMessage(response));
  }

  const payload = (await response.json()) as ApiDataResponse<T>;
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
