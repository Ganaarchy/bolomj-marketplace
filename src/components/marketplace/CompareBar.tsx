"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight, GitCompareArrows, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  COMPARE_UPDATED_EVENT,
  getCompareTours,
  MAX_COMPARE_TOURS,
  removeTourFromCompare
} from "@/lib/compare";
import { getTourId } from "@/lib/format";
import type { MarketplaceTour } from "@/lib/types";

export function CompareBar() {
  const [tours, setTours] = useState<MarketplaceTour[]>([]);

  useEffect(() => {
    const syncTours = () => setTours(getCompareTours());
    syncTours();

    window.addEventListener(COMPARE_UPDATED_EVENT, syncTours);
    window.addEventListener("storage", syncTours);

    return () => {
      window.removeEventListener(COMPARE_UPDATED_EVENT, syncTours);
      window.removeEventListener("storage", syncTours);
    };
  }, []);

  if (tours.length === 0) {
    return null;
  }

  return (
    <div className="fixed inset-x-0 bottom-0 z-50 border-t bg-card/96 shadow-[0_-18px_42px_rgba(15,23,42,0.14)] backdrop-blur">
      <div className="container flex flex-col gap-3 py-3 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex min-w-0 items-center gap-3">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-md bg-primary text-primary-foreground">
            <GitCompareArrows className="h-5 w-5" />
          </div>
          <div className="min-w-0">
            <p className="text-sm font-semibold">
              Харьцуулах жагсаалт ({tours.length}/{MAX_COMPARE_TOURS})
            </p>
            <p className="truncate text-sm text-muted-foreground">
              {tours.map((tour) => tour.title).join(" / ")}
            </p>
          </div>
        </div>

        <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
          <div className="flex min-w-0 flex-wrap gap-2">
            {tours.map((tour) => (
              <Button
                key={getTourId(tour)}
                variant="secondary"
                size="sm"
                onClick={() => removeTourFromCompare(getTourId(tour))}
                aria-label={`${tour.title} аяллыг харьцуулалтаас хасах`}
              >
                <X className="h-4 w-4" />
                <span className="max-w-36 truncate">{tour.title}</span>
              </Button>
            ))}
          </div>
          <Button asChild>
            <Link href="/compare">
              Харьцуулах
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
