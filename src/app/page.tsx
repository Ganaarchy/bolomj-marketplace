import { ErrorState } from "@/components/marketplace/ErrorState";
import { MarketplaceHome } from "@/components/marketplace/MarketplaceHome";
import { fetchMarketplaceTours } from "@/lib/api";

export default async function HomePage() {
  try {
    const tours = await fetchMarketplaceTours();
    return <MarketplaceHome tours={tours} />;
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Backend API-тай холбогдож чадсангүй.";

    return (
      <main className="container py-10">
        <ErrorState message={message} />
      </main>
    );
  }
}
