import type { Metadata } from "next";

import { LoginForm } from "@/components/marketplace/LoginForm";

export const metadata: Metadata = {
  title: "Нэвтрэх"
};

export default function LoginPage() {
  return (
    <main className="container py-10">
      <LoginForm />
    </main>
  );
}
