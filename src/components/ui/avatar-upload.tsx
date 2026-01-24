import { useState, useRef, useCallback } from 'react'
import { Button } from './button'
import { Camera, X, User, Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'

const ACCEPTED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp']
const MAX_FILE_SIZE = 5 * 1024 * 1024 // 5MB

interface AvatarUploadProps {
  value?: string
  onChange: (url: string | undefined) => void
  onUpload?: (file: File) => Promise<string>
  disabled?: boolean
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

export function AvatarUpload({
  value,
  onChange,
  onUpload,
  disabled = false,
  size = 'lg',
  className,
}: AvatarUploadProps) {
  const [isDragging, setIsDragging] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const sizeClasses = {
    sm: 'w-20 h-20',
    md: 'w-28 h-28',
    lg: 'w-36 h-36',
  }

  const iconSizes = {
    sm: 'h-8 w-8',
    md: 'h-10 w-10',
    lg: 'h-12 w-12',
  }

  const validateFile = (file: File): string | null => {
    if (!ACCEPTED_IMAGE_TYPES.includes(file.type)) {
      return 'Solo se permiten imágenes JPG, PNG o WebP'
    }
    if (file.size > MAX_FILE_SIZE) {
      return 'La imagen no puede superar 5MB'
    }
    return null
  }

  const handleFileSelect = async (file: File) => {
    setError(null)
    const validationError = validateFile(file)
    if (validationError) {
      setError(validationError)
      return
    }

    setIsUploading(true)

    try {
      if (onUpload) {
        // Subir a Firebase Storage
        const url = await onUpload(file)
        onChange(url)
      } else {
        // Crear URL local (preview)
        const url = URL.createObjectURL(file)
        onChange(url)
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al subir la imagen')
    } finally {
      setIsUploading(false)
    }
  }

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    if (!disabled && !isUploading) {
      setIsDragging(true)
    }
  }, [disabled, isUploading])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }, [])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    if (disabled || isUploading) return

    const files = Array.from(e.dataTransfer.files)
    if (files.length > 0 && files[0].type.startsWith('image/')) {
      handleFileSelect(files[0])
    }
  }, [disabled, isUploading])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files && files.length > 0) {
      handleFileSelect(files[0])
    }
  }

  const handleRemove = () => {
    onChange(undefined)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  return (
    <div className={cn('space-y-2', className)}>
      <div className="flex items-center gap-4">
        {/* Avatar preview */}
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => !disabled && !isUploading && fileInputRef.current?.click()}
          className={cn(
            'relative rounded-full overflow-hidden border-2 cursor-pointer transition-all',
            sizeClasses[size],
            isDragging && 'border-blue-500 ring-4 ring-blue-100',
            disabled && 'opacity-50 cursor-not-allowed',
            !value && !isDragging && 'border-dashed border-gray-300 hover:border-blue-400',
            value && 'border-solid border-gray-200 hover:border-blue-400'
          )}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept={ACCEPTED_IMAGE_TYPES.join(',')}
            onChange={handleInputChange}
            className="hidden"
            disabled={disabled || isUploading}
          />

          {isUploading ? (
            <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
              <Loader2 className={cn('animate-spin text-blue-500', iconSizes[size])} />
            </div>
          ) : value ? (
            <>
              <img
                src={value}
                alt="Foto del paciente"
                className="w-full h-full object-cover"
              />
              {/* Overlay on hover */}
              <div className="absolute inset-0 bg-black/40 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center">
                <Camera className="h-8 w-8 text-white" />
              </div>
            </>
          ) : (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-50">
              <User className={cn('text-gray-400', iconSizes[size])} />
              <span className="text-xs text-gray-400 mt-1">Foto</span>
            </div>
          )}
        </div>

        {/* Info and actions */}
        <div className="flex-1 space-y-2">
          <div>
            <p className="text-sm font-medium text-gray-700">Foto del paciente</p>
            <p className="text-xs text-gray-500">
              JPG, PNG o WebP. Máx. 5MB
            </p>
          </div>

          <div className="flex gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => fileInputRef.current?.click()}
              disabled={disabled || isUploading}
            >
              <Camera className="h-4 w-4 mr-1" />
              {value ? 'Cambiar' : 'Subir foto'}
            </Button>

            {value && (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={handleRemove}
                disabled={disabled || isUploading}
                className="text-red-600 hover:text-red-700 hover:bg-red-50"
              >
                <X className="h-4 w-4 mr-1" />
                Quitar
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Error message */}
      {error && (
        <p className="text-xs text-red-600">
          {error}
        </p>
      )}
    </div>
  )
}
