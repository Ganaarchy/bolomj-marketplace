export type ApiDataResponse<T> = {
  data: T;
};

export type ApiErrorResponse = {
  message?: string;
  error?: string;
  errors?: unknown;
};

export type ApiResponse<T> = T | ApiDataResponse<T>;

export type UserRole =
  | "guest"
  | "customer"
  | "system_admin"
  | "tenant_admin"
  | "user";

export type TourStatus = "draft" | "published" | "archived";

export type BookingStatus =
  | "pending"
  | "confirmed"
  | "paid"
  | "cancelled"
  | "completed";

export type TenantStatus = "pending" | "active" | "suspended";

export type AuthUser = {
  id: string;
  email: string;
  role: Exclude<UserRole, "guest">;
  tenant_id: string | null;
  first_name: string;
  last_name: string | null;
};

export type LoginPayload = {
  email: string;
  password: string;
};

export type LoginResponse = {
  accessToken: string;
  user: AuthUser;
};

export type TenantRequestPayload = {
  name: string;
  slug: string;
  registration_number: string;
  email: string;
  phone: string;
  description: string;
  website_subdomain: string;
  admin_first_name: string;
  admin_last_name: string;
  admin_email: string;
  admin_password: string;
};

export type Tour = {
  id: string;
  tenant_id: string;
  title: string;
  slug: string;
  description: string | null;
  cover_image_url: string | null;
  destination_country: string | null;
  destination_city: string | null;
  duration_days: number | null;
  capacity: number | null;
  price: number | string;
  currency: string;
  start_date: string | null;
  end_date: string | null;
  meeting_point: string | null;
  includes_text: string | null;
  excludes_text: string | null;
  status: TourStatus;
  is_featured: boolean;
  published_to_marketplace: boolean;
  created_at?: string;
  updated_at?: string;
};

export type MarketplaceTour = Tour & {
  status: "published";
  tenant_name: string;
  tenant_slug: string;
  tenant_subdomain: string | null;
};

export type MyBooking = {
  id: string;
  tenant_id: string;
  tour_id: string;
  user_id: string | null;
  customer_first_name: string;
  customer_last_name: string | null;
  customer_email: string;
  customer_phone: string | null;
  traveler_count: number;
  total_amount: string | number;
  status: BookingStatus;
  note: string | null;
  created_at: string;
  updated_at: string;
  tour_title: string;
  destination_country: string | null;
  destination_city: string | null;
};

export type BookingCreatePayload = {
  tour_id: string;
  customer_first_name: string;
  customer_last_name?: string | null;
  customer_email: string;
  customer_phone?: string | null;
  traveler_count: number;
  note?: string | null;
};

export type BookingCreateResponse = {
  message: string;
  booking: Omit<MyBooking, "tour_title" | "destination_country" | "destination_city">;
};

export type DurationFilterValue = "all" | "1-3" | "4-7" | "8-14" | "15+";

export type PriceSortValue = "featured" | "newest" | "price-asc" | "price-desc";

export type AsyncState = "idle" | "loading" | "success" | "error";

export const STORAGE_KEYS = {
  accessToken: "bolomj_access_token",
  user: "bolomj_user",
  compareTours: "bolomj_compare_tours"
} as const;

export const RESERVED_SUBDOMAINS = [
  "app",
  "api",
  "www",
  "bolomj",
  "localhost"
] as const;
