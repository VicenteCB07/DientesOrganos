import { useFormContext } from 'react-hook-form'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { FileUpload } from '@/components/ui/file-upload'
import { useFileUpload } from '../../hooks/useFileUpload'
import type { Anamnesis, ArchivoAdjunto, TipoArchivo } from '@/types'

interface AntecedentesOdontologicosFormProps {
  pacienteId?: string
  enableCloudUpload?: boolean
}

export function AntecedentesOdontologicosForm({
  pacienteId,
  enableCloudUpload = false
}: AntecedentesOdontologicosFormProps) {
  const { register, setValue, watch, formState: { errors } } = useFormContext<Anamnesis>()
  const { upload } = useFileUpload({ pacienteId })

  const bruxismo = watch('antecedentesOdontologicos.bruxismo')
  const sensibilidadDental = watch('antecedentesOdontologicos.sensibilidadDental')
  const experienciasNegativas = watch('antecedentesOdontologicos.experienciasNegativas')
  const protesisDental = watch('antecedentesOdontologicos.protesisDental')
  const implantes = watch('antecedentesOdontologicos.implantes')
  const endodoncias = watch('antecedentesOdontologicos.endodoncias')
  const extracciones = watch('antecedentesOdontologicos.extracciones')
  const problemasAnestesia = watch('antecedentesOdontologicos.problemasAnestesia')
  const frecuenciaCepillado = watch('antecedentesOdontologicos.frecuenciaCepillado')
  const tipoCepillo = watch('antecedentesOdontologicos.tipoCepillo')
  const archivosAdjuntos = watch('antecedentesOdontologicos.archivosAdjuntos') || []
  const otrosSintomas = watch('antecedentesOdontologicos.otrosSintomas')
  const otrosATM = watch('antecedentesOdontologicos.otrosATM')
  const otrosTratamientos = watch('antecedentesOdontologicos.otrosTratamientos')

  const handleArchivosChange = (archivos: ArchivoAdjunto[]) => {
    setValue('antecedentesOdontologicos.archivosAdjuntos', archivos)
  }

  // Handler para subida a Firebase Storage (cuando está habilitado)
  const handleCloudUpload = async (file: File, tipo: TipoArchivo, descripcion?: string) => {
    return await upload(file, tipo, descripcion)
  }

  return (
    <div className="space-y-6">
      <div className="border-b pb-4">
        <h3 className="text-lg font-semibold text-gray-900">Antecedentes Odontológicos</h3>
        <p className="text-sm text-muted-foreground mt-1">
          Historia dental y hábitos de higiene oral
        </p>
      </div>

      {/* Motivo de consulta */}
      <div className="space-y-2">
        <Label htmlFor="motivoConsulta">Motivo de Consulta *</Label>
        <Textarea
          id="motivoConsulta"
          {...register('antecedentesOdontologicos.motivoConsulta', { required: 'El motivo de consulta es requerido' })}
          placeholder="¿Cuál es el motivo principal de su visita?"
          rows={3}
        />
        {errors.antecedentesOdontologicos?.motivoConsulta && (
          <p className="text-xs text-red-500">{errors.antecedentesOdontologicos.motivoConsulta.message}</p>
        )}
      </div>

      {/* Última visita */}
      <div className="space-y-2">
        <Label htmlFor="ultimaVisitaDentista">Última Visita al Dentista</Label>
        <Input
          id="ultimaVisitaDentista"
          type="date"
          {...register('antecedentesOdontologicos.ultimaVisitaDentista')}
        />
      </div>

      <div className="border-t pt-4 mt-6">
        <h4 className="text-md font-medium text-gray-800 mb-4">Síntomas y Problemas Actuales</h4>
      </div>

      {/* Síntomas */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="sangradoEncias"
              checked={watch('antecedentesOdontologicos.sangradoEncias')}
              onCheckedChange={(checked) => setValue('antecedentesOdontologicos.sangradoEncias', checked as boolean)}
            />
            <Label htmlFor="sangradoEncias" className="font-normal">
              Sangrado de encías
            </Label>
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="halitosis"
              checked={watch('antecedentesOdontologicos.halitosis')}
              onCheckedChange={(checked) => setValue('antecedentesOdontologicos.halitosis', checked as boolean)}
            />
            <Label htmlFor="halitosis" className="font-normal">
              Mal aliento (halitosis)
            </Label>
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="sequedadBucal"
              checked={watch('antecedentesOdontologicos.sequedadBucal')}
              onCheckedChange={(checked) => setValue('antecedentesOdontologicos.sequedadBucal', checked as boolean)}
            />
            <Label htmlFor="sequedadBucal" className="font-normal">
              Sequedad bucal
            </Label>
          </div>
        </div>

        <div className="space-y-4">
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="sensibilidadDental"
                checked={sensibilidadDental}
                onCheckedChange={(checked) => setValue('antecedentesOdontologicos.sensibilidadDental', checked as boolean)}
              />
              <Label htmlFor="sensibilidadDental" className="font-normal">
                Sensibilidad dental
              </Label>
            </div>
            {sensibilidadDental && (
              <div className="ml-6">
                <Label className="text-sm text-gray-600">¿A qué?</Label>
                <Select
                  value={watch('antecedentesOdontologicos.sensibilidadDetalle') || ''}
                  onValueChange={(value) => setValue('antecedentesOdontologicos.sensibilidadDetalle', value as 'frio' | 'calor' | 'dulce' | 'todos')}
                >
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Seleccionar" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="frio">Frío</SelectItem>
                    <SelectItem value="calor">Calor</SelectItem>
                    <SelectItem value="dulce">Dulce</SelectItem>
                    <SelectItem value="todos">Todos</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="hemorragiasPostExtraccion"
              checked={watch('antecedentesOdontologicos.hemorragiasPostExtraccion')}
              onCheckedChange={(checked) => setValue('antecedentesOdontologicos.hemorragiasPostExtraccion', checked as boolean)}
            />
            <Label htmlFor="hemorragiasPostExtraccion" className="font-normal">
              Hemorragias post-extracción previas
            </Label>
          </div>

          {/* Otros síntomas */}
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="otrosSintomas"
                checked={otrosSintomas}
                onCheckedChange={(checked) => setValue('antecedentesOdontologicos.otrosSintomas', checked as boolean)}
              />
              <Label htmlFor="otrosSintomas" className="font-normal">
                Otros (especifique)
              </Label>
            </div>
            {otrosSintomas && (
              <div className="ml-6">
                <Textarea
                  {...register('antecedentesOdontologicos.otrosSintomasDetalle')}
                  placeholder="Describa otros síntomas o problemas..."
                  rows={2}
                />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Experiencias negativas */}
      <div className="space-y-2 bg-amber-50 p-4 rounded-lg border border-amber-200">
        <div className="flex items-center space-x-2">
          <Checkbox
            id="experienciasNegativas"
            checked={experienciasNegativas}
            onCheckedChange={(checked) => setValue('antecedentesOdontologicos.experienciasNegativas', checked as boolean)}
          />
          <Label htmlFor="experienciasNegativas" className="font-normal">
            ¿Ha tenido experiencias negativas o traumáticas en el dentista?
          </Label>
        </div>
        {experienciasNegativas && (
          <Textarea
            {...register('antecedentesOdontologicos.experienciasNegativasDetalle')}
            placeholder="Por favor, describa brevemente..."
            rows={2}
            className="mt-2"
          />
        )}
      </div>

      <div className="border-t pt-4 mt-6">
        <h4 className="text-md font-medium text-gray-800 mb-4">Articulación Temporomandibular (ATM)</h4>
      </div>

      {/* ATM */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-4">
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="bruxismo"
                checked={bruxismo}
                onCheckedChange={(checked) => setValue('antecedentesOdontologicos.bruxismo', checked as boolean)}
              />
              <Label htmlFor="bruxismo" className="font-normal">
                Bruxismo (aprieta o rechina los dientes)
              </Label>
            </div>
            {bruxismo && (
              <div className="ml-6 space-y-2">
                <Label className="text-sm text-gray-600">¿Cuándo?</Label>
                <RadioGroup
                  value={watch('antecedentesOdontologicos.bruxismoDiaNoche') || ''}
                  onValueChange={(value) => setValue('antecedentesOdontologicos.bruxismoDiaNoche', value as 'dia' | 'noche' | 'ambos')}
                  className="flex gap-4"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="dia" id="brux-dia" />
                    <Label htmlFor="brux-dia" className="font-normal text-sm">Día</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="noche" id="brux-noche" />
                    <Label htmlFor="brux-noche" className="font-normal text-sm">Noche</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="ambos" id="brux-ambos" />
                    <Label htmlFor="brux-ambos" className="font-normal text-sm">Ambos</Label>
                  </div>
                </RadioGroup>
              </div>
            )}
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="usaFerula"
              checked={watch('antecedentesOdontologicos.usaFerula')}
              onCheckedChange={(checked) => setValue('antecedentesOdontologicos.usaFerula', checked as boolean)}
            />
            <Label htmlFor="usaFerula" className="font-normal">
              Usa férula de descarga
            </Label>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="dolorATM"
              checked={watch('antecedentesOdontologicos.dolorATM')}
              onCheckedChange={(checked) => setValue('antecedentesOdontologicos.dolorATM', checked as boolean)}
            />
            <Label htmlFor="dolorATM" className="font-normal">
              Dolor en la mandíbula/ATM
            </Label>
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="chasquidoATM"
              checked={watch('antecedentesOdontologicos.chasquidoATM')}
              onCheckedChange={(checked) => setValue('antecedentesOdontologicos.chasquidoATM', checked as boolean)}
            />
            <Label htmlFor="chasquidoATM" className="font-normal">
              Chasquido/Crepitación al abrir la boca
            </Label>
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="dificultadAbrirBoca"
              checked={watch('antecedentesOdontologicos.dificultadAbrirBoca')}
              onCheckedChange={(checked) => setValue('antecedentesOdontologicos.dificultadAbrirBoca', checked as boolean)}
            />
            <Label htmlFor="dificultadAbrirBoca" className="font-normal">
              Dificultad para abrir la boca completamente
            </Label>
          </div>

          {/* Otros ATM */}
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="otrosATM"
                checked={otrosATM}
                onCheckedChange={(checked) => setValue('antecedentesOdontologicos.otrosATM', checked as boolean)}
              />
              <Label htmlFor="otrosATM" className="font-normal">
                Otros (especifique)
              </Label>
            </div>
            {otrosATM && (
              <div className="ml-6">
                <Textarea
                  {...register('antecedentesOdontologicos.otrosATMDetalle')}
                  placeholder="Describa otros problemas de ATM..."
                  rows={2}
                />
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="border-t pt-4 mt-6">
        <h4 className="text-md font-medium text-gray-800 mb-4">Tratamientos Previos</h4>
      </div>

      {/* Tratamientos previos */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="tratamientoOrtodoncia"
              checked={watch('antecedentesOdontologicos.tratamientoOrtodoncia')}
              onCheckedChange={(checked) => setValue('antecedentesOdontologicos.tratamientoOrtodoncia', checked as boolean)}
            />
            <Label htmlFor="tratamientoOrtodoncia" className="font-normal">
              Tratamiento de ortodoncia previo
            </Label>
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="ortodonciaActual"
              checked={watch('antecedentesOdontologicos.ortodonciaActual')}
              onCheckedChange={(checked) => setValue('antecedentesOdontologicos.ortodonciaActual', checked as boolean)}
            />
            <Label htmlFor="ortodonciaActual" className="font-normal">
              Ortodoncia actual
            </Label>
          </div>

          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="protesisDental"
                checked={protesisDental}
                onCheckedChange={(checked) => setValue('antecedentesOdontologicos.protesisDental', checked as boolean)}
              />
              <Label htmlFor="protesisDental" className="font-normal">
                Prótesis dental
              </Label>
            </div>
            {protesisDental && (
              <div className="ml-6">
                <Select
                  value={watch('antecedentesOdontologicos.protesisTipo') || ''}
                  onValueChange={(value) => setValue('antecedentesOdontologicos.protesisTipo', value as 'fija' | 'removible' | 'total' | 'implantes')}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Tipo de prótesis" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="fija">Fija (puentes, coronas)</SelectItem>
                    <SelectItem value="removible">Removible parcial</SelectItem>
                    <SelectItem value="total">Total (dentadura)</SelectItem>
                    <SelectItem value="implantes">Sobre implantes</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>
        </div>

        <div className="space-y-4">
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="implantes"
                checked={implantes}
                onCheckedChange={(checked) => setValue('antecedentesOdontologicos.implantes', checked as boolean)}
              />
              <Label htmlFor="implantes" className="font-normal">
                Implantes dentales
              </Label>
            </div>
            {implantes && (
              <div className="ml-6">
                <Label className="text-sm text-gray-600">Número de implantes</Label>
                <Input
                  type="number"
                  min={1}
                  {...register('antecedentesOdontologicos.implantesNumero', { valueAsNumber: true })}
                  placeholder="Cantidad"
                  className="mt-1 w-24"
                />
              </div>
            )}
          </div>

          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="endodoncias"
                checked={endodoncias}
                onCheckedChange={(checked) => setValue('antecedentesOdontologicos.endodoncias', checked as boolean)}
              />
              <Label htmlFor="endodoncias" className="font-normal">
                Endodoncias (tratamiento de conducto)
              </Label>
            </div>
            {endodoncias && (
              <div className="ml-6">
                <Input
                  {...register('antecedentesOdontologicos.endodonciasDetalle')}
                  placeholder="¿Cuáles dientes? Ej: 16, 36"
                  className="mt-1"
                />
              </div>
            )}
          </div>

          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="extracciones"
                checked={extracciones}
                onCheckedChange={(checked) => setValue('antecedentesOdontologicos.extracciones', checked as boolean)}
              />
              <Label htmlFor="extracciones" className="font-normal">
                Extracciones dentales
              </Label>
            </div>
            {extracciones && (
              <div className="ml-6">
                <Input
                  {...register('antecedentesOdontologicos.extraccionesDetalle')}
                  placeholder="¿Cuáles dientes? Ej: 18, 28, 38, 48"
                  className="mt-1"
                />
              </div>
            )}
          </div>

          {/* Otros tratamientos */}
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="otrosTratamientos"
                checked={otrosTratamientos}
                onCheckedChange={(checked) => setValue('antecedentesOdontologicos.otrosTratamientos', checked as boolean)}
              />
              <Label htmlFor="otrosTratamientos" className="font-normal">
                Otros (especifique)
              </Label>
            </div>
            {otrosTratamientos && (
              <div className="ml-6">
                <Textarea
                  {...register('antecedentesOdontologicos.otrosTratamientosDetalle')}
                  placeholder="Describa otros tratamientos previos..."
                  rows={2}
                />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Problemas con anestesia */}
      <div className="space-y-2 bg-red-50 p-4 rounded-lg border border-red-200">
        <div className="flex items-center space-x-2">
          <Checkbox
            id="problemasAnestesia"
            checked={problemasAnestesia}
            onCheckedChange={(checked) => setValue('antecedentesOdontologicos.problemasAnestesia', checked as boolean)}
          />
          <Label htmlFor="problemasAnestesia" className="font-normal text-red-800">
            ¿Ha tenido problemas con la anestesia dental?
          </Label>
        </div>
        {problemasAnestesia && (
          <Textarea
            {...register('antecedentesOdontologicos.anestesiaDetalle')}
            placeholder="Describa qué tipo de problema (reacción alérgica, no hizo efecto, etc.)"
            rows={2}
            className="mt-2"
          />
        )}
      </div>

      <div className="border-t pt-4 mt-6">
        <h4 className="text-md font-medium text-gray-800 mb-4">Higiene Oral</h4>
      </div>

      {/* Higiene oral */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Frecuencia de cepillado *</Label>
            <RadioGroup
              value={frecuenciaCepillado || ''}
              onValueChange={(value) => setValue('antecedentesOdontologicos.frecuenciaCepillado', value as '1' | '2' | '3' | 'mas_de_3')}
              className="grid grid-cols-2 gap-2"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="1" id="cep-1" />
                <Label htmlFor="cep-1" className="font-normal">1 vez/día</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="2" id="cep-2" />
                <Label htmlFor="cep-2" className="font-normal">2 veces/día</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="3" id="cep-3" />
                <Label htmlFor="cep-3" className="font-normal">3 veces/día</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="mas_de_3" id="cep-mas" />
                <Label htmlFor="cep-mas" className="font-normal">Más de 3</Label>
              </div>
            </RadioGroup>
          </div>

          <div className="space-y-2">
            <Label>Tipo de cepillo</Label>
            <RadioGroup
              value={tipoCepillo || ''}
              onValueChange={(value) => setValue('antecedentesOdontologicos.tipoCepillo', value as 'manual' | 'electrico')}
              className="flex gap-4"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="manual" id="cep-manual" />
                <Label htmlFor="cep-manual" className="font-normal">Manual</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="electrico" id="cep-electrico" />
                <Label htmlFor="cep-electrico" className="font-normal">Eléctrico</Label>
              </div>
            </RadioGroup>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="usoHiloDental"
              checked={watch('antecedentesOdontologicos.usoHiloDental')}
              onCheckedChange={(checked) => setValue('antecedentesOdontologicos.usoHiloDental', checked as boolean)}
            />
            <Label htmlFor="usoHiloDental" className="font-normal">
              Usa hilo dental regularmente
            </Label>
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="usoEnjuagueBucal"
              checked={watch('antecedentesOdontologicos.usoEnjuagueBucal')}
              onCheckedChange={(checked) => setValue('antecedentesOdontologicos.usoEnjuagueBucal', checked as boolean)}
            />
            <Label htmlFor="usoEnjuagueBucal" className="font-normal">
              Usa enjuague bucal
            </Label>
          </div>
        </div>
      </div>

      {/* Archivos adjuntos */}
      <div className="border-t pt-4 mt-6">
        <h4 className="text-md font-medium text-gray-800 mb-2">Archivos Adjuntos</h4>
        <p className="text-sm text-muted-foreground mb-4">
          Suba radiografías, fotos intraorales, documentos u otros archivos relevantes
        </p>
      </div>

      <FileUpload
        archivos={archivosAdjuntos}
        onArchivosChange={handleArchivosChange}
        onUpload={enableCloudUpload ? handleCloudUpload : undefined}
        maxFiles={50}
      />
    </div>
  )
}
