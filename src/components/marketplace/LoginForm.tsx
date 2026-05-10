"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { AlertCircle, Loader2, LogIn } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { loginExistingUser } from "@/lib/api";
import { setStoredUser, setToken } from "@/lib/auth";

const loginSchema = z.object({
  email: z.string().trim().email("И-мэйл хаяг буруу байна."),
  password: z.string().min(1, "Нууц үгээ оруулна уу.")
});

type LoginFormValues = z.infer<typeof loginSchema>;

export function LoginForm() {
  const router = useRouter();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const {
    formState: { errors, isSubmitting },
    handleSubmit,
    register
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: ""
    }
  });

  async function onSubmit(values: LoginFormValues) {
    setErrorMessage(null);

    try {
      const response = await loginExistingUser(values);
      setToken(response.accessToken);
      setStoredUser(response.user);
      router.push("/profile");
      router.refresh();
    } catch (error) {
      setErrorMessage(
        error instanceof Error
          ? error.message
          : "Нэвтрэх хүсэлт амжилтгүй боллоо."
      );
    }
  }

  return (
    <Card className="mx-auto max-w-md shadow-soft">
      <CardHeader>
        <CardTitle className="text-2xl">Нэвтрэх</CardTitle>
        <p className="text-sm leading-6 text-muted-foreground">
          Энэ хуудас зөвхөн backend дээр аль хэдийн үүссэн хэрэглэгчдэд
          зориулсан generic `POST /auth/login` нэвтрэлтийг ашиглана.
        </p>
      </CardHeader>
      <CardContent>
        <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
          <div className="space-y-2">
            <label className="text-sm font-medium" htmlFor="email">
              И-мэйл
            </label>
            <Input
              id="email"
              type="email"
              autoComplete="email"
              aria-invalid={Boolean(errors.email)}
              {...register("email")}
            />
            {errors.email ? (
              <p className="text-sm text-destructive">{errors.email.message}</p>
            ) : null}
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium" htmlFor="password">
              Нууц үг
            </label>
            <Input
              id="password"
              type="password"
              autoComplete="current-password"
              aria-invalid={Boolean(errors.password)}
              {...register("password")}
            />
            {errors.password ? (
              <p className="text-sm text-destructive">
                {errors.password.message}
              </p>
            ) : null}
          </div>

          {errorMessage ? (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Нэвтрэх боломжгүй</AlertTitle>
              <AlertDescription>{errorMessage}</AlertDescription>
            </Alert>
          ) : null}

          <Button className="w-full" type="submit" disabled={isSubmitting}>
            {isSubmitting ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <LogIn className="h-4 w-4" />
            )}
            Нэвтрэх
          </Button>
        </form>

        <div className="mt-5 rounded-md border bg-secondary/50 p-4 text-sm leading-6 text-muted-foreground">
          Шинэ customer бүртгэл одоогоор дэмжигдээгүй.{" "}
          <Link className="font-medium text-primary hover:underline" href="/register">
            Бүртгэлийн төлөв харах
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
