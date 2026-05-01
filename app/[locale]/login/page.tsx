import { Suspense } from "react"
import { LoginPage } from "@/components/login-page"
import { Locale } from "@/i18n/config"
import { getDictionary } from "@/i18n/dictionaries"

export default async function LoginPageWrapper({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  const dict = await getDictionary(locale as Locale)

  return (
    <Suspense fallback={<div>Loading login...</div>}>
      <LoginPage locale={locale} dict={dict} />
    </Suspense>
  )
}
