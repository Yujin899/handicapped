import { LoginPage } from "@/components/login-page";
import { getDictionary } from "@/i18n/dictionaries";

export default async function Login({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const dict = await getDictionary(locale as any);

  return <LoginPage locale={locale} dict={dict} />;
}
