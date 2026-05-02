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
