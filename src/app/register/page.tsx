import type { Metadata } from "next";

import { BackendGapPage } from "@/components/marketplace/BackendGapPage";

export const metadata: Metadata = {
  title: "Бүртгүүлэх"
};

export default function RegisterPage() {
  return (
    <BackendGapPage
      title="Customer бүртгэл одоогоор нээгдээгүй"
      description="Маркетплейс дээр self-service customer бүртгэл үүсгэх backend endpoint хараахан байхгүй тул энэ хуудсыг зориуд хаасан."
      missingEndpoints={["POST /auth/customer/register"]}
      note="Бодит endpoint нэмэгдэх хүртэл frontend local-only бүртгэл, fake success, эсвэл customer account амлах урсгал үүсгэхгүй."
    />
  );
}
