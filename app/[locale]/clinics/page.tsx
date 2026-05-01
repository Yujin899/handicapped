import { ClinicsListingPage } from "@/components/clinics-listing-page"
import { Locale } from "@/i18n/config"
import { getDictionary } from "@/i18n/dictionaries"

export default async function ClinicsPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  const dict = await getDictionary(locale as Locale)

  return <ClinicsListingPage locale={locale} dict={dict} />
}
