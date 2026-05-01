import { collection, getDocs, doc, setDoc, deleteDoc, query, where } from "firebase/firestore"
import { db } from "./firebase"
import { mockFilters } from "./mock-filters"

export type Filter = {
  id: string
  label: string
  labelAr?: string
  icon: string
  isPopular: boolean
}

export async function getFilters() {
  try {
    const snapshot = await getDocs(collection(db, "filters"))
    const firebaseFilters = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Filter))
    
    // Combine, prioritizing firebase ones but ensuring mock IDs exist
    const combined = [...firebaseFilters]
    for (const mock of mockFilters) {
      if (!combined.find(f => f.id === mock.id)) {
        combined.push(mock)
      }
    }
    return combined
  } catch {
    return mockFilters
  }
}

export async function getPopularFilters() {
  try {
    const q = query(collection(db, "filters"), where("isPopular", "==", true))
    const snapshot = await getDocs(q)
    const firebasePopular = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Filter))
    
    if (firebasePopular.length === 0) return mockFilters.filter(f => f.isPopular)
    return firebasePopular
  } catch {
    return mockFilters.filter(f => f.isPopular)
  }
}

export async function saveFilter(filter: Filter) {
  await setDoc(doc(db, "filters", filter.id), filter)
}

export async function deleteFilter(id: string) {
  await deleteDoc(doc(db, "filters", id))
}
