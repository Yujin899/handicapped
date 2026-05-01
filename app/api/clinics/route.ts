import { NextRequest, NextResponse } from "next/server"

type ClinicApiItem = {
  id: string
  name: string
  imageSrc: string
  imageAlt: string
  rating: number
  reviews: number
  description: string
  location: string
  specialty: string
  accessibility: {
    wheelchair: boolean
    hearing: boolean
    quiet: boolean
  }
}

function getClinics(locale: string): ClinicApiItem[] {
  const isArabic = locale === "ar"

  return [
    {
      id: "oakwood-medical-center",
      name: isArabic ? "مركز أوكوود الطبي" : "Oakwood Medical Center",
      imageSrc:
        "https://images.unsplash.com/photo-1631815588090-d4bfec5b1ccb?auto=format&fit=crop&w=1200&q=80",
      imageAlt: isArabic
        ? "مدخل مركز أوكوود الطبي مع منحدر واضح للكراسي المتحركة"
        : "Main entrance of Oakwood Medical Center with a clear wheelchair ramp",
      rating: 4.9,
      reviews: 128,
      description: isArabic
        ? "عيادة شاملة مع مداخل بدون عوائق، فريق داعم، ومساحات انتظار هادئة."
        : "Inclusive clinic with step-free entry, supportive staff, and calm waiting spaces.",
      location: isArabic ? "حي الرعاية، 2.3 كم" : "Healthcare District, 2.3 km",
      specialty: isArabic ? "مستشفى عام" : "General Hospital",
      accessibility: { wheelchair: true, hearing: true, quiet: true },
    },
    {
      id: "serenity-dental-care",
      name: isArabic ? "عيادة سيرينيتي لطب الأسنان" : "Serenity Dental Care",
      imageSrc:
        "https://images.unsplash.com/photo-1629909613654-28e377c37b09?auto=format&fit=crop&w=1200&q=80",
      imageAlt: isArabic
        ? "غرفة علاج في عيادة سيرينيتي لطب الأسنان بإضاءة هادئة"
        : "Treatment room at Serenity Dental Care with calm lighting",
      rating: 4.8,
      reviews: 94,
      description: isArabic
        ? "خدمة أسنان مهيأة بإضاءة منخفضة ومسارات واسعة للوصول السلس."
        : "Accessible dental care with low-stimulation lighting and wide navigation paths.",
      location: isArabic ? "وسط المدينة، 3.1 كم" : "Downtown, 3.1 km",
      specialty: isArabic ? "طب الأسنان" : "Dentistry",
      accessibility: { wheelchair: true, hearing: false, quiet: true },
    },
    {
      id: "horizon-vision-clinic",
      name: isArabic ? "عيادة هورايزون للعيون" : "Horizon Vision Clinic",
      imageSrc:
        "https://images.unsplash.com/photo-1624727828489-a1e03b79bba8?auto=format&fit=crop&w=1200&q=80",
      imageAlt: isArabic
        ? "منطقة استقبال منظمة في عيادة هورايزون للعيون"
        : "Organized reception area at Horizon Vision Clinic",
      rating: 4.7,
      reviews: 76,
      description: isArabic
        ? "عيادة عيون مع إشارات واضحة وموظفين مدربين على احتياجات السمع."
        : "Vision clinic with clear wayfinding and hearing-assistance trained staff.",
      location: isArabic ? "النخيل، 4.6 كم" : "Palm Avenue, 4.6 km",
      specialty: isArabic ? "طب العيون" : "Optometry",
      accessibility: { wheelchair: true, hearing: true, quiet: false },
    },
    {
      id: "al-noor-family-clinic",
      name: isArabic ? "عيادة النور العائلية" : "Al Noor Family Clinic",
      imageSrc:
        "https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&w=1200&q=80",
      imageAlt: isArabic
        ? "قاعة انتظار واسعة في عيادة النور العائلية"
        : "Spacious waiting hall at Al Noor Family Clinic",
      rating: 4.6,
      reviews: 63,
      description: isArabic
        ? "رعاية أسرية مع غرف انتظار منفصلة لتقليل التحفيز الحسي."
        : "Family care with dedicated low-stimulation waiting areas.",
      location: isArabic ? "الروضة، 5.2 كم" : "Rawda, 5.2 km",
      specialty: isArabic ? "مستشفى عام" : "General Hospital",
      accessibility: { wheelchair: false, hearing: true, quiet: true },
    },
  ]
}

export async function GET(request: NextRequest) {
  const locale = request.nextUrl.searchParams.get("locale") ?? "en"
  return NextResponse.json({ clinics: getClinics(locale) })
}
