import { useFormContext } from 'react-hook-form'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { AvatarUpload } from '@/components/ui/avatar-upload'
import type { Anamnesis } from '@/types'

const GENEROS = [
  { value: 'masculino', label: 'Masculino' },
  { value: 'femenino', label: 'Femenino' },
  { value: 'otro', label: 'Otro' },
]

const ESTADOS_CIVILES = [
  { value: 'soltero', label: 'Soltero/a' },
  { value: 'casado', label: 'Casado/a' },
  { value: 'divorciado', label: 'Divorciado/a' },
  { value: 'viudo', label: 'Viudo/a' },
  { value: 'union_libre', label: 'Unión libre' },
]

const GRUPOS_SANGUINEOS = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-']

export function DatosPersonalesForm() {
  const { register, setValue, watch, formState: { errors } } = useFormContext<Anamnesis>()

  const genero = watch('datosPersonales.genero')
  const estadoCivil = watch('datosPersonales.estadoCivil')
  const grupoSanguineo = watch('datosPersonales.grupoSanguineo')
  const fotoPerfil = watch('datosPersonales.fotoPerfil')

  return (
    <div className="space-y-6">
      <div className="border-b pb-4">
        <h3 className="text-lg font-semibold text-gray-900">Datos Personales</h3>
        <p className="text-sm text-muted-foreground mt-1">
          Información básica del paciente
        </p>
      </div>

      {/* Foto del paciente */}
      <div className="flex flex-col items-center gap-2">
        <AvatarUpload
          value={fotoPerfil}
          onChange={(url) => setValue('datosPersonales.fotoPerfil', url)}
          size="lg"
        />
        <p className="text-xs text-muted-foreground">Foto del paciente (opcional)</p>
      </div>

      {/* Nombre y Apellido */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="nombre">Nombre *</Label>
          <Input
            id="nombre"
            {...register('datosPersonales.nombre', { required: 'El nombre es requerido' })}
            placeholder="Nombre del paciente"
          />
          {errors.datosPersonales?.nombre && (
            <p className="text-xs text-red-500">{errors.datosPersonales.nombre.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="apellido">Apellido *</Label>
          <Input
            id="apellido"
            {...register('datosPersonales.apellido', { required: 'El apellido es requerido' })}
            placeholder="Apellido del paciente"
          />
          {errors.datosPersonales?.apellido && (
            <p className="text-xs text-red-500">{errors.datosPersonales.apellido.message}</p>
          )}
        </div>
      </div>

      {/* Documento y Fecha de nacimiento */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="documentoIdentidad">Documento de Identidad *</Label>
          <Input
            id="documentoIdentidad"
            {...register('datosPersonales.documentoIdentidad', { required: 'El documento es requerido' })}
            placeholder="Número de documento"
          />
          {errors.datosPersonales?.documentoIdentidad && (
            <p className="text-xs text-red-500">{errors.datosPersonales.documentoIdentidad.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="fechaNacimiento">Fecha de Nacimiento *</Label>
          <Input
            id="fechaNacimiento"
            type="date"
            {...register('datosPersonales.fechaNacimiento', { required: 'La fecha de nacimiento es requerida' })}
          />
          {errors.datosPersonales?.fechaNacimiento && (
            <p className="text-xs text-red-500">{errors.datosPersonales.fechaNacimiento.message}</p>
          )}
        </div>
      </div>

      {/* Género y Estado Civil */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Género *</Label>
          <Select
            value={genero || ''}
            onValueChange={(value) => setValue('datosPersonales.genero', value as Anamnesis['datosPersonales']['genero'])}
          >
            <SelectTrigger>
              <SelectValue placeholder="Seleccionar género" />
            </SelectTrigger>
            <SelectContent>
              {GENEROS.map((g) => (
                <SelectItem key={g.value} value={g.value}>
                  {g.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>Estado Civil</Label>
          <Select
            value={estadoCivil || ''}
            onValueChange={(value) => setValue('datosPersonales.estadoCivil', value as Anamnesis['datosPersonales']['estadoCivil'])}
          >
            <SelectTrigger>
              <SelectValue placeholder="Seleccionar estado civil" />
            </SelectTrigger>
            <SelectContent>
              {ESTADOS_CIVILES.map((e) => (
                <SelectItem key={e.value} value={e.value}>
                  {e.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Ocupación y Grupo Sanguíneo */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="ocupacion">Ocupación *</Label>
          <Input
            id="ocupacion"
            {...register('datosPersonales.ocupacion', { required: 'La ocupación es requerida' })}
            placeholder="Profesión u ocupación"
          />
          {errors.datosPersonales?.ocupacion && (
            <p className="text-xs text-red-500">{errors.datosPersonales.ocupacion.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label>Grupo Sanguíneo</Label>
          <Select
            value={grupoSanguineo || ''}
            onValueChange={(value) => setValue('datosPersonales.grupoSanguineo', value as Anamnesis['datosPersonales']['grupoSanguineo'])}
          >
            <SelectTrigger>
              <SelectValue placeholder="Seleccionar grupo" />
            </SelectTrigger>
            <SelectContent>
              {GRUPOS_SANGUINEOS.map((g) => (
                <SelectItem key={g} value={g}>
                  {g}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="border-t pt-4 mt-6">
        <h4 className="text-md font-medium text-gray-800 mb-4">Información de Contacto</h4>
      </div>

      {/* Teléfono y Email */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="telefono">Teléfono *</Label>
          <Input
            id="telefono"
            type="tel"
            {...register('datosPersonales.telefono', { required: 'El teléfono es requerido' })}
            placeholder="+57 300 123 4567"
          />
          {errors.datosPersonales?.telefono && (
            <p className="text-xs text-red-500">{errors.datosPersonales.telefono.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="telefonoEmergencia">Teléfono de Emergencia</Label>
          <Input
            id="telefonoEmergencia"
            type="tel"
            {...register('datosPersonales.telefonoEmergencia')}
            placeholder="Contacto de emergencia"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="email">Correo Electrónico</Label>
        <Input
          id="email"
          type="email"
          {...register('datosPersonales.email')}
          placeholder="correo@ejemplo.com"
        />
      </div>

      {/* Dirección */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="direccion">Dirección *</Label>
          <Input
            id="direccion"
            {...register('datosPersonales.direccion', { required: 'La dirección es requerida' })}
            placeholder="Calle, número, apartamento"
          />
          {errors.datosPersonales?.direccion && (
            <p className="text-xs text-red-500">{errors.datosPersonales.direccion.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="ciudad">Ciudad *</Label>
          <Input
            id="ciudad"
            {...register('datosPersonales.ciudad', { required: 'La ciudad es requerida' })}
            placeholder="Ciudad"
          />
          {errors.datosPersonales?.ciudad && (
            <p className="text-xs text-red-500">{errors.datosPersonales.ciudad.message}</p>
          )}
        </div>
      </div>
    </div>
  )
}
