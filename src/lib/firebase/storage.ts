import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage'
import { storage } from './config'
import type { ArchivoAdjunto, TipoArchivo } from '@/types'

/**
 * Sube un archivo a Firebase Storage
 * @param file - El archivo a subir
 * @param path - Ruta donde se guardará (ej: 'pacientes/123/archivos')
 * @param tipo - Tipo de archivo para metadatos
 * @param descripcion - Descripción opcional del archivo
 * @returns ArchivoAdjunto con la información del archivo subido
 */
export async function uploadFile(
  file: File,
  path: string,
  tipo: TipoArchivo,
  descripcion?: string
): Promise<ArchivoAdjunto> {
  // Generar nombre único para el archivo
  const timestamp = Date.now()
  const randomStr = Math.random().toString(36).substring(2, 9)
  const extension = file.name.split('.').pop() || ''
  const fileName = `${timestamp}-${randomStr}.${extension}`
  const fullPath = `${path}/${fileName}`

  // Crear referencia y subir
  const storageRef = ref(storage, fullPath)

  const metadata = {
    contentType: file.type,
    customMetadata: {
      originalName: file.name,
      tipo: tipo,
      descripcion: descripcion || '',
    },
  }

  await uploadBytes(storageRef, file, metadata)

  // Obtener URL de descarga
  const url = await getDownloadURL(storageRef)

  // Retornar objeto ArchivoAdjunto
  return {
    id: `${timestamp}-${randomStr}`,
    nombre: file.name,
    tipo: tipo,
    url: url,
    tamanio: file.size,
    mimeType: file.type,
    descripcion: descripcion,
    fechaSubida: new Date().toISOString(),
  }
}

/**
 * Elimina un archivo de Firebase Storage
 * @param url - URL del archivo a eliminar
 */
export async function deleteFile(url: string): Promise<void> {
  try {
    const storageRef = ref(storage, url)
    await deleteObject(storageRef)
  } catch (error) {
    console.error('Error al eliminar archivo:', error)
    throw error
  }
}

/**
 * Genera la ruta de almacenamiento para archivos de un paciente
 * @param odontologoId - ID del odontólogo
 * @param pacienteId - ID del paciente (opcional, para pacientes existentes)
 * @returns Ruta de almacenamiento
 */
export function getPatientFilesPath(odontologoId: string, pacienteId?: string): string {
  if (pacienteId) {
    return `odontologos/${odontologoId}/pacientes/${pacienteId}/archivos`
  }
  // Para nuevos pacientes, usar una carpeta temporal
  return `odontologos/${odontologoId}/temp/${Date.now()}`
}
