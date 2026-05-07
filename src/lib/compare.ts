"use client";

import type { MarketplaceTour } from "@/lib/types";
import { getTourId } from "@/lib/format";

const COMPARE_STORAGE_KEY = "bolomj-marketplace-compare";
export const MAX_COMPARE_TOURS = 3;

export type CompareResult =
  | { ok: true; tours: MarketplaceTour[] }
  | { ok: false; tours: MarketplaceTour[]; message: string };

function canUseStorage() {
  return typeof window !== "undefined" && Boolean(window.localStorage);
}

function emitCompareUpdated() {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new Event("bolomj:compare-updated"));
  }
}

export function getCompareTours(): MarketplaceTour[] {
  if (!canUseStorage()) {
    return [];
  }

  try {
    const rawValue = window.localStorage.getItem(COMPARE_STORAGE_KEY);
    if (!rawValue) {
      return [];
    }

    const parsedValue = JSON.parse(rawValue);
    return Array.isArray(parsedValue) ? parsedValue : [];
  } catch {
    return [];
  }
}

function saveCompareTours(tours: MarketplaceTour[]) {
  if (!canUseStorage()) {
    return;
  }

  window.localStorage.setItem(COMPARE_STORAGE_KEY, JSON.stringify(tours));
  emitCompareUpdated();
}

export function addTourToCompare(tour: MarketplaceTour): CompareResult {
  const tours = getCompareTours();
  const tourId = getTourId(tour);

  if (tours.some((item) => getTourId(item) === tourId)) {
    return {
      ok: false,
      tours,
      message: "Энэ аялал харьцуулах жагсаалтад байна."
    };
  }

  if (tours.length >= MAX_COMPARE_TOURS) {
    return {
      ok: false,
      tours,
      message: "Хамгийн ихдээ 3 аялал харьцуулна."
    };
  }

  const nextTours = [...tours, tour];
  saveCompareTours(nextTours);

  return { ok: true, tours: nextTours };
}

export function removeTourFromCompare(tourId: string | number) {
  const nextTours = getCompareTours().filter(
    (tour) => getTourId(tour) !== String(tourId)
  );
  saveCompareTours(nextTours);
  return nextTours;
}

export function clearCompareTours() {
  saveCompareTours([]);
  return [];
}

export function isTourInCompare(tourId: string | number) {
  return getCompareTours().some((tour) => getTourId(tour) === String(tourId));
}
