import type { Filter } from "./filters"

export const mockFilters: Filter[] = [
  {
    id: "wheelchair",
    label: "Wheelchair Access",
    labelAr: "وصول الكراسي المتحركة",
    icon: "Wheelchair",
    isPopular: true
  },
  {
    id: "hearing",
    label: "Hearing Support",
    labelAr: "دعم السمع",
    icon: "Ear",
    isPopular: true
  },
  {
    id: "quiet",
    label: "Quiet Environment",
    labelAr: "بيئة هادئة",
    icon: "VolumeX",
    isPopular: true
  },
  {
    id: "visual",
    label: "Visual Assistance",
    labelAr: "مساعدة بصرية",
    icon: "Eye",
    isPopular: false
  },
  {
    id: "homeVisit",
    label: "Home Visit",
    labelAr: "زيارة منزلية",
    icon: "Home",
    isPopular: true
  }
]
