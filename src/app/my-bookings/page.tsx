import type { Metadata } from "next";

import { MyBookingsPageClient } from "@/components/marketplace/MyBookingsPageClient";

export const metadata: Metadata = {
  title: "My bookings"
};

export default function MyBookingsPage() {
  return (
    <main className="container py-10">
      <MyBookingsPageClient />
    </main>
  );
}
