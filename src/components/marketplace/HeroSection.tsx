import Link from "next/link";
import { ArrowRight, Building2, GitCompareArrows, MapPin } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

type HeroSectionProps = {
  totalTours: number;
  featuredTours: number;
  destinations: string[];
};

export function HeroSection({
  totalTours,
  featuredTours,
  destinations
}: HeroSectionProps) {
  const destinationPreview =
    destinations.length > 0 ? destinations.slice(0, 4).join(" / ") : "Удахгүй";

  return (
    <section className="border-b bg-[linear-gradient(180deg,#ffffff_0%,#f8fafc_100%)]">
      <div className="container grid gap-10 py-12 md:grid-cols-[1.05fr_0.95fr] md:items-center md:py-16">
        <div>
          <Badge variant="secondary" className="gap-2 px-3 py-1">
            <Building2 className="h-3.5 w-3.5 text-primary" />
            Bolomj marketplace
          </Badge>
          <h1 className="mt-5 max-w-4xl text-balance text-4xl font-semibold leading-tight tracking-normal text-slate-950 md:text-6xl">
            Олон аяллын байгууллагын аяллыг нэг дороос хайж, харьцуул
          </h1>
          <p className="mt-5 max-w-2xl text-base leading-8 text-muted-foreground md:text-lg">
            Улс, хот, хугацаа, үнэ болон аяллын компаниар нь шүүж, тохирох
            аяллаа сонгоод захиалгыг тухайн байгууллагын сайт дээр үргэлжлүүлнэ.
          </p>
          <div className="mt-7 flex flex-col gap-3 sm:flex-row">
            <Button size="lg" asChild>
              <a href="#marketplace-tours">
                Аяллууд үзэх
                <ArrowRight className="h-4 w-4" />
              </a>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link href="/compare">
                <GitCompareArrows className="h-4 w-4" />
                Харьцуулах
              </Link>
            </Button>
          </div>
        </div>

        <div className="rounded-lg border bg-card p-5 shadow-soft">
          <div className="rounded-md border bg-slate-950 p-5 text-white">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-sm text-slate-300">Marketplace snapshot</p>
                <p className="mt-1 text-2xl font-semibold">Аяллын сонголтууд</p>
              </div>
              <div className="flex h-11 w-11 items-center justify-center rounded-md bg-white/10">
                <MapPin className="h-5 w-5" />
              </div>
            </div>
            <Separator className="my-5 bg-white/15" />
            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-md bg-white/10 p-4">
                <p className="text-3xl font-semibold">{totalTours}</p>
                <p className="mt-1 text-sm text-slate-300">Нийт аялал</p>
              </div>
              <div className="rounded-md bg-white/10 p-4">
                <p className="text-3xl font-semibold">{featuredTours}</p>
                <p className="mt-1 text-sm text-slate-300">Онцлох</p>
              </div>
              <div className="col-span-2 rounded-md bg-white p-4 text-slate-950">
                <p className="text-sm text-slate-500">Чиглэлүүд</p>
                <p className="mt-1 line-clamp-2 text-lg font-medium">
                  {destinationPreview}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
