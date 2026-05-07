"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { GitCompareArrows, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { getCompareTours, removeTourFromCompare } from "@/lib/compare";
import { getTourId } from "@/lib/format";
import type { MarketplaceTour } from "@/lib/types";

export function CompareBar() {
  const [tours, setTours] = useState<MarketplaceTour[]>([]);

  useEffect(() => {
    const syncTours = () => setTours(getCompareTours());
    syncTours();

    window.addEventListener("bolomj:compare-updated", syncTours);
    window.addEventListener("storage", syncTours);

    return () => {
      window.removeEventListener("bolomj:compare-updated", syncTours);
      window.removeEventListener("storage", syncTours);
    };
  }, []);

  if (tours.length === 0) {
    return null;
  }

  return (
    <div className="fixed inset-x-0 bottom-0 z-50 border-t bg-card/95 shadow-[0_-14px_36px_rgba(15,23,42,0.12)] backdrop-blur">
      <div className="container flex flex-col gap-3 py-3 md:flex-row md:items-center md:justify-between">
        <div className="flex min-w-0 items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-primary text-primary-foreground">
            <GitCompareArrows className="h-5 w-5" />
          </div>
          <div className="min-w-0">
            <p className="text-sm font-medium">Харьцуулах жагсаалт ({tours.length}/3)</p>
            <p className="truncate text-sm text-muted-foreground">
              {tours.map((tour) => tour.title).join(" · ")}
            </p>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {tours.map((tour) => (
            <Button
              key={getTourId(tour)}
              variant="secondary"
              size="sm"
              onClick={() => removeTourFromCompare(getTourId(tour))}
            >
              <X className="h-4 w-4" />
              <span className="max-w-32 truncate">{tour.title}</span>
            </Button>
          ))}
          <Button asChild>
            <Link href="/compare">Харьцуулах</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
