import {
  collection,
  doc,
  getDocs,
  getDoc,
  updateDoc,
  query,
  orderBy,
  serverTimestamp,
} from 'firebase/firestore'
import { db } from '@/lib/firebase/config'
import type { Usuario, UserRole } from '@/types'

const USUARIOS_COLLECTION = 'usuarios'

export interface UpdateUsuarioData {
  nombre?: string
  apellido?: string
  rol?: UserRole
  especialidad?: string
  matriculaProfesional?: string
  telefono?: string
  activo?: boolean
}

export const usersService = {
  /**
   * Obtener todos los usuarios registrados
   */
  async obtenerTodos(): Promise<Usuario[]> {
    try {
      const q = query(
        collection(db, USUARIOS_COLLECTION),
        orderBy('creadoEn', 'desc')
      )
      const snapshot = await getDocs(q)
      return snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Usuario[]
    } catch (error) {
      console.error('Error al obtener usuarios:', error)
      throw error
    }
  },

  /**
   * Obtener solo usuarios activos
   */
  async obtenerActivos(): Promise<Usuario[]> {
    const todos = await this.obtenerTodos()
    return todos.filter((u) => u.activo)
  },

  /**
   * Obtener un usuario por ID
   */
  async obtenerPorId(id: string): Promise<Usuario | null> {
    const docRef = doc(db, USUARIOS_COLLECTION, id)
    const docSnap = await getDoc(docRef)
    if (!docSnap.exists()) return null
    return { id: docSnap.id, ...docSnap.data() } as Usuario
  },

  /**
   * Actualizar datos de un usuario
   */
  async actualizar(id: string, data: UpdateUsuarioData): Promise<void> {
    const updateData: Record<string, unknown> = {
      actualizadoEn: serverTimestamp(),
    }

    // Solo agregar campos que no son undefined
    if (data.nombre !== undefined) updateData.nombre = data.nombre
    if (data.apellido !== undefined) updateData.apellido = data.apellido
    if (data.rol !== undefined) updateData.rol = data.rol
    if (data.especialidad !== undefined) updateData.especialidad = data.especialidad
    if (data.matriculaProfesional !== undefined) updateData.matriculaProfesional = data.matriculaProfesional
    if (data.telefono !== undefined) updateData.telefono = data.telefono
    if (data.activo !== undefined) updateData.activo = data.activo

    await updateDoc(doc(db, USUARIOS_COLLECTION, id), updateData)
  },

  /**
   * Cambiar el rol de un usuario
   */
  async cambiarRol(id: string, nuevoRol: UserRole): Promise<void> {
    await this.actualizar(id, { rol: nuevoRol })
  },

  /**
   * Desactivar un usuario (soft delete)
   */
  async desactivar(id: string): Promise<void> {
    await this.actualizar(id, { activo: false })
  },

  /**
   * Reactivar un usuario
   */
  async reactivar(id: string): Promise<void> {
    await this.actualizar(id, { activo: true })
  },
}
