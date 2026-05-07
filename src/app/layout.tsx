import type { Metadata } from "next";

import { Footer } from "@/components/marketplace/Footer";
import { Header } from "@/components/marketplace/Header";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://bolomj.space"),
  title: {
    default: "Bolomj Marketplace",
    template: "%s | Bolomj Marketplace"
  },
  description:
    "Олон tenant-ийн marketplace дээр нийтлэгдсэн аяллуудыг хайх, шүүх, харьцуулах public frontend.",
  openGraph: {
    title: "Bolomj Marketplace",
    description:
      "Олон аяллын компаниудын нийтэлсэн аяллуудыг нэг дороос харж харьцуулна.",
    url: "https://bolomj.space",
    siteName: "Bolomj Marketplace",
    locale: "mn_MN",
    type: "website"
  }
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="mn">
      <body className="min-h-screen">
        <div className="flex min-h-screen flex-col">
          <Header />
          <div className="flex-1">{children}</div>
          <Footer />
        </div>
      </body>
    </html>
  );
}
