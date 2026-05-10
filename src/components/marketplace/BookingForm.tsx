"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { zodResolver } from "@hookform/resolvers/zod";
import { AlertCircle, CheckCircle2, Loader2, Send } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { createBooking } from "@/lib/api";
import { formatPrice, toNumber } from "@/lib/format";
import { getStoredUser } from "@/lib/auth";
import type { BookingCreateResponse } from "@/lib/types";

const bookingSchema = z.object({
  customer_first_name: z.string().trim().min(1, "Enter your first name."),
  customer_last_name: z.string().trim().optional(),
  customer_email: z.string().trim().email("Enter a valid email address."),
  customer_phone: z.string().trim().optional(),
  traveler_count: z
    .number()
    .int("Traveler count must be a whole number.")
    .min(1, "At least one traveler is required."),
  note: z.string().trim().optional()
});

type BookingFormValues = z.infer<typeof bookingSchema>;

type BookingFormProps = {
  tourId: string;
  tourTitle: string;
  price: string | number;
  currency: string;
  capacity: number | null;
};

export function BookingForm({
  tourId,
  tourTitle,
  price,
  currency,
  capacity
}: BookingFormProps) {
  const storedUser = useMemo(() => getStoredUser(), []);
  const [bookingResponse, setBookingResponse] =
    useState<BookingCreateResponse | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const {
    formState: { errors, isSubmitting },
    handleSubmit,
    register,
    watch
  } = useForm<BookingFormValues>({
    resolver: zodResolver(
      capacity
        ? bookingSchema.extend({
            traveler_count: z
              .number()
              .int("Traveler count must be a whole number.")
              .min(1, "At least one traveler is required.")
              .max(capacity, `This tour can accept up to ${capacity} travelers.`)
          })
        : bookingSchema
    ),
    defaultValues: {
      customer_first_name: storedUser?.first_name || "",
      customer_last_name: storedUser?.last_name || "",
      customer_email: storedUser?.email || "",
      customer_phone: "",
      traveler_count: 1,
      note: ""
    }
  });

  const travelerCount = watch("traveler_count");
  const numericPrice = toNumber(price);
  const estimatedTotal =
    numericPrice === null ? null : numericPrice * Number(travelerCount || 0);

  async function onSubmit(values: BookingFormValues) {
    setErrorMessage(null);
    setBookingResponse(null);

    try {
      const response = await createBooking({
        tour_id: tourId,
        customer_first_name: values.customer_first_name,
        customer_last_name: values.customer_last_name || null,
        customer_email: values.customer_email,
        customer_phone: values.customer_phone || null,
        traveler_count: values.traveler_count,
        note: values.note || null
      });
      setBookingResponse(response);
    } catch (error) {
      setErrorMessage(
        error instanceof Error
          ? error.message
          : "Booking creation failed. Please try again."
      );
    }
  }

  return (
    <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
      <div className="space-y-2">
        <p className="text-sm font-medium">{tourTitle}</p>
        <p className="text-sm text-muted-foreground">
          Uses POST /bookings. If you are logged in as a customer, the backend
          associates the booking with your account.
        </p>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <div className="space-y-2">
          <label className="text-sm font-medium" htmlFor="customer_first_name">
            First name
          </label>
          <Input
            id="customer_first_name"
            autoComplete="given-name"
            aria-invalid={Boolean(errors.customer_first_name)}
            {...register("customer_first_name")}
          />
          {errors.customer_first_name ? (
            <p className="text-sm text-destructive">
              {errors.customer_first_name.message}
            </p>
          ) : null}
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium" htmlFor="customer_last_name">
            Last name
          </label>
          <Input
            id="customer_last_name"
            autoComplete="family-name"
            aria-invalid={Boolean(errors.customer_last_name)}
            {...register("customer_last_name")}
          />
          {errors.customer_last_name ? (
            <p className="text-sm text-destructive">
              {errors.customer_last_name.message}
            </p>
          ) : null}
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium" htmlFor="customer_email">
          Email
        </label>
        <Input
          id="customer_email"
          type="email"
          autoComplete="email"
          aria-invalid={Boolean(errors.customer_email)}
          {...register("customer_email")}
        />
        {errors.customer_email ? (
          <p className="text-sm text-destructive">
            {errors.customer_email.message}
          </p>
        ) : null}
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <div className="space-y-2">
          <label className="text-sm font-medium" htmlFor="customer_phone">
            Phone
          </label>
          <Input
            id="customer_phone"
            autoComplete="tel"
            aria-invalid={Boolean(errors.customer_phone)}
            {...register("customer_phone")}
          />
          {errors.customer_phone ? (
            <p className="text-sm text-destructive">
              {errors.customer_phone.message}
            </p>
          ) : null}
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium" htmlFor="traveler_count">
            Travelers
          </label>
          <Input
            id="traveler_count"
            type="number"
            min={1}
            max={capacity ?? undefined}
            aria-invalid={Boolean(errors.traveler_count)}
            {...register("traveler_count", { valueAsNumber: true })}
          />
          {errors.traveler_count ? (
            <p className="text-sm text-destructive">
              {errors.traveler_count.message}
            </p>
          ) : null}
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium" htmlFor="note">
          Note
        </label>
        <Textarea
          id="note"
          aria-invalid={Boolean(errors.note)}
          {...register("note")}
        />
        {errors.note ? (
          <p className="text-sm text-destructive">{errors.note.message}</p>
        ) : null}
      </div>

      {estimatedTotal !== null ? (
        <div className="rounded-md border bg-secondary/50 p-3 text-sm">
          Estimated total:{" "}
          <span className="font-semibold">
            {formatPrice(estimatedTotal, currency)}
          </span>
        </div>
      ) : null}

      {errorMessage ? (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Booking failed</AlertTitle>
          <AlertDescription>{errorMessage}</AlertDescription>
        </Alert>
      ) : null}

      {bookingResponse ? (
        <Alert>
          <CheckCircle2 className="h-4 w-4" />
          <AlertTitle>{bookingResponse.message}</AlertTitle>
          <AlertDescription>
            Booking status: {bookingResponse.booking.status}.{" "}
            <Link
              className="font-medium text-primary hover:underline"
              href={`/my-bookings/${bookingResponse.booking.id}`}
            >
              View booking
            </Link>
          </AlertDescription>
        </Alert>
      ) : null}

      <Button className="w-full" size="lg" type="submit" disabled={isSubmitting}>
        {isSubmitting ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <Send className="h-4 w-4" />
        )}
        Submit booking
      </Button>
    </form>
  );
}
