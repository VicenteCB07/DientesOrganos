import { useFormContext } from 'react-hook-form'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { AvatarUpload } from '@/components/ui/avatar-upload'
import { useLanguage } from '@/lib/i18n/LanguageContext'
import type { Anamnesis } from '@/types'

const GRUPOS_SANGUINEOS = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-']

export function DatosPersonalesForm() {
  const { register, setValue, watch, formState: { errors } } = useFormContext<Anamnesis>()
  const { t } = useLanguage()

  const GENEROS = [
    { value: 'masculino', label: t.personalData.male },
    { value: 'femenino', label: t.personalData.female },
    { value: 'otro', label: t.personalData.other },
  ]

  const ESTADOS_CIVILES = [
    { value: 'soltero', label: t.personalData.single },
    { value: 'casado', label: t.personalData.married },
    { value: 'divorciado', label: t.personalData.divorced },
    { value: 'viudo', label: t.personalData.widowed },
    { value: 'union_libre', label: t.personalData.commonLaw },
  ]

  const genero = watch('datosPersonales.genero')
  const estadoCivil = watch('datosPersonales.estadoCivil')
  const grupoSanguineo = watch('datosPersonales.grupoSanguineo')
  const fotoPerfil = watch('datosPersonales.fotoPerfil')

  return (
    <div className="space-y-6">
      <div className="border-b pb-4">
        <h3 className="text-lg font-semibold text-gray-900">{t.personalData.title}</h3>
        <p className="text-sm text-muted-foreground mt-1">
          {t.personalData.subtitle}
        </p>
      </div>

      {/* Foto del paciente */}
      <div className="flex flex-col items-center gap-2">
        <AvatarUpload
          value={fotoPerfil}
          onChange={(url) => setValue('datosPersonales.fotoPerfil', url)}
          size="lg"
        />
        <p className="text-xs text-muted-foreground">{t.personalData.photo}</p>
      </div>

      {/* Nombre y Apellido */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="nombre">{t.personalData.firstName} *</Label>
          <Input
            id="nombre"
            {...register('datosPersonales.nombre', { required: t.personalData.firstNameRequired })}
            placeholder={t.personalData.firstNamePlaceholder}
          />
          {errors.datosPersonales?.nombre && (
            <p className="text-xs text-red-500">{errors.datosPersonales.nombre.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="apellido">{t.personalData.lastName} *</Label>
          <Input
            id="apellido"
            {...register('datosPersonales.apellido', { required: t.personalData.lastNameRequired })}
            placeholder={t.personalData.lastNamePlaceholder}
          />
          {errors.datosPersonales?.apellido && (
            <p className="text-xs text-red-500">{errors.datosPersonales.apellido.message}</p>
          )}
        </div>
      </div>

      {/* Documento y Fecha de nacimiento */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="documentoIdentidad">{t.personalData.documentId} *</Label>
          <Input
            id="documentoIdentidad"
            {...register('datosPersonales.documentoIdentidad', { required: t.personalData.documentIdRequired })}
            placeholder={t.personalData.documentIdPlaceholder}
          />
          {errors.datosPersonales?.documentoIdentidad && (
            <p className="text-xs text-red-500">{errors.datosPersonales.documentoIdentidad.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="fechaNacimiento">{t.personalData.birthDate} *</Label>
          <Input
            id="fechaNacimiento"
            type="date"
            {...register('datosPersonales.fechaNacimiento', { required: t.personalData.birthDateRequired })}
          />
          {errors.datosPersonales?.fechaNacimiento && (
            <p className="text-xs text-red-500">{errors.datosPersonales.fechaNacimiento.message}</p>
          )}
        </div>
      </div>

      {/* Género y Estado Civil */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>{t.personalData.gender} *</Label>
          <Select
            value={genero || ''}
            onValueChange={(value) => setValue('datosPersonales.genero', value as Anamnesis['datosPersonales']['genero'])}
          >
            <SelectTrigger>
              <SelectValue placeholder={t.personalData.selectGender} />
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
          <Label>{t.personalData.maritalStatus}</Label>
          <Select
            value={estadoCivil || ''}
            onValueChange={(value) => setValue('datosPersonales.estadoCivil', value as Anamnesis['datosPersonales']['estadoCivil'])}
          >
            <SelectTrigger>
              <SelectValue placeholder={t.personalData.selectMaritalStatus} />
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
          <Label htmlFor="ocupacion">{t.personalData.occupation} *</Label>
          <Input
            id="ocupacion"
            {...register('datosPersonales.ocupacion', { required: t.personalData.occupationRequired })}
            placeholder={t.personalData.occupationPlaceholder}
          />
          {errors.datosPersonales?.ocupacion && (
            <p className="text-xs text-red-500">{errors.datosPersonales.ocupacion.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label>{t.personalData.bloodGroup}</Label>
          <Select
            value={grupoSanguineo || ''}
            onValueChange={(value) => setValue('datosPersonales.grupoSanguineo', value as Anamnesis['datosPersonales']['grupoSanguineo'])}
          >
            <SelectTrigger>
              <SelectValue placeholder={t.personalData.selectBloodGroup} />
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
        <h4 className="text-md font-medium text-gray-800 mb-4">{t.personalData.contactInfo}</h4>
      </div>

      {/* Teléfono y Email */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="telefono">{t.personalData.phone} *</Label>
          <Input
            id="telefono"
            type="tel"
            {...register('datosPersonales.telefono', { required: t.personalData.phoneRequired })}
            placeholder={t.personalData.phonePlaceholder}
          />
          {errors.datosPersonales?.telefono && (
            <p className="text-xs text-red-500">{errors.datosPersonales.telefono.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="telefonoEmergencia">{t.personalData.emergencyPhone}</Label>
          <Input
            id="telefonoEmergencia"
            type="tel"
            {...register('datosPersonales.telefonoEmergencia')}
            placeholder={t.personalData.emergencyPhonePlaceholder}
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="email">{t.personalData.email}</Label>
        <Input
          id="email"
          type="email"
          {...register('datosPersonales.email')}
          placeholder={t.personalData.emailPlaceholder}
        />
      </div>

      {/* Dirección */}
      <div className="space-y-2">
        <Label htmlFor="direccion">{t.personalData.address} *</Label>
        <Input
          id="direccion"
          {...register('datosPersonales.direccion', { required: t.personalData.addressRequired })}
          placeholder={t.personalData.addressPlaceholder}
        />
        {errors.datosPersonales?.direccion && (
          <p className="text-xs text-red-500">{errors.datosPersonales.direccion.message}</p>
        )}
      </div>

      {/* Ciudad y País */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="ciudad">{t.personalData.city} *</Label>
          <Input
            id="ciudad"
            {...register('datosPersonales.ciudad', { required: t.personalData.cityRequired })}
            placeholder={t.personalData.cityPlaceholder}
          />
          {errors.datosPersonales?.ciudad && (
            <p className="text-xs text-red-500">{errors.datosPersonales.ciudad.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="pais">{t.personalData.country}</Label>
          <Input
            id="pais"
            {...register('datosPersonales.pais')}
            placeholder={t.personalData.countryPlaceholder}
          />
        </div>
      </div>
    </div>
  )
}
