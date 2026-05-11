"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { AlertCircle, CalendarDays, Loader2, MapPin } from "lucide-react";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { fetchCustomerBookings } from "@/lib/api";
import { formatDate, formatDestination, formatPrice } from "@/lib/format";
import { getStoredUser, getToken } from "@/lib/auth";
import type { MyBooking } from "@/lib/types";

export function MyBookingsPageClient() {
  const [bookings, setBookings] = useState<MyBooking[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const storedUser = getStoredUser();
  const hasCustomerSession = Boolean(
    getToken() && storedUser?.role === "customer"
  );

  useEffect(() => {
    let isMounted = true;

    async function loadBookings() {
      if (!getToken() || getStoredUser()?.role !== "customer") {
        setIsLoading(false);
        return;
      }

      try {
        const customerBookings = await fetchCustomerBookings();
        if (isMounted) {
          setBookings(customerBookings);
        }
      } catch (error) {
        if (isMounted) {
          setErrorMessage(
            error instanceof Error
              ? error.message
              : "Could not load your bookings."
          );
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    loadBookings();

    return () => {
      isMounted = false;
    };
  }, []);

  if (!hasCustomerSession) {
    return (
      <Card className="mx-auto max-w-xl shadow-soft">
        <CardHeader>
          <CardTitle>Customer login required</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm leading-6 text-muted-foreground">
            Booking history is only loaded for a verified customer session.
          </p>
          <Button asChild>
            <Link href="/login">Log in</Link>
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <div>
        <h1 className="text-3xl font-semibold tracking-normal">My bookings</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Loaded from GET /customer/bookings.
        </p>
      </div>

      {isLoading ? (
        <div className="flex items-center gap-2 rounded-md border p-4 text-sm text-muted-foreground">
          <Loader2 className="h-4 w-4 animate-spin" />
          Loading bookings...
        </div>
      ) : null}

      {errorMessage ? (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Booking history unavailable</AlertTitle>
          <AlertDescription>{errorMessage}</AlertDescription>
        </Alert>
      ) : null}

      {!isLoading && !errorMessage && bookings.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-start gap-4 py-8">
            <p className="text-sm text-muted-foreground">
              The backend returned no bookings for this customer.
            </p>
            <Button asChild>
              <Link href="/">Browse tours</Link>
            </Button>
          </CardContent>
        </Card>
      ) : null}

      <div className="grid gap-4">
        {bookings.map((booking) => (
          <Card key={booking.id} className="shadow-sm">
            <CardHeader className="gap-3 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <CardTitle className="text-xl">{booking.tour_title}</CardTitle>
                <div className="mt-2 flex flex-wrap gap-3 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <MapPin className="h-4 w-4" />
                    {formatDestination(
                      booking.destination_country,
                      booking.destination_city
                    )}
                  </span>
                  <span className="flex items-center gap-1">
                    <CalendarDays className="h-4 w-4" />
                    {formatDate(booking.created_at)}
                  </span>
                </div>
              </div>
              <Badge variant="secondary">{booking.status}</Badge>
            </CardHeader>
            <CardContent className="grid gap-4 sm:grid-cols-[1fr_auto] sm:items-end">
              <div className="grid gap-2 text-sm sm:grid-cols-3">
                <div>
                  <p className="text-muted-foreground">Travelers</p>
                  <p className="font-medium">{booking.traveler_count}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Total</p>
                  <p className="font-medium">
                    {formatPrice(booking.total_amount, "MNT")}
                  </p>
                </div>
                <div>
                  <p className="text-muted-foreground">Booking ID</p>
                  <p className="break-all font-medium">{booking.id}</p>
                </div>
              </div>
              <Button variant="outline" asChild>
                <Link href={`/my-bookings/${booking.id}`}>View details</Link>
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
