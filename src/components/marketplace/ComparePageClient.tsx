"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Trash2 } from "lucide-react";

import { CompareTable } from "@/components/marketplace/CompareTable";
import { EmptyState } from "@/components/marketplace/EmptyState";
import { Button } from "@/components/ui/button";
import {
  clearCompareTours,
  COMPARE_UPDATED_EVENT,
  getCompareTours,
  MAX_COMPARE_TOURS,
  removeTourFromCompare
} from "@/lib/compare";
import type { MarketplaceTour } from "@/lib/types";

export function ComparePageClient() {
  const router = useRouter();
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

  function handleRemove(tourId: string | number) {
    setTours(removeTourFromCompare(tourId));
  }

  function handleClear() {
    setTours(clearCompareTours());
  }

  return (
    <main className="container space-y-6 py-8">
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-sm font-medium text-primary">Харьцуулалт</p>
          <h1 className="mt-1 text-3xl font-semibold tracking-normal md:text-5xl">
            Аялал харьцуулах
          </h1>
          <p className="mt-3 max-w-2xl text-muted-foreground">
            Хамгийн ихдээ {MAX_COMPARE_TOURS} аяллыг хадгалж үнэ, хугацаа,
            багтаамж, багтсан зүйлсээр нь зэрэгцүүлэн харна.
          </p>
        </div>
        <div className="flex flex-col gap-2 sm:flex-row">
          <Button variant="outline" asChild>
            <Link href="/">Аялал нэмэх</Link>
          </Button>
          <Button
            variant="destructive"
            onClick={handleClear}
            disabled={tours.length === 0}
          >
            <Trash2 className="h-4 w-4" />
            Бүгдийг цэвэрлэх
          </Button>
        </div>
      </div>

      {tours.length === 0 ? (
        <EmptyState
          title="Харьцуулах аялал алга"
          description="Маркетплейсээс 1-3 аялал сонгож харьцуулах жагсаалт үүсгэнэ үү."
          actionLabel="Маркетплейс рүү буцах"
          onAction={() => router.push("/")}
        />
      ) : (
        <CompareTable tours={tours} onRemove={handleRemove} />
      )}
    </main>
  );
}
