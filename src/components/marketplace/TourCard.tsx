import Link from "next/link";
import {
  Building2,
  CalendarDays,
  ExternalLink,
  MapPin,
  Star,
  Users
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import { CompareButton } from "@/components/marketplace/CompareButton";
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

type TourCardProps = {
  tour: MarketplaceTour;
};

export function TourCard({ tour }: TourCardProps) {
  const tenantUrl = buildTenantTourUrl(tour);

  return (
    <Card className="flex h-full overflow-hidden shadow-soft">
      <div className="flex w-full flex-col">
        <div className="relative h-36 bg-[radial-gradient(circle_at_20%_20%,rgba(250,204,21,0.85),transparent_28%),linear-gradient(135deg,#0f766e,#38bdf8_48%,#f59e0b)]">
          <div className="absolute inset-x-4 top-4 flex items-center justify-between gap-2">
            {tour.is_featured ? (
              <Badge className="bg-accent text-accent-foreground">
                <Star className="mr-1 h-3 w-3" />
                Онцлох
              </Badge>
            ) : (
              <span />
            )}
            <Badge variant="secondary">Marketplace</Badge>
          </div>
          <div className="absolute bottom-4 left-4 right-4">
            <div className="rounded-md bg-white/88 p-3 backdrop-blur">
              <p className="line-clamp-1 text-sm font-medium text-slate-800">
                {getDestination(tour)}
              </p>
              <p className="mt-1 text-xs text-slate-600">
                {formatDate(tour.start_date)} - {formatDate(tour.end_date)}
              </p>
            </div>
          </div>
        </div>

        <CardHeader>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Building2 className="h-4 w-4" />
            <span className="line-clamp-1">{tour.tenant_name || "Tenant"}</span>
          </div>
          <CardTitle className="line-clamp-2 leading-snug">{tour.title}</CardTitle>
        </CardHeader>

        <CardContent className="flex-1 space-y-4">
          <p className="line-clamp-3 text-sm leading-6 text-muted-foreground">
            {tour.description || "Аяллын дэлгэрэнгүй мэдээлэл удахгүй нэмэгдэнэ."}
          </p>

          <div className="grid grid-cols-2 gap-3 text-sm">
            <div className="flex items-center gap-2 rounded-md bg-muted p-3">
              <CalendarDays className="h-4 w-4 text-primary" />
              <span>{formatDuration(tour.duration_days)}</span>
            </div>
            <div className="flex items-center gap-2 rounded-md bg-muted p-3">
              <Users className="h-4 w-4 text-primary" />
              <span>{formatCapacity(tour.capacity)}</span>
            </div>
            <div className="col-span-2 flex items-center gap-2 rounded-md bg-muted p-3">
              <MapPin className="h-4 w-4 text-primary" />
              <span className="line-clamp-1">{getDestination(tour)}</span>
            </div>
          </div>

          <div>
            <p className="text-sm text-muted-foreground">Үнэ</p>
            <p className="text-2xl font-semibold">
              {formatPrice(tour.price, tour.currency)}
            </p>
          </div>
        </CardContent>

        <CardFooter className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <CompareButton tour={tour} compact />
          <div className="flex w-full gap-2 sm:w-auto">
            <Button className="flex-1 sm:flex-none" variant="outline" asChild>
              <Link href={`/tours/${encodeURIComponent(getTourId(tour))}`}>
                Дэлгэрэнгүй
              </Link>
            </Button>
            <Button className="flex-1 sm:flex-none" asChild>
              <a href={tenantUrl} target="_blank" rel="noreferrer">
                <ExternalLink className="h-4 w-4" />
                Очих
              </a>
            </Button>
          </div>
        </CardFooter>
      </div>
    </Card>
  );
}
