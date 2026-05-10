import Link from "next/link";
import {
  Building2,
  CalendarDays,
  ExternalLink,
  MapPin,
  Star,
  Users
} from "lucide-react";

import { CompareButton } from "@/components/marketplace/CompareButton";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  buildTenantTourUrl,
  formatCapacity,
  formatDate,
  formatDuration,
  formatPrice,
  getCoverImageUrl,
  getDestination,
  getTourId
} from "@/lib/format";
import type { MarketplaceTour } from "@/lib/types";

type TourCardProps = {
  tour: MarketplaceTour;
};

function VisualBlock({ tour }: { tour: MarketplaceTour }) {
  const destination = getDestination(tour);
  const coverImageUrl = getCoverImageUrl(tour);

  return (
    <div className="relative aspect-[16/10] overflow-hidden bg-slate-950">
      {coverImageUrl ? (
        <img
          src={coverImageUrl}
          alt={`${tour.title} аяллын зураг`}
          loading="lazy"
          className="absolute inset-0 h-full w-full object-cover transition duration-300 group-hover:scale-[1.03]"
        />
      ) : (
        <div
          aria-label="Зураг байхгүй"
          className="absolute inset-0 bg-[radial-gradient(circle_at_18%_18%,rgba(59,130,246,0.78),transparent_30%),radial-gradient(circle_at_82%_25%,rgba(16,185,129,0.55),transparent_28%),linear-gradient(135deg,#0f172a,#1e3a8a_52%,#0f766e)]"
        />
      )}
      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(15,23,42,0.04),rgba(15,23,42,0.74))]" />
      <div className="absolute inset-x-4 top-4 flex items-center justify-between gap-2">
        {tour.is_featured ? (
          <Badge className="border-white/10 bg-white text-slate-950">
            <Star className="mr-1 h-3 w-3 fill-current" />
            Онцлох
          </Badge>
        ) : (
          <span />
        )}
        <Badge variant="secondary" className="bg-white/90 text-slate-800">
          Marketplace
        </Badge>
      </div>
      <div className="absolute bottom-4 left-4 right-4 text-white">
        <p className="line-clamp-1 text-sm text-white/78">{destination}</p>
        <p className="mt-1 line-clamp-2 text-2xl font-semibold leading-tight">
          {coverImageUrl
            ? tour.title
            : tour.destination_city || tour.destination_country || tour.tenant_name}
        </p>
        {!coverImageUrl ? (
          <p className="mt-2 text-xs font-medium text-white/72">Зураг байхгүй</p>
        ) : null}
      </div>
    </div>
  );
}

function DetailPill({
  icon,
  label,
  value
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-md border bg-secondary/50 p-3">
      <div className="flex items-center gap-2 text-xs text-muted-foreground">
        {icon}
        {label}
      </div>
      <p className="mt-1 line-clamp-1 text-sm font-medium text-foreground">
        {value}
      </p>
    </div>
  );
}

export function TourCard({ tour }: TourCardProps) {
  const tenantUrl = buildTenantTourUrl(tour);

  return (
    <Card className="group flex h-full overflow-hidden border-slate-200 shadow-sm transition duration-200 hover:-translate-y-0.5 hover:shadow-lift">
      <div className="flex w-full flex-col">
        <VisualBlock tour={tour} />

        <CardHeader className="pb-3">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Building2 className="h-4 w-4 text-primary" />
            <span className="line-clamp-1">
              {tour.tenant_name || "Тодорхойгүй байгууллага"}
            </span>
          </div>
          <CardTitle className="line-clamp-2 min-h-12 text-xl leading-snug">
            {tour.title}
          </CardTitle>
        </CardHeader>

        <CardContent className="flex-1 space-y-4">
          <p className="line-clamp-3 min-h-[4.5rem] text-sm leading-6 text-muted-foreground">
            {tour.description ||
              "Аяллын дэлгэрэнгүй тайлбар одоогоор оруулаагүй байна."}
          </p>

          <div className="grid grid-cols-2 gap-3">
            <DetailPill
              icon={<CalendarDays className="h-4 w-4 text-primary" />}
              label="Хугацаа"
              value={formatDuration(tour.duration_days)}
            />
            <DetailPill
              icon={<Users className="h-4 w-4 text-primary" />}
              label="Багтаамж"
              value={formatCapacity(tour.capacity)}
            />
            <div className="col-span-2">
              <DetailPill
                icon={<MapPin className="h-4 w-4 text-primary" />}
                label="Чиглэл"
                value={getDestination(tour)}
              />
            </div>
          </div>

          <Separator />

          <div className="flex items-end justify-between gap-3">
            <div>
              <p className="text-xs text-muted-foreground">Үнэ</p>
              <p className="text-2xl font-semibold">
                {formatPrice(tour.price, tour.currency)}
              </p>
            </div>
            <div className="text-right text-xs leading-5 text-muted-foreground">
              <p>Эхлэх: {formatDate(tour.start_date)}</p>
              <p>Дуусах: {formatDate(tour.end_date)}</p>
            </div>
          </div>
        </CardContent>

        <CardFooter className="grid gap-3 border-t bg-slate-50/80 p-4">
          <CompareButton tour={tour} compact />
          <div className="grid grid-cols-2 gap-2">
            <Button variant="outline" asChild>
              <Link href={`/tours/${encodeURIComponent(getTourId(tour))}`}>
                Дэлгэрэнгүй
              </Link>
            </Button>
            <Button asChild>
              <a href={tenantUrl} target="_blank" rel="noreferrer">
                <ExternalLink className="h-4 w-4" />
                Захиалах
              </a>
            </Button>
          </div>
        </CardFooter>
      </div>
    </Card>
  );
}
