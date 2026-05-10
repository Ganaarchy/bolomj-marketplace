import { EmptyState } from "@/components/marketplace/EmptyState";
import { TourCard } from "@/components/marketplace/TourCard";
import type { MarketplaceTour } from "@/lib/types";

type TourGridProps = {
  tours: MarketplaceTour[];
  onResetFilters?: () => void;
};

export function TourGrid({ tours, onResetFilters }: TourGridProps) {
  if (tours.length === 0) {
    return (
      <EmptyState
        title="Аялал олдсонгүй"
        description="Хайлт эсвэл шүүлтүүрийн нөхцөлөө өөрчилж дахин шалгана уу."
        actionLabel={onResetFilters ? "Шүүлтүүр цэвэрлэх" : undefined}
        onAction={onResetFilters}
      />
    );
  }

  return (
    <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
      {tours.map((tour) => (
        <TourCard key={tour.id} tour={tour} />
      ))}
    </div>
  );
}
