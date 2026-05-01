import { BookingPage } from "@/components/booking-page"
import { Locale } from "@/i18n/config"
import { getDictionary } from "@/i18n/dictionaries"

export default async function ClinicBookingPage({
  params,
}: {
  params: Promise<{ locale: string; id: string }>
}) {
  const { locale, id } = await params
  const dict = await getDictionary(locale as Locale)

  return <BookingPage locale={locale} clinicId={id} dict={dict} />
}
