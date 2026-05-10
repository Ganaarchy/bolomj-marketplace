import type { Metadata } from "next";

import { TenantRequestForm } from "@/components/marketplace/TenantRequestForm";

export const metadata: Metadata = {
  title: "Байгууллагаар бүртгүүлэх",
  description:
    "Аяллын байгууллага Bolomj marketplace-д нэгдэх бүртгэлийн хүсэлт илгээх."
};

export default function RegisterTenantPage() {
  return (
    <main className="container py-10">
      <TenantRequestForm />
    </main>
  );
}
