export type MarketplaceTour = {
  id: string | number;
  tenant_id: string | number;
  title: string;
  slug: string;
  description: string | null;
  destination_country: string | null;
  destination_city: string | null;
  duration_days: number | string | null;
  capacity: number | string | null;
  price: number | string | null;
  currency: string | null;
  start_date: string | null;
  end_date: string | null;
  meeting_point: string | null;
  includes_text: string | null;
  excludes_text: string | null;
  status: string;
  is_featured: boolean;
  published_to_marketplace: boolean;
  created_at: string;
  updated_at: string;
  tenant_name: string | null;
  tenant_slug: string | null;
  tenant_subdomain: string | null;
};

export type ApiDataResponse<T> = T | { data: T };

export type DurationFilterValue = "all" | "1-3" | "4-7" | "8-14" | "15+";

export type PriceSortValue = "featured" | "price-asc" | "price-desc";
