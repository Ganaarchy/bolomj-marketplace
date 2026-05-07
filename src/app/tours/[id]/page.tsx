import type { Metadata } from "next";
import Link from "next/link";
import {
  Building2,
  CalendarDays,
  ExternalLink,
  MapPin,
  Users
} from "lucide-react";

import { CompareButton } from "@/components/marketplace/CompareButton";
import { ErrorState } from "@/components/marketplace/ErrorState";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { fetchMarketplaceTour } from "@/lib/api";
import {
  buildTenantTourUrl,
  formatCapacity,
  formatDate,
  formatDuration,
  formatPrice,
  getDestination
} from "@/lib/format";

type TourDetailPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export async function generateMetadata({
  params
}: TourDetailPageProps): Promise<Metadata> {
  const { id } = await params;

  try {
    const tour = await fetchMarketplaceTour(id);
    return {
      title: tour.title,
      description:
        tour.description ||
        `${getDestination(tour)} чиглэлийн аяллын дэлгэрэнгүй мэдээлэл`
    };
  } catch {
    return {
      title: "Аяллын дэлгэрэнгүй"
    };
  }
}

function DetailItem({
  icon,
  label,
  value
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-md border bg-card p-4">
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        {icon}
        {label}
      </div>
      <p className="mt-2 font-medium">{value}</p>
    </div>
  );
}

function TextBlock({ title, value }: { title: string; value: string | null }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="whitespace-pre-line leading-7 text-muted-foreground">
          {value || "Тодорхойгүй"}
        </p>
      </CardContent>
    </Card>
  );
}

export default async function TourDetailPage({ params }: TourDetailPageProps) {
  const { id } = await params;

  try {
    const tour = await fetchMarketplaceTour(id);
    const tenantUrl = buildTenantTourUrl(tour);

    return (
      <main className="container py-8">
        <div className="mb-6">
          <Button variant="ghost" asChild>
            <Link href="/">← Бүх аялал</Link>
          </Button>
        </div>

        <section className="grid gap-6 lg:grid-cols-[1fr_360px]">
          <div className="space-y-6">
            <div className="overflow-hidden rounded-lg border bg-card shadow-soft">
              <div className="h-56 bg-[radial-gradient(circle_at_18%_20%,rgba(250,204,21,0.82),transparent_28%),linear-gradient(135deg,#0f766e,#38bdf8_52%,#f97316)] md:h-72" />
              <div className="p-6">
                <div className="flex flex-wrap gap-2">
                  {tour.is_featured ? <Badge>Онцлох аялал</Badge> : null}
                  <Badge variant="secondary">{tour.status}</Badge>
                  <Badge variant="outline">{tour.published_to_marketplace ? "Нийтлэгдсэн" : "Нийтлэгдээгүй"}</Badge>
                </div>
                <h1 className="mt-4 text-balance text-3xl font-semibold tracking-normal md:text-5xl">
                  {tour.title}
                </h1>
                <p className="mt-4 max-w-3xl leading-8 text-muted-foreground">
                  {tour.description || "Аяллын дэлгэрэнгүй тайлбар одоогоор алга."}
                </p>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <DetailItem
                icon={<MapPin className="h-4 w-4 text-primary" />}
                label="Чиглэл"
                value={getDestination(tour)}
              />
              <DetailItem
                icon={<CalendarDays className="h-4 w-4 text-primary" />}
                label="Хугацаа"
                value={formatDuration(tour.duration_days)}
              />
              <DetailItem
                icon={<Users className="h-4 w-4 text-primary" />}
                label="Багтаамж"
                value={formatCapacity(tour.capacity)}
              />
              <DetailItem
                icon={<MapPin className="h-4 w-4 text-primary" />}
                label="Уулзах цэг"
                value={tour.meeting_point || "Тодорхойгүй"}
              />
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <TextBlock title="Багтсан зүйлс" value={tour.includes_text} />
              <TextBlock title="Багтаагүй зүйлс" value={tour.excludes_text} />
            </div>
          </div>

          <aside className="space-y-4 lg:sticky lg:top-24 lg:self-start">
            <Card className="shadow-soft">
              <CardHeader>
                <CardTitle>Захиалгын мэдээлэл</CardTitle>
              </CardHeader>
              <CardContent className="space-y-5">
                <div>
                  <p className="text-sm text-muted-foreground">Үнэ</p>
                  <p className="text-3xl font-semibold">
                    {formatPrice(tour.price, tour.currency)}
                  </p>
                </div>
                <div className="grid gap-3 text-sm">
                  <div className="flex justify-between gap-4 border-b pb-3">
                    <span className="text-muted-foreground">Эхлэх</span>
                    <span className="font-medium">{formatDate(tour.start_date)}</span>
                  </div>
                  <div className="flex justify-between gap-4 border-b pb-3">
                    <span className="text-muted-foreground">Дуусах</span>
                    <span className="font-medium">{formatDate(tour.end_date)}</span>
                  </div>
                  <div className="flex justify-between gap-4">
                    <span className="text-muted-foreground">Tenant</span>
                    <span className="text-right font-medium">
                      {tour.tenant_name || "Тодорхойгүй"}
                    </span>
                  </div>
                </div>
                <div className="grid gap-2">
                  <Button asChild size="lg">
                    <a href={tenantUrl} target="_blank" rel="noreferrer">
                      <ExternalLink className="h-4 w-4" />
                      Захиалах
                    </a>
                  </Button>
                  <CompareButton tour={tour} />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base">
                  <Building2 className="h-4 w-4 text-primary" />
                  Tenant info
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                <p>
                  <span className="text-muted-foreground">Нэр: </span>
                  {tour.tenant_name || "Тодорхойгүй"}
                </p>
                <p>
                  <span className="text-muted-foreground">Slug: </span>
                  {tour.tenant_slug || "Тодорхойгүй"}
                </p>
                <p>
                  <span className="text-muted-foreground">Subdomain: </span>
                  {tour.tenant_subdomain || "Тодорхойгүй"}
                </p>
              </CardContent>
            </Card>
          </aside>
        </section>
      </main>
    );
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Аяллын мэдээлэл авахад алдаа гарлаа.";

    return (
      <main className="container py-10">
        <ErrorState message={message} />
      </main>
    );
  }
}
