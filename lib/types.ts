import type { Timestamp } from "firebase/firestore"

export type AccessibilityPreference = "wheelchair" | "hearing" | "quiet" | "visual" | string

export type UserProfile = {
  uid: string
  email: string | null
  name: string
  photoURL?: string
  createdAt: Timestamp | null
  accessibilityPreferences: AccessibilityPreference[]
  medicalConditions?: string[]
  role: "user" | "admin"
}

export type Clinic = {
  id: string
  name: string
  nameAr?: string
  imageSrc?: string
  imageAlt?: string
  allowsHomeVisit?: boolean
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

export type BookingStatus = "pending" | "confirmed" | "checked-in" | "in-progress" | "completed" | "cancelled"

export type Booking = {
  id: string
  userId: string
  clinicId: string
  clinicName: string
  date: string
  time: string
  notes: string
  status?: BookingStatus
  checkInTime?: Timestamp | null
  createdAt: Timestamp | null
  medicalConditions?: string[]
  accessibilityPreferences?: AccessibilityPreference[]
  visitType?: "clinic" | "home"
  patientAddress?: string
}

export type Review = {
  id: string
  userId: string
  userName?: string
  userImage?: string
  clinicId: string
  rating: number
  comment: string
  images?: string[]
  accessibilityTags: AccessibilityPreference[]
  createdAt: Timestamp | null
}

export type CreateBookingInput = Omit<Booking, "id" | "createdAt" | "userId"> & {
  userId: string
  medicalConditions?: string[]
  accessibilityPreferences?: AccessibilityPreference[]
  visitType: "clinic" | "home"
  patientAddress?: string
}

export type CreateReviewInput = Omit<Review, "id" | "createdAt" | "userId" | "userName" | "userImage"> & {
  userId: string
  userName?: string
  userImage?: string
  images?: string[]
}

