"use client";

import { useEffect } from "react";
import { useForm, useWatch } from "react-hook-form";
import { Filter, RotateCcw, Search, SlidersHorizontal, Star } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import type { DurationFilterValue, PriceSortValue } from "@/lib/types";

export type FeaturedFilterValue = "all" | "featured";

export type TourFilterValues = {
  search: string;
  country: string;
  city: string;
  tenant: string;
  duration: DurationFilterValue;
  featured: FeaturedFilterValue;
  sort: PriceSortValue;
};

type TourFiltersProps = {
  values: TourFilterValues;
  countries: string[];
  cities: string[];
  tenants: string[];
  resultCount: number;
  totalCount: number;
  onChange: (values: TourFilterValues) => void;
  onReset: () => void;
};

const defaultValues: TourFilterValues = {
  search: "",
  country: "all",
  city: "all",
  tenant: "all",
  duration: "all",
  featured: "all",
  sort: "featured"
};

export function TourFilters({
  values,
  countries,
  cities,
  tenants,
  resultCount,
  totalCount,
  onChange,
  onReset
}: TourFiltersProps) {
  const form = useForm<TourFilterValues>({
    defaultValues: values
  });
  const watchedValues = useWatch({ control: form.control });

  useEffect(() => {
    form.reset(values);
  }, [form, values]);

  useEffect(() => {
    onChange({ ...defaultValues, ...watchedValues });
  }, [onChange, watchedValues]);

  function handleReset() {
    form.reset(defaultValues);
    onReset();
  }

  return (
    <Card className="shadow-sm">
      <CardContent className="p-4 md:p-5">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-md bg-secondary text-primary">
              <SlidersHorizontal className="h-4 w-4" />
            </div>
            <div>
              <h2 className="text-sm font-semibold">Хайлт ба шүүлтүүр</h2>
              <p className="text-xs text-muted-foreground">
                {resultCount} / {totalCount} аялал харагдаж байна
              </p>
            </div>
          </div>
          <Button type="button" variant="ghost" size="sm" onClick={handleReset}>
            <RotateCcw className="h-4 w-4" />
            Цэвэрлэх
          </Button>
        </div>

        <Separator className="my-4" />

        <div className="grid gap-3 lg:grid-cols-[1.4fr_1fr_1fr_1fr]">
          <label className="relative lg:col-span-2">
            <span className="sr-only">Хайх</span>
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              className="h-11 pl-9"
              placeholder="Аялал, улс, хот, байгууллагаар хайх"
              {...form.register("search")}
            />
          </label>

          <Select
            value={form.watch("country")}
            onValueChange={(value) =>
              form.setValue("country", value, { shouldDirty: true })
            }
          >
            <SelectTrigger className="h-11" aria-label="Улс">
              <SelectValue placeholder="Бүх улс" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Бүх улс</SelectItem>
              {countries.map((item) => (
                <SelectItem key={item} value={item}>
                  {item}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select
            value={form.watch("city")}
            onValueChange={(value) =>
              form.setValue("city", value, { shouldDirty: true })
            }
          >
            <SelectTrigger className="h-11" aria-label="Хот">
              <SelectValue placeholder="Бүх хот" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Бүх хот</SelectItem>
              {cities.map((item) => (
                <SelectItem key={item} value={item}>
                  {item}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="mt-3 grid gap-3 md:grid-cols-2 lg:grid-cols-4">
          <Select
            value={form.watch("tenant")}
            onValueChange={(value) =>
              form.setValue("tenant", value, { shouldDirty: true })
            }
          >
            <SelectTrigger className="h-11" aria-label="Байгууллага">
              <SelectValue placeholder="Бүх байгууллага" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Бүх байгууллага</SelectItem>
              {tenants.map((item) => (
                <SelectItem key={item} value={item}>
                  {item}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select
            value={form.watch("duration")}
            onValueChange={(value) =>
              form.setValue("duration", value as DurationFilterValue, {
                shouldDirty: true
              })
            }
          >
            <SelectTrigger className="h-11" aria-label="Хугацаа">
              <SelectValue placeholder="Бүх хугацаа" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Бүх хугацаа</SelectItem>
              <SelectItem value="1-3">1-3 өдөр</SelectItem>
              <SelectItem value="4-7">4-7 өдөр</SelectItem>
              <SelectItem value="8-14">8-14 өдөр</SelectItem>
              <SelectItem value="15+">15+ өдөр</SelectItem>
            </SelectContent>
          </Select>

          <Select
            value={form.watch("featured")}
            onValueChange={(value) =>
              form.setValue("featured", value as FeaturedFilterValue, {
                shouldDirty: true
              })
            }
          >
            <SelectTrigger className="h-11" aria-label="Онцлох эсэх">
              <SelectValue placeholder="Бүх аялал" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">
                <span className="inline-flex items-center gap-2">
                  <Filter className="h-4 w-4" />
                  Бүх аялал
                </span>
              </SelectItem>
              <SelectItem value="featured">
                <span className="inline-flex items-center gap-2">
                  <Star className="h-4 w-4" />
                  Зөвхөн онцлох
                </span>
              </SelectItem>
            </SelectContent>
          </Select>

          <Select
            value={form.watch("sort")}
            onValueChange={(value) =>
              form.setValue("sort", value as PriceSortValue, {
                shouldDirty: true
              })
            }
          >
            <SelectTrigger className="h-11" aria-label="Эрэмбэлэх">
              <SelectValue placeholder="Эрэмбэлэх" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="featured">Онцлох эхэндээ</SelectItem>
              <SelectItem value="newest">Шинэ эхэндээ</SelectItem>
              <SelectItem value="price-asc">Үнэ өсөхөөр</SelectItem>
              <SelectItem value="price-desc">Үнэ буурахаар</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardContent>
    </Card>
  );
}
