"use client";

import { getTourId } from "@/lib/format";
import type { MarketplaceTour } from "@/lib/types";
import { STORAGE_KEYS } from "@/lib/types";

export const MAX_COMPARE_TOURS = 3;
export const COMPARE_UPDATED_EVENT = "bolomj:compare-updated";

export type CompareResult =
  | { ok: true; tours: MarketplaceTour[] }
  | { ok: false; tours: MarketplaceTour[]; message: string };

function canUseStorage() {
  return typeof window !== "undefined" && Boolean(window.localStorage);
}

function emitCompareUpdated() {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new Event(COMPARE_UPDATED_EVENT));
  }
}

function normalizeCompareTours(tours: unknown): MarketplaceTour[] {
  if (!Array.isArray(tours)) {
    return [];
  }

  const tourIds = new Set<string>();
  const normalizedTours: MarketplaceTour[] = [];

  for (const tour of tours) {
    if (!tour || typeof tour !== "object") {
      continue;
    }

    const candidateTour = tour as MarketplaceTour;
    const tourId = getTourId(candidateTour);

    if (!tourId || tourIds.has(tourId)) {
      continue;
    }

    tourIds.add(tourId);
    normalizedTours.push({
      ...candidateTour,
      cover_image_url:
        typeof candidateTour.cover_image_url === "string" &&
        candidateTour.cover_image_url.trim()
          ? candidateTour.cover_image_url.trim()
          : null
    });

    if (normalizedTours.length === MAX_COMPARE_TOURS) {
      break;
    }
  }

  return normalizedTours;
}

function areToursEqual(left: MarketplaceTour[], right: MarketplaceTour[]) {
  if (left.length !== right.length) {
    return false;
  }

  return left.every((tour, index) => getTourId(tour) === getTourId(right[index]));
}

export function getCompareTours(): MarketplaceTour[] {
  if (!canUseStorage()) {
    return [];
  }

  try {
    const rawValue = window.localStorage.getItem(STORAGE_KEYS.compareTours);
    if (!rawValue) {
      return [];
    }

    const parsedValue = JSON.parse(rawValue);
    const normalizedTours = normalizeCompareTours(parsedValue);

    if (!areToursEqual(normalizedTours, parsedValue)) {
      window.localStorage.setItem(
        STORAGE_KEYS.compareTours,
        JSON.stringify(normalizedTours)
      );
    }

    return normalizedTours;
  } catch {
    return [];
  }
}

function saveCompareTours(tours: MarketplaceTour[]) {
  if (!canUseStorage()) {
    return;
  }

  window.localStorage.setItem(
    STORAGE_KEYS.compareTours,
    JSON.stringify(normalizeCompareTours(tours))
  );
  emitCompareUpdated();
}

export function addTourToCompare(tour: MarketplaceTour): CompareResult {
  const tours = getCompareTours();
  const tourId = getTourId(tour);

  if (tours.some((item) => getTourId(item) === tourId)) {
    return {
      ok: false,
      tours,
      message: "Энэ аялал аль хэдийн харьцуулах жагсаалтад байна."
    };
  }

  if (tours.length >= MAX_COMPARE_TOURS) {
    return {
      ok: false,
      tours,
      message: "Хамгийн ихдээ 3 аялал харьцуулж болно."
    };
  }

  const nextTours = [...tours, tour];
  saveCompareTours(nextTours);

  return { ok: true, tours: nextTours };
}

export function removeTourFromCompare(tourId: string | number) {
  const normalizedTourId = String(tourId);
  const nextTours = getCompareTours().filter(
    (tour) => getTourId(tour) !== normalizedTourId
  );
  saveCompareTours(nextTours);
  return nextTours;
}

export function clearCompareTours() {
  saveCompareTours([]);
  return [];
}

export function isTourInCompare(tourId: string | number) {
  const normalizedTourId = String(tourId);
  return getCompareTours().some((tour) => getTourId(tour) === normalizedTourId);
}
