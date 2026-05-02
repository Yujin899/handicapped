"use client"

import * as React from "react"
import Image from "next/image"
import Link from "next/link"
import { Accessibility, Ear, MapPin, Star, VolumeX, ChevronRight } from "lucide-react"
import { AnimatePresence, motion } from "framer-motion"

import { ClinicReviews } from "@/components/clinic-reviews"
import { ImageSlider } from "@/components/image-slider"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { getClinicById } from "@/lib/data"
import { getFilters, type Filter, getFilterLabel } from "@/lib/filters"
import { iconMap } from "@/components/search-section"
import type { Clinic } from "@/lib/types"

type ClinicDetailsDict = {
  clinicDetails: {
    bookAppointment: string
    bookAppointmentNote: string
    patientReviews: string
    accessibilityAtAGlance: string
    about: string
    aboutText: string
    available: string
    notAvailable: string
  }
  reviews: {
    title: string
    leaveReview: string
    saving: string
    placeholder: string
    addPhotos: string
    add: string
    verifiedPatient: string
  }
  search: {
    filterWheelchair: string
    filterHearing: string
    filterQuiet: string
  }
  clinicListing: {
    emptyTitle: string
    emptyMessage: string
    retry: string
    homeVisitBadge: string
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
  const [showStickyBar, setShowStickyBar] = React.useState(false)

  React.useEffect(() => {
    const handleScroll = () => {
      // Show sticky bar after scrolling down 400px
      if (window.scrollY > 400) {
        setShowStickyBar(true)
      } else {
        setShowStickyBar(false)
      }
    }
    window.addEventListener("scroll", handleScroll, { passive: true })
    handleScroll() // Initial check
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  React.useEffect(() => {
    if (showStickyBar) {
      document.documentElement.style.setProperty('--chat-widget-offset', '80px')
    } else {
      document.documentElement.style.setProperty('--chat-widget-offset', '0px')
    }
    // Reset on unmount
    return () => {
      document.documentElement.style.setProperty('--chat-widget-offset', '0px')
    }
  }, [showStickyBar])

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
    label: getFilterLabel(f.id, locale, f),
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
              {clinic.allowsHomeVisit && (
                <Badge className="rounded-md bg-emerald-500 text-white hover:bg-emerald-600 border-none">
                  {dict.clinicListing.homeVisitBadge}
                </Badge>
              )}
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
            <div className="grid gap-3 sm:grid-cols-4 lg:grid-cols-5">
              {accessibility.filter(f => f.available).map((feature) => {
                const Icon = feature.icon
                return (
                  <div key={feature.key} className="flex flex-col items-center justify-center gap-3 rounded-2xl border border-border/60 bg-muted/20 p-4 text-center transition-all hover:bg-muted/40 hover:border-primary/20">
                    <div className="inline-flex size-12 items-center justify-center rounded-2xl bg-background shadow-sm text-primary">
                      <Icon className="size-6" />
                    </div>
                    <p className="text-xs font-bold leading-tight">{feature.label}</p>
                  </div>
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
            title={dict.reviews.title}
            seedReviews={[]}
            accessibilityFeatures={clinic.accessibility}
            dict={dict}
          />
        </div>

        <aside className="lg:sticky lg:top-24 lg:self-start hidden lg:block" />
      </div>
      <AnimatePresence>
        {showStickyBar && (
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed bottom-0 left-0 right-0 z-40 border-t border-border/50 bg-background/80 p-4 shadow-[0_-8px_30px_rgb(0,0,0,0.08)] backdrop-blur-xl"
            dir={locale === 'ar' ? 'rtl' : 'ltr'}
          >
            <div className="container mx-auto flex max-w-7xl items-center justify-between gap-4">
              <div className="hidden flex-col sm:flex">
                <p className="text-sm font-bold text-foreground">
                  {locale === 'ar' ? clinic.nameAr || clinic.name : clinic.name}
                </p>
                <div className="flex items-center gap-2 mt-0.5">
                   <span className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Star className="size-3 fill-current text-primary" />
                    {(clinic.rating ?? 0).toFixed(1)}
                  </span>
                  <span className="text-xs text-muted-foreground opacity-50">•</span>
                  <span className="text-xs text-muted-foreground">
                    {locale === 'ar' ? clinic.specialtyAr || clinic.specialty : clinic.specialty}
                  </span>
                </div>
              </div>
              <Button asChild className="h-12 flex-1 sm:flex-none sm:px-12 rounded-xl font-black text-base shadow-lg shadow-primary/20 transition-transform active:scale-95">
                <Link href={`/${locale}/clinics/${clinic.id}/book`}>
                  {dict.clinicDetails.bookAppointment}
                </Link>
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  )
}

