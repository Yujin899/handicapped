"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { CalendarDays, Clock3, MapPin, Star, UserRound } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import { Textarea } from "@/components/ui/textarea"
import { useAuth } from "@/components/auth-provider"
import { createBooking, getClinicById } from "@/lib/data"
import { getFriendlyFirebaseError } from "@/lib/firebase-errors"
import { mockFilters } from "@/lib/mock-filters"

type BookingDict = {
  booking: {
    title: string
    subtitle: string
    clinicSummary: string
    date: string
    time: string
    userInfo: string
    fullName: string
    fullNamePlaceholder: string
    note: string
    notePlaceholder: string
    accessibilityReminder: string
    confirmBooking: string
    requiredField: string
    selectedDateLabel: string
    visitType: string
    clinicVisit: string
    homeVisit: string
    homeAddress: string
    addressPlaceholder: string
    homeVisitNote: string
  }
  bookingSuccess: {
    accessibilityNotesTitle: string
  }
  search: {
    filterWheelchair: string
    filterHearing: string
    filterQuiet: string
  }
  onboarding: {
    conditionDiabetes: string
    conditionHypertension: string
    conditionCardiac: string
    conditionAsthma: string
    conditionEpilepsy: string
    conditionKidney: string
    conditionArthritis: string
    needsLabel: string
    conditionsLabel: string
  }
}

const dateOptions = [
  { key: "2026-05-02", label: "Fri, May 2" },
  { key: "2026-05-03", label: "Sat, May 3" },
  { key: "2026-05-04", label: "Sun, May 4" },
  { key: "2026-05-05", label: "Mon, May 5" },
  { key: "2026-05-06", label: "Tue, May 6" },
]

const timeSlots = ["09:00 AM", "10:30 AM", "12:00 PM", "02:00 PM", "04:30 PM"]

export function BookingPage({
  locale,
  clinicId,
  dict,
}: {
  locale: string
  clinicId: string
  dict: BookingDict
}) {
  const isArabic = locale === "ar"
  const router = useRouter()
  const { currentUser, profile, loading } = useAuth()
  const [selectedDate, setSelectedDate] = React.useState(dateOptions[0].key)
  const [selectedTime, setSelectedTime] = React.useState(timeSlots[1])
  const [name, setName] = React.useState("")
  const [note, setNote] = React.useState("")
  const [error, setError] = React.useState("")
  const [isSubmitting, setIsSubmitting] = React.useState(false)
  const [firestoreClinicName, setFirestoreClinicName] = React.useState("")
  const [firestoreClinicNameAr, setFirestoreClinicNameAr] = React.useState("")
  const [allowsHomeVisit, setAllowsHomeVisit] = React.useState(false)
  const [visitType, setVisitType] = React.useState<"clinic" | "home">("clinic")
  const [patientAddress, setPatientAddress] = React.useState("")

  const fallbackClinicName = clinicId
    .split("-")
    .map((segment) => segment.charAt(0).toUpperCase() + segment.slice(1))
    .join(" ")
  const clinicName = isArabic 
    ? (firestoreClinicNameAr || firestoreClinicName || fallbackClinicName)
    : (firestoreClinicName || fallbackClinicName)

  React.useEffect(() => {
    getClinicById(clinicId)
      .then((clinic) => {
        setFirestoreClinicName(clinic?.name ?? "")
        setFirestoreClinicNameAr(clinic?.nameAr ?? "")
        setAllowsHomeVisit(!!clinic?.allowsHomeVisit)
      })
      .catch(() => {
        setFirestoreClinicName("")
        setFirestoreClinicNameAr("")
      })
  }, [clinicId])

  const selectedDateLabel =
    dateOptions.find((date) => date.key === selectedDate)?.label ?? dateOptions[0].label

  const accessibilityNotes = (profile?.accessibilityPreferences?.length ? profile.accessibilityPreferences : [])
    .map(id => {
      const filter = mockFilters.find(f => f.id === id)
      return locale === 'ar' ? filter?.labelAr || filter?.label || id : filter?.label || id
    })

  const medicalConditionsNotes = (profile?.medicalConditions?.length ? profile.medicalConditions : [])
    .map(id => {
      const conditionMap: Record<string, string> = {
        diabetes: dict.onboarding.conditionDiabetes,
        hypertension: dict.onboarding.conditionHypertension,
        cardiac: dict.onboarding.conditionCardiac,
        asthma: dict.onboarding.conditionAsthma,
        epilepsy: dict.onboarding.conditionEpilepsy,
        kidney: dict.onboarding.conditionKidney,
        arthritis: dict.onboarding.conditionArthritis,
      };
      return conditionMap[id] || id;
    });

  const canSubmit = name.trim().length > 1

  const onSubmit = async (event: React.FormEvent) => {
    event.preventDefault()
    if (!canSubmit) return
    setError("")

    if (!currentUser) {
      router.push(`/${locale}/login?redirect=/${locale}/clinics/${clinicId}/book`)
      return
    }

    setIsSubmitting(true)

    try {
      const bookingId = await createBooking({
        userId: currentUser.uid,
        clinicId,
        clinicName,
        clinicNameAr: firestoreClinicNameAr,
        date: selectedDate,
        time: selectedTime,
        notes: note.trim(),
        medicalConditions: profile?.medicalConditions || [],
        accessibilityPreferences: profile?.accessibilityPreferences || [],
        visitType: visitType,
        patientAddress: visitType === "home" ? patientAddress.trim() : "",
      })

      const params = new URLSearchParams({
        id: bookingId,
        clinicId: clinicId,
        clinic: isArabic ? (firestoreClinicNameAr || clinicName) : clinicName,
        date: selectedDateLabel,
        time: selectedTime,
        note: note.trim(),
        prefs: accessibilityNotes.join("|"),
        conditions: medicalConditionsNotes.join("|"),
        type: visitType,
        address: visitType === "home" ? patientAddress.trim() : "",
      })

      router.push(`/${locale}/booking/success?${params.toString()}`)
    } catch (err) {
      setError(getFriendlyFirebaseError(err))
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <section className="container mx-auto max-w-4xl px-4 py-8 md:px-6 md:py-10">
      <div className="space-y-6">
        <div className="space-y-2">
          <h1 className="text-2xl font-semibold tracking-tight md:text-3xl">{dict.booking.title}</h1>
          <p className="text-sm text-muted-foreground md:text-base">{dict.booking.subtitle}</p>
        </div>

        <Card className="rounded-md border-border/80 shadow-sm">
          <CardHeader className="pb-3">
            <CardTitle className="text-base">{dict.booking.clinicSummary}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <p className="text-base font-semibold">{clinicName}</p>
            <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
              <span className="inline-flex items-center gap-1">
                <Star className="size-4 fill-current text-primary" />
                4.8 (96)
              </span>
              <span className="inline-flex items-center gap-1">
                <MapPin className="size-4" />
                {isArabic ? "المنطقة الطبية" : "Healthcare District"}
              </span>
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-md border-border/80 shadow-sm">
          <CardContent className="space-y-6 p-4 pt-4 md:p-5 md:pt-5">
            <form className="space-y-6" onSubmit={onSubmit}>
              <div className="space-y-3">
                <p className="inline-flex items-center gap-2 text-sm font-semibold">
                  <CalendarDays className="size-4 text-primary" />
                  {dict.booking.date}
                </p>
                <div className="grid grid-cols-2 gap-2 md:grid-cols-5">
                  {dateOptions.map((date) => (
                    <Button
                      key={date.key}
                      type="button"
                      variant={selectedDate === date.key ? "default" : "outline"}
                      aria-pressed={selectedDate === date.key}
                      className="h-11 rounded-md px-2 text-xs md:text-sm"
                      onClick={() => setSelectedDate(date.key)}
                    >
                      {date.label}
                    </Button>
                  ))}
                </div>
              </div>

              <div className="space-y-3">
                <p className="inline-flex items-center gap-2 text-sm font-semibold">
                  <Clock3 className="size-4 text-primary" />
                  {dict.booking.time}
                </p>
                <div className="grid grid-cols-2 gap-2 md:grid-cols-5">
                  {timeSlots.map((slot) => (
                    <Button
                      key={slot}
                      type="button"
                      variant={selectedTime === slot ? "default" : "outline"}
                      aria-pressed={selectedTime === slot}
                      className="h-11 rounded-md px-2 text-xs md:text-sm"
                      onClick={() => setSelectedTime(slot)}
                    >
                      {slot}
                    </Button>
                  ))}
                </div>
              </div>

              {allowsHomeVisit && (
                <div className="space-y-4 rounded-xl border border-primary/20 bg-primary/5 p-4">
                  <div className="space-y-2">
                    <p className="text-sm font-bold text-primary">
                      {dict.booking.visitType}
                    </p>
                    <div className="flex gap-2">
                      <Button
                        type="button"
                        variant={visitType === "clinic" ? "default" : "outline"}
                        className="flex-1 rounded-md"
                        onClick={() => setVisitType("clinic")}
                      >
                        {dict.booking.clinicVisit}
                      </Button>
                      <Button
                        type="button"
                        variant={visitType === "home" ? "default" : "outline"}
                        className="flex-1 rounded-md"
                        onClick={() => setVisitType("home")}
                      >
                        {dict.booking.homeVisit}
                      </Button>
                    </div>
                  </div>

                  {visitType === "home" && (
                    <div className="space-y-2 animate-in fade-in slide-in-from-top-1 duration-200">
                      <label htmlFor="patient-address" className="text-sm font-medium">
                        {dict.booking.homeAddress} <span className="text-destructive">*</span>
                      </label>
                      <Input
                        id="patient-address"
                        value={patientAddress}
                        onChange={(e) => setPatientAddress(e.target.value)}
                        placeholder={dict.booking.addressPlaceholder}
                        className="h-11 border-primary/30"
                        required
                      />
                      <p className="text-[10px] text-muted-foreground">
                        {dict.booking.homeVisitNote}
                      </p>
                    </div>
                  )}
                </div>
              )}

              <Separator />

              <div className="space-y-4">
                <p className="inline-flex items-center gap-2 text-sm font-semibold">
                  <UserRound className="size-4 text-primary" />
                  {dict.booking.userInfo}
                </p>
                <div className="space-y-1.5">
                  <label htmlFor="booking-name" className="text-sm font-medium">
                    {dict.booking.fullName} <span className="text-destructive">*</span>
                  </label>
                  <Input
                    id="booking-name"
                    value={name}
                    onChange={(event) => setName(event.target.value)}
                    placeholder={dict.booking.fullNamePlaceholder}
                    className="h-11"
                    required
                  />
                  {!canSubmit && (
                    <p className="text-xs text-muted-foreground">{dict.booking.requiredField}</p>
                  )}
                </div>
                <div className="space-y-1.5">
                  <label htmlFor="booking-note" className="text-sm font-medium">
                    {dict.booking.note}
                  </label>
                  <Textarea
                    id="booking-note"
                    value={note}
                    onChange={(event) => setNote(event.target.value)}
                    placeholder={dict.booking.notePlaceholder}
                  />
                </div>
              </div>

              {(accessibilityNotes.length > 0 || medicalConditionsNotes.length > 0) && (
                <Card className="rounded-md border-none bg-muted/20 shadow-none">
                  <CardContent className="space-y-4 p-4 pt-4">
                    <p className="text-sm font-semibold">{dict.booking.accessibilityReminder}</p>
                    {accessibilityNotes.length > 0 && (
                      <div className="space-y-2">
                        <p className="text-xs font-medium text-muted-foreground">{dict.onboarding.needsLabel}</p>
                        <div className="flex flex-wrap gap-2">
                          {accessibilityNotes.map((preference) => (
                            <Badge key={preference} variant="secondary" className="rounded-md">
                              {isArabic ? "✓" : "✔"} {preference}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                    {medicalConditionsNotes.length > 0 && (
                      <div className="space-y-2">
                        <p className="text-xs font-medium text-muted-foreground">{dict.onboarding.conditionsLabel}</p>
                        <div className="flex flex-wrap gap-2">
                          {medicalConditionsNotes.map((condition) => (
                            <Badge key={condition} variant="outline" className="rounded-md border-primary/30 bg-primary/5 text-primary">
                              {isArabic ? "●" : "●"} {condition}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              )}

              {error && (
                <p className="rounded-md bg-destructive/10 px-3 py-2 text-sm text-destructive" role="alert">
                  {error}
                </p>
              )}

              <Button
                type="submit"
                className="h-12 w-full rounded-md text-sm font-semibold"
                disabled={loading || isSubmitting}
              >
                {isSubmitting ? "Saving..." : dict.booking.confirmBooking}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </section>
  )
}
