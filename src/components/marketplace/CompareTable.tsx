"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import { ExternalLink, Trash2, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
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

type CompareTableProps = {
  tours: MarketplaceTour[];
  onRemove: (tourId: string | number) => void;
};

type CompareRow = {
  label: string;
  render: (tour: MarketplaceTour) => ReactNode;
};

const UNKNOWN_LABEL = "Тодорхойгүй";

const rows: CompareRow[] = [
  {
    label: "Байгууллага",
    render: (tour) => tour.tenant_name || UNKNOWN_LABEL
  },
  {
    label: "Чиглэл",
    render: getDestination
  },
  {
    label: "Хугацаа",
    render: (tour) => formatDuration(tour.duration_days)
  },
  {
    label: "Үнэ",
    render: (tour) => formatPrice(tour.price, tour.currency)
  },
  {
    label: "Багтаамж",
    render: (tour) => formatCapacity(tour.capacity)
  },
  {
    label: "Эхлэх өдөр",
    render: (tour) => formatDate(tour.start_date)
  },
  {
    label: "Дуусах өдөр",
    render: (tour) => formatDate(tour.end_date)
  },
  {
    label: "Багтсан зүйлс",
    render: (tour) => tour.includes_text || UNKNOWN_LABEL
  },
  {
    label: "Багтаагүй зүйлс",
    render: (tour) => tour.excludes_text || UNKNOWN_LABEL
  }
];

const mobileRows = rows.filter(
  (row) => row.label !== "Багтсан зүйлс" && row.label !== "Багтаагүй зүйлс"
);

function TourActions({ tour }: { tour: MarketplaceTour }) {
  return (
    <div className="grid gap-2 sm:grid-cols-2 md:grid-cols-1 lg:grid-cols-2">
      <Button variant="outline" size="sm" asChild>
        <Link href={`/tours/${encodeURIComponent(getTourId(tour))}`}>
          Дэлгэрэнгүй
        </Link>
      </Button>
      <Button size="sm" asChild>
        <a href={buildTenantTourUrl(tour)} target="_blank" rel="noreferrer">
          <ExternalLink className="h-4 w-4" />
          Захиалах
        </a>
      </Button>
    </div>
  );
}

export function CompareTable({ tours, onRemove }: CompareTableProps) {
  return (
    <section aria-label="Аялал харьцуулах хүснэгт">
      <div className="grid gap-4 md:hidden">
        {tours.map((tour) => (
          <Card key={getTourId(tour)} className="overflow-hidden shadow-soft">
            <CardHeader className="gap-3 border-b bg-secondary/40">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="text-xs font-medium uppercase tracking-wide text-primary">
                    Харьцуулж байна
                  </p>
                  <CardTitle className="mt-1 text-lg leading-snug">
                    <Link
                      className="hover:text-primary hover:underline"
                      href={`/tours/${encodeURIComponent(getTourId(tour))}`}
                    >
                      {tour.title}
                    </Link>
                  </CardTitle>
                  <p className="mt-2 line-clamp-1 text-sm text-muted-foreground">
                    {tour.tenant_name || UNKNOWN_LABEL}
                  </p>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => onRemove(getTourId(tour))}
                  aria-label={`${tour.title} аяллыг харьцуулалтаас хасах`}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>

            <CardContent className="space-y-4 p-4">
              <div className="grid grid-cols-2 gap-3">
                {mobileRows.map((row) => (
                  <div key={row.label} className="rounded-md border bg-background p-3">
                    <p className="text-xs text-muted-foreground">{row.label}</p>
                    <div className="mt-1 text-sm font-medium leading-5">
                      {row.render(tour)}
                    </div>
                  </div>
                ))}
              </div>

              <div className="space-y-3 rounded-md border bg-background p-3">
                <div>
                  <p className="text-xs text-muted-foreground">Багтсан зүйлс</p>
                  <p className="mt-1 text-sm leading-6">
                    {tour.includes_text || UNKNOWN_LABEL}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Багтаагүй зүйлс</p>
                  <p className="mt-1 text-sm leading-6">
                    {tour.excludes_text || UNKNOWN_LABEL}
                  </p>
                </div>
              </div>
            </CardContent>

            <CardFooter className="grid gap-2 border-t bg-slate-50/80 p-4 pt-4">
              <TourActions tour={tour} />
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onRemove(getTourId(tour))}
              >
                <Trash2 className="h-4 w-4" />
                Хасах
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>

      <div className="hidden overflow-hidden rounded-lg border bg-card shadow-soft md:block">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[820px] border-collapse text-sm">
            <thead>
              <tr className="border-b bg-secondary/70">
                <th className="w-48 p-4 text-left font-semibold text-foreground">
                  Үзүүлэлт
                </th>
                {tours.map((tour) => (
                  <th key={getTourId(tour)} className="min-w-60 p-4 text-left">
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <Link
                          className="line-clamp-2 font-semibold leading-6 hover:text-primary hover:underline"
                          href={`/tours/${encodeURIComponent(getTourId(tour))}`}
                        >
                          {tour.title}
                        </Link>
                        <p className="mt-1 line-clamp-1 text-xs font-normal text-muted-foreground">
                          {tour.tenant_name || UNKNOWN_LABEL}
                        </p>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => onRemove(getTourId(tour))}
                        aria-label={`${tour.title} аяллыг харьцуулалтаас хасах`}
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
                  <th className="bg-muted/35 p-4 text-left align-top font-medium text-foreground">
                    {row.label}
                  </th>
                  {tours.map((tour) => (
                    <td
                      key={`${row.label}-${getTourId(tour)}`}
                      className="max-w-80 p-4 align-top leading-6 text-muted-foreground"
                    >
                      {row.render(tour)}
                    </td>
                  ))}
                </tr>
              ))}
              <tr>
                <th className="bg-muted/35 p-4 text-left align-top font-medium text-foreground">
                  Үйлдэл
                </th>
                {tours.map((tour) => (
                  <td key={`actions-${getTourId(tour)}`} className="p-4 align-top">
                    <TourActions tour={tour} />
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
