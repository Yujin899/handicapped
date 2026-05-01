"use client";

import React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { signUpWithEmail, loginWithGoogle } from "@/lib/auth";
import { getFriendlyFirebaseError } from "@/lib/firebase-errors";
import { updateAccessibilityPreferences } from "@/lib/users";
import { GoogleIcon } from "./shared-ui";

export function SignupPage({ locale, dict }: { locale: string; dict: Record<string, any> }) {
  const router = useRouter();
  const [name, setName] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [error, setError] = React.useState("");
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [isGoogleSubmitting, setIsGoogleSubmitting] = React.useState(false);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError("");
    setIsSubmitting(true);

    try {
      const { user, isNew } = await signUpWithEmail(email.trim(), password, name.trim());
      await handlePostLogin(user.uid);
      if (isNew) {
        router.push(`/${locale}/onboarding`);
      } else {
        router.push(`/${locale}`);
      }
    } catch (err) {
      setError(getFriendlyFirebaseError(err));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGoogleLogin = async () => {
    setError("");
    setIsGoogleSubmitting(true);

    try {
      const { user, isNew } = await loginWithGoogle();
      await handlePostLogin(user.uid);
      if (isNew) {
        router.push(`/${locale}/onboarding`);
      } else {
        router.push(`/${locale}`);
      }
    } catch (err) {
      setError(getFriendlyFirebaseError(err));
    } finally {
      setIsGoogleSubmitting(false);
    }
  };

  const handlePostLogin = async (uid: string) => {
    const pendingPreferences = window.localStorage.getItem("pendingAccessibilityPreferences");
    if (pendingPreferences) {
      try {
        await updateAccessibilityPreferences(uid, JSON.parse(pendingPreferences));
        window.localStorage.removeItem("pendingAccessibilityPreferences");
      } catch (e) {
        console.error("Failed to update pending preferences", e);
      }
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <div className="w-full max-w-md space-y-8">
        <div className="space-y-2 text-center">
          <h1 className="text-3xl font-bold tracking-tight">{dict.auth.signupTitle}</h1>
          <p className="text-muted-foreground">
            {dict.auth.hasAccount}{" "}
            <Link href={`/${locale}/login`} className="text-primary hover:underline font-medium">
              {dict.auth.loginButton}
            </Link>
          </p>
        </div>

        <form className="space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="name" className="text-sm font-medium">
                {dict.auth.name}
              </label>
              <Input
                id="name"
                type="text"
                value={name}
                onChange={(event) => setName(event.target.value)}
                placeholder={dict.auth.namePlaceholder}
                required
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium">
                {dict.auth.email}
              </label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder={dict.auth.emailPlaceholder}
                required
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="password" className="text-sm font-medium">
                {dict.auth.password}
              </label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                placeholder={dict.auth.passwordPlaceholder}
                required
              />
            </div>
          </div>
          {error && (
            <p className="rounded-md bg-destructive/10 px-3 py-2 text-sm text-destructive" role="alert">
              {error}
            </p>
          )}
          <Button type="submit" className="w-full" size="xl" disabled={isSubmitting || isGoogleSubmitting}>
            {isSubmitting ? "Please wait..." : dict.auth.signupButton}
          </Button>
        </form>

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-background px-2 text-muted-foreground">Or</span>
          </div>
        </div>

        <div className="space-y-4">
          <Button 
            variant="outline" 
            className="w-full" 
            size="xl"
            type="button" 
            onClick={handleGoogleLogin}
            disabled={isGoogleSubmitting || isSubmitting}
          >
            {isGoogleSubmitting ? "Please wait..." : (
              <div className="flex items-center gap-2">
                <GoogleIcon className="h-5 w-5" />
                {dict.auth.google}
              </div>
            )}
          </Button>
          <Button variant="ghost" className="w-full" size="xl" type="button" asChild>
            <Link href={`/${locale}/onboarding`}>{dict.auth.guest}</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
