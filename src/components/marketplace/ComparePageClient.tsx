"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ExternalLink, Trash2, X } from "lucide-react";

import { EmptyState } from "@/components/marketplace/EmptyState";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  clearCompareTours,
  getCompareTours,
  removeTourFromCompare
} from "@/lib/compare";
import {
  buildTenantTourUrl,
  formatCapacity,
  formatDate,
  formatDuration,
  formatPrice,
  getDestination,
  getTourId
} from "@/lib/format";
import type { MarketplaceTour } from "@/lib/types";

const rows = [
  {
    label: "Аялал",
    render: (tour: MarketplaceTour) => (
      <Link
        className="font-medium text-primary hover:underline"
        href={`/tours/${encodeURIComponent(getTourId(tour))}`}
      >
        {tour.title}
      </Link>
    )
  },
  {
    label: "Tenant",
    render: (tour: MarketplaceTour) => tour.tenant_name || "Тодорхойгүй"
  },
  {
    label: "Чиглэл",
    render: getDestination
  },
  {
    label: "Хугацаа",
    render: (tour: MarketplaceTour) => formatDuration(tour.duration_days)
  },
  {
    label: "Үнэ",
    render: (tour: MarketplaceTour) => formatPrice(tour.price, tour.currency)
  },
  {
    label: "Багтаамж",
    render: (tour: MarketplaceTour) => formatCapacity(tour.capacity)
  },
  {
    label: "Эхлэх",
    render: (tour: MarketplaceTour) => formatDate(tour.start_date)
  },
  {
    label: "Дуусах",
    render: (tour: MarketplaceTour) => formatDate(tour.end_date)
  },
  {
    label: "Багтсан",
    render: (tour: MarketplaceTour) => tour.includes_text || "Тодорхойгүй"
  },
  {
    label: "Багтаагүй",
    render: (tour: MarketplaceTour) => tour.excludes_text || "Тодорхойгүй"
  },
  {
    label: "Захиалах",
    render: (tour: MarketplaceTour) => (
      <Button size="sm" asChild>
        <a href={buildTenantTourUrl(tour)} target="_blank" rel="noreferrer">
          <ExternalLink className="h-4 w-4" />
          Захиалах
        </a>
      </Button>
    )
  }
];

export function ComparePageClient() {
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
          <p className="text-sm font-medium text-primary">Compare</p>
          <h1 className="mt-1 text-3xl font-semibold tracking-normal md:text-5xl">
            Аялал харьцуулах
          </h1>
          <p className="mt-3 max-w-2xl text-muted-foreground">
            Хамгийн ихдээ 3 аяллыг хадгалж үнэ, хугацаа, багтаамж, багтсан
            зүйлсээр нь зэрэгцүүлэн харна.
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" asChild>
            <Link href="/">Аялал нэмэх</Link>
          </Button>
          <Button
            variant="destructive"
            onClick={handleClear}
            disabled={tours.length === 0}
          >
            <Trash2 className="h-4 w-4" />
            Цэвэрлэх
          </Button>
        </div>
      </div>

      {tours.length === 0 ? (
        <EmptyState
          title="Харьцуулах аялал алга"
          description="Нүүр хуудаснаас 1-3 аялал сонгож харьцуулна уу."
        />
      ) : (
        <Card className="overflow-hidden shadow-soft">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[760px] border-collapse text-sm">
              <thead>
                <tr className="border-b bg-muted/70">
                  <th className="w-44 p-4 text-left font-medium">Үзүүлэлт</th>
                  {tours.map((tour) => (
                    <th key={getTourId(tour)} className="min-w-56 p-4 text-left">
                      <div className="flex items-start justify-between gap-3">
                        <span className="line-clamp-2 font-semibold">{tour.title}</span>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleRemove(getTourId(tour))}
                          aria-label="Хасах"
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {rows.map((row) => (
                  <tr key={row.label} className="border-b last:border-b-0">
                    <th className="bg-muted/35 p-4 text-left align-top font-medium">
                      {row.label}
                    </th>
                    {tours.map((tour) => (
                      <td
                        key={`${row.label}-${getTourId(tour)}`}
                        className="max-w-72 p-4 align-top leading-6 text-muted-foreground"
                      >
                        {row.render(tour)}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}
    </main>
  );
}
