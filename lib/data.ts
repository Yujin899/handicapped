import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  query,
  serverTimestamp,
  setDoc,
  where,
} from "firebase/firestore"

import { db } from "@/lib/firebase"
import type { Booking, Clinic, CreateBookingInput, CreateReviewInput, Review } from "@/lib/types"
import { mockClinics } from "./mock-data"

export async function getClinics() {
  const snapshot = await getDocs(collection(db, "clinics"))

  const firebaseClinics = snapshot.docs.map((clinicDoc) => ({
    id: clinicDoc.id,
    ...clinicDoc.data(),
  })) as Clinic[]

  // Combine firebase clinics with mock clinics, prioritizing firebase ones if IDs clash
  const combined = [...firebaseClinics]
  for (const mock of mockClinics) {
    if (!combined.find(c => c.id === mock.id)) {
      combined.push(mock)
    }
  }

  return combined
}

export async function getClinicById(id: string) {
  const snapshot = await getDoc(doc(db, "clinics", id))
  if (snapshot.exists()) {
    return {
      id: snapshot.id,
      ...snapshot.data(),
    } as Clinic
  }

  // Fallback to mock data
  const mock = mockClinics.find(c => c.id === id)
  return mock || null
}

export async function saveClinic(clinic: Clinic) {
  await setDoc(doc(db, "clinics", clinic.id), clinic, { merge: true })
}

export async function deleteClinic(id: string) {
  await deleteDoc(doc(db, "clinics", id))
}

export async function createBooking(input: CreateBookingInput) {
  const bookingRef = await addDoc(collection(db, "bookings"), {
    userId: input.userId,
    clinicId: input.clinicId,
    clinicName: input.clinicName,
    date: input.date,
    time: input.time,
    notes: input.notes,
    createdAt: serverTimestamp(),
  })

  return bookingRef.id
}

export async function getBookingsByUser(uid: string) {
  const bookingsQuery = query(
    collection(db, "bookings"),
    where("userId", "==", uid)
  )
  const snapshot = await getDocs(bookingsQuery)

  const bookings = snapshot.docs.map((bookingDoc) => ({
    id: bookingDoc.id,
    ...bookingDoc.data(),
  })) as Booking[]

  return bookings.sort(sortNewestFirst)
}

export async function getAllBookings() {
  const snapshot = await getDocs(collection(db, "bookings"))
  const bookings = snapshot.docs.map((bookingDoc) => ({
    id: bookingDoc.id,
    ...bookingDoc.data(),
  })) as Booking[]

  return bookings.sort(sortNewestFirst)
}

export async function createReview(input: CreateReviewInput) {
  const reviewRef = await addDoc(collection(db, "reviews"), {
    userId: input.userId,
    clinicId: input.clinicId,
    rating: input.rating,
    comment: input.comment,
    accessibilityTags: input.accessibilityTags,
    createdAt: serverTimestamp(),
  })

  return reviewRef.id
}

export async function getReviewsByClinic(id: string) {
  const reviewsQuery = query(
    collection(db, "reviews"),
    where("clinicId", "==", id)
  )
  const snapshot = await getDocs(reviewsQuery)

  const reviews = snapshot.docs.map((reviewDoc) => ({
    id: reviewDoc.id,
    ...reviewDoc.data(),
  })) as Review[]

  return reviews.sort(sortNewestFirst)
}

export async function getAllReviews() {
  const snapshot = await getDocs(collection(db, "reviews"))
  const reviews = snapshot.docs.map((reviewDoc) => ({
    id: reviewDoc.id,
    ...reviewDoc.data(),
  })) as Review[]

  return reviews.sort(sortNewestFirst)
}

function sortNewestFirst<T extends { createdAt: { toMillis?: () => number } | null }>(a: T, b: T) {
  return (b.createdAt?.toMillis?.() ?? 0) - (a.createdAt?.toMillis?.() ?? 0)
}
