"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Loader2, LogOut, UserRound } from "lucide-react";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { fetchCurrentUser } from "@/lib/api";
import { getStoredUser, getToken, logout, setStoredUser } from "@/lib/auth";
import type { AuthUser } from "@/lib/types";

function ProfileRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-md border bg-background p-4">
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="mt-1 break-words text-sm font-medium">{value}</p>
    </div>
  );
}

export function ProfilePageClient() {
  const router = useRouter();
  const [user, setUser] = useState<AuthUser | null>(() => getStoredUser());
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const hasToken = Boolean(getToken());

  useEffect(() => {
    let isMounted = true;

    async function loadProfile() {
      if (!getToken()) {
        setIsLoading(false);
        return;
      }

      try {
        const currentUser = await fetchCurrentUser();
        if (!isMounted) {
          return;
        }

        setStoredUser(currentUser);
        setUser(currentUser);
      } catch (error) {
        if (!isMounted) {
          return;
        }

        setErrorMessage(
          error instanceof Error
            ? error.message
            : "Профайл мэдээлэл авах боломжгүй байна."
        );
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    loadProfile();

    return () => {
      isMounted = false;
    };
  }, []);

  function handleLogout() {
    logout();
    router.push("/");
    router.refresh();
  }

  if (!hasToken) {
    return (
      <Card className="mx-auto max-w-xl shadow-soft">
        <CardHeader>
          <CardTitle>Профайл харахын тулд нэвтэрнэ үү</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm leading-6 text-muted-foreground">
            Профайл нь зөвхөн generic backend auth-аар нэвтэрсэн одоо байгаа
            хэрэглэгчдэд ажиллана.
          </p>
          <Button asChild>
            <Link href="/login">Нэвтрэх</Link>
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="mx-auto max-w-3xl shadow-soft">
      <CardHeader className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-md bg-primary text-primary-foreground">
            <UserRound className="h-6 w-6" />
          </div>
          <CardTitle className="text-2xl">Профайл</CardTitle>
          <p className="mt-2 text-sm leading-6 text-muted-foreground">
            `GET /auth/me` endpoint-оос авсан одоо байгаа backend хэрэглэгчийн
            мэдээлэл.
          </p>
        </div>
        <Button variant="outline" onClick={handleLogout}>
          <LogOut className="h-4 w-4" />
          Гарах
        </Button>
      </CardHeader>
      <CardContent className="space-y-5">
        {isLoading ? (
          <div className="flex items-center gap-2 rounded-md border p-4 text-sm text-muted-foreground">
            <Loader2 className="h-4 w-4 animate-spin" />
            Профайл уншиж байна...
          </div>
        ) : null}

        {errorMessage ? (
          <Alert variant="destructive">
            <AlertTitle>Профайл авах боломжгүй</AlertTitle>
            <AlertDescription>{errorMessage}</AlertDescription>
          </Alert>
        ) : null}

        {user ? (
          <div className="grid gap-3 sm:grid-cols-2">
            <ProfileRow label="И-мэйл" value={user.email} />
            <ProfileRow label="Эрх" value={user.role} />
            <ProfileRow label="Нэр" value={user.first_name || "Тодорхойгүй"} />
            <ProfileRow label="Овог" value={user.last_name || "Тодорхойгүй"} />
            <ProfileRow
              label="Tenant ID"
              value={user.tenant_id || "Тодорхойгүй"}
            />
            <ProfileRow label="User ID" value={user.id} />
          </div>
        ) : null}
      </CardContent>
    </Card>
  );
}
