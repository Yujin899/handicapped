"use client"

import * as React from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { CalendarDays, ShieldCheck, UserRound } from "lucide-react"

import { useAuth } from "@/components/auth-provider"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import { Toast } from "@/components/ui/toast"
import { getBookingsByUser } from "@/lib/data"
import { getFriendlyFirebaseError } from "@/lib/firebase-errors"
import type { Booking } from "@/lib/types"
import { getFilters, type Filter } from "@/lib/filters"
import { updateUserProfile } from "@/lib/users"

export function ProfilePage({ locale, dict }: { locale: string, dict: any }) {
  const router = useRouter()
  const { currentUser, profile, loading, refreshProfile } = useAuth()
  const [name, setName] = React.useState("")
  const [preferences, setPreferences] = React.useState<string[]>([])
  const [availableFilters, setAvailableFilters] = React.useState<Filter[]>([])
  const [bookings, setBookings] = React.useState<Booking[]>([])
  const [error, setError] = React.useState("")
  const [isSaving, setIsSaving] = React.useState(false)
  const [showSuccessToast, setShowSuccessToast] = React.useState(false)

  const d = dict.profile

  React.useEffect(() => {
    getFilters().then(setAvailableFilters)
  }, [])

  React.useEffect(() => {
    if (!loading && !currentUser) {
      router.push(`/${locale}/login?redirect=/${locale}/profile`)
    }
  }, [currentUser, loading, locale, router])

  React.useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      setName(profile?.name ?? "")
      setPreferences(profile?.accessibilityPreferences ?? [])
    }, 0)

    return () => window.clearTimeout(timeoutId)
  }, [profile])

  React.useEffect(() => {
    if (!currentUser) return

    getBookingsByUser(currentUser.uid)
      .then(setBookings)
      .catch(() => setBookings([]))
  }, [currentUser])

  const togglePreference = (preference: string) => {
    setPreferences((current) =>
      current.includes(preference)
        ? current.filter((item) => item !== preference)
        : [...current, preference]
    )
  }

  const handleSave = async (event: React.FormEvent) => {
    event.preventDefault()
    if (!currentUser) return

    setError("")
    setIsSaving(true)

    try {
      await updateUserProfile(currentUser.uid, {
        name: name.trim(),
        accessibilityPreferences: preferences,
      })
      await refreshProfile()
      setShowSuccessToast(true)
    } catch (err) {
      setError(getFriendlyFirebaseError(err))
    } finally {
      setIsSaving(false)
    }
  }

  if (loading || !currentUser) {
    return (
      <section className="container mx-auto max-w-5xl px-4 py-10 md:px-6">
        <p className="text-sm text-muted-foreground">{d.loading}</p>
      </section>
    )
  }

  return (
    <section className="container mx-auto max-w-6xl px-4 py-8 md:px-6 md:py-10">
      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_360px]">
        <div className="space-y-6">
          <header className="space-y-2">
            <p className="text-sm font-semibold text-primary">{d.badge}</p>
            <h1 className="text-2xl font-semibold tracking-tight md:text-3xl">
              {d.title}
            </h1>
            <p className="max-w-2xl text-sm text-muted-foreground md:text-base">
              {d.subtitle}
            </p>
          </header>

          <Card className="rounded-md border-border/80 shadow-sm">
            <CardHeader>
              <CardTitle className="inline-flex items-center gap-2 text-base">
                <UserRound className="size-4 text-primary" />
                {d.accountDetails}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form className="space-y-5" onSubmit={handleSave}>
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-1.5">
                    <label htmlFor="profile-name" className="text-sm font-medium">{d.name}</label>
                    <Input
                      id="profile-name"
                      value={name}
                      onChange={(event) => setName(event.target.value)}
                      placeholder={d.namePlaceholder}
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label htmlFor="profile-email" className="text-sm font-medium">{d.email}</label>
                    <Input id="profile-email" value={currentUser.email ?? ""} disabled />
                  </div>
                </div>

                <Separator />

                <div className="space-y-3">
                  <p className="text-sm font-medium">{d.preferences}</p>
                  <div className="flex flex-wrap gap-2">
                    {availableFilters.map((filter) => (
                      <Button
                        key={filter.id}
                        type="button"
                        variant={preferences.includes(filter.id) ? "default" : "outline"}
                        className="h-11 rounded-md capitalize"
                        onClick={() => togglePreference(filter.id)}
                      >
                        {locale === 'ar' ? filter.labelAr || filter.label : filter.label}
                      </Button>
                    ))}
                  </div>
                </div>

                {error && (
                  <p className="rounded-md bg-destructive/10 px-3 py-2 text-sm text-destructive" role="alert">
                    {error}
                  </p>
                )}

                <Button type="submit" disabled={isSaving}>
                  {isSaving ? d.saving : d.save}
                </Button>
              </form>
            </CardContent>
          </Card>

          <Card className="rounded-md border-border/80 shadow-sm">
            <CardHeader>
              <CardTitle className="inline-flex items-center gap-2 text-base">
                <CalendarDays className="size-4 text-primary" />
                {d.bookings}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {bookings.length === 0 ? (
                <div className="rounded-md bg-muted/20 p-5">
                  <p className="font-medium">{d.noBookings}</p>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {d.noBookingsDesc}
                  </p>
                </div>
              ) : (
                bookings.map((booking) => (
                  <div key={booking.id} className="rounded-md border border-border/80 p-4">
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div>
                        <p className="font-semibold">{booking.clinicName}</p>
                        <p className="mt-1 text-sm text-muted-foreground">
                          {booking.date} at {booking.time}
                        </p>
                      </div>
                      <Badge variant="secondary" className="rounded-md">{d.confirmed}</Badge>
                    </div>
                    {booking.notes && <p className="mt-3 text-sm">{booking.notes}</p>}
                  </div>
                ))
              )}
            </CardContent>
          </Card>
        </div>

        <aside className="space-y-4">
          <Card className="rounded-md border-border/80 shadow-sm">
            <CardContent className="space-y-4 p-5 pt-5">
              <div className="inline-flex size-10 items-center justify-center rounded-md bg-primary/10 text-primary">
                <ShieldCheck className="size-5" />
              </div>
              <div>
                <p className="font-semibold">{d.role}</p>
                <p className="mt-1 text-sm text-muted-foreground">
                  {profile?.role === "admin" ? d.adminRole : d.userRole}
                </p>
              </div>
              {profile?.role === "admin" && (
                <Button asChild className="w-full rounded-md">
                  <Link href={`/${locale}/admin`}>{d.openAdmin}</Link>
                </Button>
              )}
            </CardContent>
          </Card>
        </aside>
      </div>
      <Toast 
        message={locale === 'ar' ? "تم حفظ الملف الشخصي بنجاح" : "Profile saved successfully"}
        isVisible={showSuccessToast}
        onClose={() => setShowSuccessToast(false)}
      />
    </section>
  )
}
