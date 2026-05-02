"use client";

import React from 'react';
import { Accessibility, CheckCircle, ChevronRight, Star, Search } from 'lucide-react';
import { motion } from 'framer-motion';
import type { Variants } from 'framer-motion';
import Link from 'next/link';
import { Badge, Button, ClinicCard } from './shared-ui';
import { SearchSection } from './search-section';
import { getClinics } from '@/lib/data';
import type { Clinic } from '@/lib/types';

export function HomeClient({ dict, locale }: { dict: any, locale: string }) {
  const [topClinics, setTopClinics] = React.useState<Clinic[]>([]);

  React.useEffect(() => {
    getClinics().then(allClinics => {
      const sorted = [...allClinics].sort((a, b) => (b.rating || 0) - (a.rating || 0));
      setTopClinics(sorted.slice(0, 3));
    });
  }, []);
  const fadeIn: Variants = {
    hidden: { opacity: 0, y: 10 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] as const }
    }
  };

  const staggerContainer: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08,
        delayChildren: 0.1
      }
    }
  };

  return (
    <main className="flex-1 overflow-hidden">
      {/* 2. Hero Section */}
      <section className="relative pt-12 pb-16 md:pt-20 md:pb-24 lg:pt-24 lg:pb-32 border-b bg-gradient-to-b from-primary/[0.03] to-background">
        <div className="container mx-auto max-w-7xl px-4 sm:px-6 relative z-10">
          <motion.div 
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
            className="max-w-4xl flex flex-col gap-8 md:gap-10"
          >
            <div className="space-y-6">
              <motion.div variants={fadeIn}>
                <Badge variant="secondary" className="px-3 py-1 text-xs font-bold tracking-wide uppercase bg-primary/10 text-primary border-primary/20">
                  {dict.hero.badge}
                </Badge>
              </motion.div>
              <motion.h1 
                variants={fadeIn}
                className="text-5xl font-extrabold tracking-tight sm:text-6xl md:text-7xl lg:text-8xl text-foreground leading-[1.05]"
              >
                {dict.hero.titlePart1} <span className="text-primary/90">{dict.hero.titleHighlight}</span>
              </motion.h1>
              <motion.p 
                variants={fadeIn}
                className="text-xl md:text-2xl text-muted-foreground max-w-2xl leading-relaxed"
              >
                {dict.hero.subtitle}
              </motion.p>
            </div>
            
            <motion.div variants={fadeIn}>
              <SearchSection dict={dict} locale={locale} />
            </motion.div>
          </motion.div>
        </div>
        
        {/* Subtle Decorative Elements */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="absolute -top-24 -right-24 w-96 h-96 bg-primary/5 rounded-full blur-3xl -z-10" 
        />
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease: "easeOut", delay: 0.1 }}
          className="absolute top-1/2 -left-24 w-72 h-72 bg-primary/3 rounded-full blur-3xl -z-10" 
        />
      </section>

      {/* 3. Featured Clinics Section */}
      <section className="bg-muted/10 py-16 md:py-24 lg:py-32">
        <div className="container mx-auto max-w-7xl px-4 sm:px-6">
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainer}
            className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16"
          >
            <div className="space-y-4">
              <motion.h2 variants={fadeIn} className="text-4xl md:text-5xl font-extrabold tracking-tight text-foreground leading-[1.1]">
                {dict.clinics.titlePart1} <br className="md:hidden" /> {dict.clinics.titlePart2}
              </motion.h2>
              <motion.p variants={fadeIn} className="text-muted-foreground text-xl max-w-xl leading-relaxed">
                {dict.clinics.subtitle}
              </motion.p>
            </div>
            <motion.div variants={fadeIn}>
              <Button asChild variant="outline" className="hidden md:flex items-center gap-2 font-bold h-12 border-2 px-6 rounded-xl hover:bg-primary hover:text-primary-foreground hover:border-primary transition-all whitespace-nowrap shrink-0">
                <Link href={`/${locale}/clinics`} className="flex items-center gap-2">
                  {dict.actions.exploreAll} <ChevronRight className="h-4 w-4 rtl:rotate-180 shrink-0" />
                </Link>
              </Button>
            </motion.div>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 lg:gap-10">
            {topClinics.length > 0 ? (
              topClinics.map((clinic) => {
                // Map real clinic data to ClinicCard expectations
                const mappedClinic = {
                  id: clinic.id,
                  name: locale === 'ar' ? clinic.nameAr || clinic.name : clinic.name,
                  rating: (clinic.rating || 0).toFixed(1),
                  type: locale === 'ar' ? clinic.specialtyAr || clinic.specialty || "رعاية صحية" : clinic.specialty || "Healthcare",
                  imageSrc: clinic.imageSrc,
                  badges: Object.entries(clinic.accessibility || {})
                    .filter(([, value]) => value === true)
                    .map(([key]) => {
                      if (key === 'wheelchair') return locale === 'ar' ? 'وصول الكراسي' : 'Wheelchair';
                      if (key === 'hearing') return locale === 'ar' ? 'دعم السمع' : 'Hearing';
                      if (key === 'quiet') return locale === 'ar' ? 'بيئة هادئة' : 'Quiet';
                      if (key === 'visual') return locale === 'ar' ? 'مساعدة بصرية' : 'Visual';
                      return key;
                    })
                };
                return (
                  <ClinicCard key={clinic.id} clinic={mappedClinic} dict={dict} locale={locale} />
                );
              })
            ) : (
              [1, 2, 3].map((i) => (
                <div key={i} className="h-[400px] rounded-[32px] bg-muted/20 animate-pulse" />
              ))
            )}
          </div>
          <motion.div 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="md:hidden mt-12"
          >
            <Button asChild variant="outline" className="w-full h-14 font-black border-2 rounded-2xl">
              <Link href={`/${locale}/clinics`}>
                {dict.actions.viewAll}
              </Link>
            </Button>
          </motion.div>
        </div>
      </section>

      {/* 4. How It Works */}
      <section className="container mx-auto max-w-7xl px-4 sm:px-6 py-16 md:py-24 lg:py-32">
        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={staggerContainer}
          className="text-center max-w-3xl mx-auto mb-24 space-y-6"
        >
          <motion.h2 variants={fadeIn} className="text-4xl md:text-6xl font-extrabold tracking-tight leading-[1.1]">{dict.howItWorks.title}</motion.h2>
          <motion.p variants={fadeIn} className="text-muted-foreground text-xl leading-relaxed">{dict.howItWorks.subtitle}</motion.p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-12 lg:gap-20 max-w-6xl mx-auto relative">
          {[
            { id: 1, icon: Search, title: dict.howItWorks.step1Title, desc: dict.howItWorks.step1Desc, rotate: "rotate-3", iconRotate: "-rotate-3" },
            { id: 2, icon: Accessibility, title: dict.howItWorks.step2Title, desc: dict.howItWorks.step2Desc, rotate: "-rotate-6", iconRotate: "rotate-6" },
            { id: 3, icon: CheckCircle, title: dict.howItWorks.step3Title, desc: dict.howItWorks.step3Desc, rotate: "rotate-12", iconRotate: "-rotate-12", primary: true },
          ].map((step) => {
            const Icon = step.icon;
            return (
              <motion.div 
                key={step.id}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: step.id * 0.08 }}
                className="flex flex-col items-center text-center gap-8 group"
              >
                <div className={`h-20 w-20 rounded-[28px] ${step.primary ? 'bg-primary text-primary-foreground shadow-2xl shadow-primary/30' : 'bg-primary/10 text-primary shadow-inner'} flex items-center justify-center ${step.rotate} rtl:rotate-0 transition-transform group-hover:rotate-0 duration-500`}>
                  <Icon className={`h-10 w-10 ${step.iconRotate} rtl:rotate-0 transition-transform group-hover:rotate-0 duration-500`} />
                </div>
                <div className="space-y-4">
                  <h3 className="text-2xl font-black">{step.title}</h3>
                  <p className="text-muted-foreground text-lg leading-relaxed">{step.desc}</p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* 5. Reliability Section */}
      <section className="container mx-auto max-w-7xl px-4 sm:px-6 py-16 md:py-24 lg:py-32">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center relative z-10">
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainer}
            className="space-y-12"
          >
            <div className="space-y-6">
              <motion.h2 variants={fadeIn} className="text-4xl md:text-6xl lg:text-7xl font-extrabold tracking-tight leading-[1.1]">
                {dict.reliability.title} <br /> <span className="text-primary">{dict.reliability.titleHighlight}</span>
              </motion.h2>
              <motion.p variants={fadeIn} className="text-xl md:text-2xl text-muted-foreground leading-relaxed max-w-xl font-medium">
                {dict.reliability.subtitle}
              </motion.p>
            </div>
            
            <div className="space-y-8">
              {[
                dict.reliability.point1,
                dict.reliability.point2,
                dict.reliability.point3
              ].map((text) => (
                <motion.div key={text} variants={fadeIn} className="flex items-center gap-6 group">
                  <div className="h-12 w-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary shrink-0 group-hover:scale-110 transition-transform border-2 border-primary/10 shadow-sm group-hover:bg-primary group-hover:text-primary-foreground duration-300">
                    <CheckCircle className="h-6 w-6" />
                  </div>
                  <span className="text-xl md:text-2xl font-bold tracking-tight text-foreground/80 group-hover:text-foreground transition-colors">{text}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="relative hidden lg:block"
          >
            <div className="bg-background rounded-[40px] border-2 border-primary/10 p-12 space-y-8 shadow-2xl">
              <div className="flex items-center gap-6 pb-8 border-b">
                <div className="h-16 w-16 rounded-full bg-muted/60 animate-pulse" />
                <div className="space-y-3">
                  <div className="h-5 w-32 bg-muted/60 rounded-full animate-pulse" />
                  <div className="h-4 w-20 bg-muted/30 rounded-full animate-pulse" />
                </div>
              </div>
              <div className="space-y-4">
                <div className="h-4 w-full bg-muted/30 rounded-full animate-pulse" />
                <div className="h-4 w-5/6 bg-muted/30 rounded-full animate-pulse" />
                <div className="h-4 w-4/6 bg-muted/30 rounded-full animate-pulse" />
              </div>
              <div className="flex gap-3 pt-6">
                <div className="h-10 w-32 bg-primary/10 rounded-2xl border border-primary/20" />
                <div className="h-10 w-32 bg-muted/20 rounded-2xl border border-border" />
              </div>
            </div>
            <motion.div 
              animate={{ 
                y: [0, -15, 0],
                rotate: [12, 8, 12]
              }}
              transition={{ 
                duration: 4, 
                repeat: Infinity, 
                ease: "easeInOut" 
              }}
              className="absolute -top-10 -start-10 h-20 w-20 bg-primary rounded-3xl flex items-center justify-center shadow-2xl shadow-primary/20"
            >
              <Star className="h-10 w-10 text-primary-foreground fill-current" />
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* 6. High-Contrast CTA */}
      <section className="container mx-auto max-w-7xl px-4 sm:px-6 pb-16 md:pb-24 lg:pb-32">
        <motion.div 
          initial={{ opacity: 0, scale: 0.98 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] as const }}
          className="bg-primary text-primary-foreground rounded-[32px] md:rounded-[48px] lg:rounded-[64px] py-16 md:py-24 lg:py-32 px-6 md:px-12 text-center shadow-3xl shadow-primary/20 relative overflow-hidden group"
        >
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,hsl(var(--primary-foreground)_/_0.15),transparent)]" />
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="max-w-4xl mx-auto flex flex-col items-center gap-12 relative z-10"
          >
            <motion.h2 variants={fadeIn} className="text-5xl md:text-7xl font-black tracking-tight leading-[1.05]">{dict.cta.title} <br className="hidden md:block" /> {dict.cta.titleBreak}</motion.h2>
            <motion.p variants={fadeIn} className="text-primary-foreground/90 text-2xl md:text-3xl font-bold max-w-3xl leading-relaxed">
              {dict.cta.subtitle}
            </motion.p>
            <motion.div variants={fadeIn}>
              <Button asChild size="lg" variant="secondary" className="h-16 px-16 text-xl font-black shadow-2xl hover:scale-105 transition-transform rounded-[24px]">
                <Link href={`/${locale}/clinics`}>
                  {dict.actions.startSearch}
                </Link>
              </Button>
            </motion.div>
          </motion.div>
        </motion.div>
      </section>
    </main>
  );
}
