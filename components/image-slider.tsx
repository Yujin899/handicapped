"use client";

import React, { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import { ChevronLeft, ChevronRight, Image as ImageIcon } from 'lucide-react';
import { Button } from './shared-ui';

interface ImageSliderProps {
  images?: string[];
  placeholderCount?: number;
}

export function ImageSlider({ images = [], placeholderCount = 5 }: ImageSliderProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);

  // If no images provided, use placeholders
  const displayItems = images.length > 0 ? images : Array.from({ length: placeholderCount }).map((_, i) => `placeholder-${i}`);
  const totalItems = displayItems.length;

  const scrollTo = (index: number) => {
    if (!scrollRef.current) return;
    const container = scrollRef.current;
    const isRTL = window.getComputedStyle(container).direction === 'rtl';
    const scrollAmount = isRTL ? -(index * container.clientWidth) : (index * container.clientWidth);
    container.scrollTo({
      left: scrollAmount,
      behavior: 'smooth'
    });
    setCurrentIndex(index);
  };

  const handleNext = () => {
    const nextIndex = (currentIndex + 1) % totalItems;
    scrollTo(nextIndex);
  };

  const handlePrev = () => {
    const prevIndex = (currentIndex - 1 + totalItems) % totalItems;
    scrollTo(prevIndex);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
      e.preventDefault();
      const container = scrollRef.current;
      const isRTL = container ? window.getComputedStyle(container).direction === 'rtl' : false;
      
      if (e.key === 'ArrowLeft') {
        if (isRTL) handleNext();
        else handlePrev();
      } else {
        if (isRTL) handlePrev();
        else handleNext();
      }
    }
  };

  // Update current index based on scroll position (for swipe support)
  useEffect(() => {
    const container = scrollRef.current;
    if (!container) return;

    const handleScroll = () => {
      // Use Math.abs because scrollLeft is negative in RTL layouts
      const scrollPosition = Math.abs(container.scrollLeft);
      const itemWidth = container.clientWidth;
      const newIndex = Math.round(scrollPosition / itemWidth);
      if (newIndex !== currentIndex) {
        setCurrentIndex(newIndex);
      }
    };

    container.addEventListener('scroll', handleScroll, { passive: true });
    return () => container.removeEventListener('scroll', handleScroll);
  }, [currentIndex]);

  return (
    <div 
      className="relative w-full group rounded-3xl overflow-hidden border-2 shadow-sm bg-muted/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary transition-shadow"
      tabIndex={0}
      onKeyDown={handleKeyDown}
    >
      {/* Scrollable Container */}
      <div 
        ref={scrollRef}
        className="flex overflow-x-auto touch-pan-x snap-x snap-mandatory hide-scrollbar aspect-[4/3] md:aspect-[21/9]"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {displayItems.map((item, index) => (
          <div 
            key={index} 
            className="w-full shrink-0 snap-center flex items-center justify-center relative"
          >
            {item.startsWith('placeholder') ? (
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-primary/[0.02]">
                <ImageIcon className="h-12 w-12 text-muted-foreground/20 mb-2" />
                <span className="text-sm font-bold text-muted-foreground/40 uppercase tracking-widest">
                  Image {index + 1}
                </span>
              </div>
            ) : (
              <Image 
                src={item} 
                alt={`Clinic image ${index + 1}`}
                fill
                className="object-cover"
              />
            )}
          </div>
        ))}
      </div>

      {/* Navigation Arrows (Desktop) */}
      <div className="absolute inset-y-0 left-0 right-0 flex items-center justify-between px-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none md:flex hidden">
        <Button 
          variant="outline" 
          size="icon" 
          className="h-10 w-10 rounded-full bg-background/80 backdrop-blur-sm border-transparent shadow-lg pointer-events-auto hover:scale-110 transition-transform"
          onClick={handlePrev}
          aria-label="Previous image"
        >
          <ChevronLeft className="h-5 w-5 rtl:rotate-180" />
        </Button>
        <Button 
          variant="outline" 
          size="icon" 
          className="h-10 w-10 rounded-full bg-background/80 backdrop-blur-sm border-transparent shadow-lg pointer-events-auto hover:scale-110 transition-transform"
          onClick={handleNext}
          aria-label="Next image"
        >
          <ChevronRight className="h-5 w-5 rtl:rotate-180" />
        </Button>
      </div>

      {/* Dot Indicators */}
      <div className="absolute bottom-4 left-0 right-0 flex justify-center">
        <div className="flex gap-2 bg-background/50 backdrop-blur-md px-3 py-2 rounded-full shadow-sm">
          {displayItems.map((_, index) => (
            <button
              key={index}
              onClick={() => scrollTo(index)}
              aria-label={`Go to slide ${index + 1}`}
              className={`transition-all duration-300 rounded-full ${
                index === currentIndex 
                  ? 'w-6 h-2 bg-foreground shadow-sm' 
                  : 'w-2 h-2 bg-foreground/30 hover:bg-foreground/50'
              }`}
            />
          ))}
        </div>
      </div>
      
      {/* Counter Badge (Mobile) */}
      <div className="absolute top-4 right-4 md:hidden bg-background/80 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold shadow-sm">
        {currentIndex + 1} / {totalItems}
      </div>
    </div>
  );
}
