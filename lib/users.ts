import type { User } from "firebase/auth"
import {
  doc,
  getDocs,
  collection,
  getDoc,
  serverTimestamp,
  setDoc,
  updateDoc,
} from "firebase/firestore"

import { db } from "@/lib/firebase"
import type { AccessibilityPreference, UserProfile } from "@/lib/types"

export async function ensureUserDocument(user: Pick<User, "uid" | "email">, name = "") {
  const userRef = doc(db, "users", user.uid)
  const snapshot = await getDoc(userRef)

  if (snapshot.exists()) {
    return { profile: snapshot.data() as UserProfile, isNew: false }
  }

  const profile = {
    uid: user.uid,
    email: user.email,
    name,
    createdAt: serverTimestamp(),
    accessibilityPreferences: [],
    medicalConditions: [],
    role: "user",
  }

  await setDoc(userRef, profile)

  return {
    profile: {
      ...profile,
      createdAt: null,
    } as UserProfile,
    isNew: true
  }
}

export async function getUser(uid: string) {
  const snapshot = await getDoc(doc(db, "users", uid))
  if (!snapshot.exists()) return null

  return snapshot.data() as UserProfile
}

export async function updateUserProfile(
  uid: string,
  data: Partial<Pick<UserProfile, "name" | "accessibilityPreferences" | "medicalConditions" | "photoURL">>
) {
  await updateDoc(doc(db, "users", uid), data)
}

export async function updateAccessibilityPreferences(
  uid: string,
  preferences: AccessibilityPreference[]
) {
  await updateUserProfile(uid, { accessibilityPreferences: preferences })
}

export async function updateMedicalConditions(
  uid: string,
  conditions: string[]
) {
  await updateUserProfile(uid, { medicalConditions: conditions })
}

export async function getUsers() {
  const snapshot = await getDocs(collection(db, "users"))

  return snapshot.docs.map((userDoc) => userDoc.data() as UserProfile)
}
