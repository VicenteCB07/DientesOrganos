import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  type User,
} from 'firebase/auth'
import {
  doc,
  getDoc,
  setDoc,
  serverTimestamp,
} from 'firebase/firestore'
import { auth, db } from '@/lib/firebase/config'
import type { Usuario, UserRole } from '@/types'

const COLLECTION = 'usuarios'

export const authService = {
  // Escuchar cambios de autenticación
  onAuthChange(callback: (user: User | null) => void) {
    return onAuthStateChanged(auth, callback)
  },

  // Iniciar sesión
  async signIn(email: string, password: string): Promise<User> {
    const userCredential = await signInWithEmailAndPassword(auth, email, password)
    return userCredential.user
  },

  // Registrar usuario (odontólogo)
  async signUp(email: string, password: string, nombre: string, apellido: string = ''): Promise<User> {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password)
    const user = userCredential.user

    // Crear documento de usuario en Firestore
    const usuarioData: Omit<Usuario, 'id'> = {
      email,
      nombre,
      apellido,
      rol: 'odontologo' as UserRole,
      activo: true,
      creadoEn: serverTimestamp() as Usuario['creadoEn'],
      actualizadoEn: serverTimestamp() as Usuario['actualizadoEn'],
    }

    await setDoc(doc(db, COLLECTION, user.uid), usuarioData)

    return user
  },

  // Cerrar sesión
  async signOut(): Promise<void> {
    await firebaseSignOut(auth)
  },

  // Obtener datos del usuario desde Firestore
  async getUsuario(uid: string): Promise<Usuario | null> {
    const docRef = doc(db, COLLECTION, uid)
    const docSnap = await getDoc(docRef)

    if (!docSnap.exists()) return null

    return {
      id: docSnap.id,
      ...docSnap.data(),
    } as Usuario
  },
}
