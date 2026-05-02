"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/components/auth-provider";
import { getFriendlyFirebaseError } from "@/lib/firebase-errors";
import { updateAccessibilityPreferences, updateMedicalConditions } from "@/lib/users";
import { getFilters, type Filter } from "@/lib/filters";

export function OnboardingFlow({ locale, dict }: { locale: string; dict: Record<string, any> }) {
  const router = useRouter();
  const { currentUser, refreshProfile } = useAuth();
  const [step, setStep] = useState(1);
  const [userType, setUserType] = useState<string | null>(null);
  const [needs, setNeeds] = useState<string[]>([]);
  const [conditions, setConditions] = useState<string[]>([]);
  const [availableFilters, setAvailableFilters] = useState<Filter[]>([]);
  const [error, setError] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  const medicalConditionsList = [
    { id: "diabetes", label: dict.onboarding.conditionDiabetes },
    { id: "hypertension", label: dict.onboarding.conditionHypertension },
    { id: "cardiac", label: dict.onboarding.conditionCardiac },
    { id: "asthma", label: dict.onboarding.conditionAsthma },
    { id: "epilepsy", label: dict.onboarding.conditionEpilepsy },
    { id: "kidney", label: dict.onboarding.conditionKidney },
    { id: "arthritis", label: dict.onboarding.conditionArthritis },
  ];

  React.useEffect(() => {
    getFilters().then(setAvailableFilters);
  }, []);

  const handleNext = () => setStep((s) => s + 1);
  const handleBack = () => setStep((s) => s - 1);

  const toggleNeed = (need: string) => {
    setNeeds((prev) =>
      prev.includes(need) ? prev.filter((n) => n !== need) : [...prev, need]
    );
  };

  const toggleCondition = (id: string) => {
    setConditions((prev) =>
      prev.includes(id) ? prev.filter((c) => c !== id) : [...prev, id]
    );
  };

  const handleContinue = async () => {
    setError("");
    setIsSaving(true);

    try {
      if (currentUser) {
        await Promise.all([
          updateAccessibilityPreferences(currentUser.uid, needs),
          updateMedicalConditions(currentUser.uid, conditions)
        ]);
        await refreshProfile();
        router.push(`/${locale}`);
        return;
      }

      window.localStorage.setItem("pendingAccessibilityPreferences", JSON.stringify(needs));
      window.localStorage.setItem("pendingMedicalConditions", JSON.stringify(conditions));
      router.push(`/${locale}/signup`);
    } catch (err) {
      setError(getFriendlyFirebaseError(err));
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <div className="w-full max-w-lg space-y-8">
        {step === 1 && (
          <div className="space-y-8">
            <div className="space-y-2 text-center">
              <h1 className="text-3xl font-bold tracking-tight">{dict.onboarding.step1Title}</h1>
            </div>
            <div className="space-y-4">
              <button
                type="button"
                aria-pressed={userType === "patient"}
                onClick={() => setUserType("patient")}
                className={`w-full text-left p-6 rounded-lg border-2 transition-colors ${
                  userType === "patient" ? "border-primary bg-primary/5" : "border-muted hover:border-primary/50"
                }`}
              >
                <div className="font-semibold text-lg">{dict.onboarding.patient}</div>
                <div className="text-muted-foreground mt-1">{dict.onboarding.patientDesc}</div>
              </button>
              <button
                type="button"
                aria-pressed={userType === "caregiver"}
                onClick={() => setUserType("caregiver")}
                className={`w-full text-left p-6 rounded-lg border-2 transition-colors ${
                  userType === "caregiver" ? "border-primary bg-primary/5" : "border-muted hover:border-primary/50"
                }`}
              >
                <div className="font-semibold text-lg">{dict.onboarding.caregiver}</div>
                <div className="text-muted-foreground mt-1">{dict.onboarding.caregiverDesc}</div>
              </button>
            </div>
            <div className="flex justify-between pt-4">
              <Button variant="ghost" onClick={handleContinue} disabled={isSaving}>{dict.onboarding.skip}</Button>
              <Button onClick={handleNext} disabled={!userType}>
                {dict.onboarding.nextButton}
              </Button>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-8">
            <div className="space-y-2 text-center">
              <h1 className="text-3xl font-bold tracking-tight">{dict.onboarding.step2Title}</h1>
              <p className="text-muted-foreground">{dict.onboarding.step2Subtitle}</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {availableFilters.map((filter) => {
                const isSelected = needs.includes(filter.id);
                return (
                  <Button
                    key={filter.id}
                    variant={isSelected ? "default" : "outline"}
                    className="h-auto py-4 text-base font-medium"
                    aria-pressed={isSelected}
                    onClick={() => toggleNeed(filter.id)}
                  >
                    {locale === 'ar' ? filter.labelAr || filter.label : filter.label}
                  </Button>
                );
              })}
            </div>
            <div className="flex justify-between pt-4">
              <Button variant="ghost" onClick={handleBack}>{dict.onboarding.back}</Button>
              <Button onClick={handleNext}>
                {dict.onboarding.nextButton}
              </Button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-8">
            <div className="space-y-2 text-center">
              <h1 className="text-3xl font-bold tracking-tight">{dict.onboarding.step3Title}</h1>
              <p className="text-muted-foreground">{dict.onboarding.step3Subtitle}</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {medicalConditionsList.map((item) => {
                const isSelected = conditions.includes(item.id);
                return (
                  <Button
                    key={item.id}
                    variant={isSelected ? "default" : "outline"}
                    className="h-auto py-4 text-base font-medium"
                    aria-pressed={isSelected}
                    onClick={() => toggleCondition(item.id)}
                  >
                    {item.label}
                  </Button>
                );
              })}
            </div>
            <div className="flex justify-between pt-4">
              <Button variant="ghost" onClick={handleBack}>{dict.onboarding.back}</Button>
              <Button onClick={handleNext}>
                {dict.onboarding.nextButton}
              </Button>
            </div>
          </div>
        )}

        {step === 4 && (
          <div className="space-y-8">
            <div className="space-y-2 text-center">
              <h1 className="text-3xl font-bold tracking-tight">{dict.onboarding.step4Title}</h1>
              <p className="text-muted-foreground">{dict.onboarding.step4Subtitle}</p>
            </div>
            <div className="p-6 rounded-lg bg-muted/50 space-y-4">
              <div>
                <span className="font-semibold">{dict.onboarding.userTypeLabel}</span>
                <span className="capitalize">{userType === "patient" ? dict.onboarding.patient : dict.onboarding.caregiver}</span>
              </div>
              <div>
                <span className="font-semibold">{dict.onboarding.needsLabel}</span>
                <span>
                  {needs.length > 0
                    ? needs.map((n) => {
                        const f = availableFilters.find(f => f.id === n);
                        return locale === 'ar' ? f?.labelAr || f?.label || n : f?.label || n;
                      }).join(", ")
                    : dict.onboarding.noneSpecified}
                </span>
              </div>
              <div>
                <span className="font-semibold">{dict.onboarding.conditionsLabel}</span>
                <span>
                  {conditions.length > 0
                    ? conditions.map((c) => {
                        const item = medicalConditionsList.find(m => m.id === c);
                        return item?.label || c;
                      }).join(", ")
                    : dict.onboarding.noneSpecified}
                </span>
              </div>
            </div>
            <div className="flex flex-col space-y-4 pt-4">
              {error && (
                <p className="rounded-md bg-destructive/10 px-3 py-2 text-sm text-destructive" role="alert">
                  {error}
                </p>
              )}
              <Button onClick={handleContinue} className="w-full" disabled={isSaving}>
                {isSaving ? "Saving..." : dict.onboarding.continue}
              </Button>
              <Button variant="ghost" onClick={handleBack} className="w-full">{dict.onboarding.back}</Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
