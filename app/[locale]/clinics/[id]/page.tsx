import { ClinicDetailsPageClient } from "@/components/clinic-details-page"
import { Locale } from "@/i18n/config"
import { getDictionary } from "@/i18n/dictionaries"

export default async function ClinicDetailsPage({
  params,
}: {
  params: Promise<{ locale: string; id: string }>
}) {
  const { locale, id } = await params
  const dict = await getDictionary(locale as Locale)

  return <ClinicDetailsPageClient clinicId={id} locale={locale} dict={dict} />
}

