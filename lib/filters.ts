import { collection, getDocs, doc, setDoc, deleteDoc, query, where } from "firebase/firestore"
import { db } from "./firebase"

export type Filter = {
  id: string
  label: string
  labelAr?: string
  icon: string
  isPopular: boolean
}

export async function getFilters() {
  const snapshot = await getDocs(collection(db, "filters"))
  const firebaseFilters = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Filter))
  return firebaseFilters
}

export async function getPopularFilters() {
  const q = query(collection(db, "filters"), where("isPopular", "==", true))
  const snapshot = await getDocs(q)
  const firebasePopular = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Filter))
  return firebasePopular
}

export async function saveFilter(filter: Filter) {
  await setDoc(doc(db, "filters", filter.id), filter)
}

export async function deleteFilter(id: string) {
  await deleteDoc(doc(db, "filters", id))
}

const defaultTranslations: Record<string, { en: string, ar: string }> = {
  wheelchair: { en: "Wheelchair Access", ar: "وصول الكراسي المتحركة" },
  hearing: { en: "Hearing Support", ar: "دعم السمع" },
  quiet: { en: "Quiet Environment", ar: "بيئة هادئة" },
  visual: { en: "Visual Assistance", ar: "مساعدة بصرية" },
  homeVisit: { en: "Home Visit", ar: "زيارة منزلية" },
}

export function getFilterLabel(id: string, locale: string, filter?: Filter) {
  const isArabic = locale === 'ar'
  
  // 1. Try from database object
  if (filter) {
    const label = isArabic ? filter.labelAr || filter.label : filter.label
    if (label) return label
  }

  // 2. Try from fallbacks
  const fallback = defaultTranslations[id]
  if (fallback) {
    return isArabic ? fallback.ar : fallback.en
  }

  // 3. Last resort: format the key
  return id.charAt(0).toUpperCase() + id.slice(1).replace(/([A-Z])/g, ' $1')
}
