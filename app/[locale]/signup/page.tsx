import { Suspense } from "react";
import { SignupPage } from "@/components/signup-page";
import { getDictionary } from "@/i18n/dictionaries";

export default async function Signup({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const dict = await getDictionary(locale as any);

  return (
    <Suspense fallback={null}>
      <SignupPage locale={locale} dict={dict} />
    </Suspense>
  );
}
