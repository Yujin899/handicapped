import { OnboardingFlow } from "@/components/onboarding-flow";
import { getDictionary } from "@/i18n/dictionaries";

export default async function Onboarding({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const dict = await getDictionary(locale as any);

  return <OnboardingFlow locale={locale} dict={dict} />;
}
