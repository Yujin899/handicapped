"use client"

import * as React from "react"
import { Star } from "lucide-react"

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
}: {
  clinicId: string
  locale: string
  title: string
  seedReviews: SeedReview[]
}) {
  const { currentUser } = useAuth()
  const [reviews, setReviews] = React.useState<Review[]>([])
  const [rating, setRating] = React.useState(5)
  const [comment, setComment] = React.useState("")
  const [tags, setTags] = React.useState<string[]>([])
  const [error, setError] = React.useState("")
  const [loading, setLoading] = React.useState(true)
  const [isSubmitting, setIsSubmitting] = React.useState(false)

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
      })
      setComment("")
      setTags([])
      setRating(5)
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
              placeholder="Share what accessibility support worked well."
              required
            />
            <div className="flex flex-wrap gap-3">
              {tagOptions.map((filter) => {
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
            {error && (
              <p className="rounded-md bg-destructive/10 px-3 py-2 text-sm text-destructive" role="alert">
                {error}
              </p>
            )}
            <Button type="submit" disabled={isSubmitting || comment.trim().length === 0}>
              {isSubmitting ? "Saving..." : "Leave review"}
            </Button>
          </form>
        </CardContent>
      </Card>

      <div className="space-y-4">
        {reviews.map((review) => (
          <Card key={review.id} className="rounded-2xl border-2 shadow-none bg-background">
            <CardContent className="p-6 pt-6 space-y-4">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="font-bold text-foreground leading-none">Verified patient</p>
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
                <div className="flex items-center gap-1 bg-secondary/50 px-2 py-1 rounded-md">
                  <Star className="h-3.5 w-3.5 fill-current text-primary" />
                  <span className="text-sm font-bold text-secondary-foreground">{review.rating}</span>
                </div>
              </div>
              <p className="text-muted-foreground text-sm leading-relaxed font-medium">&quot;{review.comment}&quot;</p>
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
