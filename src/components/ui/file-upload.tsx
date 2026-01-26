import { useState, useRef, useCallback } from 'react'
import { Button } from './button'
import { Label } from './label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './select'
import { Input } from './input'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from './dialog'
import {
  Upload,
  X,
  FileImage,
  FileText,
  Image,
  Loader2,
  Eye,
  Trash2,
  Download,
  ZoomIn,
  ZoomOut,
  RotateCw,
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

  // Estado para vista previa modal
  const [previewModalOpen, setPreviewModalOpen] = useState(false)
  const [previewArchivo, setPreviewArchivo] = useState<ArchivoAdjunto | null>(null)
  const [imageZoom, setImageZoom] = useState(1)
  const [imageRotation, setImageRotation] = useState(0)

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

  const openPreview = (archivo: ArchivoAdjunto) => {
    setPreviewArchivo(archivo)
    setImageZoom(1)
    setImageRotation(0)
    setPreviewModalOpen(true)
  }

  const handleZoomIn = () => {
    setImageZoom(prev => Math.min(prev + 0.25, 3))
  }

  const handleZoomOut = () => {
    setImageZoom(prev => Math.max(prev - 0.25, 0.5))
  }

  const handleRotate = () => {
    setImageRotation(prev => (prev + 90) % 360)
  }

  const isImageFile = (mimeType: string) => ACCEPTED_IMAGE_TYPES.includes(mimeType)
  const isPdfFile = (mimeType: string) => mimeType === 'application/pdf'

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
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {archivos.map((archivo) => (
              <div
                key={archivo.id}
                className="group relative bg-white dark:bg-slate-800 border dark:border-slate-700 rounded-lg overflow-hidden hover:shadow-md transition-shadow"
              >
                {/* Preview thumbnail - clickeable */}
                <div
                  onClick={() => openPreview(archivo)}
                  className="cursor-pointer aspect-square bg-gray-100 dark:bg-slate-700 flex items-center justify-center relative overflow-hidden"
                >
                  {isImageFile(archivo.mimeType) ? (
                    <img
                      src={archivo.url}
                      alt={archivo.nombre}
                      className="w-full h-full object-cover transition-transform group-hover:scale-105"
                    />
                  ) : isPdfFile(archivo.mimeType) ? (
                    <div className="flex flex-col items-center justify-center text-gray-400 dark:text-gray-500">
                      <FileText className="h-12 w-12 mb-2" />
                      <span className="text-xs font-medium">PDF</span>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center text-gray-400 dark:text-gray-500">
                      {getTipoIcon(archivo.tipo)}
                      <span className="text-xs mt-2">{archivo.mimeType.split('/')[1]?.toUpperCase()}</span>
                    </div>
                  )}

                  {/* Overlay on hover */}
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <Eye className="h-8 w-8 text-white" />
                  </div>

                  {/* Tipo badge */}
                  <div className="absolute top-2 left-2">
                    <span className="bg-black/60 text-white text-xs px-2 py-0.5 rounded-full">
                      {getTipoLabel(archivo.tipo)}
                    </span>
                  </div>
                </div>

                {/* Info */}
                <div className="p-3">
                  <p className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate" title={archivo.nombre}>
                    {archivo.nombre}
                  </p>
                  <div className="flex items-center justify-between mt-1">
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      {formatFileSize(archivo.tamanio)}
                    </span>
                    {archivo.descripcion && (
                      <span className="text-xs text-gray-500 dark:text-gray-400 truncate ml-2" title={archivo.descripcion}>
                        {archivo.descripcion}
                      </span>
                    )}
                  </div>
                </div>

                {/* Actions overlay */}
                <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <a
                    href={archivo.url}
                    download={archivo.nombre}
                    onClick={(e) => e.stopPropagation()}
                    className="p-1.5 bg-white/90 dark:bg-slate-800/90 rounded-full hover:bg-white dark:hover:bg-slate-700 transition-colors shadow-sm"
                    title="Descargar"
                  >
                    <Download className="h-4 w-4 text-gray-600 dark:text-gray-300" />
                  </a>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation()
                      handleRemove(archivo.id)
                    }}
                    className="p-1.5 bg-white/90 dark:bg-slate-800/90 rounded-full hover:bg-red-50 dark:hover:bg-red-900/50 transition-colors shadow-sm"
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

      {/* Preview Modal */}
      <Dialog open={previewModalOpen} onOpenChange={setPreviewModalOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] p-0 overflow-hidden">
          <DialogHeader className="p-4 pb-2 border-b dark:border-slate-700">
            <DialogTitle className="flex items-center justify-between pr-8">
              <span className="truncate">{previewArchivo?.nombre}</span>
              <div className="flex items-center gap-2">
                {previewArchivo && isImageFile(previewArchivo.mimeType) && (
                  <>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={handleZoomOut}
                      disabled={imageZoom <= 0.5}
                      title="Alejar"
                    >
                      <ZoomOut className="h-4 w-4" />
                    </Button>
                    <span className="text-sm text-muted-foreground w-16 text-center">
                      {Math.round(imageZoom * 100)}%
                    </span>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={handleZoomIn}
                      disabled={imageZoom >= 3}
                      title="Acercar"
                    >
                      <ZoomIn className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={handleRotate}
                      title="Rotar"
                    >
                      <RotateCw className="h-4 w-4" />
                    </Button>
                  </>
                )}
                {previewArchivo && (
                  <a
                    href={previewArchivo.url}
                    download={previewArchivo.nombre}
                    className="inline-flex"
                  >
                    <Button variant="outline" size="icon" title="Descargar">
                      <Download className="h-4 w-4" />
                    </Button>
                  </a>
                )}
              </div>
            </DialogTitle>
          </DialogHeader>

          <div className="flex-1 overflow-auto bg-gray-100 dark:bg-slate-900 p-4 flex items-center justify-center min-h-[400px]">
            {previewArchivo && isImageFile(previewArchivo.mimeType) && (
              <div className="overflow-auto max-w-full max-h-[calc(90vh-120px)]">
                <img
                  src={previewArchivo.url}
                  alt={previewArchivo.nombre}
                  className="max-w-none transition-transform duration-200"
                  style={{
                    transform: `scale(${imageZoom}) rotate(${imageRotation}deg)`,
                  }}
                />
              </div>
            )}

            {previewArchivo && isPdfFile(previewArchivo.mimeType) && (
              <iframe
                src={previewArchivo.url}
                className="w-full h-[calc(90vh-120px)] border-0 rounded"
                title={previewArchivo.nombre}
              />
            )}

            {previewArchivo && !isImageFile(previewArchivo.mimeType) && !isPdfFile(previewArchivo.mimeType) && (
              <div className="text-center py-12">
                <FileText className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  Vista previa no disponible para este tipo de archivo
                </p>
                <a href={previewArchivo.url} download={previewArchivo.nombre}>
                  <Button>
                    <Download className="h-4 w-4 mr-2" />
                    Descargar archivo
                  </Button>
                </a>
              </div>
            )}
          </div>

          {previewArchivo?.descripcion && (
            <div className="p-3 border-t dark:border-slate-700 bg-gray-50 dark:bg-slate-800">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                <span className="font-medium">Descripción:</span> {previewArchivo.descripcion}
              </p>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
