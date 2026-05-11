"use client";

import { useState } from "react";

import { cn } from "@/lib/utils";

type TourMediaImageProps = {
  src: string;
  alt: string;
  className?: string;
  fallbackClassName?: string;
  loading?: "eager" | "lazy";
};

export function TourMediaImage({
  src,
  alt,
  className,
  fallbackClassName,
  loading = "lazy"
}: TourMediaImageProps) {
  const [hasError, setHasError] = useState(false);

  if (hasError) {
    return (
      <div
        aria-label={alt}
        className={cn(
          "flex h-full w-full items-center justify-center bg-muted text-sm font-medium text-muted-foreground",
          fallbackClassName
        )}
      >
        Зураг ачаалсангүй
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      loading={loading}
      className={className}
      onError={() => setHasError(true)}
    />
  );
}
