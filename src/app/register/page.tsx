import type { Metadata } from "next";

import { RegisterForm } from "@/components/marketplace/RegisterForm";

export const metadata: Metadata = {
  title: "Register"
};

export default function RegisterPage() {
  return (
    <main className="container py-10">
      <RegisterForm />
    </main>
  );
}
