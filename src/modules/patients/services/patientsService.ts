import {
  collection,
  doc,
  getDocs,
  getDoc,
  setDoc,
  updateDoc,
  query,
  where,
  serverTimestamp,
  Timestamp,
} from 'firebase/firestore'
import { db } from '@/lib/firebase/config'
import type { Paciente, Anamnesis, Odontograma, DientePaciente, EstadoDiente } from '@/types'

const PACIENTES_COLLECTION = 'pacientes'
const ODONTOGRAMAS_COLLECTION = 'odontogramas'

// ============================================
// TIPOS PARA FORMULARIOS (sin Timestamp)
// ============================================

export interface PacienteFormData {
  anamnesis: Anamnesis
}

// ============================================
// SERVICIO DE PACIENTES
// ============================================

export const patientsService = {
  /**
   * Obtener todos los pacientes activos de un odontólogo
   */
  async obtenerTodos(odontologoId: string): Promise<Paciente[]> {
    try {
      const q = query(
        collection(db, PACIENTES_COLLECTION),
        where('odontologoId', '==', odontologoId),
        where('activo', '==', true)
      )
      const snapshot = await getDocs(q)
      const pacientes = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Paciente[]

      // Ordenar en cliente por apellido
      return pacientes.sort((a, b) =>
        a.anamnesis.datosPersonales.apellido.localeCompare(b.anamnesis.datosPersonales.apellido)
      )
    } catch (error) {
      console.error('Error al obtener pacientes:', error)
      throw error
    }
  },

  /**
   * Buscar pacientes por nombre o documento
   */
  async buscar(odontologoId: string, termino: string): Promise<Paciente[]> {
    // Firestore no soporta búsqueda de texto, obtenemos todos y filtramos
    const todos = await this.obtenerTodos(odontologoId)
    const terminoLower = termino.toLowerCase()

    return todos.filter((p) => {
      const nombre = `${p.anamnesis.datosPersonales.nombre} ${p.anamnesis.datosPersonales.apellido}`.toLowerCase()
      const documento = p.anamnesis.datosPersonales.documentoIdentidad.toLowerCase()
      return nombre.includes(terminoLower) || documento.includes(terminoLower)
    })
  },

  /**
   * Obtener un paciente por ID
   */
  async obtenerPorId(id: string): Promise<Paciente | null> {
    const docRef = doc(db, PACIENTES_COLLECTION, id)
    const docSnap = await getDoc(docRef)
    if (!docSnap.exists()) return null
    return { id: docSnap.id, ...docSnap.data() } as Paciente
  },

  /**
   * Crear un nuevo paciente
   */
  async crear(odontologoId: string, data: PacienteFormData): Promise<string> {
    const docRef = doc(collection(db, PACIENTES_COLLECTION))

    const pacienteData: Record<string, unknown> = {
      odontologoId,
      anamnesis: sanitizeAnamnesis(data.anamnesis),
      activo: true,
      creadoEn: serverTimestamp(),
      actualizadoEn: serverTimestamp(),
    }

    await setDoc(docRef, pacienteData)
    return docRef.id
  },

  /**
   * Actualizar un paciente existente
   */
  async actualizar(id: string, data: Partial<PacienteFormData>): Promise<void> {
    const updateData: Record<string, unknown> = {
      actualizadoEn: serverTimestamp(),
    }

    if (data.anamnesis) {
      updateData.anamnesis = sanitizeAnamnesis(data.anamnesis)
    }

    await updateDoc(doc(db, PACIENTES_COLLECTION, id), updateData)
  },

  /**
   * Eliminar (soft delete) un paciente
   */
  async eliminar(id: string): Promise<void> {
    await updateDoc(doc(db, PACIENTES_COLLECTION, id), {
      activo: false,
      actualizadoEn: serverTimestamp(),
    })
  },

  /**
   * Reactivar un paciente eliminado
   */
  async reactivar(id: string): Promise<void> {
    await updateDoc(doc(db, PACIENTES_COLLECTION, id), {
      activo: true,
      actualizadoEn: serverTimestamp(),
    })
  },
}

// ============================================
// SERVICIO DE ODONTOGRAMAS
// ============================================

export const odontogramasService = {
  /**
   * Obtener odontograma más reciente de un paciente
   */
  async obtenerPorPaciente(pacienteId: string): Promise<Odontograma | null> {
    try {
      const q = query(
        collection(db, ODONTOGRAMAS_COLLECTION),
        where('pacienteId', '==', pacienteId)
      )
      const snapshot = await getDocs(q)
      if (snapshot.empty) {
        console.log('No se encontró odontograma para paciente:', pacienteId)
        return null
      }

      // Si hay múltiples, ordenar por fecha en cliente y tomar el más reciente
      const odontogramas = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Odontograma[]

      // Ordenar por fecha de creación descendente
      odontogramas.sort((a, b) => {
        const fechaA = a.fechaCreacion?.seconds || 0
        const fechaB = b.fechaCreacion?.seconds || 0
        return fechaB - fechaA
      })

      console.log('Odontograma encontrado:', odontogramas[0])
      return odontogramas[0]
    } catch (error) {
      console.error('Error al obtener odontograma:', error)
      throw error
    }
  },

  /**
   * Obtener historial completo de odontogramas de un paciente
   * Retorna todos los odontogramas ordenados por fecha descendente (más reciente primero)
   */
  async obtenerHistorial(pacienteId: string): Promise<Odontograma[]> {
    try {
      const q = query(
        collection(db, ODONTOGRAMAS_COLLECTION),
        where('pacienteId', '==', pacienteId)
      )
      const snapshot = await getDocs(q)
      if (snapshot.empty) {
        return []
      }

      const odontogramas = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Odontograma[]

      // Ordenar por fecha de creación descendente (más reciente primero)
      odontogramas.sort((a, b) => {
        const fechaA = a.fechaCreacion?.seconds || 0
        const fechaB = b.fechaCreacion?.seconds || 0
        return fechaB - fechaA
      })

      return odontogramas
    } catch (error) {
      console.error('Error al obtener historial de odontogramas:', error)
      throw error
    }
  },

  /**
   * Crear odontograma para un paciente
   * @param pacienteId - ID del paciente
   * @param odontologoId - ID del odontólogo
   * @param opciones - Opciones adicionales
   * @param opciones.motivo - Motivo de la visita/diagnóstico
   * @param opciones.copiarDe - ID del odontograma del cual copiar los dientes
   */
  async crear(
    pacienteId: string,
    odontologoId: string,
    opciones?: {
      motivo?: string
      copiarDe?: string
    }
  ): Promise<string> {
    const docRef = doc(collection(db, ODONTOGRAMAS_COLLECTION))

    let dientes: DientePaciente[]

    // Si se indica copiar de otro odontograma, obtener sus dientes
    if (opciones?.copiarDe) {
      const odontogramaAnterior = await getDoc(doc(db, ODONTOGRAMAS_COLLECTION, opciones.copiarDe))
      if (odontogramaAnterior.exists()) {
        const dataAnterior = odontogramaAnterior.data() as Odontograma
        // Copiar dientes actualizando la fecha
        dientes = dataAnterior.dientes.map(d => ({
          ...d,
          ultimaActualizacion: Timestamp.now(),
        }))
      } else {
        // Si no existe el odontograma a copiar, crear dientes nuevos
        dientes = crearDientesIniciales()
      }
    } else {
      // Crear 32 dientes con estado inicial sano
      dientes = crearDientesIniciales()
    }

    const odontogramaData: Record<string, unknown> = {
      pacienteId,
      odontologoId,
      dientes,
      fechaCreacion: serverTimestamp(),
      fechaActualizacion: serverTimestamp(),
    }

    // Agregar motivo si se proporciona
    if (opciones?.motivo) {
      odontogramaData.motivo = opciones.motivo
    }

    await setDoc(docRef, odontogramaData)
    return docRef.id
  },

  /**
   * Actualizar estado de un diente
   */
  async actualizarDiente(
    odontogramaId: string,
    numeroDiente: number,
    datoDiente: Partial<DientePaciente>
  ): Promise<void> {
    const odontogramaRef = doc(db, ODONTOGRAMAS_COLLECTION, odontogramaId)
    const odontogramaSnap = await getDoc(odontogramaRef)

    if (!odontogramaSnap.exists()) {
      throw new Error('Odontograma no encontrado')
    }

    // Limpiar undefined del objeto datoDiente
    const cleanData: Record<string, unknown> = {}
    for (const [key, value] of Object.entries(datoDiente)) {
      if (value !== undefined) {
        cleanData[key] = value
      }
    }

    const odontograma = odontogramaSnap.data() as Odontograma
    const dientes = odontograma.dientes.map((d) => {
      if (d.numeroDiente === numeroDiente) {
        return {
          ...d,
          ...cleanData,
          ultimaActualizacion: Timestamp.now(),
        }
      }
      return d
    })

    await updateDoc(odontogramaRef, {
      dientes,
      fechaActualizacion: serverTimestamp(),
    })
  },

  /**
   * Marcar/desmarcar diente como campo interferente
   */
  async toggleCampoInterferente(
    odontogramaId: string,
    numeroDiente: number,
    notas?: string
  ): Promise<void> {
    const odontogramaRef = doc(db, ODONTOGRAMAS_COLLECTION, odontogramaId)
    const odontogramaSnap = await getDoc(odontogramaRef)

    if (!odontogramaSnap.exists()) {
      throw new Error('Odontograma no encontrado')
    }

    const odontograma = odontogramaSnap.data() as Odontograma
    const dientes = odontograma.dientes.map((d) => {
      if (d.numeroDiente === numeroDiente) {
        return {
          ...d,
          campoInterferente: !d.campoInterferente,
          campoInterferenteNotas: notas || d.campoInterferenteNotas,
          ultimaActualizacion: Timestamp.now(),
        }
      }
      return d
    })

    await updateDoc(odontogramaRef, {
      dientes,
      fechaActualizacion: serverTimestamp(),
    })
  },

  /**
   * Actualizar observaciones generales del odontograma
   */
  async actualizarObservaciones(
    odontogramaId: string,
    observaciones: string
  ): Promise<void> {
    const odontogramaRef = doc(db, ODONTOGRAMAS_COLLECTION, odontogramaId)
    await updateDoc(odontogramaRef, {
      observacionesGenerales: observaciones,
      fechaActualizacion: serverTimestamp(),
    })
  },

  /**
   * Cerrar un odontograma (marcar visita como terminada)
   */
  async cerrar(odontogramaId: string): Promise<void> {
    const odontogramaRef = doc(db, ODONTOGRAMAS_COLLECTION, odontogramaId)
    await updateDoc(odontogramaRef, {
      cerrado: true,
      fechaCierre: serverTimestamp(),
      fechaActualizacion: serverTimestamp(),
    })
  },
}

// ============================================
// HELPERS
// ============================================

/**
 * Crea 32 dientes con estado inicial sano
 */
function crearDientesIniciales(): DientePaciente[] {
  const dientes: DientePaciente[] = []
  for (let cuadrante = 1; cuadrante <= 4; cuadrante++) {
    for (let diente = 1; diente <= 8; diente++) {
      const numeroDiente = cuadrante * 10 + diente
      dientes.push({
        numeroDiente,
        estado: 'sano' as EstadoDiente,
        patologias: [],
        campoInterferente: false,
        protocolosAplicados: [],
        ultimaActualizacion: Timestamp.now(),
      })
    }
  }
  return dientes
}

/**
 * Limpia objeto de valores undefined antes de enviar a Firestore
 */
function sanitizeObject(obj: Record<string, unknown>): Record<string, unknown> {
  const result: Record<string, unknown> = {}

  for (const [key, value] of Object.entries(obj)) {
    if (value === undefined) continue

    if (value !== null && typeof value === 'object' && !Array.isArray(value) && !(value instanceof Timestamp)) {
      result[key] = sanitizeObject(value as Record<string, unknown>)
    } else if (Array.isArray(value)) {
      result[key] = value.filter((v) => v !== undefined)
    } else {
      result[key] = value
    }
  }

  return result
}

/**
 * Sanitiza los datos de anamnesis para Firestore
 */
function sanitizeAnamnesis(anamnesis: Anamnesis): Record<string, unknown> {
  return sanitizeObject(anamnesis as unknown as Record<string, unknown>)
}

/**
 * Calcula la edad del paciente a partir de su fecha de nacimiento
 */
export function calcularEdad(fechaNacimiento: string): number {
  const hoy = new Date()
  const nacimiento = new Date(fechaNacimiento)
  let edad = hoy.getFullYear() - nacimiento.getFullYear()
  const mes = hoy.getMonth() - nacimiento.getMonth()

  if (mes < 0 || (mes === 0 && hoy.getDate() < nacimiento.getDate())) {
    edad--
  }

  return edad
}

/**
 * Formatea el nombre completo del paciente
 */
export function formatearNombreCompleto(paciente: Paciente): string {
  const { nombre, apellido } = paciente.anamnesis.datosPersonales
  return `${nombre} ${apellido}`
}
