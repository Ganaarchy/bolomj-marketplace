"use client";

import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { AlertCircle, Building2, CheckCircle2, Loader2, Send } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { createTenantRequest } from "@/lib/api";

const slugPattern = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

const tenantRequestSchema = z.object({
  name: z.string().trim().min(2, "Байгууллагын нэр оруулна уу."),
  slug: z
    .string()
    .trim()
    .toLowerCase()
    .min(3, "Slug хамгийн багадаа 3 тэмдэгт байна.")
    .regex(slugPattern, "Зөвхөн жижиг үсэг, тоо, зураас ашиглана уу."),
  registration_number: z
    .string()
    .trim()
    .min(2, "Регистрийн дугаар оруулна уу."),
  email: z.string().trim().email("Зөв имэйл хаяг оруулна уу."),
  phone: z.string().trim().min(6, "Утасны дугаар оруулна уу."),
  description: z
    .string()
    .trim()
    .min(10, "Байгууллагын товч танилцуулга оруулна уу."),
  website_subdomain: z
    .string()
    .trim()
    .toLowerCase()
    .min(3, "Дэд домэйн хамгийн багадаа 3 тэмдэгт байна.")
    .regex(slugPattern, "Зөвхөн жижиг үсэг, тоо, зураас ашиглана уу."),
  admin_first_name: z.string().trim().min(1, "Админы нэр оруулна уу."),
  admin_last_name: z.string().trim().min(1, "Админы овог оруулна уу."),
  admin_email: z.string().trim().email("Админы зөв имэйл оруулна уу."),
  admin_password: z
    .string()
    .min(6, "Нууц үг хамгийн багадаа 6 тэмдэгт байна.")
});

type TenantRequestFormValues = z.infer<typeof tenantRequestSchema>;

const successMessage =
  "Байгууллагын бүртгэлийн хүсэлт амжилттай илгээгдлээ. Системийн админ баталгаажуулсны дараа таны вебсайт идэвхжинэ.";

function FieldError({ message }: { message?: string }) {
  if (!message) {
    return null;
  }

  return <p className="text-sm text-destructive">{message}</p>;
}

export function TenantRequestForm() {
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);

  const {
    formState: { errors, isSubmitting },
    handleSubmit,
    register,
    reset
  } = useForm<TenantRequestFormValues>({
    resolver: zodResolver(tenantRequestSchema),
    defaultValues: {
      name: "",
      slug: "",
      registration_number: "",
      email: "",
      phone: "",
      description: "",
      website_subdomain: "",
      admin_first_name: "",
      admin_last_name: "",
      admin_email: "",
      admin_password: ""
    }
  });

  async function onSubmit(values: TenantRequestFormValues) {
    setErrorMessage(null);
    setIsSuccess(false);

    try {
      await createTenantRequest(values);
      setIsSuccess(true);
      reset();
    } catch (error) {
      setErrorMessage(
        error instanceof Error
          ? error.message
          : "Хүсэлт илгээхэд алдаа гарлаа. Дахин оролдоно уу."
      );
    }
  }

  return (
    <div className="mx-auto grid max-w-6xl gap-8 lg:grid-cols-[0.85fr_1.15fr]">
      <section className="space-y-5">
        <div className="inline-flex h-12 w-12 items-center justify-center rounded-md bg-primary text-primary-foreground">
          <Building2 className="h-6 w-6" />
        </div>
        <div className="space-y-3">
          <p className="text-sm font-semibold uppercase tracking-normal text-primary">
            Байгууллагын хүсэлт
          </p>
          <h1 className="text-3xl font-semibold tracking-normal text-slate-950 md:text-4xl">
            Аяллын байгууллагаар Bolomj-д нэгдэх
          </h1>
          <p className="max-w-xl text-base leading-7 text-muted-foreground">
            Хүсэлт илгээгдсэний дараа системийн админ мэдээллийг шалгаж,
            баталгаажуулсан үед байгууллагын вебсайт болон удирдлагын эрх
            идэвхжинэ.
          </p>
        </div>
        <div className="rounded-md border bg-secondary/50 p-4 text-sm leading-6 text-muted-foreground">
          Энэ маягт tenant_admin шууд үүсгэхгүй. Зөвхөн баталгаажуулалт хүлээж
          буй байгууллагын хүсэлт үүсгэнэ.
        </div>
      </section>

      <Card className="shadow-soft">
        <CardHeader>
          <CardTitle className="text-2xl">Бүртгэлийн хүсэлт</CardTitle>
          <p className="text-sm leading-6 text-muted-foreground">
            Байгууллагын үндсэн мэдээлэл болон анхны админы мэдээллийг оруулна
            уу.
          </p>
        </CardHeader>
        <CardContent>
          <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2 sm:col-span-2">
                <label className="text-sm font-medium" htmlFor="name">
                  Байгууллагын нэр
                </label>
                <Input
                  id="name"
                  autoComplete="organization"
                  aria-invalid={Boolean(errors.name)}
                  {...register("name")}
                />
                <FieldError message={errors.name?.message} />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium" htmlFor="slug">
                  Slug
                </label>
                <Input
                  id="slug"
                  placeholder="nomad-travel"
                  aria-invalid={Boolean(errors.slug)}
                  {...register("slug")}
                />
                <FieldError message={errors.slug?.message} />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium" htmlFor="website_subdomain">
                  Вебсайтын дэд домэйн
                </label>
                <Input
                  id="website_subdomain"
                  placeholder="nomad"
                  aria-invalid={Boolean(errors.website_subdomain)}
                  {...register("website_subdomain")}
                />
                <p className="text-xs text-muted-foreground">.bolomj.space</p>
                <FieldError message={errors.website_subdomain?.message} />
              </div>

              <div className="space-y-2">
                <label
                  className="text-sm font-medium"
                  htmlFor="registration_number"
                >
                  Регистрийн дугаар
                </label>
                <Input
                  id="registration_number"
                  aria-invalid={Boolean(errors.registration_number)}
                  {...register("registration_number")}
                />
                <FieldError message={errors.registration_number?.message} />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium" htmlFor="email">
                  Байгууллагын имэйл
                </label>
                <Input
                  id="email"
                  type="email"
                  autoComplete="email"
                  aria-invalid={Boolean(errors.email)}
                  {...register("email")}
                />
                <FieldError message={errors.email?.message} />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium" htmlFor="phone">
                  Утас
                </label>
                <Input
                  id="phone"
                  autoComplete="tel"
                  aria-invalid={Boolean(errors.phone)}
                  {...register("phone")}
                />
                <FieldError message={errors.phone?.message} />
              </div>

              <div className="space-y-2 sm:col-span-2">
                <label className="text-sm font-medium" htmlFor="description">
                  Танилцуулга
                </label>
                <Textarea
                  id="description"
                  rows={4}
                  aria-invalid={Boolean(errors.description)}
                  {...register("description")}
                />
                <FieldError message={errors.description?.message} />
              </div>
            </div>

            <div className="grid gap-4 border-t pt-6 sm:grid-cols-2">
              <div className="space-y-2">
                <label className="text-sm font-medium" htmlFor="admin_first_name">
                  Админы нэр
                </label>
                <Input
                  id="admin_first_name"
                  autoComplete="given-name"
                  aria-invalid={Boolean(errors.admin_first_name)}
                  {...register("admin_first_name")}
                />
                <FieldError message={errors.admin_first_name?.message} />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium" htmlFor="admin_last_name">
                  Админы овог
                </label>
                <Input
                  id="admin_last_name"
                  autoComplete="family-name"
                  aria-invalid={Boolean(errors.admin_last_name)}
                  {...register("admin_last_name")}
                />
                <FieldError message={errors.admin_last_name?.message} />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium" htmlFor="admin_email">
                  Админы имэйл
                </label>
                <Input
                  id="admin_email"
                  type="email"
                  autoComplete="email"
                  aria-invalid={Boolean(errors.admin_email)}
                  {...register("admin_email")}
                />
                <FieldError message={errors.admin_email?.message} />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium" htmlFor="admin_password">
                  Админы нууц үг
                </label>
                <Input
                  id="admin_password"
                  type="password"
                  autoComplete="new-password"
                  aria-invalid={Boolean(errors.admin_password)}
                  {...register("admin_password")}
                />
                <FieldError message={errors.admin_password?.message} />
              </div>
            </div>

            {isSuccess ? (
              <Alert className="border-emerald-200 bg-emerald-50 text-emerald-950">
                <CheckCircle2 className="h-4 w-4 text-emerald-700" />
                <AlertTitle>Хүсэлт илгээгдлээ</AlertTitle>
                <AlertDescription>{successMessage}</AlertDescription>
              </Alert>
            ) : null}

            {errorMessage ? (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Хүсэлт илгээхэд алдаа гарлаа</AlertTitle>
                <AlertDescription>{errorMessage}</AlertDescription>
              </Alert>
            ) : null}

            <Button className="w-full" type="submit" disabled={isSubmitting}>
              {isSubmitting ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Send className="h-4 w-4" />
              )}
              {isSubmitting ? "Илгээж байна..." : "Хүсэлт илгээх"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
