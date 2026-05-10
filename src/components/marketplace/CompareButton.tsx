"use client";

import { useEffect, useState } from "react";
import { Check, GitCompareArrows, Minus } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  addTourToCompare,
  COMPARE_UPDATED_EVENT,
  isTourInCompare,
  removeTourFromCompare
} from "@/lib/compare";
import { getTourId } from "@/lib/format";
import type { MarketplaceTour } from "@/lib/types";

type CompareButtonProps = {
  tour: MarketplaceTour;
  compact?: boolean;
};

export function CompareButton({ tour, compact = false }: CompareButtonProps) {
  const [isAdded, setIsAdded] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const tourId = getTourId(tour);

  useEffect(() => {
    const syncState = () => setIsAdded(isTourInCompare(tourId));
    syncState();

    window.addEventListener(COMPARE_UPDATED_EVENT, syncState);
    window.addEventListener("storage", syncState);

    return () => {
      window.removeEventListener(COMPARE_UPDATED_EVENT, syncState);
      window.removeEventListener("storage", syncState);
    };
  }, [tourId]);

  useEffect(() => {
    if (!message) {
      return;
    }

    const timeout = window.setTimeout(() => setMessage(null), 2400);
    return () => window.clearTimeout(timeout);
  }, [message]);

  function handleClick() {
    if (isAdded) {
      removeTourFromCompare(tourId);
      setIsAdded(false);
      setMessage("Харьцуулалтаас хаслаа.");
      return;
    }

    const result = addTourToCompare(tour);
    setIsAdded(result.ok);
    setMessage(result.ok ? "Харьцуулах жагсаалтад нэмлээ." : result.message);
  }

  return (
    <div className="relative">
      <Button
        className={compact ? "w-full" : undefined}
        type="button"
        variant={isAdded ? "secondary" : "outline"}
        size={compact ? "sm" : "default"}
        onClick={handleClick}
        aria-pressed={isAdded}
      >
        {isAdded ? (
          <Check className="h-4 w-4" />
        ) : (
          <GitCompareArrows className="h-4 w-4" />
        )}
        {isAdded ? "Нэмэгдсэн" : "Харьцуулах"}
        {isAdded ? <Minus className="h-3.5 w-3.5 opacity-70" /> : null}
      </Button>
      {message ? (
        <div
          className="absolute right-0 top-full z-20 mt-2 w-64 rounded-md border bg-card p-3 text-xs shadow-soft"
          aria-live="polite"
        >
          {message}
        </div>
      ) : null}
    </div>
  );
}
