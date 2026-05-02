import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  GoogleAuthProvider,
  signInWithPopup,
  setPersistence,
  browserLocalPersistence,
} from "firebase/auth"

import { auth } from "@/lib/firebase"
import { ensureUserDocument, updateUserProfile } from "@/lib/users"

// Force local persistence to ensure session survives redirects
setPersistence(auth, browserLocalPersistence).catch(err => {
  console.error("Failed to set persistence", err)
})

const googleProvider = new GoogleAuthProvider()

export async function loginWithGoogle() {
  return await signInWithPopup(auth, googleProvider)
}

export async function signUpWithEmail(email: string, password: string, name = "") {
  const credential = await createUserWithEmailAndPassword(auth, email, password)
  const { isNew } = await ensureUserDocument(credential.user, name)

  if (name.trim()) {
    await updateUserProfile(credential.user.uid, { name: name.trim() })
  }

  return { user: credential.user, isNew }
}

export async function loginWithEmail(email: string, password: string) {
  const credential = await signInWithEmailAndPassword(auth, email, password)
  const { isNew } = await ensureUserDocument(credential.user)

  return { user: credential.user, isNew }
}

export async function logout() {
  await signOut(auth)
}

