"use client";

import { Filter, Search } from "lucide-react";

import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import type { DurationFilterValue, PriceSortValue } from "@/lib/types";

type TourFiltersProps = {
  search: string;
  destination: string;
  duration: DurationFilterValue;
  sort: PriceSortValue;
  destinations: string[];
  onSearchChange: (value: string) => void;
  onDestinationChange: (value: string) => void;
  onDurationChange: (value: DurationFilterValue) => void;
  onSortChange: (value: PriceSortValue) => void;
};

export function TourFilters({
  search,
  destination,
  duration,
  sort,
  destinations,
  onSearchChange,
  onDestinationChange,
  onDurationChange,
  onSortChange
}: TourFiltersProps) {
  return (
    <div className="rounded-lg border bg-card p-4 shadow-sm">
      <div className="mb-3 flex items-center gap-2 text-sm font-medium">
        <Filter className="h-4 w-4 text-primary" />
        Хайлт ба шүүлтүүр
      </div>
      <div className="grid gap-3 md:grid-cols-[1.5fr_1fr_1fr_1fr]">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            className="pl-9"
            value={search}
            onChange={(event) => onSearchChange(event.target.value)}
            placeholder="Аялал, улс, хот, компаниар хайх"
          />
        </div>

        <Select value={destination} onValueChange={onDestinationChange}>
          <SelectTrigger aria-label="Очих улс">
            <SelectValue placeholder="Бүх чиглэл" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Бүх чиглэл</SelectItem>
            {destinations.map((item) => (
              <SelectItem key={item} value={item}>
                {item}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select
          value={duration}
          onValueChange={(value) => onDurationChange(value as DurationFilterValue)}
        >
          <SelectTrigger aria-label="Хугацаа">
            <SelectValue placeholder="Хугацаа" />
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
          value={sort}
          onValueChange={(value) => onSortChange(value as PriceSortValue)}
        >
          <SelectTrigger aria-label="Эрэмбэлэх">
            <SelectValue placeholder="Эрэмбэлэх" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="featured">Онцлох эхэнд</SelectItem>
            <SelectItem value="price-asc">Үнэ багаас их</SelectItem>
            <SelectItem value="price-desc">Үнэ ихээс бага</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
