import { ProfilePage } from "@/components/profile-page"
import { getDictionary } from "@/i18n/dictionaries"
import { type Locale } from "@/i18n/config"

export default async function Profile({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  const dict = await getDictionary(locale as Locale)

  return <ProfilePage locale={locale} dict={dict} />
}

