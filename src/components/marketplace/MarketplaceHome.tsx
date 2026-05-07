"use client";

import { useMemo, useState } from "react";

import { CompareBar } from "@/components/marketplace/CompareBar";
import { TourFilters } from "@/components/marketplace/TourFilters";
import { TourGrid } from "@/components/marketplace/TourGrid";
import { Badge } from "@/components/ui/badge";
import { getDestination, toNumber } from "@/lib/format";
import type {
  DurationFilterValue,
  MarketplaceTour,
  PriceSortValue
} from "@/lib/types";

type MarketplaceHomeProps = {
  tours: MarketplaceTour[];
};

function normalize(value: string | null | undefined) {
  return (value || "").toLocaleLowerCase("mn-MN").trim();
}

function matchesDuration(
  days: number | string | null | undefined,
  duration: DurationFilterValue
) {
  const numericDays = toNumber(days);

  if (duration === "all") {
    return true;
  }

  if (numericDays === null) {
    return false;
  }

  if (duration === "1-3") {
    return numericDays >= 1 && numericDays <= 3;
  }

  if (duration === "4-7") {
    return numericDays >= 4 && numericDays <= 7;
  }

  if (duration === "8-14") {
    return numericDays >= 8 && numericDays <= 14;
  }

  return numericDays >= 15;
}

export function MarketplaceHome({ tours }: MarketplaceHomeProps) {
  const [search, setSearch] = useState("");
  const [destination, setDestination] = useState("all");
  const [duration, setDuration] = useState<DurationFilterValue>("all");
  const [sort, setSort] = useState<PriceSortValue>("featured");

  const destinations = useMemo(() => {
    return Array.from(
      new Set(
        tours
          .map((tour) => tour.destination_country)
          .filter((item): item is string => Boolean(item))
      )
    ).sort((a, b) => a.localeCompare(b));
  }, [tours]);

  const filteredTours = useMemo(() => {
    const searchValue = normalize(search);

    return tours
      .filter((tour) => {
        const isPublished =
          tour.published_to_marketplace !== false && tour.status === "published";

        if (!isPublished) {
          return false;
        }

        const matchesDestination =
          destination === "all" || tour.destination_country === destination;
        const matchesSearch =
          !searchValue ||
          [
            tour.title,
            tour.destination_country,
            tour.destination_city,
            tour.tenant_name
          ].some((item) => normalize(item).includes(searchValue));

        return (
          matchesDestination &&
          matchesDuration(tour.duration_days, duration) &&
          matchesSearch
        );
      })
      .sort((a, b) => {
        if (sort === "featured") {
          return Number(b.is_featured) - Number(a.is_featured);
        }

        const featuredDelta = Number(b.is_featured) - Number(a.is_featured);
        if (featuredDelta !== 0) {
          return featuredDelta;
        }

        const aPrice = toNumber(a.price) ?? Number.POSITIVE_INFINITY;
        const bPrice = toNumber(b.price) ?? Number.POSITIVE_INFINITY;

        return sort === "price-asc" ? aPrice - bPrice : bPrice - aPrice;
      });
  }, [destination, duration, search, sort, tours]);

  function resetFilters() {
    setSearch("");
    setDestination("all");
    setDuration("all");
    setSort("featured");
  }

  return (
    <>
      <section className="relative overflow-hidden border-b bg-card">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_12%_18%,rgba(20,184,166,0.18),transparent_26%),radial-gradient(circle_at_82%_12%,rgba(245,158,11,0.24),transparent_24%)]" />
        <div className="container relative grid gap-8 py-12 md:grid-cols-[1.1fr_0.9fr] md:items-center md:py-16">
          <div>
            <Badge variant="secondary">Public travel marketplace</Badge>
            <h1 className="mt-5 max-w-3xl text-balance text-4xl font-semibold tracking-normal md:text-6xl">
              Аяллын компаниудын нийтэлсэн аяллуудыг нэг дороос
            </h1>
            <p className="mt-5 max-w-2xl text-lg leading-8 text-muted-foreground">
              Улс, хот, хугацаа, үнээр шүүж аяллаа сонгоод захиалгыг тухайн
              tenant-ийн website дээр үргэлжлүүлнэ.
            </p>
          </div>
          <div className="grid gap-3 rounded-lg border bg-background/80 p-4 shadow-soft backdrop-blur">
            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-md bg-card p-4">
                <p className="text-3xl font-semibold">{tours.length}</p>
                <p className="text-sm text-muted-foreground">Нийт аялал</p>
              </div>
              <div className="rounded-md bg-card p-4">
                <p className="text-3xl font-semibold">
                  {tours.filter((tour) => tour.is_featured).length}
                </p>
                <p className="text-sm text-muted-foreground">Онцлох аялал</p>
              </div>
              <div className="col-span-2 rounded-md bg-primary p-4 text-primary-foreground">
                <p className="text-sm opacity-90">Чиглэлүүд</p>
                <p className="mt-1 line-clamp-2 text-lg font-medium">
                  {destinations.length > 0 ? destinations.join(" · ") : "Одоогоор алга"}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <main className="container space-y-6 py-8 pb-28">
        <TourFilters
          search={search}
          destination={destination}
          duration={duration}
          sort={sort}
          destinations={destinations}
          onSearchChange={setSearch}
          onDestinationChange={setDestination}
          onDurationChange={setDuration}
          onSortChange={setSort}
        />

        <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="text-2xl font-semibold tracking-normal">Нийтлэгдсэн аяллууд</h2>
            <p className="text-sm text-muted-foreground">
              {filteredTours.length} аялал олдлоо
            </p>
          </div>
          {filteredTours[0] ? (
            <p className="text-sm text-muted-foreground">
              Эхний чиглэл: {getDestination(filteredTours[0])}
            </p>
          ) : null}
        </div>

        <TourGrid tours={filteredTours} onResetFilters={resetFilters} />
      </main>

      <CompareBar />
    </>
  );
}
