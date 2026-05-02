"use client"

import * as React from "react"
import Link from "next/link"
import Image from "next/image"
import {
  MapPin,
  Star,
  Search,
} from "lucide-react"
import { useSearchParams, useRouter, usePathname } from "next/navigation"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Skeleton } from "@/components/ui/skeleton"
import { Input } from "@/components/ui/input"
import { getClinics } from "@/lib/data"
import { getFilters, type Filter } from "@/lib/filters"
import { iconMap } from "@/components/search-section"
import type { Clinic } from "@/lib/types"
import { LocationCombobox } from "./location-combobox"
import { SpecialtyCombobox } from "./specialty-combobox"
import { egyptLocations } from "@/lib/egypt-locations"
import { getSpecialties, type Specialty } from "@/lib/specialties"

const sortOptions = ["relevance", "rating", "distance"] as const
type SortOption = (typeof sortOptions)[number]
const clinicsCache = new Map<string, Clinic[]>()
const CACHE_KEY_PREFIX = "clinics-cache:"

type ListingDictionary = {
  actions: {
    findAccess: string
    viewDetails: string
  }
  search: {
    locationPlaceholder: string
    queryPlaceholder: string
    filterWheelchair: string
    filterHearing: string
    filterQuiet: string
  }
  clinicListing: {
    pageTitle: string
    pageSubtitle: string
    filtersHeading: string
    resultsFound: string
    sortBy: string
    sortOptions: Record<SortOption, string>
    emptyTitle: string
    emptyMessage: string
    resetFilters: string
    errorTitle: string
    errorMessage: string
    retry: string
    staleNotice: string
  }
}

export function ClinicsListingPage({
  locale,
  dict,
}: {
  locale: string
  dict: ListingDictionary
}) {
  const searchParams = useSearchParams()
  const router = useRouter()
  const pathname = usePathname()

  const [locationQuery, setLocationQuery] = React.useState(() => searchParams.get('location') || "")
  const [specialtyQuery, setSpecialtyQuery] = React.useState(() => searchParams.get('query') || "")
  const [nameQuery, setNameQuery] = React.useState(() => searchParams.get('name') || "")
  const [sortBy, setSortBy] = React.useState<SortOption>("relevance")
  const [loading, setLoading] = React.useState(true)
  const [hasError, setHasError] = React.useState(false)
  const [isStale, setIsStale] = React.useState(false)
  const [clinics, setClinics] = React.useState<Clinic[]>([])
  const [availableFilters, setAvailableFilters] = React.useState<Filter[]>([])
  const [filters, setFilters] = React.useState<Record<string, boolean>>(() => {
    const f = searchParams.get('filters')
    if (!f) return {}
    const activeFilterIds = f.split(',')
    const newFilters: Record<string, boolean> = {}
    activeFilterIds.forEach(id => {
      newFilters[id] = true
    })
    return newFilters
  })
  const [specialties, setSpecialties] = React.useState<Specialty[]>([])

  React.useEffect(() => {
    getFilters().then(setAvailableFilters)
    getSpecialties().then(setSpecialties)
  }, [])

  // Sync state to URL in real-time
  React.useEffect(() => {
    const params = new URLSearchParams()
    if (locationQuery) params.set('location', locationQuery)
    if (specialtyQuery) params.set('query', specialtyQuery)
    if (nameQuery) params.set('name', nameQuery)
    
    const activeFilterIds = Object.keys(filters).filter(id => filters[id])
    if (activeFilterIds.length > 0) {
      params.set('filters', activeFilterIds.join(','))
    }

    const queryString = params.toString()
    const newPath = `${pathname}${queryString ? `?${queryString}` : ''}`
    
    router.replace(newPath, { scroll: false })
  }, [locationQuery, specialtyQuery, nameQuery, filters, pathname, router])

  const loadClinics = React.useCallback(async (signal?: AbortSignal) => {
    const hasClinics = clinics.length > 0
    if (!hasClinics) {
      setLoading(true)
    }
    setHasError(false)
    setIsStale(false)

    try {
      const retryDelays = [0, 350, 900]
      let payload: Clinic[] = []

      for (const delay of retryDelays) {
        if (delay > 0) {
          await new Promise((resolve) => window.setTimeout(resolve, delay))
        }
        if (signal?.aborted) return

        payload = await getClinics()
        if (payload.length > 0) {
          break
        }
      }

      setClinics(payload)
      clinicsCache.set(locale, payload)
      if (typeof window !== "undefined") {
        window.sessionStorage.setItem(
          `${CACHE_KEY_PREFIX}${locale}`,
          JSON.stringify(payload)
        )
      }
    } catch {
      if (signal?.aborted) {
        return
      }
      setHasError(true)
      setIsStale(clinics.length > 0)
      if (clinics.length === 0) {
        setClinics([])
      }
    } finally {
      if (!signal?.aborted) {
        setLoading(false)
      }
    }
  }, [clinics.length, locale])

  React.useEffect(() => {
    const controller = new AbortController()
    const memoryCache = clinicsCache.get(locale)

    if (memoryCache && memoryCache.length > 0) {
      window.setTimeout(() => {
        setClinics(memoryCache)
        setLoading(false)
      }, 0)
    } else {
      const sessionCache = window.sessionStorage.getItem(`${CACHE_KEY_PREFIX}${locale}`)
      if (sessionCache) {
        try {
          const parsed = JSON.parse(sessionCache) as Clinic[]
          if (parsed.length > 0) {
            window.setTimeout(() => {
              setClinics(parsed)
              setLoading(false)
            }, 0)
          }
        } catch {
          // ignore malformed cache payloads
        }
      }
    }

    const timeoutId = window.setTimeout(() => {
      loadClinics(controller.signal)
    }, 0)

    return () => {
      window.clearTimeout(timeoutId)
      controller.abort()
    }
  }, [loadClinics, locale])

  const filteredClinics = React.useMemo(() => {
    // Helper to find location names by ID for smart matching against raw strings
    const selectedLocationData = locationQuery ? (() => {
      for (const gov of egyptLocations) {
        if (gov.id === locationQuery) return { name: gov.name, nameAr: gov.nameAr }
        const city = gov.cities.find(c => c.id === locationQuery)
        if (city) return { name: city.name, nameAr: city.nameAr }
      }
      return null
    })() : null

    const selectedSpecialtyData = specialtyQuery ? specialties.find(s => s.id === specialtyQuery) : null
    const nq = nameQuery.trim().toLowerCase()

    const result = clinics.filter((clinic) => {
      const locationMatches = !selectedLocationData || 
        clinic.location?.toLowerCase().includes(selectedLocationData.name.toLowerCase()) ||
        clinic.locationAr?.includes(selectedLocationData.nameAr) ||
        clinic.name.toLowerCase().includes(selectedLocationData.name.toLowerCase()) ||
        clinic.nameAr?.includes(selectedLocationData.nameAr)

      const specialtyMatches = !selectedSpecialtyData ||
        clinic.specialty?.toLowerCase().includes(selectedSpecialtyData.name.toLowerCase()) ||
        clinic.specialtyAr?.includes(selectedSpecialtyData.nameAr) ||
        clinic.description?.toLowerCase().includes(selectedSpecialtyData.name.toLowerCase()) ||
        clinic.descriptionAr?.includes(selectedSpecialtyData.nameAr)

      const nameMatches = nq.length === 0 ||
        clinic.name.toLowerCase().includes(nq) ||
        clinic.nameAr?.includes(nq)

      const accessibilityMatches = Object.entries(filters).every(([key, value]) => {
        if (!value) return true
        if (key === 'homeVisit') return clinic.allowsHomeVisit === true
        return clinic.accessibility?.[key as keyof typeof clinic.accessibility] === true
      })

      return locationMatches && specialtyMatches && nameMatches && accessibilityMatches
    })

    return [...result].sort((a, b) => {
      if (sortBy === "rating") return (b.rating ?? 0) - (a.rating ?? 0)
      if (sortBy === "distance") return (a.location ?? "").localeCompare(b.location ?? "")
      return (b.reviews ?? 0) - (a.reviews ?? 0)
    })
  }, [clinics, locationQuery, specialtyQuery, nameQuery, filters, sortBy, specialties])

  const resetFilters = () => {
    setLocationQuery("")
    setSpecialtyQuery("")
    setNameQuery("")
    setSortBy("relevance")
    setFilters({})
  }

  const filterButtons = availableFilters.map(f => ({
    key: f.id,
    label: locale === 'ar' ? f.labelAr || f.label : f.label,
    icon: iconMap[f.icon as keyof typeof iconMap] || iconMap.Accessibility
  }))

  const stateCardClassName = "rounded-md border-border/80 bg-muted/20 shadow-sm"
  const stateCardContentClassName = "space-y-3 p-8 pt-8 text-center"

  return (
    <section
      className="container mx-auto max-w-7xl px-4 py-8 md:px-6 md:py-10"
      aria-busy={loading}
    >
      <div className="space-y-6">
        <header className="space-y-2">
          <h1 className="text-2xl font-semibold tracking-tight md:text-3xl">
            {dict.clinicListing.pageTitle}
          </h1>
          <p className="text-sm text-muted-foreground md:text-base">
            {dict.clinicListing.pageSubtitle}
          </p>
        </header>

        <Card className="rounded-md border-border/80 shadow-sm">
          <CardContent className="space-y-5 p-4 pt-4 md:p-5 md:pt-5">
            <div className="grid grid-cols-1 gap-3 md:grid-cols-3 md:items-center">
              <div className="relative">
                <LocationCombobox 
                  value={locationQuery}
                  onChange={setLocationQuery}
                  placeholder={dict.search.locationPlaceholder}
                  locale={locale}
                />
              </div>
              <div className="relative">
                <SpecialtyCombobox
                  value={specialtyQuery}
                  onChange={setSpecialtyQuery}
                  placeholder={dict.search.queryPlaceholder.split('...')[0]}
                  locale={locale}
                />
              </div>
              <div className="relative">
                <Search className="pointer-events-none absolute start-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  value={nameQuery}
                  onChange={(event) => setNameQuery(event.target.value)}
                  placeholder={locale === 'ar' ? 'اسم العيادة...' : 'Clinic Name...'}
                  className="h-11 ps-10 text-sm"
                />
              </div>
            </div>

            <div className="space-y-2">
              <p className="text-sm font-semibold text-foreground">{dict.clinicListing.filtersHeading}</p>
              <div className="flex flex-wrap gap-2">
                {filterButtons.map((filter) => {
                  const Icon = filter.icon
                  const active = filters[filter.key]

                  return (
                    <Button
                      key={filter.key}
                      type="button"
                      variant={active ? "default" : "outline"}
                      className="h-11 rounded-md px-3 text-sm"
                      aria-pressed={active}
                      onClick={() =>
                        setFilters((prev) => ({ ...prev, [filter.key]: !prev[filter.key] }))
                      }
                    >
                      <Icon className="size-4" aria-hidden="true" />
                      <span>{filter.label}</span>
                    </Button>
                  )
                })}
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid gap-8 grid-cols-1">
          <div className="space-y-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-sm font-medium text-muted-foreground">
                {dict.clinicListing.resultsFound.replace(
                  "{count}",
                  String(filteredClinics.length)
                )}
              </p>
              <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row sm:items-center">
                <span className="text-sm text-muted-foreground">{dict.clinicListing.sortBy}</span>
                <div className="flex flex-wrap gap-1 rounded-md border border-border bg-background p-1 sm:inline-flex sm:flex-nowrap">
                  {sortOptions.map((option) => (
                    <Button
                      key={option}
                      type="button"
                      size="sm"
                      variant={sortBy === option ? "secondary" : "ghost"}
                      className="h-9 flex-1 rounded-sm px-3 text-xs sm:flex-none sm:px-2"
                      onClick={() => setSortBy(option)}
                    >
                      {dict.clinicListing.sortOptions[option]}
                    </Button>
                  ))}
                </div>
              </div>
            </div>

            <Separator />

            {isStale && (
              <Card className={stateCardClassName}>
                <CardContent className="p-4 pt-4 text-sm text-muted-foreground" role="status" aria-live="polite">
                  {dict.clinicListing.staleNotice}
                </CardContent>
              </Card>
            )}

            {loading ? (
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
                {Array.from({ length: 6 }).map((_, index) => (
                  <Card key={index} className="rounded-md border-border/80 shadow-sm">
                    <CardHeader className="space-y-2">
                      <Skeleton className="h-5 w-2/3" />
                      <Skeleton className="h-4 w-1/3" />
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <Skeleton className="h-4 w-full" />
                      <Skeleton className="h-4 w-5/6" />
                      <div className="flex gap-2">
                        <Skeleton className="h-6 w-28" />
                        <Skeleton className="h-6 w-24" />
                      </div>
                    </CardContent>
                    <CardFooter>
                      <Skeleton className="h-11 w-full" />
                    </CardFooter>
                  </Card>
                ))}
              </div>
            ) : hasError && clinics.length === 0 ? (
              <Card className={stateCardClassName}>
                <CardContent className={stateCardContentClassName} role="alert" aria-live="assertive">
                  <p className="text-lg font-semibold">{dict.clinicListing.errorTitle}</p>
                  <p className="text-sm text-muted-foreground">{dict.clinicListing.errorMessage}</p>
                  <Button
                    variant="outline"
                    className="mt-2 h-11 rounded-md px-4"
                    onClick={() => loadClinics()}
                  >
                    {dict.clinicListing.retry}
                  </Button>
                </CardContent>
              </Card>
            ) : filteredClinics.length === 0 ? (
              <Card className={stateCardClassName}>
                <CardContent className={stateCardContentClassName}>
                  <p className="text-lg font-semibold">{dict.clinicListing.emptyTitle}</p>
                  <p className="text-sm text-muted-foreground">{dict.clinicListing.emptyMessage}</p>
                  <Button variant="outline" className="mt-2 h-11 rounded-md px-4" onClick={resetFilters}>
                    {dict.clinicListing.resetFilters}
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
                {filteredClinics.map((clinic, index) => {
                  const isFeatured = index === 0

                  return (
                  <Card
                    key={clinic.id}
                    className={`rounded-md border-border/80 shadow-sm transition-shadow focus-within:ring-2 focus-within:ring-ring/50 focus-within:ring-offset-2 ${isFeatured ? "xl:col-span-2 xl:shadow-md" : ""}`}
                  >
                    <div
                      className={`relative overflow-hidden rounded-t-md ${isFeatured ? "aspect-[21/9] md:aspect-[18/9]" : "aspect-[16/9]"}`}
                    >
                      <Image
                        src={clinic.imageSrc || "https://images.unsplash.com/photo-1631815588090-d4bfec5b1ccb?auto=format&fit=crop&w=1200&q=80"}
                        alt={clinic.imageAlt || clinic.name}
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
                        className="object-cover"
                      />
                      <div className="absolute top-3 left-3 flex flex-col gap-1.5">
                        {(clinic.rating ?? 0) >= 4.9 && (
                          <div className="bg-primary text-primary-foreground px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-wider shadow-lg">
                            {locale === 'ar' ? "الأكثر ملاءمة" : "Most Suitable"}
                          </div>
                        )}
                         {clinic.accessibility?.wheelchair && (
                          <div className="bg-white/90 text-foreground px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-wider shadow-sm border border-border/50">
                            {locale === 'ar' ? "صديق للكراسي" : "Wheelchair Friendly"}
                          </div>
                        )}
                        {clinic.allowsHomeVisit && (
                          <div className="bg-emerald-500 text-white px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-wider shadow-lg">
                            {(dict.clinicListing as any).homeVisitBadge || (locale === 'ar' ? "زيارة منزلية متاحة" : "Home Visit Available")}
                          </div>
                        )}
                      </div>
                    </div>
                    <CardHeader className={`space-y-2 ${isFeatured ? "pb-2" : ""}`}>
                      <div className="flex items-start justify-between gap-3">
                        <CardTitle className="text-base leading-snug">
                          {locale === 'ar' ? clinic.nameAr || clinic.name : clinic.name}
                        </CardTitle>
                        <div className="inline-flex items-center gap-1 rounded-md bg-secondary px-2 py-1 text-xs font-semibold text-secondary-foreground">
                          <Star className="size-3.5 fill-current" />
                          <span>{(clinic.rating ?? 0).toFixed(1)}</span>
                          <span className="text-muted-foreground">({clinic.reviews ?? 0})</span>
                        </div>
                      </div>
                      <CardDescription className={`text-sm ${isFeatured ? "md:max-w-[72ch]" : ""}`}>
                        {(locale === 'ar' ? clinic.descriptionAr || clinic.description : clinic.description) || "Accessibility details are being verified by the clinic team."}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex flex-wrap gap-2">
                        <Badge variant="outline" className="rounded-md">
                          {locale === 'ar' ? clinic.specialtyAr || clinic.specialty : clinic.specialty || "Healthcare"}
                        </Badge>
                        {Object.entries(clinic.accessibility || {}).map(([key, value]) => {
                          if (!value) return null
                          const filter = availableFilters.find(f => f.id === key)
                          if (!filter) return null
                          const Icon = iconMap[filter.icon as keyof typeof iconMap] || iconMap.Accessibility
                          return (
                            <Badge key={key} variant="secondary" className="gap-1 rounded-md">
                              <Icon className="size-3.5" />
                              {locale === 'ar' ? filter.labelAr || filter.label : filter.label}
                            </Badge>
                          )
                        })}
                      </div>
                      <p className="inline-flex items-center gap-1 text-sm text-muted-foreground">
                        <MapPin className="size-4" />
                        {locale === 'ar' ? clinic.locationAr || clinic.location : clinic.location || "Location pending"}
                      </p>
                    </CardContent>
                    <CardFooter>
                      <Button asChild className="h-11 w-full rounded-md">
                        <Link href={`/${locale}/clinics/${clinic.id}`}>{dict.actions.viewDetails}</Link>
                      </Button>
                    </CardFooter>
                  </Card>
                )})}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
