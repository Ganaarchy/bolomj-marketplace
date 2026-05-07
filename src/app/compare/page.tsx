import type { Metadata } from "next";

import { ComparePageClient } from "@/components/marketplace/ComparePageClient";

export const metadata: Metadata = {
  title: "Харьцуулах"
};

export default function ComparePage() {
  return <ComparePageClient />;
}
