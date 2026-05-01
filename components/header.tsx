"use client";

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Accessibility, Menu, Sun, Moon } from 'lucide-react';
import { Button } from './shared-ui';
import { useAuth } from './auth-provider';
import { logout } from '@/lib/auth';
import { useTheme } from './theme-provider';

export function Header({ dict, locale }: { dict: any; locale: string }) {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const [isLangDropdownOpen, setIsLangDropdownOpen] = React.useState(false);
  const { theme, setTheme } = useTheme();
  const { currentUser } = useAuth();

  const switchLanguage = (newLocale: string) => {
    if (newLocale === locale) return;
    const newPath = window.location.pathname.replace(`/${locale}`, `/${newLocale}`);
    window.location.href = newPath || `/${newLocale}`;
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur-md transform-gpu">
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 h-16 flex items-center justify-between md:justify-start">
        {/* Left Side: Logo */}
        <div className="flex flex-1 items-center justify-start">
          <Link href={`/${locale}`} className="flex items-center gap-2 sm:gap-2.5 shrink-0 hover:opacity-90 transition-opacity">
            <div className="bg-primary rounded-lg p-1 shadow-sm">
              <Accessibility className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="font-bold text-base sm:text-lg tracking-tight hidden min-[380px]:inline-block">{dict.brand}</span>
          </Link>
        </div>

        {/* Center: Navigation (Desktop Only) */}
        <nav className="hidden md:flex items-center gap-10 text-xs font-black uppercase tracking-[0.2em] text-muted-foreground">
          <Link href={`/${locale}`} className="text-foreground transition-colors hover:text-primary">{dict.nav.home}</Link>
          <Link href={`/${locale}/clinics`} className="transition-colors hover:text-primary">{dict.nav.explore}</Link>
          <Link href={currentUser ? `/${locale}/profile` : `/${locale}/login`} className="transition-colors hover:text-primary">{dict.nav.profile}</Link>
        </nav>

        {/* Right Side: Actions */}
        <div className="flex flex-1 items-center justify-end gap-1 md:gap-2">
          <div className="hidden md:flex">
            <Button variant="ghost" size="icon" onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')} className="text-muted-foreground hover:text-foreground h-11 w-11" aria-label="Toggle theme">
              <Sun className="h-5 w-5 hidden dark:block" />
              <Moon className="h-5 w-5 block dark:hidden" />
            </Button>
          </div>
          <div className="relative hidden md:block">
            <Button 
              variant="ghost" 
              className="text-muted-foreground hover:text-foreground flex items-center gap-2 px-3 h-11" 
              onClick={() => setIsLangDropdownOpen(!isLangDropdownOpen)}
              aria-label="Select language"
            >
              <Image src={locale === 'en' ? "/en.png" : "/ar.png"} alt={locale} width={24} height={16} className="h-4 w-6 rounded-[2px] object-cover border border-border/50 shadow-sm" />
              <span className="text-xs font-bold uppercase">{locale}</span>
            </Button>
            {isLangDropdownOpen && (
              <div className="absolute top-full end-0 mt-2 w-40 bg-background border border-border rounded-xl shadow-lg overflow-hidden animate-in fade-in slide-in-from-top-2 z-50">
                <button 
                  onClick={() => { switchLanguage('en'); setIsLangDropdownOpen(false); }}
                  className={`w-full flex items-center gap-3 px-4 min-h-[44px] py-3 text-sm font-semibold hover:bg-muted/50 transition-colors duration-200 ease-out ${locale === 'en' ? 'bg-primary/5 text-primary' : ''}`}
                >
                  <Image src="/en.png" alt="English" width={24} height={16} className="h-4 w-6 rounded-[2px] object-cover border border-border/50 shadow-sm" />
                  English
                </button>
                <button 
                  onClick={() => { switchLanguage('ar'); setIsLangDropdownOpen(false); }}
                  className={`w-full flex items-center gap-3 px-4 min-h-[44px] py-3 text-sm font-semibold hover:bg-muted/50 transition-colors duration-200 ease-out border-t border-border/50 ${locale === 'ar' ? 'bg-primary/5 text-primary' : ''}`}
                >
                  <Image src="/ar.png" alt="العربية" width={24} height={16} className="h-4 w-6 rounded-[2px] object-cover border border-border/50 shadow-sm" />
                  العربية
                </button>
              </div>
            )}
          </div>
          <div className="hidden lg:block">
            {currentUser ? (
              <Button variant="ghost" className="font-bold text-xs uppercase tracking-widest" onClick={() => void logout()}>
                {dict.actions.logout}
              </Button>
            ) : (
              <Link href={`/${locale}/login`}>
                <Button variant="ghost" className="font-bold text-xs uppercase tracking-widest">{dict.actions.login}</Button>
              </Link>
            )}
          </div>
          <Link href={`/${locale}/clinics`}>
            <Button className="shadow-sm font-bold h-9 sm:h-10 px-3 sm:px-5 text-[10px] sm:text-xs uppercase tracking-widest whitespace-nowrap rounded-xl" aria-label={dict.actions.findClinic}>
              <span className="sm:hidden">{dict.actions.findClinicMobile}</span>
              <span className="hidden sm:inline">{dict.actions.findClinic}</span>
            </Button>
          </Link>
          
          {/* Mobile Menu Toggle */}
          <Button 
            variant="ghost" 
            size="icon" 
            className="md:hidden border-0 sm:border ml-0.5 h-11 w-11"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label={isMenuOpen ? "Close menu" : "Open menu"}
            aria-expanded={isMenuOpen}
          >
            <Menu className="h-5 w-5" />
          </Button>
        </div>
      </div>

      {/* Mobile Navigation Overlay */}
      {isMenuOpen && (
        <div className="md:hidden border-t bg-background p-4 space-y-4 animate-in fade-in slide-in-from-top-2 duration-200 ease-out" role="dialog" aria-modal="true" aria-label="Mobile navigation">
          <nav className="flex flex-col gap-2 text-sm font-semibold">
            <Link href={`/${locale}`} className="p-3 min-h-[44px] flex items-center rounded-lg hover:bg-muted transition-colors duration-200" onClick={() => setIsMenuOpen(false)}>{dict.nav.home}</Link>
            <Link href={`/${locale}/clinics`} className="p-3 min-h-[44px] flex items-center rounded-lg hover:bg-muted transition-colors duration-200" onClick={() => setIsMenuOpen(false)}>{dict.nav.explore}</Link>
            <Link href={currentUser ? `/${locale}/profile` : `/${locale}/login`} className="p-3 min-h-[44px] flex items-center rounded-lg hover:bg-muted transition-colors duration-200" onClick={() => setIsMenuOpen(false)}>{dict.nav.profile}</Link>
            <div className="flex gap-4 p-2">
              <Button variant="outline" size="sm" onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')} className="flex-1 h-11">
                {theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
              </Button>
              <Button variant="outline" size="sm" onClick={() => switchLanguage(locale === 'en' ? 'ar' : 'en')} className="flex-1 h-11">
                {locale === 'en' ? 'العربية' : 'English'}
              </Button>
            </div>
            {currentUser ? (
              <button
                type="button"
                className="p-3 min-h-[44px] flex items-center rounded-lg hover:bg-muted transition-colors duration-200 border-t mt-2 text-left"
                onClick={() => {
                  setIsMenuOpen(false);
                  void logout();
                }}
              >
                {dict.actions.logout}
              </button>
            ) : (
              <Link href={`/${locale}/login`} className="p-3 min-h-[44px] flex items-center rounded-lg hover:bg-muted transition-colors duration-200 border-t mt-2" onClick={() => setIsMenuOpen(false)}>{dict.actions.login}</Link>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}
