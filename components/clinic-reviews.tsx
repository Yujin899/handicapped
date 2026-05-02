"use client"

import * as React from "react"
import { Star, ImagePlus, X, Loader2 } from "lucide-react"
import Image from "next/image"

import { useAuth } from "@/components/auth-provider"
import { Badge } from "@/components/shared-ui"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { createReview, getReviewsByClinic } from "@/lib/data"
import { getFriendlyFirebaseError } from "@/lib/firebase-errors"
import type { Review } from "@/lib/types"
import { mockFilters } from "@/lib/mock-filters"
import { iconMap } from "./search-section"

type SeedReview = {
  id: number
  author: string
  date: string
  rating: number
  text: string
}

const tagOptions = mockFilters

export function ClinicReviews({
  clinicId,
  locale,
  title,
  seedReviews,
  accessibilityFeatures = {},
  dict,
}: {
  clinicId: string
  locale: string
  title: string
  seedReviews: SeedReview[]
  accessibilityFeatures?: Record<string, boolean | undefined>
  dict: any
}) {
  const { currentUser, profile } = useAuth()
  const [reviews, setReviews] = React.useState<Review[]>([])
  const [rating, setRating] = React.useState(5)
  const [comment, setComment] = React.useState("")
  const [tags, setTags] = React.useState<string[]>([])
  const [error, setError] = React.useState("")
  const [loading, setLoading] = React.useState(true)
  const [isSubmitting, setIsSubmitting] = React.useState(false)
  const [reviewImages, setReviewImages] = React.useState<string[]>([])
  const [isUploading, setIsUploading] = React.useState(false)

  // Only show tags that the clinic actually has
  const availableTagOptions = React.useMemo(() => {
    return tagOptions.filter(option => accessibilityFeatures[option.id]);
  }, [accessibilityFeatures]);

  const loadReviews = React.useCallback(async () => {
    setLoading(true)
    try {
      setReviews(await getReviewsByClinic(clinicId))
    } catch {
      setReviews([])
    } finally {
      setLoading(false)
    }
  }, [clinicId])

  React.useEffect(() => {
    let isActive = true

    getReviewsByClinic(clinicId)
      .then((items) => {
        if (isActive) setReviews(items)
      })
      .catch(() => {
        if (isActive) setReviews([])
      })
      .finally(() => {
        if (isActive) setLoading(false)
      })

    return () => {
      isActive = false
    }
  }, [clinicId])

  const toggleTag = (tag: string) => {
    setTags((current) =>
      current.includes(tag) ? current.filter((item) => item !== tag) : [...current, tag]
    )
  }

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files
    if (!files || files.length === 0) return

    const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME
    const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET

    if (!cloudName || !uploadPreset) {
      setError("Cloudinary configuration missing.")
      return
    }

    setIsUploading(true)
    setError("")

    try {
      const urls: string[] = []
      for (const file of Array.from(files).slice(0, 4)) {
        const formData = new FormData()
        formData.append("file", file)
        formData.append("upload_preset", uploadPreset)

        const response = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
          method: "POST",
          body: formData,
        })

        if (!response.ok) throw new Error("Upload failed")
        const data = await response.json()
        urls.push(data.secure_url)
      }
      setReviewImages(prev => [...prev, ...urls].slice(0, 4))
    } catch (err) {
      setError("Image upload failed.")
    } finally {
      setIsUploading(false)
      event.target.value = ""
    }
  }

  const removeImage = (index: number) => {
    setReviewImages(prev => prev.filter((_, i) => i !== index))
  }

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()
    setError("")

    if (!currentUser) {
      window.location.href = `/${locale}/login?redirect=/${locale}/clinics/${clinicId}#reviews`
      return
    }

    setIsSubmitting(true)

    try {
      await createReview({
        userId: currentUser.uid,
        clinicId,
        rating,
        comment: comment.trim(),
        accessibilityTags: tags,
        userName: currentUser.displayName || currentUser.email?.split('@')[0] || dict.reviews.verifiedPatient,
        userImage: profile?.photoURL || currentUser.photoURL || "/profile.png",
        images: reviewImages,
      })
      setComment("")
      setTags([])
      setRating(5)
      setReviewImages([])
      await loadReviews()
    } catch (err) {
      setError(getFriendlyFirebaseError(err))
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <section className="space-y-6 scroll-mt-24" id="reviews">
      <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight">{title}</h2>

      <Card className="rounded-2xl border-2 shadow-none">
        <CardContent className="p-5 pt-5">
          <form className="space-y-4" onSubmit={handleSubmit}>
            <div className="flex flex-wrap items-center gap-2">
              {[1, 2, 3, 4, 5].map((value) => (
                <Button
                  key={value}
                  type="button"
                  variant={rating === value ? "default" : "outline"}
                  className="h-10 w-10 rounded-md p-0"
                  onClick={() => setRating(value)}
                  aria-label={`${value} star rating`}
                >
                  {value}
                </Button>
              ))}
            </div>
            <Textarea
              value={comment}
              onChange={(event) => setComment(event.target.value)}
              placeholder={dict.reviews.placeholder}
              required
            />
            <div className="flex flex-wrap gap-3">
              {availableTagOptions.map((filter) => {
                const Icon = iconMap[filter.icon] || Star;
                const isActive = tags.includes(filter.id);
                return (
                  <Button
                    key={filter.id}
                    type="button"
                    variant={isActive ? "default" : "outline"}
                    className="h-11 rounded-xl px-4 flex items-center gap-2 font-bold"
                    onClick={() => toggleTag(filter.id)}
                  >
                    <Icon className={`h-4 w-4 ${isActive ? 'text-primary-foreground' : 'text-primary'}`} />
                    {locale === 'ar' ? filter.labelAr || filter.label : filter.label}
                  </Button>
                );
              })}
            </div>

            <div className="space-y-3">
              <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">{dict.reviews.addPhotos}</label>
              <div className="flex flex-wrap gap-2">
                {reviewImages.map((url, index) => (
                  <div key={index} className="relative size-20 group">
                    <img src={url} alt="" className="object-cover w-full h-full rounded-xl border border-border/50" />
                    <button
                      type="button"
                      onClick={() => removeImage(index)}
                      className="absolute -top-1.5 -right-1.5 bg-destructive text-destructive-foreground rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
                    >
                      <X className="size-3" />
                    </button>
                  </div>
                ))}
                {reviewImages.length < 4 && (
                  <label className={`flex flex-col items-center justify-center size-20 border-2 border-dashed rounded-xl cursor-pointer transition-all ${isUploading ? 'bg-muted/50 cursor-wait' : 'border-border hover:border-primary hover:bg-primary/5'}`}>
                    {isUploading ? (
                      <Loader2 className="size-5 animate-spin text-primary" />
                    ) : (
                      <>
                        <ImagePlus className="size-5 text-muted-foreground" />
                        <span className="text-[10px] font-bold text-muted-foreground mt-1 uppercase">{dict.reviews.add}</span>
                      </>
                    )}
                    <input type="file" multiple accept="image/*" className="hidden" onChange={handleImageUpload} disabled={isUploading} />
                  </label>
                )}
              </div>
            </div>
            {error && (
              <p className="rounded-md bg-destructive/10 px-3 py-2 text-sm text-destructive" role="alert">
                {error}
              </p>
            )}
            <Button type="submit" disabled={isSubmitting || comment.trim().length === 0}>
              {isSubmitting ? dict.reviews.saving : dict.reviews.leaveReview}
            </Button>
          </form>
        </CardContent>
      </Card>

      <div className="space-y-4">
        {reviews.map((review) => (
          <Card key={review.id} className="rounded-2xl border-2 shadow-none bg-background">
            <CardContent className="p-6 pt-6 space-y-4">
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-full border-2 border-background shadow-sm">
                    <Image 
                      src={review.userImage || "/profile.png"} 
                      alt={review.userName || "User"} 
                      fill 
                      className="object-cover" 
                    />
                  </div>
                  <div>
                    <p className="font-bold text-foreground leading-none">{review.userName || dict.reviews.verifiedPatient}</p>
                    <div className="mt-2 flex flex-wrap gap-2">
                    {review.accessibilityTags.map((tagId) => {
                      const filter = mockFilters.find(f => f.id === tagId);
                      if (!filter) return null;
                      const Icon = iconMap[filter.icon] || Star;
                      return (
                        <Badge key={tagId} variant="secondary" className="rounded-lg py-1 px-3 flex items-center gap-1.5 font-bold border border-secondary">
                          <Icon className="h-3 w-3 text-primary" />
                          {locale === 'ar' ? filter.labelAr || filter.label : filter.label}
                        </Badge>
                      );
                    })}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-1 bg-secondary/50 px-2 py-1 rounded-md">
                  <Star className="h-3.5 w-3.5 fill-current text-primary" />
                  <span className="text-sm font-bold text-secondary-foreground">{review.rating}</span>
                </div>
              </div>
              <p className="text-muted-foreground text-sm leading-relaxed font-medium">&quot;{review.comment}&quot;</p>
              
              {review.images && review.images.length > 0 && (
                <div className="flex flex-wrap gap-3 pt-2">
                  {review.images.map((img, i) => (
                    <div key={i} className="relative h-32 w-40 shrink-0 overflow-hidden rounded-2xl border-2 border-border/30 shadow-sm transition-transform hover:scale-[1.02] cursor-zoom-in">
                      <Image src={img} alt="Review attachment" fill className="object-cover" />
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        ))}

        {!loading && reviews.length === 0 && seedReviews.map((review) => (
          <Card key={review.id} className="rounded-2xl border-2 shadow-none bg-background">
            <CardContent className="p-6 pt-6 space-y-4">
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                    {review.author.charAt(0)}
                  </div>
                  <div>
                    <p className="font-bold text-foreground leading-none">{review.author}</p>
                    <p className="text-xs text-muted-foreground mt-1 font-medium">{review.date}</p>
                  </div>
                </div>
                <div className="flex items-center gap-1 bg-secondary/50 px-2 py-1 rounded-md">
                  <Star className="h-3.5 w-3.5 fill-current text-primary" />
                  <span className="text-sm font-bold text-secondary-foreground">{review.rating}</span>
                </div>
              </div>
              <p className="text-muted-foreground text-sm leading-relaxed font-medium">&quot;{review.text}&quot;</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  )
}
