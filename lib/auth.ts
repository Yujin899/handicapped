import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  GoogleAuthProvider,
  signInWithPopup,
} from "firebase/auth"

import { auth } from "@/lib/firebase"
import { ensureUserDocument, updateUserProfile } from "@/lib/users"

const googleProvider = new GoogleAuthProvider()

export async function loginWithGoogle() {
  const credential = await signInWithPopup(auth, googleProvider)
  const { isNew } = await ensureUserDocument(credential.user, credential.user.displayName || "")
  return { user: credential.user, isNew }
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

