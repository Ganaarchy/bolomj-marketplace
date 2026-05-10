import type { Metadata } from "next";

import { BookingDetailPageClient } from "@/components/marketplace/BookingDetailPageClient";

type BookingDetailPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export const metadata: Metadata = {
  title: "Booking details"
};

export default async function BookingDetailPage({
  params
}: BookingDetailPageProps) {
  const { id } = await params;

  return (
    <main className="container py-10">
      <BookingDetailPageClient bookingId={id} />
    </main>
  );
}
