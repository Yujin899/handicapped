"use client";

import React from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { loginWithEmail, loginWithGoogle } from "@/lib/auth";
import { auth } from "@/lib/firebase";
import { ensureUserDocument } from "@/lib/users";
import { getFriendlyFirebaseError } from "@/lib/firebase-errors";
import { getRedirectResult } from "firebase/auth";
import { GoogleIcon } from "./shared-ui";

export function LoginPage({ locale, dict }: { locale: string; dict: Record<string, any> }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [error, setError] = React.useState("");
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [isGoogleSubmitting, setIsGoogleSubmitting] = React.useState(false);

  const redirectTo = searchParams.get("redirect") ?? `/${locale}`;
  const [loadingRedirect, setLoadingRedirect] = React.useState(true);

  React.useEffect(() => {
    const handleRedirect = async () => {
      try {
        const result = await getRedirectResult(auth);
        if (result) {
          setIsGoogleSubmitting(true);
          const { isNew } = await ensureUserDocument(result.user, result.user.displayName || "");
          if (isNew) {
            router.push(`/${locale}/onboarding`);
          } else {
            router.push(redirectTo);
          }
        }
      } catch (err) {
        setError(getFriendlyFirebaseError(err));
      } finally {
        setLoadingRedirect(false);
      }
    };

    handleRedirect();
  }, [locale, router, redirectTo]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError("");
    setIsSubmitting(true);

    try {
      const { isNew } = await loginWithEmail(email.trim(), password);
      if (isNew) {
        router.push(`/${locale}/onboarding`);
      } else {
        router.push(redirectTo);
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
      await loginWithGoogle();
      // Browser will redirect, so no need to push router here
    } catch (err) {
      setError(getFriendlyFirebaseError(err));
      setIsGoogleSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <div className="w-full max-w-md space-y-8">
        <div className="space-y-2 text-center">
          <h1 className="text-3xl font-bold tracking-tight">{dict.auth.loginTitle}</h1>
          <p className="text-muted-foreground">
            {dict.auth.noAccount}{" "}
            <Link href={`/${locale}/signup`} className="text-primary hover:underline font-medium">
              {dict.auth.signupButton}
            </Link>
          </p>
        </div>

        <form className="space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
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
            {isSubmitting ? "Please wait..." : dict.auth.loginButton}
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
        </div>
      </div>
    </div>
  );
}
