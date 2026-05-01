import { FirebaseError } from "firebase/app"

const friendlyMessages: Record<string, string> = {
  "auth/email-already-in-use": "An account already exists with this email.",
  "auth/invalid-email": "Please enter a valid email address.",
  "auth/invalid-credential": "The email or password is incorrect.",
  "auth/user-not-found": "The email or password is incorrect.",
  "auth/wrong-password": "The email or password is incorrect.",
  "auth/weak-password": "Please choose a password with at least 6 characters.",
  "auth/network-request-failed": "Network error. Please check your connection and try again.",
  "permission-denied": "You do not have permission to do that.",
  unavailable: "The service is temporarily unavailable. Please try again.",
}

export function getFriendlyFirebaseError(error: unknown) {
  if (error instanceof FirebaseError) {
    return friendlyMessages[error.code] ?? "Something went wrong. Please try again."
  }

  return "Something went wrong. Please try again."
}

