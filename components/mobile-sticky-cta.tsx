"use client";

import React, { useState, useEffect } from 'react';
import { Bookmark } from 'lucide-react';
import { Button } from './shared-ui';

export function MobileStickyCTA({ dict }: { dict: any }) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // Show CTA after scrolling down 200px
      if (window.scrollY > 200) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    
    // Initial check
    handleScroll();
    
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div 
      className={`md:hidden fixed bottom-0 left-0 right-0 p-4 bg-background/90 backdrop-blur-xl border-t border-border/50 z-40 transform-gpu shadow-lg transition-transform duration-300 ease-out ${
        isVisible ? 'translate-y-0' : 'translate-y-[150%]'
      }`}
    >
      <div className="flex gap-3">
        <Button variant="outline" size="icon" className="h-14 w-14 rounded-2xl shrink-0 border-2 shadow-sm bg-background" aria-label={dict.clinicDetails.save}>
          <Bookmark className="h-6 w-6" />
        </Button>
        <Button size="lg" className="flex-1 h-14 rounded-2xl text-lg font-black shadow-lg">
          {dict.clinicDetails.bookAppointment}
        </Button>
      </div>
    </div>
  );
}
