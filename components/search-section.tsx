"use client";

import React from 'react';
import { 
  Ear, VolumeX, Accessibility, Eye, Wind, Heart, User, Shield, Info,
  Brain, Baby, Dog, Clock, MessageCircle, Smile, Hand, Phone, Stethoscope, 
  Navigation, Map, Locate, Zap, Sun, Moon, Cloud, Bell, Camera, Mic, Search
} from 'lucide-react';
import { motion } from 'framer-motion';
import { Button, Wheelchair, Input } from './shared-ui';
import { getPopularFilters, type Filter } from '@/lib/filters';
import { LocationCombobox } from './location-combobox';
import { SpecialtyCombobox } from './specialty-combobox';

export const iconMap: Record<string, React.ElementType> = {
  Wheelchair, Ear, VolumeX, Accessibility, Eye, Wind, Heart, User, Shield, Info,
  Brain, Baby, Dog, Clock, MessageCircle, Smile, Hand, Phone, Stethoscope,
  Navigation, Map, Locate, Zap, Sun, Moon, Cloud, Bell, Camera, Mic
};

export function SearchSection({ dict, locale }: { dict: any; locale: string }) {
  const [activeFilters, setActiveFilters] = React.useState<Record<string, boolean>>({});
  const [popularFilters, setPopularFilters] = React.useState<Filter[]>([]);
  const [locationValue, setLocationValue] = React.useState('');
  const [specialtyValue, setSpecialtyValue] = React.useState('');
  const [nameValue, setNameValue] = React.useState('');

  React.useEffect(() => {
    getPopularFilters().then(setPopularFilters);
  }, []);

  const toggleFilter = (filter: string) => {
    setActiveFilters(prev => ({ ...prev, [filter]: !prev[filter] }));
  };

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (locationValue) params.set('location', locationValue);
    if (specialtyValue) params.set('query', specialtyValue);
    if (nameValue) params.set('name', nameValue);
    
    const activeFilterIds = Object.keys(activeFilters).filter(id => activeFilters[id]);
    if (activeFilterIds.length > 0) {
      params.set('filters', activeFilterIds.join(','));
    }

    const queryString = params.toString();
    const target = `/${locale}/clinics${queryString ? `?${queryString}` : ''}`;
    window.location.href = target;
  };

  return (
    <div className="flex flex-col gap-10">
      {/* Primary Search Bar */}
      <div className="relative max-w-4xl">
        <div className="bg-background border-2 border-primary/10 shadow-2xl shadow-primary/5 rounded-3xl p-2 md:p-3 flex flex-col md:flex-row gap-2 transition-all hover:border-primary/20 focus-within:border-primary/30 focus-within:shadow-primary/10" 
          role="search" 
          aria-label="Search for accessible clinics"
        >
          <div className="relative flex-[1]">
            <LocationCombobox 
              value={locationValue}
              onChange={setLocationValue}
              placeholder={dict.search.locationPlaceholder}
              locale={locale}
            />
          </div>
          <div className="hidden md:block w-px bg-border/60 my-2" aria-hidden="true"></div>
          <div className="relative flex-[1]">
            <SpecialtyCombobox
              value={specialtyValue}
              onChange={setSpecialtyValue}
              placeholder={dict.search.queryPlaceholder.split('...')[0]}
              locale={locale}
            />
          </div>
          <div className="hidden md:block w-px bg-border/60 my-2" aria-hidden="true"></div>
          <div className="relative flex-[1.2]">
            <Search className="absolute start-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input 
              value={nameValue}
              onChange={(e) => setNameValue(e.target.value)}
              placeholder={locale === 'ar' ? 'اسم العيادة...' : 'Clinic Name...'}
              className="h-11 border-0 bg-transparent ps-10 text-sm font-normal shadow-none focus-visible:ring-0"
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
