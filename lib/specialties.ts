import { collection, getDocs, doc, setDoc, deleteDoc } from "firebase/firestore"
import { db } from "./firebase"

export type Specialty = {
  id: string
  name: string
  nameAr: string
}

export async function getSpecialties() {
  const snapshot = await getDocs(collection(db, "specialties"))
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Specialty))
}

export async function saveSpecialty(specialty: Specialty) {
  await setDoc(doc(db, "specialties", specialty.id), specialty)
}

export async function deleteSpecialty(id: string) {
  await deleteDoc(doc(db, "specialties", id))
}
