import { useState, useRef, useCallback } from 'react'
import { Button } from './button'
import { Label } from './label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './select'
import { Input } from './input'
import {
  Upload,
  X,
  FileImage,
  FileText,
  Image,
  Loader2,
  Eye,
  Trash2,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import type { ArchivoAdjunto, TipoArchivo } from '@/types'

const TIPOS_ARCHIVO: { value: TipoArchivo; label: string; icon: React.ReactNode }[] = [
  { value: 'radiografia', label: 'Radiografía', icon: <FileImage className="h-4 w-4" /> },
  { value: 'foto_intraoral', label: 'Foto Intraoral', icon: <Image className="h-4 w-4" /> },
  { value: 'foto_extraoral', label: 'Foto Extraoral', icon: <Image className="h-4 w-4" /> },
  { value: 'documento', label: 'Documento', icon: <FileText className="h-4 w-4" /> },
  { value: 'otro', label: 'Otro', icon: <FileText className="h-4 w-4" /> },
]

const ACCEPTED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif']
const ACCEPTED_DOCUMENT_TYPES = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document']
const MAX_FILE_SIZE = 10 * 1024 * 1024 // 10MB

interface FileUploadProps {
  archivos: ArchivoAdjunto[]
  onArchivosChange: (archivos: ArchivoAdjunto[]) => void
  onUpload?: (file: File, tipo: TipoArchivo, descripcion?: string) => Promise<ArchivoAdjunto>
  disabled?: boolean
  maxFiles?: number
}

export function FileUpload({
  archivos,
  onArchivosChange,
  onUpload,
  disabled = false,
  maxFiles = 10,
}: FileUploadProps) {
  const [isDragging, setIsDragging] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [tipoArchivo, setTipoArchivo] = useState<TipoArchivo>('radiografia')
  const [descripcion, setDescripcion] = useState('')
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    if (!disabled) {
      setIsDragging(true)
    }
  }, [disabled])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }, [])

  const validateFile = (file: File): string | null => {
    const acceptedTypes = [...ACCEPTED_IMAGE_TYPES, ...ACCEPTED_DOCUMENT_TYPES]
    if (!acceptedTypes.includes(file.type)) {
      return 'Tipo de archivo no permitido. Use imágenes (JPG, PNG, WebP) o documentos (PDF, DOC).'
    }
    if (file.size > MAX_FILE_SIZE) {
      return 'El archivo es demasiado grande. Máximo 10MB.'
    }
    if (archivos.length >= maxFiles) {
      return `Máximo ${maxFiles} archivos permitidos.`
    }
    return null
  }

  const handleFileSelect = (file: File) => {
    setError(null)
    const validationError = validateFile(file)
    if (validationError) {
      setError(validationError)
      return
    }

    setSelectedFile(file)

    // Create preview for images
    if (ACCEPTED_IMAGE_TYPES.includes(file.type)) {
      const url = URL.createObjectURL(file)
      setPreviewUrl(url)
    } else {
      setPreviewUrl(null)
    }

    // Auto-detect tipo based on filename or mime type
    if (file.name.toLowerCase().includes('rx') || file.name.toLowerCase().includes('radio')) {
      setTipoArchivo('radiografia')
    } else if (file.type === 'application/pdf' || file.type.includes('word')) {
      setTipoArchivo('documento')
    } else if (ACCEPTED_IMAGE_TYPES.includes(file.type)) {
      setTipoArchivo('foto_intraoral')
    }
  }

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    if (disabled) return

    const files = Array.from(e.dataTransfer.files)
    if (files.length > 0) {
      handleFileSelect(files[0])
    }
  }, [disabled, archivos.length, maxFiles])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files && files.length > 0) {
      handleFileSelect(files[0])
    }
  }

  const handleUpload = async () => {
    if (!selectedFile || !onUpload) return

    setIsUploading(true)
    setError(null)

    try {
      const nuevoArchivo = await onUpload(selectedFile, tipoArchivo, descripcion || undefined)
      onArchivosChange([...archivos, nuevoArchivo])

      // Reset form
      setSelectedFile(null)
      setPreviewUrl(null)
      setDescripcion('')
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al subir el archivo')
    } finally {
      setIsUploading(false)
    }
  }

  const handleLocalUpload = () => {
    if (!selectedFile) return

    // Crear archivo local (sin subir a servidor)
    const nuevoArchivo: ArchivoAdjunto = {
      id: `local-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      nombre: selectedFile.name,
      tipo: tipoArchivo,
      url: previewUrl || URL.createObjectURL(selectedFile),
      tamanio: selectedFile.size,
      mimeType: selectedFile.type,
      descripcion: descripcion || undefined,
      fechaSubida: new Date().toISOString(),
    }

    onArchivosChange([...archivos, nuevoArchivo])

    // Reset form
    setSelectedFile(null)
    setPreviewUrl(null)
    setDescripcion('')
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const handleRemove = (id: string) => {
    onArchivosChange(archivos.filter(a => a.id !== id))
  }

  const cancelSelection = () => {
    setSelectedFile(null)
    setPreviewUrl(null)
    setDescripcion('')
    setError(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return `${bytes} B`
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
  }

  const getTipoIcon = (tipo: TipoArchivo) => {
    const found = TIPOS_ARCHIVO.find(t => t.value === tipo)
    return found?.icon || <FileText className="h-4 w-4" />
  }

  const getTipoLabel = (tipo: TipoArchivo) => {
    const found = TIPOS_ARCHIVO.find(t => t.value === tipo)
    return found?.label || tipo
  }

  return (
    <div className="space-y-4">
      {/* Drop zone */}
      {!selectedFile && (
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => !disabled && fileInputRef.current?.click()}
          className={cn(
            'border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-all',
            isDragging && 'border-blue-500 bg-blue-50',
            disabled && 'opacity-50 cursor-not-allowed',
            !isDragging && !disabled && 'border-gray-300 hover:border-blue-400 hover:bg-gray-50'
          )}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept={[...ACCEPTED_IMAGE_TYPES, ...ACCEPTED_DOCUMENT_TYPES].join(',')}
            onChange={handleInputChange}
            className="hidden"
            disabled={disabled}
          />
          <Upload className="h-10 w-10 text-gray-400 mx-auto mb-3" />
          <p className="text-sm font-medium text-gray-700">
            Arrastra archivos aquí o haz clic para seleccionar
          </p>
          <p className="text-xs text-gray-500 mt-1">
            Imágenes (JPG, PNG, WebP) o documentos (PDF, DOC) • Máx. 10MB
          </p>
        </div>
      )}

      {/* Selected file preview */}
      {selectedFile && (
        <div className="border rounded-lg p-4 bg-gray-50">
          <div className="flex items-start gap-4">
            {/* Preview */}
            {previewUrl ? (
              <div className="w-24 h-24 rounded-lg overflow-hidden bg-white border shrink-0">
                <img
                  src={previewUrl}
                  alt="Preview"
                  className="w-full h-full object-cover"
                />
              </div>
            ) : (
              <div className="w-24 h-24 rounded-lg bg-white border flex items-center justify-center shrink-0">
                <FileText className="h-10 w-10 text-gray-400" />
              </div>
            )}

            {/* Details form */}
            <div className="flex-1 space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-sm text-gray-900 truncate max-w-xs">
                    {selectedFile.name}
                  </p>
                  <p className="text-xs text-gray-500">
                    {formatFileSize(selectedFile.size)}
                  </p>
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={cancelSelection}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <Label className="text-xs">Tipo de archivo</Label>
                  <Select value={tipoArchivo} onValueChange={(v) => setTipoArchivo(v as TipoArchivo)}>
                    <SelectTrigger className="h-9">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {TIPOS_ARCHIVO.map((tipo) => (
                        <SelectItem key={tipo.value} value={tipo.value}>
                          <div className="flex items-center gap-2">
                            {tipo.icon}
                            {tipo.label}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-1">
                  <Label className="text-xs">Descripción (opcional)</Label>
                  <Input
                    value={descripcion}
                    onChange={(e) => setDescripcion(e.target.value)}
                    placeholder="Ej: Panorámica 2024"
                    className="h-9"
                  />
                </div>
              </div>

              <Button
                type="button"
                onClick={onUpload ? handleUpload : handleLocalUpload}
                disabled={isUploading}
                className="w-full"
                size="sm"
              >
                {isUploading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    Subiendo...
                  </>
                ) : (
                  <>
                    <Upload className="h-4 w-4 mr-2" />
                    Agregar archivo
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Error message */}
      {error && (
        <p className="text-sm text-red-600 bg-red-50 p-2 rounded">
          {error}
        </p>
      )}

      {/* Uploaded files list */}
      {archivos.length > 0 && (
        <div className="space-y-2">
          <Label className="text-sm font-medium">
            Archivos adjuntos ({archivos.length})
          </Label>
          <div className="grid gap-2">
            {archivos.map((archivo) => (
              <div
                key={archivo.id}
                className="flex items-center gap-3 p-3 bg-white border rounded-lg"
              >
                {/* Thumbnail */}
                {ACCEPTED_IMAGE_TYPES.includes(archivo.mimeType) ? (
                  <div className="w-12 h-12 rounded overflow-hidden bg-gray-100 shrink-0">
                    <img
                      src={archivo.url}
                      alt={archivo.nombre}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ) : (
                  <div className="w-12 h-12 rounded bg-gray-100 flex items-center justify-center shrink-0">
                    {getTipoIcon(archivo.tipo)}
                  </div>
                )}

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {archivo.nombre}
                  </p>
                  <div className="flex items-center gap-2 text-xs text-gray-500">
                    <span className="bg-gray-100 px-1.5 py-0.5 rounded">
                      {getTipoLabel(archivo.tipo)}
                    </span>
                    <span>{formatFileSize(archivo.tamanio)}</span>
                    {archivo.descripcion && (
                      <span className="truncate">• {archivo.descripcion}</span>
                    )}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-1">
                  <a
                    href={archivo.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 hover:bg-gray-100 rounded transition-colors"
                    title="Ver archivo"
                  >
                    <Eye className="h-4 w-4 text-gray-500" />
                  </a>
                  <button
                    type="button"
                    onClick={() => handleRemove(archivo.id)}
                    className="p-2 hover:bg-red-50 rounded transition-colors"
                    title="Eliminar"
                  >
                    <Trash2 className="h-4 w-4 text-red-500" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
