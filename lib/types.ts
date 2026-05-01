import type { Timestamp } from "firebase/firestore"

export type AccessibilityPreference = "wheelchair" | "hearing" | "quiet" | "visual" | string

export type UserProfile = {
  uid: string
  email: string | null
  name: string
  createdAt: Timestamp | null
  accessibilityPreferences: AccessibilityPreference[]
  role: "user" | "admin"
}

export type Clinic = {
  id: string
  name: string
  nameAr?: string
  imageSrc?: string
  imageAlt?: string
  images?: string[]
  rating?: number
  reviews?: number
  description?: string
  descriptionAr?: string
  location?: string
  locationAr?: string
  governorate?: string
  governorateAr?: string
  city?: string
  cityAr?: string
  street?: string
  streetAr?: string
  specialty?: string
  specialtyAr?: string
  accessibility?: {
    wheelchair?: boolean
    hearing?: boolean
    quiet?: boolean
    visual?: boolean
    [key: string]: boolean | undefined
  }
}

export type Booking = {
  id: string
  userId: string
  clinicId: string
  clinicName: string
  date: string
  time: string
  notes: string
  createdAt: Timestamp | null
}

export type Review = {
  id: string
  userId: string
  clinicId: string
  rating: number
  comment: string
  accessibilityTags: AccessibilityPreference[]
  createdAt: Timestamp | null
}

export type CreateBookingInput = Omit<Booking, "id" | "createdAt" | "userId"> & {
  userId: string
}

export type CreateReviewInput = Omit<Review, "id" | "createdAt" | "userId"> & {
  userId: string
}

