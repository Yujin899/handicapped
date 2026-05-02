"use client";

import React from 'react';
import Link from 'next/link';
import { Accessibility } from 'lucide-react';
import { useAuth } from './auth-provider';

export function Footer({ dict, locale }: { dict: any; locale: string }) {
  const { currentUser } = useAuth();
  return (
    <footer className="bg-background border-t py-12 md:py-16 lg:py-24 px-4">
      <div className="container mx-auto max-w-7xl">
        <div className="flex flex-col md:flex-row items-start justify-between gap-16 border-b border-border/60 pb-16 mb-16">
          <div className="space-y-6 max-w-sm">
            <Link href={`/${locale}`} className="flex items-center gap-3 hover:opacity-90 transition-opacity">
              <div className="bg-primary rounded-xl p-1.5">
                <Accessibility className="h-7 w-7 text-primary-foreground" />
              </div>
              <span className="font-extrabold text-2xl tracking-tight text-foreground">{dict.brand}</span>
            </Link>
            <p className="text-muted-foreground text-lg leading-relaxed font-bold">
              {dict.footer.mission}
            </p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-x-20 gap-y-10">
            <div className="space-y-4">
              <h4 className="font-black uppercase tracking-[0.1em] text-sm text-foreground">{dict.footer.explore}</h4>
              <nav className="flex flex-col gap-3 text-base font-bold text-muted-foreground">
                <Link href={`/${locale}/clinics`} className="hover:text-primary transition-colors">{dict.footer.clinics}</Link>
                <Link href={currentUser ? `/${locale}/profile` : `/${locale}/login`} className="hover:text-primary transition-colors">{dict.nav.profile}</Link>
                <Link href={`/${locale}`} className="hover:text-primary transition-colors">{dict.nav.about}</Link>
              </nav>
            </div>
            <div className="space-y-4">
              <h4 className="font-black uppercase tracking-[0.1em] text-sm text-foreground">{dict.footer.legal}</h4>
              <nav className="flex flex-col gap-3 text-base font-bold text-muted-foreground">
                <Link href="#" className="hover:text-primary transition-colors">{dict.footer.privacy}</Link>
                <Link href="#" className="hover:text-primary transition-colors">{dict.footer.terms}</Link>
                <Link href="#" className="hover:text-primary transition-colors">{dict.footer.accessPolicy}</Link>
              </nav>
            </div>
          </div>
        </div>
        <div className="flex flex-col items-center gap-6 text-sm font-black text-muted-foreground uppercase tracking-widest text-center">
          <p>{dict.footer.copyright.replace('{year}', new Date().getFullYear().toString())}</p>
        </div>
      </div>
    </footer>
  );
}
