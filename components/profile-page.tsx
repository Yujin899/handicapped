"use client"

import * as React from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { CalendarDays, ShieldCheck, UserRound, ImagePlus, Loader2, Camera } from "lucide-react"
import Image from "next/image"

import { useAuth } from "@/components/auth-provider"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import { Toast } from "@/components/ui/toast"
import { getBookingsByUser, getAllBookings } from "@/lib/data"
import { QueueStatus } from "@/components/queue-status"
import { getFriendlyFirebaseError } from "@/lib/firebase-errors"
import type { Booking } from "@/lib/types"
import { getFilters, type Filter } from "@/lib/filters"
import { updateUserProfile } from "@/lib/users"

export function ProfilePage({ locale, dict }: { locale: string, dict: any }) {
  const router = useRouter()
  const { currentUser, profile, loading, refreshProfile } = useAuth()
  const [name, setName] = React.useState("")
  const [preferences, setPreferences] = React.useState<string[]>([])
  const [medicalConditions, setMedicalConditions] = React.useState<string[]>([])
  const [customPrefInput, setCustomPrefInput] = React.useState("")
  const [customCondInput, setCustomCondInput] = React.useState("")
  const [availableFilters, setAvailableFilters] = React.useState<Filter[]>([])
  const [bookings, setBookings] = React.useState<Booking[]>([])
  const [allBookings, setAllBookings] = React.useState<Booking[]>([])
  const [error, setError] = React.useState("")
  const [isSaving, setIsSaving] = React.useState(false)
  const [isUploading, setIsUploading] = React.useState(false)
  const [photoURL, setPhotoURL] = React.useState("")
  const [showSuccessToast, setShowSuccessToast] = React.useState(false)

  const d = dict.profile
  const isArabic = locale === "ar"

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
      setMedicalConditions(profile?.medicalConditions ?? [])
      setPhotoURL(profile?.photoURL ?? "/profile.png")
    }, 0)

    return () => window.clearTimeout(timeoutId)
  }, [profile])

  React.useEffect(() => {
    if (!currentUser) return

    getBookingsByUser(currentUser.uid)
      .then(setBookings)
      .catch(() => setBookings([]))

    getAllBookings()
      .then(setAllBookings)
      .catch(() => setAllBookings([]))
  }, [currentUser])

  const togglePreference = (preference: string) => {
    setPreferences((current) =>
      current.includes(preference)
        ? current.filter((item) => item !== preference)
        : [...current, preference]
    )
  }

  const toggleCondition = (condition: string) => {
    setMedicalConditions((current) =>
      current.includes(condition)
        ? current.filter((item) => item !== condition)
        : [...current, condition]
    )
  }

  const addCustomPreference = () => {
    if (!customPrefInput.trim()) return
    const val = customPrefInput.trim()
    if (!preferences.includes(val)) {
      setPreferences(prev => [...prev, val])
    }
    setCustomPrefInput("")
  }

  const addCustomCondition = () => {
    if (!customCondInput.trim()) return
    const val = customCondInput.trim()
    if (!medicalConditions.includes(val)) {
      setMedicalConditions(prev => [...prev, val])
    }
    setCustomCondInput("")
  }

  const predefinedConditions = [
    "diabetes", "hypertension", "cardiac", "asthma", "epilepsy", "kidney", "arthritis"
  ]

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME
    const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET

    if (!cloudName || !uploadPreset) {
      setError("Cloudinary configuration missing.")
      return
    }

    setIsUploading(true)
    setError("")

    try {
      const formData = new FormData()
      formData.append("file", file)
      formData.append("upload_preset", uploadPreset)

      const response = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
        method: "POST",
        body: formData,
      })

      if (!response.ok) throw new Error("Upload failed")
      const data = await response.json()
      setPhotoURL(data.secure_url)
    } catch (err) {
      setError("Image upload failed.")
    } finally {
      setIsUploading(false)
    }
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
        medicalConditions: medicalConditions,
        photoURL: photoURL,
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
              <form className="space-y-6" onSubmit={handleSave}>
                <div className="flex flex-col items-center gap-6 md:flex-row">
                  <div className="relative group">
                    <div className="relative size-32 overflow-hidden rounded-full border-4 border-background shadow-xl">
                      <Image 
                        src={photoURL || "/profile.png"} 
                        alt="Profile" 
                        fill 
                        className="object-cover" 
                      />
                      {isUploading && (
                        <div className="absolute inset-0 flex items-center justify-center bg-black/40">
                          <Loader2 className="size-8 animate-spin text-white" />
                        </div>
                      )}
                    </div>
                    <label className="absolute bottom-0 right-0 flex size-10 cursor-pointer items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg transition-transform hover:scale-110">
                      <Camera className="size-5" />
                      <input 
                        type="file" 
                        className="hidden" 
                        accept="image/*" 
                        onChange={handleImageUpload} 
                        disabled={isUploading} 
                      />
                    </label>
                  </div>
                  <div className="flex-1 space-y-1">
                    <h3 className="text-xl font-bold">{name || "Verified User"}</h3>
                    <p className="text-sm text-muted-foreground">{currentUser.email}</p>
                    <div className="flex flex-wrap gap-2 pt-2">
                      <Badge variant="secondary" className="rounded-md">
                        {profile?.role === "admin" ? "Administrator" : "Verified Patient"}
                      </Badge>
                    </div>
                  </div>
                </div>

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
                    {/* Render custom preferences that are not in the predefined list */}
                    {preferences.filter(p => !availableFilters.some(f => f.id === p)).map(p => (
                      <Button
                        key={p}
                        type="button"
                        variant="default"
                        className="h-11 rounded-md"
                        onClick={() => togglePreference(p)}
                      >
                        {p} ×
                      </Button>
                    ))}
                  </div>
                  <div className="flex gap-2 max-w-sm">
                    <Input 
                      placeholder={isArabic ? "إضافة احتياج مخصص..." : "Add custom need..."}
                      value={customPrefInput}
                      onChange={(e) => setCustomPrefInput(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addCustomPreference())}
                    />
                    <Button type="button" variant="outline" onClick={addCustomPreference}>{isArabic ? "إضافة" : "Add"}</Button>
                  </div>
                </div>

                <div className="space-y-3">
                  <p className="text-sm font-medium">{d.medicalConditions || "Medical Conditions"}</p>
                  <div className="flex flex-wrap gap-2">
                    {[
                      { id: "diabetes", label: dict.onboarding.conditionDiabetes },
                      { id: "hypertension", label: dict.onboarding.conditionHypertension },
                      { id: "cardiac", label: dict.onboarding.conditionCardiac },
                      { id: "asthma", label: dict.onboarding.conditionAsthma },
                      { id: "epilepsy", label: dict.onboarding.conditionEpilepsy },
                      { id: "kidney", label: dict.onboarding.conditionKidney },
                      { id: "arthritis", label: dict.onboarding.conditionArthritis },
                    ].map((item) => (
                      <Button
                        key={item.id}
                        type="button"
                        variant={medicalConditions.includes(item.id) ? "default" : "outline"}
                        className="h-11 rounded-md"
                        onClick={() => toggleCondition(item.id)}
                      >
                        {item.label}
                      </Button>
                    ))}
                    {/* Render custom conditions */}
                    {medicalConditions.filter(c => !predefinedConditions.includes(c)).map(c => (
                      <Button
                        key={c}
                        type="button"
                        variant="default"
                        className="h-11 rounded-md"
                        onClick={() => toggleCondition(c)}
                      >
                        {c} ×
                      </Button>
                    ))}
                  </div>
                  <div className="flex gap-2 max-w-sm">
                    <Input 
                      placeholder={isArabic ? "إضافة حالة مخصصة..." : "Add custom condition..."}
                      value={customCondInput}
                      onChange={(e) => setCustomCondInput(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addCustomCondition())}
                    />
                    <Button type="button" variant="outline" onClick={addCustomCondition}>{isArabic ? "إضافة" : "Add"}</Button>
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
                  <div key={booking.id} className="space-y-3 rounded-md border border-border/80 p-4">
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div>
                        <p className="font-semibold">{isArabic ? (booking.clinicNameAr || booking.clinicName) : booking.clinicName}</p>
                        <p className="mt-1 text-sm text-muted-foreground">
                          {booking.date} {isArabic ? "في" : "at"} {booking.time}
                        </p>
                      </div>
                      <Badge variant="secondary" className="rounded-md">
                        {booking.status === "completed" ? (isArabic ? "مكتمل" : "Completed") : 
                         booking.status === "cancelled" ? (isArabic ? "ملغي" : "Cancelled") :
                         booking.status === "in-progress" ? (isArabic ? "جارٍ" : "In Progress") :
                         (isArabic ? "مؤكد" : "Confirmed")}
                      </Badge>
                    </div>
                    {booking.notes && <p className="text-sm">{booking.notes}</p>}
                    
                    <QueueStatus 
                      booking={booking} 
                      locale={locale} 
                      allBookings={allBookings} 
                    />
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
