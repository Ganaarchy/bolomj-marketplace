"use client";

import { useCallback, useMemo, useState } from "react";

import { CompareBar } from "@/components/marketplace/CompareBar";
import { HeroSection } from "@/components/marketplace/HeroSection";
import {
  TourFilters,
  type TourFilterValues
} from "@/components/marketplace/TourFilters";
import { TourGrid } from "@/components/marketplace/TourGrid";
import { getDestination, toNumber } from "@/lib/format";
import type { DurationFilterValue, MarketplaceTour } from "@/lib/types";

type MarketplaceHomeProps = {
  tours: MarketplaceTour[];
};

const defaultFilters: TourFilterValues = {
  search: "",
  country: "all",
  city: "all",
  tenant: "all",
  duration: "all",
  featured: "all",
  sort: "featured"
};

function normalize(value: string | null | undefined) {
  return (value || "").toLocaleLowerCase("mn-MN").trim();
}

function uniqueSorted(values: Array<string | null | undefined>) {
  return Array.from(
    new Set(values.filter((item): item is string => Boolean(item)))
  ).sort((a, b) => a.localeCompare(b, "mn-MN"));
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

function newestTime(tour: MarketplaceTour) {
  const date = tour.created_at || tour.updated_at || tour.start_date;
  if (!date) {
    return 0;
  }

  const time = new Date(date).getTime();
  return Number.isNaN(time) ? 0 : time;
}

export function MarketplaceHome({ tours }: MarketplaceHomeProps) {
  const [filters, setFilters] = useState<TourFilterValues>(defaultFilters);

  const countries = useMemo(
    () => uniqueSorted(tours.map((tour) => tour.destination_country)),
    [tours]
  );
  const cities = useMemo(
    () => uniqueSorted(tours.map((tour) => tour.destination_city)),
    [tours]
  );
  const tenants = useMemo(
    () => uniqueSorted(tours.map((tour) => tour.tenant_name)),
    [tours]
  );

  const filteredTours = useMemo(() => {
    const searchValue = normalize(filters.search);

    return tours
      .filter((tour) => {
        const isPublished =
          tour.published_to_marketplace !== false && tour.status === "published";

        if (!isPublished) {
          return false;
        }

        const matchesSearch =
          !searchValue ||
          [
            tour.title,
            tour.destination_country,
            tour.destination_city,
            tour.tenant_name
          ].some((item) => normalize(item).includes(searchValue));

        return (
          matchesSearch &&
          (filters.country === "all" ||
            tour.destination_country === filters.country) &&
          (filters.city === "all" || tour.destination_city === filters.city) &&
          (filters.tenant === "all" || tour.tenant_name === filters.tenant) &&
          (filters.featured === "all" || tour.is_featured) &&
          matchesDuration(tour.duration_days, filters.duration)
        );
      })
      .sort((a, b) => {
        if (filters.sort === "featured") {
          const featuredDelta = Number(b.is_featured) - Number(a.is_featured);
          return featuredDelta || newestTime(b) - newestTime(a);
        }

        if (filters.sort === "newest") {
          return newestTime(b) - newestTime(a);
        }

        const aPrice = toNumber(a.price);
        const bPrice = toNumber(b.price);

        if (aPrice === null && bPrice === null) {
          return 0;
        }

        if (aPrice === null) {
          return 1;
        }

        if (bPrice === null) {
          return -1;
        }

        return filters.sort === "price-asc" ? aPrice - bPrice : bPrice - aPrice;
      });
  }, [filters, tours]);

  const handleFilterChange = useCallback((values: TourFilterValues) => {
    setFilters((currentValues) =>
      JSON.stringify(currentValues) === JSON.stringify(values)
        ? currentValues
        : values
    );
  }, []);

  const resetFilters = useCallback(() => {
    setFilters(defaultFilters);
  }, []);

  return (
    <>
      <HeroSection
        totalTours={tours.length}
        featuredTours={tours.filter((tour) => tour.is_featured).length}
        destinations={countries}
      />

      <main id="marketplace-tours" className="container space-y-6 py-8 pb-28">
        <TourFilters
          values={filters}
          countries={countries}
          cities={cities}
          tenants={tenants}
          resultCount={filteredTours.length}
          totalCount={tours.length}
          onChange={handleFilterChange}
          onReset={resetFilters}
        />

        <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="text-2xl font-semibold tracking-normal">
              Нийтлэгдсэн аяллууд
            </h2>
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
