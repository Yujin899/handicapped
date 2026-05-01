"use client";

import React, { memo } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Activity, Star } from 'lucide-react';
import { motion } from 'framer-motion';

export const Wheelchair = memo((props: React.SVGProps<SVGSVGElement>) => (
  <svg
    {...props}
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <circle cx="8" cy="16" r="5" />
    <circle cx="19" cy="19" r="1" />
    <path d="M2.5 10 1.8 1.1l1.5 3" />
    <path d="M15 15.5v-1.5a4 4 0 0 0-4-4h-2" />
    <path d="M11 5.5a2 2 0 1 1-4 0 2 2 0 0 1 4 0" />
  </svg>
));
export const GoogleIcon = memo((props: React.SVGProps<SVGSVGElement>) => (
  <svg
    {...props}
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
      fill="#4285F4"
    />
    <path
      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
      fill="#34A853"
    />
    <path
      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"
      fill="#FBBC05"
    />
    <path
      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
      fill="#EA4335"
    />
  </svg>
));
GoogleIcon.displayName = "GoogleIcon";

export const Button = React.forwardRef<HTMLButtonElement, React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: 'default' | 'outline' | 'ghost' | 'secondary', size?: 'default' | 'sm' | 'lg' | 'xl' | '2xl' | 'icon' }>(({ className, variant = 'default', size = 'default', ...props }, ref) => {
  const baseStyles = "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 active:scale-[0.98]";
  const variants = {
    default: "bg-primary text-primary-foreground hover:bg-primary/90 hover:shadow-lg hover:shadow-primary/20",
    outline: "border-2 border-input bg-background hover:bg-accent hover:text-accent-foreground hover:border-accent",
    ghost: "hover:bg-accent hover:text-accent-foreground",
    secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
  };
  const sizes = {
    default: "h-10 px-4 py-2",
    sm: "h-9 rounded-md px-3",
    lg: "h-11 rounded-md px-8",
    xl: "h-12 rounded-xl px-10 text-base gap-3",
    "2xl": "h-14 rounded-2xl px-12 text-lg gap-4",
    icon: "h-10 w-10",
  };
  
  return (
    <motion.button
      ref={ref as any}
      whileHover={{ scale: 1.01 }}
      whileTap={{ scale: 0.98 }}
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className || ''}`}
      {...props as any}
    />
  );
});
Button.displayName = "Button";

export const Input = React.forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(({ className, type, ...props }, ref) => {
  return (
    <input
      type={type}
      className={`flex h-10 w-full rounded-md border-2 border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 transition-all focus:border-primary/50 ${className || ''}`}
      ref={ref}
      {...props}
    />
  )
});
Input.displayName = "Input";

export const Card = memo(({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={`rounded-xl border bg-card text-card-foreground shadow-sm ${className || ''}`} {...props} />
));
Card.displayName = "Card";

export const CardHeader = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={`flex flex-col space-y-1.5 p-6 ${className || ''}`} {...props} />
);
export const CardTitle = ({ className, ...props }: React.HTMLAttributes<HTMLHeadingElement>) => (
  <h3 className={`text-2xl font-semibold leading-none tracking-tight ${className || ''}`} {...props} />
);
export const CardContent = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={`p-6 pt-0 ${className || ''}`} {...props} />
);
export const CardFooter = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={`flex items-center p-6 pt-0 ${className || ''}`} {...props} />
);

export const Badge = memo(({ className, variant = 'default', ...props }: React.HTMLAttributes<HTMLDivElement> & { variant?: 'default' | 'secondary' | 'outline' }) => {
  const baseStyles = "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2";
  const variants = {
    default: "border-transparent bg-primary text-primary-foreground hover:bg-primary/80",
    secondary: "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80",
    outline: "text-foreground",
  };
  return <div className={`${baseStyles} ${variants[variant]} ${className || ''}`} {...props} />
});
Badge.displayName = "Badge";

export const ClinicCard = memo(({ clinic, dict, locale }: { clinic: { id: string, name: string, rating: string, type: string, badges: string[], imageSrc?: string }, dict: any, locale: string }) => (
  <Link href={`/${locale}/clinics/${clinic.id}`} className="block h-full">
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      whileHover={{ y: -8, transition: { duration: 0.3, ease: "easeOut" } }}
      className="flex flex-col h-full hover:shadow-2xl hover:shadow-primary/10 transition-all duration-300 ease-out border-2 border-transparent hover:border-primary/10 overflow-hidden group bg-background rounded-[32px] cursor-pointer"
    >
      <div className="aspect-[16/10] bg-muted relative overflow-hidden">
        <div className="absolute inset-0 flex items-center justify-center bg-primary/[0.02] group-hover:scale-110 transition-transform duration-700 ease-out">
          {clinic.imageSrc ? (
            <Image 
              src={clinic.imageSrc} 
              alt={clinic.name} 
              fill 
              className="object-cover"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          ) : (
            <Activity className="h-16 w-16 text-primary/5" />
          )}
        </div>
        <div className="absolute top-4 left-4 flex flex-col gap-2">
          {parseFloat(clinic.rating) >= 4.9 && (
            <div className="bg-primary text-primary-foreground px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider shadow-lg shadow-primary/20 backdrop-blur-md">
              {locale === 'ar' ? "الأكثر ملاءمة" : "Most Suitable"}
            </div>
          )}
          {clinic.badges.some(b => b.toLowerCase().includes('wheelchair') || b.includes('كرسي')) && (
            <div className="bg-white/90 text-foreground px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider shadow-lg backdrop-blur-md border border-border/50">
              {locale === 'ar' ? "صديق للكراسي" : "Wheelchair Friendly"}
            </div>
          )}
        </div>
      </div>
      <CardHeader className="pb-4 pt-8 px-8">
        <div className="flex justify-between items-start gap-4">
          <div className="space-y-2">
            <span className="text-[10px] font-black text-primary uppercase tracking-[0.2em]">{clinic.type}</span>
            <CardTitle className="text-2xl font-bold group-hover:text-primary transition-colors leading-tight">{clinic.name}</CardTitle>
          </div>
          <motion.div 
            whileHover={{ scale: 1.1, rotate: 5 }}
            className="flex items-center gap-1.5 bg-secondary/80 text-secondary-foreground px-3 py-1.5 rounded-xl text-sm font-black border border-secondary shadow-sm"
          >
            <Star className="h-3.5 w-3.5 fill-current text-primary" />
            {clinic.rating}
          </motion.div>
        </div>
      </CardHeader>
      <CardContent className="flex-1 pb-8 px-8">
        <div className="flex flex-wrap gap-2.5 mb-6">
          {clinic.badges.map((b) => (
            <Badge key={b} variant="secondary" className="bg-primary/5 text-primary border-primary/10 text-[11px] font-black py-1 px-2.5 rounded-lg group-hover:bg-primary/10 transition-colors">
              {b}
            </Badge>
          ))}
        </div>
        <p className="text-muted-foreground text-base leading-relaxed">
          {dict.clinics.communityVerified}
        </p>
      </CardContent>
      <CardFooter className="pt-0 px-8 pb-8">
        <Button variant="outline" className="w-full border-2 font-black group-hover:bg-primary group-hover:text-primary-foreground group-hover:border-primary transition-all duration-300 ease-out h-12 rounded-2xl text-base shadow-sm">
          {dict.actions.viewDetails}
        </Button>
      </CardFooter>
    </motion.div>
  </Link>
));
ClinicCard.displayName = "ClinicCard";

