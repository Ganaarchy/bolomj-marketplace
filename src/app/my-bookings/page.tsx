import type { Metadata } from "next";

import { BackendGapPage } from "@/components/marketplace/BackendGapPage";

export const metadata: Metadata = {
  title: "Миний захиалгууд"
};

export default function MyBookingsPage() {
  return (
    <BackendGapPage
      title="Захиалгын түүх одоогоор дэмжигдээгүй"
      description="Public customer booking history endpoint байхгүй тул маркетплейс захиалгын түүхийг одоогоор харуулахгүй."
      missingEndpoints={["GET /customer/bookings", "GET /customer/bookings/:id"]}
      note="Backend дээр GET /bookings/my байгаа ч энэ нь existing authenticated backend user-д хамаарах хязгаарлагдмал урсгал. Customer account registration/login бүрэн шийдэгдтэл энэ хуудсыг зориуд хаасан."
    />
  );
}
