import { redirect } from "next/navigation";

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Байгууллагаар бүртгүүлэх"
};

export default function RegisterPage() {
  redirect("/register-tenant");
}
