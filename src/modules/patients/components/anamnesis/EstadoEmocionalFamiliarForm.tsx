import { useFormContext } from 'react-hook-form'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import type { Anamnesis } from '@/types'
import { AlertCircle, Heart, Users } from 'lucide-react'

export function EstadoEmocionalFamiliarForm() {
  const { register, setValue, watch } = useFormContext<Anamnesis>()

  const eventoEstresanteReciente = watch('estadoEmocional.eventoEstresanteReciente')
  const tratamientoPsicologico = watch('estadoEmocional.tratamientoPsicologico')
  const medicacionPsiquiatrica = watch('estadoEmocional.medicacionPsiquiatrica')
  const estadoAnimoGeneral = watch('estadoEmocional.estadoAnimoGeneral')
  const relacionesFamiliares = watch('estadoEmocional.relacionesFamiliares')
  const satisfaccionLaboral = watch('estadoEmocional.satisfaccionLaboral')

  return (
    <div className="space-y-6">
      <div className="border-b pb-4">
        <h3 className="text-lg font-semibold text-gray-900">Estado Emocional y Antecedentes Familiares</h3>
        <p className="text-sm text-muted-foreground mt-1">
          Esta información es fundamental para el enfoque de biodescodificación y medicina integrativa
        </p>
      </div>

      {/* Nota sobre confidencialidad */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex gap-3">
        <AlertCircle className="h-5 w-5 text-blue-600 shrink-0 mt-0.5" />
        <div>
          <p className="text-sm text-blue-800 font-medium">Información confidencial</p>
          <p className="text-xs text-blue-700 mt-1">
            Esta sección es especialmente sensible. La información aquí proporcionada es estrictamente
            confidencial y se utiliza para entender mejor la relación entre el estado emocional y
            las manifestaciones dentales según los principios de la biodescodificación.
          </p>
        </div>
      </div>

      {/* Estado emocional */}
      <div className="border-t pt-4 mt-6">
        <div className="flex items-center gap-2 mb-4">
          <Heart className="h-5 w-5 text-rose-500" />
          <h4 className="text-md font-medium text-gray-800">Estado Emocional Actual</h4>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Estado de ánimo general *</Label>
            <Select
              value={estadoAnimoGeneral || ''}
              onValueChange={(value) => setValue('estadoEmocional.estadoAnimoGeneral', value as 'estable' | 'ansioso' | 'deprimido' | 'irritable' | 'variable')}
            >
              <SelectTrigger>
                <SelectValue placeholder="¿Cómo se siente la mayor parte del tiempo?" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="estable">Estable / Equilibrado</SelectItem>
                <SelectItem value="ansioso">Ansioso / Preocupado</SelectItem>
                <SelectItem value="deprimido">Triste / Deprimido</SelectItem>
                <SelectItem value="irritable">Irritable / Enojado</SelectItem>
                <SelectItem value="variable">Variable / Inestable</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="eventoEstresante"
                checked={eventoEstresanteReciente}
                onCheckedChange={(checked) => setValue('estadoEmocional.eventoEstresanteReciente', checked as boolean)}
              />
              <Label htmlFor="eventoEstresante" className="font-normal">
                ¿Ha experimentado algún evento estresante o traumático recientemente?
              </Label>
            </div>
            {eventoEstresanteReciente && (
              <Textarea
                {...register('estadoEmocional.eventoDetalle')}
                placeholder="Si desea compartir, describa brevemente (duelo, separación, pérdida laboral, enfermedad, etc.)"
                rows={3}
                className="mt-2"
              />
            )}
          </div>
        </div>

        <div className="space-y-4">
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="tratamientoPsicologico"
                checked={tratamientoPsicologico}
                onCheckedChange={(checked) => setValue('estadoEmocional.tratamientoPsicologico', checked as boolean)}
              />
              <Label htmlFor="tratamientoPsicologico" className="font-normal">
                ¿Está en tratamiento psicológico o psiquiátrico?
              </Label>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="medicacionPsiquiatrica"
                checked={medicacionPsiquiatrica}
                onCheckedChange={(checked) => setValue('estadoEmocional.medicacionPsiquiatrica', checked as boolean)}
              />
              <Label htmlFor="medicacionPsiquiatrica" className="font-normal">
                ¿Toma medicación psiquiátrica?
              </Label>
            </div>
            {medicacionPsiquiatrica && (
              <Input
                {...register('estadoEmocional.medicacionPsiquiatricaDetalle')}
                placeholder="Nombre del medicamento (antidepresivos, ansiolíticos, etc.)"
                className="mt-2"
              />
            )}
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="redApoyo"
              checked={watch('estadoEmocional.redApoyo')}
              onCheckedChange={(checked) => setValue('estadoEmocional.redApoyo', checked as boolean)}
            />
            <Label htmlFor="redApoyo" className="font-normal">
              ¿Cuenta con una red de apoyo (familia, amigos cercanos)?
            </Label>
          </div>
        </div>
      </div>

      {/* Relaciones */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
        <div className="space-y-2">
          <Label>Relaciones familiares *</Label>
          <div className="flex gap-2">
            {(['buenas', 'regulares', 'conflictivas'] as const).map((opcion) => (
              <button
                key={opcion}
                type="button"
                onClick={() => setValue('estadoEmocional.relacionesFamiliares', opcion)}
                className={`flex-1 px-3 py-2 rounded-lg text-sm font-medium transition-all border ${
                  relacionesFamiliares === opcion
                    ? opcion === 'buenas'
                      ? 'bg-green-100 text-green-800 border-green-300'
                      : opcion === 'regulares'
                      ? 'bg-yellow-100 text-yellow-800 border-yellow-300'
                      : 'bg-red-100 text-red-800 border-red-300'
                    : 'bg-gray-50 text-gray-600 border-gray-200 hover:bg-gray-100'
                }`}
              >
                {opcion.charAt(0).toUpperCase() + opcion.slice(1)}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-2">
          <Label>Satisfacción laboral *</Label>
          <div className="flex gap-2">
            {(['alta', 'media', 'baja'] as const).map((opcion) => (
              <button
                key={opcion}
                type="button"
                onClick={() => setValue('estadoEmocional.satisfaccionLaboral', opcion)}
                className={`flex-1 px-3 py-2 rounded-lg text-sm font-medium transition-all border ${
                  satisfaccionLaboral === opcion
                    ? opcion === 'alta'
                      ? 'bg-green-100 text-green-800 border-green-300'
                      : opcion === 'media'
                      ? 'bg-yellow-100 text-yellow-800 border-yellow-300'
                      : 'bg-red-100 text-red-800 border-red-300'
                    : 'bg-gray-50 text-gray-600 border-gray-200 hover:bg-gray-100'
                }`}
              >
                {opcion.charAt(0).toUpperCase() + opcion.slice(1)}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Antecedentes familiares */}
      <div className="border-t pt-4 mt-6">
        <div className="flex items-center gap-2 mb-4">
          <Users className="h-5 w-5 text-indigo-500" />
          <h4 className="text-md font-medium text-gray-800">Antecedentes Familiares</h4>
        </div>
        <p className="text-sm text-muted-foreground mb-4">
          Enfermedades presentes en padres, abuelos o hermanos
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
        {/* Columna 1 - Enfermedades sistémicas */}
        <div className="space-y-3">
          <p className="text-sm font-medium text-gray-700">Enfermedades Sistémicas</p>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="diabetesFamiliar"
              checked={watch('antecedentesFamiliares.diabetesFamiliar')}
              onCheckedChange={(checked) => setValue('antecedentesFamiliares.diabetesFamiliar', checked as boolean)}
            />
            <Label htmlFor="diabetesFamiliar" className="font-normal">
              Diabetes
            </Label>
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="hipertensionFamiliar"
              checked={watch('antecedentesFamiliares.hipertensionFamiliar')}
              onCheckedChange={(checked) => setValue('antecedentesFamiliares.hipertensionFamiliar', checked as boolean)}
            />
            <Label htmlFor="hipertensionFamiliar" className="font-normal">
              Hipertensión arterial
            </Label>
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="cardiopatiaFamiliar"
              checked={watch('antecedentesFamiliares.cardiopatiaFamiliar')}
              onCheckedChange={(checked) => setValue('antecedentesFamiliares.cardiopatiaFamiliar', checked as boolean)}
            />
            <Label htmlFor="cardiopatiaFamiliar" className="font-normal">
              Enfermedades cardíacas
            </Label>
          </div>

          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="cancerFamiliar"
                checked={watch('antecedentesFamiliares.cancerFamiliar')}
                onCheckedChange={(checked) => setValue('antecedentesFamiliares.cancerFamiliar', checked as boolean)}
              />
              <Label htmlFor="cancerFamiliar" className="font-normal">
                Cáncer
              </Label>
            </div>
            {watch('antecedentesFamiliares.cancerFamiliar') && (
              <Input
                {...register('antecedentesFamiliares.cancerTipo')}
                placeholder="Tipo de cáncer"
                className="ml-6"
              />
            )}
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="autoinmunesFamiliar"
              checked={watch('antecedentesFamiliares.enfermedadesAutoinmunesFamiliar')}
              onCheckedChange={(checked) => setValue('antecedentesFamiliares.enfermedadesAutoinmunesFamiliar', checked as boolean)}
            />
            <Label htmlFor="autoinmunesFamiliar" className="font-normal">
              Enfermedades autoinmunes
            </Label>
          </div>
        </div>

        {/* Columna 2 - Antecedentes dentales */}
        <div className="space-y-3">
          <p className="text-sm font-medium text-gray-700">Antecedentes Dentales</p>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="periodontalsFamiliar"
              checked={watch('antecedentesFamiliares.problemasPeriodontalsFamiliar')}
              onCheckedChange={(checked) => setValue('antecedentesFamiliares.problemasPeriodontalsFamiliar', checked as boolean)}
            />
            <Label htmlFor="periodontalsFamiliar" className="font-normal">
              Problemas de encías (periodontitis)
            </Label>
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="perdidaDentalFamiliar"
              checked={watch('antecedentesFamiliares.perdidaDentalTempranaFamiliar')}
              onCheckedChange={(checked) => setValue('antecedentesFamiliares.perdidaDentalTempranaFamiliar', checked as boolean)}
            />
            <Label htmlFor="perdidaDentalFamiliar" className="font-normal">
              Pérdida dental temprana
            </Label>
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="maloclusionFamiliar"
              checked={watch('antecedentesFamiliares.maloclusionFamiliar')}
              onCheckedChange={(checked) => setValue('antecedentesFamiliares.maloclusionFamiliar', checked as boolean)}
            />
            <Label htmlFor="maloclusionFamiliar" className="font-normal">
              Maloclusión / Problemas de mordida
            </Label>
          </div>
        </div>
      </div>

      {/* Otros antecedentes */}
      <div className="space-y-2 mt-4">
        <Label>Otros antecedentes familiares relevantes</Label>
        <Textarea
          {...register('antecedentesFamiliares.otrosAntecedentesFamiliares')}
          placeholder="Cualquier otra condición hereditaria o patrón familiar que considere relevante..."
          rows={2}
        />
      </div>

      {/* Observaciones adicionales y consentimiento */}
      <div className="border-t pt-4 mt-6">
        <h4 className="text-md font-medium text-gray-800 mb-4">Observaciones Finales</h4>
      </div>

      <div className="space-y-4">
        <div className="space-y-2">
          <Label>Observaciones adicionales</Label>
          <Textarea
            {...register('observacionesAdicionales')}
            placeholder="Cualquier información adicional que considere importante compartir..."
            rows={3}
          />
        </div>

        {/* Consentimiento */}
        <div className="bg-gray-50 p-4 rounded-lg border">
          <div className="flex items-start space-x-3">
            <Checkbox
              id="consentimiento"
              checked={watch('consentimientoInformado')}
              onCheckedChange={(checked) => setValue('consentimientoInformado', checked as boolean)}
              className="mt-1"
            />
            <div>
              <Label htmlFor="consentimiento" className="font-medium cursor-pointer">
                Consentimiento Informado *
              </Label>
              <p className="text-xs text-gray-600 mt-1">
                Declaro que la información proporcionada es verídica y autorizo su uso para
                fines diagnósticos y terapéuticos. Entiendo que esta información es confidencial
                y será tratada de acuerdo con las leyes de protección de datos vigentes.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
