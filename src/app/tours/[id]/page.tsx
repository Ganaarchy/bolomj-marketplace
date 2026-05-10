import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  Building2,
  CalendarDays,
  CheckCircle2,
  ExternalLink,
  MapPin,
  Star,
  Users,
  XCircle
} from "lucide-react";

import { CompareButton } from "@/components/marketplace/CompareButton";
import { ErrorState } from "@/components/marketplace/ErrorState";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
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

type DetailMetricProps = {
  icon: React.ReactNode;
  label: string;
  value: string;
  description?: string;
};

export async function generateMetadata({
  params
}: TourDetailPageProps): Promise<Metadata> {
  const { id } = await params;

  try {
    const tour = await fetchMarketplaceTour(id);
    return {
      title: {
        absolute: `${tour.title} - Bolomj`
      },
      description:
        tour.description ||
        `${getDestination(tour)} чиглэлийн аяллын дэлгэрэнгүй мэдээлэл`
    };
  } catch {
    return {
      title: {
        absolute: "Аяллын дэлгэрэнгүй - Bolomj"
      }
    };
  }
}

function DetailMetric({ icon, label, value, description }: DetailMetricProps) {
  return (
    <div className="rounded-lg border bg-card p-4 shadow-sm">
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        {icon}
        {label}
      </div>
      <p className="mt-2 text-lg font-semibold">{value}</p>
      {description ? (
        <p className="mt-1 text-xs leading-5 text-muted-foreground">
          {description}
        </p>
      ) : null}
    </div>
  );
}

function TextSection({
  icon,
  title,
  value
}: {
  icon: React.ReactNode;
  title: string;
  value: string | null;
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          {icon}
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="whitespace-pre-line leading-7 text-muted-foreground">
          {value || "Тодорхойгүй"}
        </p>
      </CardContent>
    </Card>
  );
}

function DetailHero({
  title,
  destination,
  tenantName,
  isFeatured
}: {
  title: string;
  destination: string;
  tenantName: string;
  isFeatured: boolean;
}) {
  return (
    <section className="overflow-hidden rounded-lg border bg-card shadow-soft">
      <div className="relative min-h-[320px] bg-slate-950">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_20%,rgba(59,130,246,0.75),transparent_28%),radial-gradient(circle_at_80%_18%,rgba(16,185,129,0.55),transparent_25%),linear-gradient(135deg,#020617,#1e3a8a_48%,#0f766e)]" />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(15,23,42,0.05),rgba(15,23,42,0.86))]" />
        <div className="relative flex min-h-[320px] flex-col justify-end p-6 text-white md:p-8">
          <div className="mb-4 flex flex-wrap gap-2">
            {isFeatured ? (
              <Badge className="border-white/10 bg-white text-slate-950">
                <Star className="mr-1 h-3.5 w-3.5 fill-current" />
                Онцлох аялал
              </Badge>
            ) : null}
            <Badge variant="secondary" className="bg-white/90 text-slate-800">
              Marketplace
            </Badge>
          </div>
          <p className="flex items-center gap-2 text-sm text-white/78">
            <MapPin className="h-4 w-4" />
            {destination}
          </p>
          <h1 className="mt-3 max-w-4xl text-balance text-4xl font-semibold leading-tight tracking-normal md:text-6xl">
            {title}
          </h1>
          <p className="mt-4 flex items-center gap-2 text-sm text-white/78">
            <Building2 className="h-4 w-4" />
            {tenantName}
          </p>
        </div>
      </div>
    </section>
  );
}

export default async function TourDetailPage({ params }: TourDetailPageProps) {
  const { id } = await params;

  try {
    const tour = await fetchMarketplaceTour(id);
    const tenantUrl = buildTenantTourUrl(tour);
    const destination = getDestination(tour);
    const tenantName = tour.tenant_name || "Тодорхойгүй байгууллага";

    return (
      <main className="container space-y-6 py-8">
        <Button variant="ghost" asChild>
          <Link href="/">
            <ArrowLeft className="h-4 w-4" />
            Бүх аялал
          </Link>
        </Button>

        <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_380px]">
          <div className="space-y-6">
            <DetailHero
              title={tour.title}
              destination={destination}
              tenantName={tenantName}
              isFeatured={tour.is_featured}
            />

            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              <DetailMetric
                icon={<MapPin className="h-4 w-4 text-primary" />}
                label="Чиглэл"
                value={destination}
              />
              <DetailMetric
                icon={<CalendarDays className="h-4 w-4 text-primary" />}
                label="Хугацаа"
                value={formatDuration(tour.duration_days)}
                description={`${formatDate(tour.start_date)} - ${formatDate(
                  tour.end_date
                )}`}
              />
              <DetailMetric
                icon={<Users className="h-4 w-4 text-primary" />}
                label="Багтаамж"
                value={formatCapacity(tour.capacity)}
              />
              <DetailMetric
                icon={<Building2 className="h-4 w-4 text-primary" />}
                label="Байгууллага"
                value={tenantName}
              />
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Аяллын тухай</CardTitle>
                <CardDescription>
                  Marketplace дээр нийтлэгдсэн аяллын үндсэн мэдээлэл
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="whitespace-pre-line leading-8 text-muted-foreground">
                  {tour.description ||
                    "Аяллын дэлгэрэнгүй тайлбар одоогоор оруулаагүй байна."}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="h-5 w-5 text-primary" />
                  Уулзах цэг
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="leading-7 text-muted-foreground">
                  {tour.meeting_point || "Тодорхойгүй"}
                </p>
              </CardContent>
            </Card>

            <div className="grid gap-4 md:grid-cols-2">
              <TextSection
                icon={<CheckCircle2 className="h-5 w-5 text-emerald-600" />}
                title="Багтсан зүйлс"
                value={tour.includes_text}
              />
              <TextSection
                icon={<XCircle className="h-5 w-5 text-destructive" />}
                title="Багтаагүй зүйлс"
                value={tour.excludes_text}
              />
            </div>

            <Card className="bg-slate-50">
              <CardHeader>
                <CardTitle>Ижил төстэй аялал хайх</CardTitle>
                <CardDescription>
                  Энэ чиглэл эсвэл бусад байгууллагын аяллуудыг marketplace дээр
                  дахин харьцуулж үзээрэй.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button variant="outline" asChild>
                  <Link href="/">
                    Marketplace руу буцах
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </div>

          <aside className="space-y-4 lg:sticky lg:top-24 lg:self-start">
            <Card className="shadow-soft">
              <CardHeader>
                <CardTitle>Захиалгын мэдээлэл</CardTitle>
                <CardDescription>
                  Захиалга тухайн байгууллагын сайт дээр үргэлжилнэ.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-5">
                <div>
                  <p className="text-sm text-muted-foreground">Үнэ</p>
                  <p className="mt-1 text-4xl font-semibold">
                    {formatPrice(tour.price, tour.currency)}
                  </p>
                </div>

                <Separator />

                <div className="grid gap-3 text-sm">
                  <div className="flex justify-between gap-4">
                    <span className="text-muted-foreground">Эхлэх огноо</span>
                    <span className="text-right font-medium">
                      {formatDate(tour.start_date)}
                    </span>
                  </div>
                  <div className="flex justify-between gap-4">
                    <span className="text-muted-foreground">Дуусах огноо</span>
                    <span className="text-right font-medium">
                      {formatDate(tour.end_date)}
                    </span>
                  </div>
                  <div className="flex justify-between gap-4">
                    <span className="text-muted-foreground">Хугацаа</span>
                    <span className="text-right font-medium">
                      {formatDuration(tour.duration_days)}
                    </span>
                  </div>
                  <div className="flex justify-between gap-4">
                    <span className="text-muted-foreground">Багтаамж</span>
                    <span className="text-right font-medium">
                      {formatCapacity(tour.capacity)}
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
                  Байгууллагын мэдээлэл
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <div>
                  <p className="text-muted-foreground">Нэр</p>
                  <p className="font-medium">{tenantName}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Slug</p>
                  <p className="font-medium">{tour.tenant_slug}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Subdomain</p>
                  <p className="font-medium">
                    {tour.tenant_subdomain || "Тодорхойгүй"}
                  </p>
                </div>
              </CardContent>
            </Card>
          </aside>
        </div>
      </main>
    );
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : "Аяллын мэдээлэл авахад алдаа гарлаа.";

    return (
      <main className="container py-10">
        <ErrorState title="Аялал олдсонгүй" message={message} />
      </main>
    );
  }
}
