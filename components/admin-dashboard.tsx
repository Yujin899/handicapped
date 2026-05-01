"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { Building2, CalendarCheck, ImagePlus, Loader2, MessageSquareText, UsersRound, X } from "lucide-react"

import { useAuth } from "@/components/auth-provider"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
  deleteClinic,
  getAllBookings,
  getAllReviews,
  getClinics,
  saveClinic,
} from "@/lib/data"
import { deleteFilter, getFilters, saveFilter, type Filter } from "@/lib/filters"
import { deleteSpecialty, getSpecialties, saveSpecialty, type Specialty } from "@/lib/specialties"
import { getFriendlyFirebaseError } from "@/lib/firebase-errors"
import type { Booking, Clinic, Review, UserProfile } from "@/lib/types"
import { getUsers } from "@/lib/users"
import { iconMap } from "@/components/search-section"
import { egyptLocations } from "@/lib/egypt-locations"

const slugify = (text: string) =>
  text
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "")

type ClinicForm = {
  id: string
  name: string
  nameAr: string
  location: string
  locationAr: string
  specialty: string
  specialtyAr: string
  description: string
  descriptionAr: string
  images: string[]
  accessibility: Record<string, boolean>
  governorate: string
  city: string
  street: string
}

const emptyClinic: ClinicForm = {
  id: "",
  name: "",
  nameAr: "",
  location: "",
  locationAr: "",
  specialty: "",
  specialtyAr: "",
  description: "",
  descriptionAr: "",
  images: [],
  accessibility: {},
  governorate: "",
  city: "",
  street: "",
}

export function AdminDashboard({ locale, dict }: { locale: string, dict: any }) {
  const router = useRouter()
  const { currentUser, profile, loading } = useAuth()
  const [users, setUsers] = React.useState<UserProfile[]>([])
  const [clinics, setClinics] = React.useState<Clinic[]>([])
  const [bookings, setBookings] = React.useState<Booking[]>([])
  const [reviews, setReviews] = React.useState<Review[]>([])
  const [filters, setFilters] = React.useState<Filter[]>([])
  const [specialties, setSpecialties] = React.useState<Specialty[]>([])
  const [form, setForm] = React.useState<ClinicForm>(emptyClinic)
  const [filterForm, setFilterForm] = React.useState<Omit<Filter, "id">>({ label: "", labelAr: "", icon: "Accessibility", isPopular: false })
  const [specialtyForm, setSpecialtyForm] = React.useState<Omit<Specialty, "id">>({ name: "", nameAr: "" })
  const [error, setError] = React.useState("")
  const [isSaving, setIsSaving] = React.useState(false)
  const [isUploading, setIsUploading] = React.useState(false)
  const [isLoadingData, setIsLoadingData] = React.useState(true)

  const d = dict.admin

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files
    if (!files || files.length === 0) return

    const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME
    const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET

    if (!cloudName || !uploadPreset) {
      setError("Cloudinary configuration is missing. Set NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME and NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET.")
      return
    }

    setIsUploading(true)
    setError("")

    const remainingSlots = 25 - form.images.length
    const filesToUpload = Array.from(files).slice(0, remainingSlots)
    const uploadedUrls: string[] = []

    try {
      for (const file of filesToUpload) {
        const formData = new FormData()
        formData.append("file", file)
        formData.append("upload_preset", uploadPreset)

        const response = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
          method: "POST",
          body: formData,
        })

        if (!response.ok) throw new Error("Upload failed")
        const data = await response.json()
        uploadedUrls.push(data.secure_url)
      }

      setForm(prev => ({
        ...prev,
        images: [...prev.images, ...uploadedUrls]
      }))
    } catch (err) {
      setError("Image upload failed. Please check your Cloudinary settings.")
    } finally {
      setIsUploading(false)
      // Reset input
      event.target.value = ""
    }
  }

  const removeImage = (index: number) => {
    setForm(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }))
  }

  const isAdmin = profile?.role === "admin"

  React.useEffect(() => {
    if (!loading && !currentUser) {
      router.push(`/${locale}/login?redirect=/${locale}/admin`)
    }
  }, [currentUser, loading, locale, router])

  const loadDashboard = React.useCallback(async () => {
    if (!isAdmin) return

    setIsLoadingData(true)
    setError("")

    try {
      const [nextUsers, nextClinics, nextBookings, nextReviews, nextFilters, nextSpecialties] = await Promise.all([
        getUsers(),
        getClinics(),
        getAllBookings(),
        getAllReviews(),
        getFilters(),
        getSpecialties(),
      ])
  
      setUsers(nextUsers)
      setClinics(nextClinics)
      setBookings(nextBookings)
      setReviews(nextReviews)
      setFilters(nextFilters)
      setSpecialties(nextSpecialties)
    } catch (err) {
      setError(getFriendlyFirebaseError(err))
    } finally {
      setIsLoadingData(false)
    }
  }, [isAdmin])

  React.useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      void loadDashboard()
    }, 0)

    return () => window.clearTimeout(timeoutId)
  }, [loadDashboard])

  const setField = (field: keyof ClinicForm, value: string | boolean) => {
    setForm((current) => ({ ...current, [field]: value }))
  }

  const editClinic = (clinic: Clinic) => {
    setForm({
      id: clinic.id,
      name: clinic.name,
      nameAr: clinic.nameAr || "",
      location: clinic.location || "",
      locationAr: clinic.locationAr || "",
      specialty: clinic.specialty || "",
      specialtyAr: clinic.specialtyAr || "",
      description: clinic.description || "",
      descriptionAr: clinic.descriptionAr || "",
      images: clinic.images || [],
      accessibility: (clinic.accessibility as Record<string, boolean>) || {},
      governorate: clinic.governorate || "",
      city: clinic.city || "",
      street: clinic.street || "",
    })
  }

  const handleSaveClinic = async (event: React.FormEvent) => {
    event.preventDefault()
    setError("")
    setIsSaving(true)

    try {
      const id = form.id.trim() || slugify(form.name)
      await saveClinic({
        id,
        name: form.name.trim(),
        specialty: form.specialty.trim(),
        description: form.description.trim(),
        imageSrc: form.images[0] || "",
        images: form.images,
        imageAlt: form.name.trim(),
        rating: 0,
        reviews: 0,
        accessibility: form.accessibility,
        governorate: form.governorate,
        city: form.city,
        street: form.street,
        location: `${form.street}, ${form.city}, ${form.governorate}`,
      })
      setForm(emptyClinic)
      await loadDashboard()
    } catch (err) {
      setError(getFriendlyFirebaseError(err))
    } finally {
      setIsSaving(false)
    }
  }

  const handleSaveFilter = async (event: React.FormEvent) => {
    event.preventDefault()
    if (!filterForm.label.trim()) return

    try {
      const id = slugify(filterForm.label)
      await saveFilter({ ...filterForm, id })
      setFilterForm({ label: "", labelAr: "", icon: "Accessibility", isPopular: false })
      await loadDashboard()
    } catch (err) {
      setError("Failed to save filter")
    }
  }

  const handleDeleteFilter = async (id: string) => {
    try {
      await deleteFilter(id)
      await loadDashboard()
    } catch (err) {
      setError("Failed to delete filter")
    }
  }

  const handleSaveSpecialty = async (event: React.FormEvent) => {
    event.preventDefault()
    if (!specialtyForm.name.trim()) return

    try {
      const id = slugify(specialtyForm.name)
      await saveSpecialty({ ...specialtyForm, id })
      setSpecialtyForm({ name: "", nameAr: "" })
      await loadDashboard()
    } catch (err) {
      setError("Failed to save specialty")
    }
  }

  const handleDeleteSpecialty = async (id: string) => {
    try {
      await deleteSpecialty(id)
      await loadDashboard()
    } catch (err) {
      setError("Failed to delete specialty")
    }
  }

  const toggleClinicAccessibility = (key: string) => {
    setForm(prev => ({
      ...prev,
      accessibility: {
        ...prev.accessibility,
        [key]: !prev.accessibility[key]
      }
    }))
  }

  const handleDeleteClinic = async (id: string) => {
    setError("")
    try {
      await deleteClinic(id)
      await loadDashboard()
    } catch (err) {
      setError(getFriendlyFirebaseError(err))
    }
  }

  if (loading || !currentUser) {
    return (
      <section className="container mx-auto max-w-7xl px-4 py-10 md:px-6">
        <p className="text-sm text-muted-foreground">Checking access...</p>
      </section>
    )
  }

  if (!isAdmin) {
    return (
      <section className="container mx-auto max-w-3xl px-4 py-10 md:px-6">
        <Card className="rounded-md border-border/80 shadow-sm">
          <CardContent className="space-y-3 p-6 pt-6">
            <h1 className="text-xl font-semibold">Admin access required</h1>
            <p className="text-sm text-muted-foreground">
              Your account is signed in, but it is not marked as an administrator.
            </p>
            <Button onClick={() => router.push(`/${locale}/profile`)}>Back to profile</Button>
          </CardContent>
        </Card>
      </section>
    )
  }

  const stats = [
    { label: d.stats.clinics, value: clinics.length, icon: Building2 },
    { label: d.stats.users, value: users.length, icon: UsersRound },
    { label: d.stats.bookings, value: bookings.length, icon: CalendarCheck },
    { label: d.stats.reviews, value: reviews.length, icon: MessageSquareText },
  ]

  return (
    <section className="container mx-auto max-w-7xl px-4 py-8 md:px-6 md:py-10">
      <div className="space-y-6">
        <header className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div className="space-y-2">
            <p className="text-sm font-semibold text-primary">{d.badge}</p>
            <h1 className="text-2xl font-semibold tracking-tight md:text-3xl">
              {d.title}
            </h1>
            <p className="max-w-2xl text-sm text-muted-foreground md:text-base">
              {d.subtitle}
            </p>
          </div>
          <Button variant="outline" onClick={() => void loadDashboard()} disabled={isLoadingData}>
            {d.refresh}
          </Button>
        </header>

        {error && (
          <p className="rounded-md bg-destructive/10 px-3 py-2 text-sm text-destructive" role="alert">
            {error}
          </p>
        )}

        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat) => {
            const Icon = stat.icon
            return (
              <Card key={stat.label} className="rounded-md border-border/80 shadow-sm">
                <CardContent className="flex items-center justify-between gap-4 p-5 pt-5">
                  <div>
                    <p className="text-sm text-muted-foreground">{stat.label}</p>
                    <p className="mt-1 text-2xl font-semibold">{stat.value}</p>
                  </div>
                  <div className="inline-flex size-10 items-center justify-center rounded-md bg-primary/10 text-primary">
                    <Icon className="size-5" />
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>

        <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_420px]">
          <Card className="rounded-md border-border/80 shadow-sm">
            <CardHeader>
              <CardTitle className="text-base">{d.clinicsTitle}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {clinics.length === 0 ? (
                <div className="rounded-md bg-muted/20 p-5">
                  <p className="font-medium">{d.noClinics}</p>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {d.noClinicsDesc}
                  </p>
                </div>
              ) : (
                clinics.map((clinic) => (
                  <div key={clinic.id} className="rounded-md border border-border/80 p-4">
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div>
                        <CardTitle className="text-sm font-semibold">{clinic.name} | {clinic.nameAr || "—"}</CardTitle>
                        <p className="mt-1 text-xs text-muted-foreground">
                          {clinic.specialty || "Healthcare"} ({clinic.specialtyAr || "—"}) · {clinic.location || "Location pending"}
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" onClick={() => editClinic(clinic)}>
                          {d.edit}
                        </Button>
                        <Button variant="ghost" size="sm" onClick={() => void handleDeleteClinic(clinic.id)}>
                          {d.delete}
                        </Button>
                      </div>
                    </div>
                    <div className="mt-3 flex flex-wrap gap-2">
                      {Object.entries(clinic.accessibility || {}).map(([key, value]) => {
                        if (!value) return null
                        const filter = filters.find(f => f.id === key)
                        return (
                          <Badge key={key} variant="secondary">
                            {filter?.label || key}
                          </Badge>
                        )
                      })}
                    </div>
                  </div>
                ))
              )}
            </CardContent>
          </Card>

          <Card className="rounded-md border-border/80 shadow-sm">
            <CardHeader>
              <CardTitle className="text-base">
                {form.id ? d.editClinic.replace("{id}", form.id) : d.addClinic}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form className="space-y-4" onSubmit={handleSaveClinic}>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">{dict.clinicDetails.name} (EN)</label>
                    <Input
                      value={form.name || ""}
                      onChange={(e) => setForm(prev => ({ ...prev, name: e.target.value }))}
                      placeholder="Clinic Name (English)"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">{dict.clinicDetails.name} (AR)</label>
                    <Input
                      value={form.nameAr || ""}
                      onChange={(e) => setForm(prev => ({ ...prev, nameAr: e.target.value }))}
                      placeholder="اسم العيادة (العربية)"
                      dir="rtl"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-3">
                  <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">{dict.clinicDetails.specialty}</label>
                  <div className="flex flex-wrap gap-2">
                    {specialties.length === 0 ? (
                      <p className="text-xs text-muted-foreground">No specialties added yet. Add some below.</p>
                    ) : (
                      specialties.map((s) => (
                        <Button
                          key={s.id}
                          type="button"
                          variant={form.specialty === s.name ? "default" : "outline"}
                          className="h-10 rounded-md"
                          onClick={() => setForm(prev => ({ ...prev, specialty: s.name, specialtyAr: s.nameAr }))}
                        >
                          {locale === 'ar' ? s.nameAr : s.name}
                        </Button>
                      ))
                    )}
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Governorate</label>
                      <select
                        value={form.governorate}
                        onChange={(e) => setForm(prev => ({ ...prev, governorate: e.target.value, city: "" }))}
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                        required
                      >
                        <option value="">Select Governorate</option>
                        {egyptLocations.map((gov) => (
                          <option key={gov.id} value={gov.name}>{locale === 'ar' ? gov.nameAr : gov.name}</option>
                        ))}
                      </select>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">City / Village</label>
                      <select
                        value={form.city}
                        onChange={(e) => setForm(prev => ({ ...prev, city: e.target.value }))}
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                        disabled={!form.governorate}
                        required
                      >
                        <option value="">Select City/Village</option>
                        {form.governorate && egyptLocations.find(g => g.name === form.governorate)?.cities.map((city) => (
                          <option key={city.id} value={city.name}>{locale === 'ar' ? city.nameAr : city.name}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Street Address</label>
                    <Input
                      value={form.street}
                      onChange={(e) => setForm(prev => ({ ...prev, street: e.target.value }))}
                      placeholder="Street name, building number..."
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">{dict.clinicDetails.about} (EN)</label>
                  <Textarea
                    value={form.description || ""}
                    onChange={(e) => setForm(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="About (English)"
                    rows={3}
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">{dict.clinicDetails.about} (AR)</label>
                  <Textarea
                    value={form.descriptionAr || ""}
                    onChange={(e) => setForm(prev => ({ ...prev, descriptionAr: e.target.value }))}
                    placeholder="عن العيادة (العربية)"
                    rows={3}
                    dir="rtl"
                  />
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">{d.images} ({form.images.length}/25)</label>
                  </div>
                  <div className="grid grid-cols-4 gap-2">
                    {form.images.map((url, index) => (
                      <div key={index} className="relative aspect-square group">
                        <img src={url} alt="" className="object-cover w-full h-full rounded-lg border border-border/50" />
                        <button
                          type="button"
                          onClick={() => removeImage(index)}
                          className="absolute -top-2 -right-2 bg-destructive text-destructive-foreground rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
                        >
                          <X className="size-3" />
                        </button>
                      </div>
                    ))}
                    {form.images.length < 25 && (
                      <label className={`flex flex-col items-center justify-center aspect-square border-2 border-dashed rounded-lg cursor-pointer transition-all duration-200 ${isUploading ? 'bg-muted/50 border-muted-foreground/20 cursor-wait' : 'border-border hover:border-primary hover:bg-primary/5'}`}>
                        {isUploading ? (
                          <Loader2 className="size-6 animate-spin text-primary" />
                        ) : (
                          <>
                            <ImagePlus className="size-6 text-muted-foreground group-hover:text-primary transition-colors" />
                            <span className="text-[10px] font-bold text-muted-foreground mt-1 uppercase tracking-tighter">{d.add}</span>
                          </>
                        )}
                        <input
                          type="file"
                          multiple
                          accept="image/*"
                          className="hidden"
                          onChange={handleImageUpload}
                          disabled={isUploading}
                        />
                      </label>
                    )}
                  </div>
                </div>
                <div className="space-y-3">
                  <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">{d.accessibilityFeatures}</label>
                  <div className="flex flex-wrap gap-2">
                    {filters.map((filter) => (
                      <Button
                        key={filter.id}
                        type="button"
                        variant={form.accessibility[filter.id] ? "default" : "outline"}
                        className="h-10 rounded-md capitalize"
                        onClick={() => toggleClinicAccessibility(filter.id)}
                      >
                        {filter.label}
                      </Button>
                    ))}
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button type="submit" disabled={isSaving}>
                    {isSaving ? d.saving : d.saveClinic}
                  </Button>
                  <Button type="button" variant="outline" onClick={() => setForm(emptyClinic)}>
                    {d.clear}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_420px]">
          <Card className="rounded-md border-border/80 shadow-sm">
            <CardHeader>
              <CardTitle className="text-base">{d.filters.title}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {filters.map((filter) => {
                  const Icon = iconMap[filter.icon] || iconMap.Accessibility
                  return (
                    <div key={filter.id} className="flex items-center justify-between rounded-md border border-border/80 p-3">
                      <div className="flex items-center gap-3">
                        <div className="inline-flex size-8 items-center justify-center rounded-md bg-muted text-muted-foreground">
                          <Icon className="size-4" />
                        </div>
                        <div>
                          <p className="font-medium text-sm">{filter.label} | {filter.labelAr || "—"}</p>
                          {filter.isPopular && <Badge variant="secondary" className="mt-1 text-[10px]">{d.filters.popular}</Badge>}
                        </div>
                      </div>
                      <Button variant="ghost" size="sm" onClick={() => handleDeleteFilter(filter.id)}>
                        <X className="size-4" />
                      </Button>
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>

          <Card className="rounded-md border-border/80 shadow-sm">
            <CardHeader>
              <CardTitle className="text-base">{d.filters.addTitle}</CardTitle>
            </CardHeader>
            <CardContent>
              <form className="space-y-4" onSubmit={handleSaveFilter}>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">{d.filters.label} (EN)</label>
                    <Input
                      value={filterForm.label || ""}
                      onChange={(e) => setFilterForm(prev => ({ ...prev, label: e.target.value }))}
                      placeholder="Label (English)"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">{d.filters.label} (AR)</label>
                    <Input
                      value={filterForm.labelAr || ""}
                      onChange={(e) => setFilterForm(prev => ({ ...prev, labelAr: e.target.value }))}
                      placeholder="التسمية (العربية)"
                      dir="rtl"
                      required
                    />
                  </div>
                </div>
                <div className="space-y-3">
                  <label className="text-sm font-medium">{d.filters.icon}</label>
                  <div className="relative">
                    <div className="flex gap-2 overflow-x-auto pb-4 pt-1 scrollbar-hide snap-x px-1">
                      {Object.keys(iconMap).map((iconName) => {
                        const Icon = iconMap[iconName]
                        const isSelected = filterForm.icon === iconName
                        return (
                          <Button
                            key={iconName}
                            type="button"
                            variant={isSelected ? "default" : "outline"}
                            className={`size-12 shrink-0 rounded-xl p-0 transition-all snap-start ${isSelected ? 'scale-110 shadow-lg shadow-primary/20' : 'hover:border-primary/50'}`}
                            onClick={() => setFilterForm(prev => ({ ...prev, icon: iconName }))}
                            title={iconName}
                          >
                            <Icon className={`size-6 ${isSelected ? 'animate-in zoom-in-75 duration-300' : ''}`} />
                          </Button>
                        )
                      })}
                    </div>
                    <div className="absolute inset-y-0 -left-1 w-8 bg-gradient-to-r from-background to-transparent pointer-events-none" />
                    <div className="absolute inset-y-0 -right-1 w-8 bg-gradient-to-l from-background to-transparent pointer-events-none" />
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <input 
                    type="checkbox" 
                    id="isPopular" 
                    checked={filterForm.isPopular}
                    onChange={(e) => setFilterForm(prev => ({ ...prev, isPopular: e.target.checked }))}
                    className="size-4 rounded border-gray-300 text-primary focus:ring-primary"
                  />
                  <label htmlFor="isPopular" className="text-sm font-medium">{d.filters.isPopular}</label>
                </div>
                <Button type="submit" className="w-full">{d.filters.save}</Button>
              </form>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_420px]">
          <Card className="rounded-md border-border/80 shadow-sm">
            <CardHeader>
              <CardTitle className="text-base">Specialties</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {specialties.map((specialty) => (
                  <div key={specialty.id} className="flex items-center justify-between rounded-md border border-border/80 p-3">
                    <div className="flex items-center gap-3">
                      <div className="inline-flex size-8 items-center justify-center rounded-md bg-muted text-muted-foreground">
                        <Building2 className="size-4" />
                      </div>
                      <div>
                        <p className="font-medium text-sm">{specialty.name} | {specialty.nameAr || "—"}</p>
                      </div>
                    </div>
                    <Button variant="ghost" size="sm" onClick={() => handleDeleteSpecialty(specialty.id)}>
                      <X className="size-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="rounded-md border-border/80 shadow-sm">
            <CardHeader>
              <CardTitle className="text-base">Add Specialty</CardTitle>
            </CardHeader>
            <CardContent>
              <form className="space-y-4" onSubmit={handleSaveSpecialty}>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Name (EN)</label>
                    <Input
                      value={specialtyForm.name || ""}
                      onChange={(e) => setSpecialtyForm(prev => ({ ...prev, name: e.target.value }))}
                      placeholder="Specialty Name (English)"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Name (AR)</label>
                    <Input
                      value={specialtyForm.nameAr || ""}
                      onChange={(e) => setSpecialtyForm(prev => ({ ...prev, nameAr: e.target.value }))}
                      placeholder="اسم التخصص (العربية)"
                      dir="rtl"
                      required
                    />
                  </div>
                </div>
                <Button type="submit" className="w-full">Save Specialty</Button>
              </form>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <ActivityList title={d.recentBookings} empty={d.noActivity} items={bookings.map((booking) => ({
            id: booking.id,
            title: booking.clinicName,
            detail: `${booking.date} at ${booking.time}`,
          }))} />
          <ActivityList title={d.recentReviews} empty={d.noActivity} items={reviews.map((review) => ({
            id: review.id,
            title: `${review.rating}/5 for ${review.clinicId}`,
            detail: review.comment,
          }))} />
        </div>
      </div>
    </section>
  )
}

function ActivityList({
  title,
  empty,
  items,
}: {
  title: string
  empty: string
  items: Array<{ id: string; title: string; detail: string }>
}) {
  return (
    <Card className="rounded-md border-border/80 shadow-sm">
      <CardHeader>
        <CardTitle className="text-base">{title}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {items.length === 0 ? (
          <p className="rounded-md bg-muted/20 p-4 text-sm text-muted-foreground">{empty}</p>
        ) : (
          items.slice(0, 6).map((item) => (
            <div key={item.id} className="rounded-md border border-border/80 p-3">
              <p className="text-sm font-semibold">{item.title}</p>
              <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">{item.detail}</p>
            </div>
          ))
        )}
      </CardContent>
    </Card>
  )
}

