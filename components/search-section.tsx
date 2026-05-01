"use client";

import React from 'react';
import { 
  MapPin, Search, Ear, VolumeX, Accessibility, Eye, Wind, Heart, User, Shield, Info,
  Brain, Baby, Dog, Clock, MessageCircle, Smile, Hand, Phone, Stethoscope, 
  Navigation, Map, Locate, Zap, Sun, Moon, Cloud, Bell, Camera, Mic
} from 'lucide-react';
import { motion } from 'framer-motion';
import type { Variants } from 'framer-motion';
import { Input, Button, Wheelchair } from './shared-ui';
import { getPopularFilters, type Filter } from '@/lib/filters';
import { getSpecialties, type Specialty } from '@/lib/specialties';
import { AnimatePresence } from 'framer-motion';
import { Building2 } from 'lucide-react';

export const iconMap: Record<string, React.ElementType> = {
  Wheelchair, Ear, VolumeX, Accessibility, Eye, Wind, Heart, User, Shield, Info,
  Brain, Baby, Dog, Clock, MessageCircle, Smile, Hand, Phone, Stethoscope,
  Navigation, Map, Locate, Zap, Sun, Moon, Cloud, Bell, Camera, Mic
};

export function SearchSection({ dict, locale }: { dict: any; locale: string }) {
  const [activeFilters, setActiveFilters] = React.useState<Record<string, boolean>>({});
  const [popularFilters, setPopularFilters] = React.useState<Filter[]>([]);
  const [specialties, setSpecialties] = React.useState<Specialty[]>([]);
  const [focusedInput, setFocusedInput] = React.useState<'location' | 'query' | null>(null);
  const [locationValue, setLocationValue] = React.useState('');
  const [queryValue, setQueryValue] = React.useState('');

  React.useEffect(() => {
    getPopularFilters().then(setPopularFilters);
    getSpecialties().then(setSpecialties);
  }, []);

  const toggleFilter = (filter: string) => {
    setActiveFilters(prev => ({ ...prev, [filter]: !prev[filter] }));
  };

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (locationValue) params.set('location', locationValue);
    if (queryValue) params.set('query', queryValue);
    
    const activeFilterIds = Object.keys(activeFilters).filter(id => activeFilters[id]);
    if (activeFilterIds.length > 0) {
      params.set('filters', activeFilterIds.join(','));
    }

    const queryString = params.toString();
    const target = `/${locale}/clinics${queryString ? `?${queryString}` : ''}`;
    window.location.href = target;
  };

  const containerVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: [0.16, 1, 0.3, 1] as const,
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <div className="flex flex-col gap-10">
      {/* Primary Search Bar */}
      <div className="relative max-w-3xl">
        <div className="bg-background border-2 border-primary/10 shadow-2xl shadow-primary/5 rounded-3xl p-2 md:p-3 flex flex-col md:flex-row gap-2 transition-all hover:border-primary/20 focus-within:border-primary/30 focus-within:shadow-primary/10" 
          role="search" 
          aria-label="Search for accessible clinics"
        >
          <div className="relative flex-[1.2]">
            <MapPin className="absolute start-4 top-3.5 h-5 w-5 text-primary/60" aria-hidden="true" />
            <label htmlFor="location-search" className="sr-only">{dict.search.locationPlaceholder}</label>
            <Input 
              id="location-search" 
              placeholder={dict.search.locationPlaceholder} 
              className="ps-12 h-12 border-0 bg-transparent shadow-none text-base focus-visible:ring-0 placeholder:text-muted-foreground/60" 
              value={locationValue}
              onChange={(e) => setLocationValue(e.target.value)}
              onFocus={() => setFocusedInput('location')}
              onBlur={() => setTimeout(() => setFocusedInput(null), 200)}
            />
          </div>
          <div className="hidden md:block w-px bg-border/60 my-2 mx-1" aria-hidden="true"></div>
          <div className="relative flex-[1.5]">
            <Search className="absolute start-4 top-3.5 h-5 w-5 text-primary/60" aria-hidden="true" />
            <label htmlFor="query-search" className="sr-only">{dict.search.queryPlaceholder}</label>
            <Input 
              id="query-search" 
              placeholder={dict.search.queryPlaceholder} 
              className="ps-12 h-12 border-0 bg-transparent shadow-none text-base focus-visible:ring-0 placeholder:text-muted-foreground/60" 
              value={queryValue}
              onChange={(e) => setQueryValue(e.target.value)}
              onFocus={() => setFocusedInput('query')}
              onBlur={() => setTimeout(() => setFocusedInput(null), 200)}
            />
          </div>
          <Button 
            size="lg" 
            className="h-12 px-10 text-base font-bold shadow-md md:w-auto rounded-2xl"
            onClick={handleSearch}
          >
            {dict.actions.findAccess}
          </Button>
        </div>

        <AnimatePresence>
          {focusedInput && (
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.98 }}
              className="absolute top-full left-0 right-0 mt-3 p-5 bg-background border-2 border-primary/10 shadow-2xl shadow-primary/5 rounded-[2rem] z-50 overflow-hidden backdrop-blur-xl"
            >
              {focusedInput === 'location' ? (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xs font-black uppercase tracking-widest text-primary/60">{dict.search.popularLocations || 'Popular Locations'}</h3>
                    <Locate className="h-4 w-4 text-primary animate-pulse" />
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                    {[
                      { en: 'Cairo', ar: 'القاهرة' },
                      { en: 'Giza', ar: 'الجيزة' },
                      { en: 'Alexandria', ar: 'الإسكندرية' },
                      { en: 'Mansoura', ar: 'المنصورة' },
                      { en: 'Tanta', ar: 'طنطا' },
                      { en: 'Hurghada', ar: 'الغردقة' },
                      { en: 'Luxor', ar: 'الأقصر' },
                      { en: 'Aswan', ar: 'أسوان' },
                      { en: 'Port Said', ar: 'بورسعيد' }
                    ].map((loc) => (
                      <button
                        key={loc.en}
                        className="flex items-center gap-3 p-3 rounded-2xl border border-border/50 hover:border-primary/30 hover:bg-primary/5 transition-all text-sm font-bold text-start group"
                        onClick={() => {
                          setLocationValue(locale === 'ar' ? loc.ar : loc.en);
                        }}
                      >
                        <MapPin className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
                        <span>{locale === 'ar' ? loc.ar : loc.en}</span>
                      </button>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xs font-black uppercase tracking-widest text-primary/60">{dict.search.popularSpecialties || 'Popular Specialties'}</h3>
                    <Stethoscope className="h-4 w-4 text-primary animate-pulse" />
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                    {(specialties.length > 5 ? specialties : [
                      { id: '1', name: 'General', nameAr: 'عام' },
                      { id: '2', name: 'Dentist', nameAr: 'أسنان' },
                      { id: '3', name: 'Orthopedic', nameAr: 'عظام' },
                      { id: '4', name: 'Pediatric', nameAr: 'أطفال' },
                      { id: '5', name: 'Cardiology', nameAr: 'قلب' },
                      { id: '6', name: 'Ophthalmology', nameAr: 'رمد' },
                      { id: '7', name: 'Neurology', nameAr: 'أعصاب' },
                      { id: '8', name: 'Dermatology', nameAr: 'جلدية' },
                      { id: '9', name: 'Psychiatry', nameAr: 'نفسي' },
                      { id: '10', name: 'Physical Therapy', nameAr: 'علاج طبيعي' }
                    ]).map((s) => (
                      <button
                        key={s.id}
                        className="flex items-center gap-3 p-3 rounded-2xl border border-border/50 hover:border-primary/30 hover:bg-primary/5 transition-all text-sm font-bold text-start group"
                        onClick={() => {
                          setQueryValue(locale === 'ar' ? s.nameAr : s.name);
                        }}
                      >
                        <Building2 className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
                        <span>{locale === 'ar' ? s.nameAr : s.name}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Prominent Filters */}
      <div className="flex flex-col gap-5">
        <h2 className="text-sm font-bold text-muted-foreground tracking-tight uppercase">{dict.search.filtersTitle}</h2>
        <div className="flex flex-wrap gap-4" role="group" aria-label="Accessibility filters">
          {popularFilters.map((filter) => {
            const Icon = iconMap[filter.icon] || Accessibility;
            const isActive = activeFilters[filter.id];
            return (
              <motion.button 
                key={filter.id}
                whileHover={{ scale: 1.03, y: -2 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => toggleFilter(filter.id)}
                className={`flex items-center gap-3 px-5 py-3 rounded-2xl border-2 transition-all text-sm font-bold group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ${
                  isActive 
                    ? 'border-primary/50 bg-primary/5 text-primary shadow-lg shadow-primary/10' 
                    : 'border-border bg-background hover:bg-muted/50 text-foreground/80 hover:text-foreground shadow-sm hover:shadow-md'
                }`} 
                aria-pressed={isActive}
              >
                <Icon className={`h-5 w-5 transition-all duration-300 ${isActive ? 'text-primary scale-110' : 'text-muted-foreground/80 group-hover:text-primary'}`} aria-hidden="true" /> 
                <span>{locale === 'ar' ? filter.labelAr || filter.label : filter.label}</span>
              </motion.button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
