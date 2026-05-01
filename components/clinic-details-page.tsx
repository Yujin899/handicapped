"use client"

import * as React from "react"
import Image from "next/image"
import Link from "next/link"
import { Accessibility, Ear, MapPin, Star, VolumeX } from "lucide-react"

import { ClinicReviews } from "@/components/clinic-reviews"
import { ImageSlider } from "@/components/image-slider"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { getClinicById } from "@/lib/data"
import { getFilters, type Filter } from "@/lib/filters"
import { iconMap } from "@/components/search-section"
import type { Clinic } from "@/lib/types"

type ClinicDetailsDict = {
  clinicDetails: {
    bookAppointment: string
    patientReviews: string
    accessibilityAtAGlance: string
    about: string
    aboutText: string
    available: string
    notAvailable: string
  }
  search: {
    filterWheelchair: string
    filterHearing: string
    filterQuiet: string
  }
}

export function ClinicDetailsPageClient({
  clinicId,
  locale,
  dict,
}: {
  clinicId: string
  locale: string
  dict: ClinicDetailsDict
}) {
  const [clinic, setClinic] = React.useState<Clinic | null>(null)
  const [availableFilters, setAvailableFilters] = React.useState<Filter[]>([])
  const [loading, setLoading] = React.useState(true)

  React.useEffect(() => {
    getFilters().then(setAvailableFilters)
    getClinicById(clinicId)
      .then(setClinic)
      .catch(() => setClinic(null))
      .finally(() => setLoading(false))
  }, [clinicId])

  if (loading) {
    return (
      <section className="container mx-auto max-w-7xl px-4 py-8 md:px-6 md:py-10">
        <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
          <div className="space-y-5">
            <Skeleton className="h-8 w-2/3" />
            <Skeleton className="aspect-[16/8] w-full rounded-md" />
            <Skeleton className="h-40 w-full rounded-md" />
          </div>
          <Skeleton className="h-72 w-full rounded-md" />
        </div>
      </section>
    )
  }

  if (!clinic) {
    return (
      <section className="container mx-auto max-w-3xl px-4 py-10 md:px-6">
        <Card className="rounded-md border-border/80 shadow-sm">
          <CardContent className="space-y-3 p-6 pt-6">
            <h1 className="text-xl font-semibold">{dict.clinicListing.emptyTitle}</h1>
            <p className="text-sm text-muted-foreground">
              {dict.clinicListing.emptyMessage}
            </p>
            <Button asChild>
              <Link href={`/${locale}/clinics`}>{dict.clinicListing.retry}</Link>
            </Button>
          </CardContent>
        </Card>
      </section>
    )
  }

  const accessibility = availableFilters.map((f) => ({
    key: f.id,
    label: locale === 'ar' ? f.labelAr || f.label : f.label,
    available: Boolean(clinic.accessibility?.[f.id]),
    icon: iconMap[f.icon as keyof typeof iconMap] || iconMap.Accessibility,
  }))

  return (
    <section className="container mx-auto max-w-7xl px-4 py-8 pb-28 md:px-6 md:py-10">
      <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_360px]">
        <div className="space-y-8">
          <header className="space-y-4">
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="secondary" className="rounded-md">
                {locale === 'ar' ? clinic.specialtyAr || clinic.specialty : clinic.specialty || "Healthcare"}
              </Badge>
              <span className="inline-flex items-center gap-1 rounded-md bg-secondary px-2 py-1 text-xs font-semibold">
                <Star className="size-3.5 fill-current text-primary" />
                {(clinic.rating ?? 0).toFixed(1)} ({clinic.reviews ?? 0})
              </span>
            </div>
            <div className="space-y-2">
              <h1 className="text-3xl font-semibold tracking-tight md:text-5xl">
                {locale === 'ar' ? clinic.nameAr || clinic.name : clinic.name}
              </h1>
              <p className="inline-flex items-center gap-2 text-muted-foreground">
                <MapPin className="size-4" />
                {locale === 'ar' ? clinic.locationAr || clinic.location : clinic.location || "Location pending"}
              </p>
            </div>
          </header>

          {clinic.images && clinic.images.length > 0 ? (
            <ImageSlider images={clinic.images} />
          ) : (
            <div className="relative aspect-[16/8] overflow-hidden rounded-md bg-muted">
              <Image
                src={clinic.imageSrc || "https://images.unsplash.com/photo-1631815588090-d4bfec5b1ccb?auto=format&fit=crop&w=1200&q=80"}
                alt={clinic.imageAlt || clinic.name}
                fill
                sizes="(max-width: 1024px) 100vw, 70vw"
                className="object-cover"
              />
            </div>
          )}

          <section className="space-y-4" id="accessibility">
            <h2 className="text-2xl font-semibold tracking-tight">
              {dict.clinicDetails.accessibilityAtAGlance}
            </h2>
            <div className="grid gap-3 sm:grid-cols-3">
              {accessibility.map((feature) => {
                const Icon = feature.icon
                return (
                  <Card key={feature.key} className="rounded-md border-border/80 shadow-sm">
                    <CardContent className="space-y-3 p-4 pt-4">
                      <div className="inline-flex size-10 items-center justify-center rounded-md bg-primary/10 text-primary">
                        <Icon className="size-5" />
                      </div>
                      <div>
                        <p className="font-semibold">{feature.label}</p>
                        <p className={`mt-1 text-sm font-bold ${feature.available ? 'text-green-600 dark:text-green-400' : 'text-destructive/80'}`}>
                          {feature.available
                            ? dict.clinicDetails.available
                            : dict.clinicDetails.notAvailable}
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          </section>

          <section className="space-y-3">
            <h2 className="text-2xl font-semibold tracking-tight">{dict.clinicDetails.about}</h2>
            <p className="max-w-3xl text-muted-foreground">
              {(locale === 'ar' ? clinic.descriptionAr || clinic.description : clinic.description) || dict.clinicDetails.aboutText}
            </p>
          </section>

          <ClinicReviews
            clinicId={clinic.id}
            locale={locale}
            title={dict.clinicDetails.patientReviews}
            seedReviews={[]}
          />
        </div>

        <aside className="lg:sticky lg:top-24 lg:self-start">
          <Card className="rounded-md border-border/80 shadow-sm">
            <CardHeader>
              <CardTitle className="text-base">{dict.clinicDetails.bookAppointment}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">
                {dict.clinicDetails.bookAppointmentNote}
              </p>
              <Button asChild className="h-12 w-full rounded-md">
                <Link href={`/${locale}/clinics/${clinic.id}/book`}>
                  {dict.clinicDetails.bookAppointment}
                </Link>
              </Button>
            </CardContent>
          </Card>
        </aside>
      </div>
    </section>
  )
}

