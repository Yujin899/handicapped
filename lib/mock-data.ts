import type { Clinic } from "./types"

export const mockClinics: Clinic[] = [
  {
    id: "oakwood-general",
    name: "Oakwood General Hospital",
    nameAr: "مستشفى أوكوود العام",
    specialty: "General Hospital",
    specialtyAr: "مستشفى عام",
    location: "Nasr City, Cairo",
    locationAr: "مدينة نصر، القاهرة",
    rating: 4.9,
    reviews: 128,
    imageSrc: "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&q=80&w=800",
    images: [
      "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1516549655169-df83a0774514?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1512678080530-7760d81faba6?auto=format&fit=crop&q=80&w=800"
    ],
    description: "Oakwood General provides comprehensive healthcare services with state-of-the-art accessibility features for all patients.",
    descriptionAr: "يوفر مستشفى أوكوود العام خدمات رعاية صحية شاملة مع ميزات وصول متطورة لجميع المرضى.",
    accessibility: { wheelchair: true, hearing: true, quiet: false, visual: true }
  },
  {
    id: "serenity-dentistry",
    name: "Serenity Dentistry",
    nameAr: "سيرينيتي لطب الأسنان",
    specialty: "Dentistry",
    specialtyAr: "طب الأسنان",
    location: "Maadi, Cairo",
    locationAr: "المعادي، القاهرة",
    rating: 4.8,
    reviews: 85,
    imageSrc: "https://images.unsplash.com/photo-1606811841689-23dfddce3e95?auto=format&fit=crop&q=80&w=800",
    images: [
      "https://images.unsplash.com/photo-1606811841689-23dfddce3e95?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1629909608135-ca2b70f4bb18?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1598256989800-fe5f95da9787?auto=format&fit=crop&q=80&w=800"
    ],
    description: "A peaceful dental experience designed for comfort. We specialize in accessible dental care for children and adults.",
    descriptionAr: "تجربة أسنان هادئة مصممة للراحة. نحن متخصصون في رعاية الأسنان الميسرة للأطفال والكبار.",
    accessibility: { wheelchair: true, hearing: false, quiet: true, visual: false }
  },
  {
    id: "horizon-optometry",
    name: "Horizon Optometry",
    nameAr: "هورايزون لفحص النظر",
    specialty: "Optometry",
    specialtyAr: "فحص النظر",
    location: "Zamalek, Cairo",
    locationAr: "الزمالك، القاهرة",
    rating: 4.7,
    reviews: 64,
    imageSrc: "https://images.unsplash.com/photo-1581595220892-b0739db3ba8c?auto=format&fit=crop&q=80&w=800",
    images: [
      "https://images.unsplash.com/photo-1581595220892-b0739db3ba8c?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&q=80&w=800"
    ],
    description: "Expert eye care with advanced diagnostic tools. Fully accessible facility with support for service animals.",
    descriptionAr: "رعاية عيون خبيرة مع أدوات تشخيص متقدمة. مرفق ميسر بالكامل مع دعم لحيوانات الخدمة.",
    accessibility: { wheelchair: true, hearing: true, quiet: true, visual: true }
  },
  {
    id: "nile-pediatrics",
    name: "Nile Pediatrics",
    nameAr: "النيل لطب الأطفال",
    specialty: "Pediatrics",
    specialtyAr: "طب الأطفال",
    location: "Dokki, Giza",
    locationAr: "الدقي، الجيزة",
    rating: 4.9,
    reviews: 210,
    imageSrc: "https://images.unsplash.com/photo-1537368910025-700350fe46c7?auto=format&fit=crop&q=80&w=800",
    images: [
      "https://images.unsplash.com/photo-1537368910025-700350fe46c7?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1631217816660-ad820d2b6173?auto=format&fit=crop&q=80&w=800"
    ],
    description: "Caring for the next generation. Our clinic is child-friendly and fully accessible for parents with disabilities.",
    descriptionAr: "رعاية الجيل القادم. عيادتنا صديقة للأطفال وميسرة بالكامل للآباء ذوي الإعاقة.",
    accessibility: { wheelchair: true, hearing: true, quiet: false, visual: false }
  },
  {
    id: "alex-physio",
    name: "Alexandria Physiotherapy",
    nameAr: "الإسكندرية للعلاج الطبيعي",
    specialty: "Physiotherapy",
    specialtyAr: "العلاج الطبيعي",
    location: "Smouha, Alexandria",
    locationAr: "سموحة، الإسكندرية",
    rating: 4.8,
    reviews: 145,
    imageSrc: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&q=80&w=800",
    images: [
      "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1597452485669-2c7bb5fef90d?auto=format&fit=crop&q=80&w=800"
    ],
    description: "Recovery and rehabilitation in a supportive environment. Specialized equipment for mobility-impaired patients.",
    descriptionAr: "التعافي وإعادة التأهيل في بيئة داعمة. معدات متخصصة للمرضى الذين يعانون من ضعف الحركة.",
    accessibility: { wheelchair: true, hearing: false, quiet: true, visual: true }
  },
  {
    id: "pyramid-cardio",
    name: "Pyramid Cardiology",
    nameAr: "بيراميد لطب القلب",
    specialty: "Cardiology",
    specialtyAr: "طب القلب",
    location: "Haram, Giza",
    locationAr: "الهرم، الجيزة",
    rating: 4.7,
    reviews: 92,
    imageSrc: "https://images.unsplash.com/photo-1628177142898-93e36e4e3a50?auto=format&fit=crop&q=80&w=800",
    images: [
      "https://images.unsplash.com/photo-1628177142898-93e36e4e3a50?auto=format&fit=crop&q=80&w=800"
    ],
    description: "Your heart health is our priority. Accessible diagnostic testing and consultation rooms.",
    descriptionAr: "صحة قلبك هي أولويتنا. غرف استشارة واختبارات تشخيصية ميسرة.",
    accessibility: { wheelchair: true, hearing: true, quiet: true, visual: false }
  },
  {
    id: "sunny-rehab",
    name: "Sunny Rehabilitation Center",
    nameAr: "مركز صني للتأهيل",
    specialty: "Rehabilitation",
    specialtyAr: "التأهيل",
    location: "Heliopolis, Cairo",
    locationAr: "مصر الجديدة، القاهرة",
    rating: 4.6,
    reviews: 78,
    imageSrc: "https://images.unsplash.com/photo-1513224502586-d1e602410265?auto=format&fit=crop&q=80&w=800",
    images: [
      "https://images.unsplash.com/photo-1513224502586-d1e602410265?auto=format&fit=crop&q=80&w=800"
    ],
    description: "Helping you regain independence. Our center is a model for accessible infrastructure in Egypt.",
    descriptionAr: "مساعدتك على استعادة الاستقلال. مركزنا هو نموذج للبنية التحتية الميسرة في مصر.",
    accessibility: { wheelchair: true, hearing: true, quiet: true, visual: true }
  },
  {
    id: "elite-ortho",
    name: "Elite Orthopedics",
    nameAr: "إيليت لجراحة العظام",
    specialty: "Orthopedics",
    specialtyAr: "جراحة العظام",
    location: "Sheikh Zayed, Giza",
    locationAr: "الشيخ زايد، الجيزة",
    rating: 4.8,
    reviews: 156,
    imageSrc: "https://images.unsplash.com/photo-1559757175-5700dde675bc?auto=format&fit=crop&q=80&w=800",
    images: [
      "https://images.unsplash.com/photo-1559757175-5700dde675bc?auto=format&fit=crop&q=80&w=800"
    ],
    description: "Advanced bone and joint care. Featuring tactile paths and clear signage for all patients.",
    descriptionAr: "رعاية متقدمة للعظام والمفاصل. تتميز بمسارات لمسية ولافتات واضحة لجميع المرضى.",
    accessibility: { wheelchair: true, hearing: false, quiet: false, visual: true }
  },
  {
    id: "wellness-mental-health",
    name: "Wellness Mental Health",
    nameAr: "ويلنس للصحة النفسية",
    specialty: "Mental Health",
    specialtyAr: "الصحة النفسية",
    location: "New Cairo, Cairo",
    locationAr: "القاهرة الجديدة، القاهرة",
    rating: 4.9,
    reviews: 134,
    imageSrc: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?auto=format&fit=crop&q=80&w=800",
    images: [
      "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?auto=format&fit=crop&q=80&w=800"
    ],
    description: "Supportive and inclusive mental healthcare. We offer sensory-friendly spaces and quiet rooms.",
    descriptionAr: "رعاية صحية نفسية داعمة وشاملة. نحن نقدم مساحات صديقة للحواس وغرف هادئة.",
    accessibility: { wheelchair: true, hearing: true, quiet: true, visual: false }
  },
  {
    id: "st-luke-clinic",
    name: "St. Luke Multi-Specialty Clinic",
    nameAr: "عيادة سانت لوك متعددة التخصصات",
    specialty: "Multi-Specialty",
    specialtyAr: "متعدد التخصصات",
    location: "Shubra, Cairo",
    locationAr: "شبرا، القاهرة",
    rating: 4.5,
    reviews: 112,
    imageSrc: "https://images.unsplash.com/photo-1516549655169-df83a0774514?auto=format&fit=crop&q=80&w=800",
    images: [
      "https://images.unsplash.com/photo-1516549655169-df83a0774514?auto=format&fit=crop&q=80&w=800"
    ],
    description: "A community-focused clinic offering a wide range of services with full accessibility support.",
    descriptionAr: "عيادة تركز على المجتمع تقدم مجموعة واسعة من الخدمات مع دعم كامل لإمكانية الوصول.",
    accessibility: { wheelchair: true, hearing: true, quiet: false, visual: true }
  }
]
