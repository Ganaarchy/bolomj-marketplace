import type { Metadata } from "next";

import { ProfilePageClient } from "@/components/marketplace/ProfilePageClient";

export const metadata: Metadata = {
  title: "Профайл"
};

export default function ProfilePage() {
  return (
    <main className="container py-10">
      <ProfilePageClient />
    </main>
  );
}
