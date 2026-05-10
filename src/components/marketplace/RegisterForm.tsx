"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { AlertCircle, Loader2, UserPlus } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { registerCustomer } from "@/lib/api";
import { setStoredUser, setToken } from "@/lib/auth";

const registerSchema = z.object({
  email: z.string().trim().email("Enter a valid email address."),
  password: z.string().min(6, "Password must be at least 6 characters."),
  first_name: z.string().trim().min(1, "Enter your first name."),
  last_name: z.string().trim().optional()
});

type RegisterFormValues = z.infer<typeof registerSchema>;

export function RegisterForm() {
  const router = useRouter();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const {
    formState: { errors, isSubmitting },
    handleSubmit,
    register
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      email: "",
      password: "",
      first_name: "",
      last_name: ""
    }
  });

  async function onSubmit(values: RegisterFormValues) {
    setErrorMessage(null);

    try {
      const response = await registerCustomer({
        ...values,
        last_name: values.last_name || null
      });
      setToken(response.accessToken);
      setStoredUser(response.user);
      router.push("/profile");
      router.refresh();
    } catch (error) {
      setErrorMessage(
        error instanceof Error
          ? error.message
          : "Customer registration failed. Please try again."
      );
    }
  }

  return (
    <Card className="mx-auto max-w-xl shadow-soft">
      <CardHeader>
        <CardTitle className="text-2xl">Create customer account</CardTitle>
        <p className="text-sm leading-6 text-muted-foreground">
          Uses POST /auth/customer/register and signs you in with the returned token.
        </p>
      </CardHeader>
      <CardContent>
        <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <label className="text-sm font-medium" htmlFor="first_name">
                First name
              </label>
              <Input
                id="first_name"
                autoComplete="given-name"
                aria-invalid={Boolean(errors.first_name)}
                {...register("first_name")}
              />
              {errors.first_name ? (
                <p className="text-sm text-destructive">
                  {errors.first_name.message}
                </p>
              ) : null}
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium" htmlFor="last_name">
                Last name
              </label>
              <Input
                id="last_name"
                autoComplete="family-name"
                aria-invalid={Boolean(errors.last_name)}
                {...register("last_name")}
              />
              {errors.last_name ? (
                <p className="text-sm text-destructive">
                  {errors.last_name.message}
                </p>
              ) : null}
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium" htmlFor="email">
              Email
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
              Password
            </label>
            <Input
              id="password"
              type="password"
              autoComplete="new-password"
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
              <AlertTitle>Registration failed</AlertTitle>
              <AlertDescription>{errorMessage}</AlertDescription>
            </Alert>
          ) : null}

          <Button className="w-full" type="submit" disabled={isSubmitting}>
            {isSubmitting ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <UserPlus className="h-4 w-4" />
            )}
            Create account
          </Button>
        </form>

        <div className="mt-5 text-sm text-muted-foreground">
          Already registered?{" "}
          <Link className="font-medium text-primary hover:underline" href="/login">
            Log in
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
