import { AdminDashboard } from "@/components/admin-dashboard"
import { getDictionary } from "@/i18n/dictionaries"
import { type Locale } from "@/i18n/config"

export default async function Admin({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  const dict = await getDictionary(locale as Locale)

  return <AdminDashboard locale={locale} dict={dict} />
}

