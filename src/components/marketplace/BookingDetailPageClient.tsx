"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { AlertCircle, ArrowLeft, Loader2 } from "lucide-react";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { fetchCustomerBooking } from "@/lib/api";
import { formatDate, formatDestination, formatPrice } from "@/lib/format";
import { getStoredUser, getToken } from "@/lib/auth";
import type { MyBooking } from "@/lib/types";

function DetailRow({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="rounded-md border bg-background p-4">
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="mt-1 break-words text-sm font-medium">{value}</p>
    </div>
  );
}

export function BookingDetailPageClient({ bookingId }: { bookingId: string }) {
  const [booking, setBooking] = useState<MyBooking | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const storedUser = getStoredUser();
  const hasCustomerSession = Boolean(
    getToken() && storedUser?.role === "customer"
  );

  useEffect(() => {
    let isMounted = true;

    async function loadBooking() {
      if (!getToken() || getStoredUser()?.role !== "customer") {
        setIsLoading(false);
        return;
      }

      try {
        const customerBooking = await fetchCustomerBooking(bookingId);
        if (isMounted) {
          setBooking(customerBooking);
        }
      } catch (error) {
        if (isMounted) {
          setErrorMessage(
            error instanceof Error
              ? error.message
              : "Could not load this booking."
          );
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    loadBooking();

    return () => {
      isMounted = false;
    };
  }, [bookingId]);

  if (!hasCustomerSession) {
    return (
      <Card className="mx-auto max-w-xl shadow-soft">
        <CardHeader>
          <CardTitle>Customer login required</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm leading-6 text-muted-foreground">
            Booking details are only loaded for a verified customer session.
          </p>
          <Button asChild>
            <Link href="/login">Log in</Link>
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <Button variant="ghost" asChild>
        <Link href="/my-bookings">
          <ArrowLeft className="h-4 w-4" />
          Back to bookings
        </Link>
      </Button>

      {isLoading ? (
        <div className="flex items-center gap-2 rounded-md border p-4 text-sm text-muted-foreground">
          <Loader2 className="h-4 w-4 animate-spin" />
          Loading booking...
        </div>
      ) : null}

      {errorMessage ? (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Booking unavailable</AlertTitle>
          <AlertDescription>{errorMessage}</AlertDescription>
        </Alert>
      ) : null}

      {booking ? (
        <Card className="shadow-soft">
          <CardHeader className="gap-3 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <CardTitle className="text-2xl">{booking.tour_title}</CardTitle>
              <p className="mt-2 text-sm text-muted-foreground">
                {formatDestination(
                  booking.destination_country,
                  booking.destination_city
                )}
              </p>
            </div>
            <Badge variant="secondary">{booking.status}</Badge>
          </CardHeader>
          <CardContent className="space-y-5">
            <div className="grid gap-3 sm:grid-cols-2">
              <DetailRow label="Booking ID" value={booking.id} />
              <DetailRow label="Tour ID" value={booking.tour_id} />
              <DetailRow
                label="Customer"
                value={[booking.customer_first_name, booking.customer_last_name]
                  .filter(Boolean)
                  .join(" ")}
              />
              <DetailRow label="Email" value={booking.customer_email} />
              <DetailRow
                label="Phone"
                value={booking.customer_phone || "Not provided"}
              />
              <DetailRow label="Travelers" value={booking.traveler_count} />
              <DetailRow
                label="Total"
                value={formatPrice(booking.total_amount, "MNT")}
              />
              <DetailRow label="Created" value={formatDate(booking.created_at)} />
            </div>

            {booking.note ? (
              <div className="rounded-md border bg-background p-4">
                <p className="text-xs text-muted-foreground">Note</p>
                <p className="mt-1 whitespace-pre-line text-sm">{booking.note}</p>
              </div>
            ) : null}
          </CardContent>
        </Card>
      ) : null}
    </div>
  );
}
