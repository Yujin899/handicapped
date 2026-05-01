"use client"

import * as React from "react"
import type { User } from "firebase/auth"
import { onAuthStateChanged } from "firebase/auth"

import { auth } from "@/lib/firebase"
import { ensureUserDocument, getUser } from "@/lib/users"
import type { UserProfile } from "@/lib/types"

type AuthContextValue = {
  currentUser: User | null
  profile: UserProfile | null
  loading: boolean
  refreshProfile: () => Promise<void>
}

const AuthContext = React.createContext<AuthContextValue | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [currentUser, setCurrentUser] = React.useState<User | null>(null)
  const [profile, setProfile] = React.useState<UserProfile | null>(null)
  const [loading, setLoading] = React.useState(true)

  const refreshProfile = React.useCallback(async () => {
    const user = auth.currentUser
    if (!user) {
      setProfile(null)
      return
    }

    setProfile(await getUser(user.uid))
  }, [])

  React.useEffect(() => {
    return onAuthStateChanged(auth, async (user) => {
      setLoading(true)
      setCurrentUser(user)

      if (!user) {
        setProfile(null)
        setLoading(false)
        return
      }

      try {
        await ensureUserDocument(user)
        setProfile(await getUser(user.uid))
      } catch {
        setProfile(null)
      } finally {
        setLoading(false)
      }
    })
  }, [])

  const value = React.useMemo(
    () => ({ currentUser, profile, loading, refreshProfile }),
    [currentUser, loading, profile, refreshProfile]
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const value = React.useContext(AuthContext)
  if (!value) {
    throw new Error("useAuth must be used inside AuthProvider")
  }

  return value
}
