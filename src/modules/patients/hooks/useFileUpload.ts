import { useState, useCallback } from 'react'
import { uploadFile, getPatientFilesPath } from '@/lib/firebase/storage'
import { useAuthContext } from '@/modules/auth'
import type { ArchivoAdjunto, TipoArchivo } from '@/types'

interface UseFileUploadOptions {
  pacienteId?: string
}

interface UseFileUploadReturn {
  upload: (file: File, tipo: TipoArchivo, descripcion?: string) => Promise<ArchivoAdjunto>
  isUploading: boolean
  error: string | null
  clearError: () => void
}

/**
 * Hook para manejar la subida de archivos a Firebase Storage
 */
export function useFileUpload(options: UseFileUploadOptions = {}): UseFileUploadReturn {
  const { pacienteId } = options
  const { usuario } = useAuthContext()
  const [isUploading, setIsUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const upload = useCallback(
    async (file: File, tipo: TipoArchivo, descripcion?: string): Promise<ArchivoAdjunto> => {
      if (!usuario?.id) {
        throw new Error('Usuario no autenticado')
      }

      setIsUploading(true)
      setError(null)

      try {
        const path = getPatientFilesPath(usuario.id, pacienteId)
        const archivo = await uploadFile(file, path, tipo, descripcion)
        return archivo
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Error al subir el archivo'
        setError(errorMessage)
        throw err
      } finally {
        setIsUploading(false)
      }
    },
    [usuario?.id, pacienteId]
  )

  const clearError = useCallback(() => {
    setError(null)
  }, [])

  return {
    upload,
    isUploading,
    error,
    clearError,
  }
}
