import Link from "next/link"
import { CheckCircle2, Clock3, MapPin } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Locale } from "@/i18n/config"
import { getDictionary } from "@/i18n/dictionaries"

export default async function BookingSuccessPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>
  searchParams: Promise<Record<string, string | string[] | undefined>>
}) {
  const { locale } = await params
  const query = await searchParams
  const dict = await getDictionary(locale as Locale)
  const isArabic = locale === "ar"

  const clinic = typeof query.clinic === "string" ? query.clinic : dict.data.oakwood
  const date = typeof query.date === "string" ? query.date : "Fri, May 2"
  const time = typeof query.time === "string" ? query.time : "10:30 AM"
  const note = typeof query.note === "string" ? query.note : ""
  const prefsRaw = typeof query.prefs === "string" ? query.prefs : ""
  const prefs = prefsRaw ? prefsRaw.split("|").filter(Boolean) : []
  const visitType = typeof query.type === "string" ? query.type : "clinic"
  const address = typeof query.address === "string" ? query.address : ""

  return (
    <section className="container mx-auto max-w-3xl px-4 py-10 md:px-6 md:py-14">
      <div className="space-y-6">
        <Card className="rounded-md border-border/80 shadow-sm">
          <CardContent className="space-y-3 p-6 pt-6 text-center">
            <div className="mx-auto inline-flex size-12 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-sm">
              <CheckCircle2 className="size-6" />
            </div>
            <h1 className="text-2xl font-semibold tracking-tight md:text-3xl">
              {dict.bookingSuccess.title}
            </h1>
            <p className="text-sm text-muted-foreground md:text-base">
              {dict.bookingSuccess.subtitle}
            </p>
          </CardContent>
        </Card>

        <Card className="rounded-md border-border/80 shadow-sm">
          <CardHeader>
            <CardTitle className="text-base">{dict.bookingSuccess.detailsTitle}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">{dict.bookingSuccess.clinic}</p>
              <p className="font-semibold">{clinic}</p>
            </div>
            <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
              <div className="rounded-md bg-muted/20 p-3">
                <p className="inline-flex items-center gap-1 text-xs text-muted-foreground">
                  <Clock3 className="size-3.5" /> {dict.bookingSuccess.dateTime}
                </p>
                <p className="mt-1 text-sm font-medium">
                  {date} - {time}
                </p>
              </div>
              <div className="rounded-md bg-muted/20 p-3">
                <p className="inline-flex items-center gap-1 text-xs text-muted-foreground">
                  <MapPin className="size-3.5" /> {dict.bookingSuccess.location}
                </p>
                <p className="mt-1 text-sm font-medium">
                  {visitType === "home" 
                    ? dict.bookingSuccess.homeVisitTitle
                    : (isArabic ? "المنطقة الطبية" : "Healthcare District")}
                </p>
              </div>
            </div>

            {visitType === "home" && address && (
              <div className="rounded-md border border-primary/20 bg-primary/5 p-4">
                <p className="text-xs font-bold uppercase tracking-wider text-primary">
                  {dict.bookingSuccess.visitAddress}
                </p>
                <p className="mt-1 text-sm font-semibold">{address}</p>
                <p className="mt-2 text-xs text-muted-foreground">
                  {dict.bookingSuccess.visitAddressNote}
                </p>
              </div>
            )}

            {prefs.length > 0 && (
              <>
                <Separator />
                <div className="space-y-2">
                  <p className="text-sm font-medium">{dict.bookingSuccess.accessibilityNotesTitle}</p>
                  <div className="flex flex-wrap gap-2">
                    {prefs.map((pref) => (
                      <Badge key={pref} variant="secondary" className="rounded-md">
                        {isArabic ? "✓" : "✔"} {pref}
                      </Badge>
                    ))}
                  </div>
                </div>
              </>
            )}

            {note && (
              <div className="rounded-md bg-muted/10 p-3">
                <p className="text-xs text-muted-foreground">{dict.bookingSuccess.note}</p>
                <p className="mt-1 text-sm">{note}</p>
              </div>
            )}
          </CardContent>
        </Card>

        <div className="flex flex-col gap-3">
          <div className="flex flex-col gap-3 sm:flex-row">
            <Button asChild className="h-14 flex-1 rounded-xl text-base font-bold shadow-sm">
              <Link href={`/${locale}/clinics`}>{dict.bookingSuccess.backToClinics}</Link>
            </Button>
            <Button asChild variant="outline" className="h-14 flex-1 rounded-xl text-base font-bold border-2">
              <Link href={`/${locale}/clinics/${query.clinicId || "oakwood-medical-center"}`}>
                {dict.bookingSuccess.viewClinic}
              </Link>
            </Button>
          </div>
          <Button asChild variant="ghost" className="h-12 w-full rounded-xl text-sm font-semibold text-muted-foreground hover:bg-primary/5 hover:text-primary">
            <Link href={`/${locale}/profile`}>
              {dict.bookingSuccess.viewProfile}
            </Link>
          </Button>
        </div>
      </div>
    </section>
  )
}
