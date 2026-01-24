import { useFormContext } from 'react-hook-form'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import type { Anamnesis, TipoAlimentacion, NivelEstres, CalidadSueno, FrecuenciaEjercicio } from '@/types'

const TIPOS_ALIMENTACION: { value: TipoAlimentacion; label: string }[] = [
  { value: 'omnivora', label: 'Omnívora' },
  { value: 'vegetariana', label: 'Vegetariana' },
  { value: 'vegana', label: 'Vegana' },
  { value: 'cetogenica', label: 'Cetogénica/Keto' },
  { value: 'mediterranea', label: 'Mediterránea' },
  { value: 'otra', label: 'Otra' },
]

const NIVELES_ESTRES: { value: NivelEstres; label: string; color: string }[] = [
  { value: 'bajo', label: 'Bajo', color: 'bg-green-100 text-green-800' },
  { value: 'moderado', label: 'Moderado', color: 'bg-yellow-100 text-yellow-800' },
  { value: 'alto', label: 'Alto', color: 'bg-orange-100 text-orange-800' },
  { value: 'muy_alto', label: 'Muy Alto', color: 'bg-red-100 text-red-800' },
]

const CALIDAD_SUENO: { value: CalidadSueno; label: string }[] = [
  { value: 'buena', label: 'Buena' },
  { value: 'regular', label: 'Regular' },
  { value: 'mala', label: 'Mala' },
  { value: 'insomnio', label: 'Insomnio' },
]

const FRECUENCIA_EJERCICIO: { value: FrecuenciaEjercicio; label: string }[] = [
  { value: 'nunca', label: 'Nunca' },
  { value: 'ocasional', label: 'Ocasional (1-2/semana)' },
  { value: 'regular', label: 'Regular (3-4/semana)' },
  { value: 'diario', label: 'Diario' },
]

export function HabitosEstiloVidaForm() {
  const { register, setValue, watch } = useFormContext<Anamnesis>()

  const tabaquismo = watch('habitosEstiloVida.tabaquismo')
  const exFumador = watch('habitosEstiloVida.exFumador')
  const alcohol = watch('habitosEstiloVida.alcohol')
  const drogas = watch('habitosEstiloVida.drogas')
  const trastornosAlimenticios = watch('habitosEstiloVida.trastornosAlimenticios')
  const tipoAlimentacion = watch('habitosEstiloVida.tipoAlimentacion')
  const nivelEstres = watch('habitosEstiloVida.nivelEstres')
  const calidadSueno = watch('habitosEstiloVida.calidadSueno')
  const ejercicio = watch('habitosEstiloVida.ejercicio')

  return (
    <div className="space-y-6">
      <div className="border-b pb-4">
        <h3 className="text-lg font-semibold text-gray-900">Hábitos y Estilo de Vida</h3>
        <p className="text-sm text-muted-foreground mt-1">
          Información sobre hábitos que pueden afectar la salud bucal
        </p>
      </div>

      {/* Hábitos nocivos */}
      <div className="border-t pt-4">
        <h4 className="text-md font-medium text-gray-800 mb-4">Hábitos Nocivos</h4>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Tabaquismo */}
        <div className="space-y-4 p-4 bg-gray-50 rounded-lg">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="tabaquismo"
              checked={tabaquismo}
              onCheckedChange={(checked) => {
                setValue('habitosEstiloVida.tabaquismo', checked as boolean)
                if (!checked) {
                  setValue('habitosEstiloVida.tabaquismoFrecuencia', undefined)
                  setValue('habitosEstiloVida.tabaquismoAnios', undefined)
                }
              }}
            />
            <Label htmlFor="tabaquismo" className="font-medium">
              Fuma actualmente
            </Label>
          </div>
          {tabaquismo && (
            <div className="ml-6 space-y-3">
              <div>
                <Label className="text-sm text-gray-600">Frecuencia</Label>
                <Input
                  {...register('habitosEstiloVida.tabaquismoFrecuencia')}
                  placeholder="Ej: 10 cigarros/día"
                  className="mt-1"
                />
              </div>
              <div>
                <Label className="text-sm text-gray-600">Años fumando</Label>
                <Input
                  type="number"
                  min={0}
                  {...register('habitosEstiloVida.tabaquismoAnios', { valueAsNumber: true })}
                  placeholder="Años"
                  className="mt-1 w-24"
                />
              </div>
            </div>
          )}

          {!tabaquismo && (
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="exFumador"
                  checked={exFumador}
                  onCheckedChange={(checked) => setValue('habitosEstiloVida.exFumador', checked as boolean)}
                />
                <Label htmlFor="exFumador" className="font-normal">
                  Ex-fumador
                </Label>
              </div>
              {exFumador && (
                <div className="ml-6">
                  <Label className="text-sm text-gray-600">Años sin fumar</Label>
                  <Input
                    type="number"
                    min={0}
                    {...register('habitosEstiloVida.aniosDejarFumar', { valueAsNumber: true })}
                    placeholder="Años"
                    className="mt-1 w-24"
                  />
                </div>
              )}
            </div>
          )}
        </div>

        {/* Alcohol y drogas */}
        <div className="space-y-4 p-4 bg-gray-50 rounded-lg">
          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="alcohol"
                checked={alcohol}
                onCheckedChange={(checked) => setValue('habitosEstiloVida.alcohol', checked as boolean)}
              />
              <Label htmlFor="alcohol" className="font-medium">
                Consume alcohol
              </Label>
            </div>
            {alcohol && (
              <div className="ml-6">
                <Label className="text-sm text-gray-600">Frecuencia</Label>
                <Select
                  value={watch('habitosEstiloVida.alcoholFrecuencia') || ''}
                  onValueChange={(value) => setValue('habitosEstiloVida.alcoholFrecuencia', value as 'ocasional' | 'social' | 'frecuente' | 'diario')}
                >
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Seleccionar" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ocasional">Ocasional</SelectItem>
                    <SelectItem value="social">Social (fines de semana)</SelectItem>
                    <SelectItem value="frecuente">Frecuente</SelectItem>
                    <SelectItem value="diario">Diario</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>

          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="drogas"
                checked={drogas}
                onCheckedChange={(checked) => setValue('habitosEstiloVida.drogas', checked as boolean)}
              />
              <Label htmlFor="drogas" className="font-medium">
                Uso de sustancias psicoactivas
              </Label>
            </div>
            {drogas && (
              <div className="ml-6">
                <Input
                  {...register('habitosEstiloVida.drogasDetalle')}
                  placeholder="Especificar (confidencial)"
                  className="mt-1"
                />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Hábitos orales */}
      <div className="border-t pt-4 mt-6">
        <h4 className="text-md font-medium text-gray-800 mb-4">Hábitos Orales</h4>
        <p className="text-sm text-muted-foreground mb-4">
          Estos hábitos pueden afectar la salud dental y la articulación temporomandibular
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        <div className="flex items-center space-x-2">
          <Checkbox
            id="onicofagia"
            checked={watch('habitosEstiloVida.onicofagia')}
            onCheckedChange={(checked) => setValue('habitosEstiloVida.onicofagia', checked as boolean)}
          />
          <Label htmlFor="onicofagia" className="font-normal">
            Morderse las uñas
          </Label>
        </div>

        <div className="flex items-center space-x-2">
          <Checkbox
            id="mordisqueoLabios"
            checked={watch('habitosEstiloVida.mordisqueoLabios')}
            onCheckedChange={(checked) => setValue('habitosEstiloVida.mordisqueoLabios', checked as boolean)}
          />
          <Label htmlFor="mordisqueoLabios" className="font-normal">
            Mordisqueo de labios/mejillas
          </Label>
        </div>

        <div className="flex items-center space-x-2">
          <Checkbox
            id="mordisqueoObjetos"
            checked={watch('habitosEstiloVida.mordisqueoObjetos')}
            onCheckedChange={(checked) => setValue('habitosEstiloVida.mordisqueoObjetos', checked as boolean)}
          />
          <Label htmlFor="mordisqueoObjetos" className="font-normal">
            Morder objetos (bolígrafos, etc.)
          </Label>
        </div>

        <div className="flex items-center space-x-2">
          <Checkbox
            id="succionDigital"
            checked={watch('habitosEstiloVida.succionDigital')}
            onCheckedChange={(checked) => setValue('habitosEstiloVida.succionDigital', checked as boolean)}
          />
          <Label htmlFor="succionDigital" className="font-normal">
            Succión digital
          </Label>
        </div>

        <div className="flex items-center space-x-2">
          <Checkbox
            id="respiracionBucal"
            checked={watch('habitosEstiloVida.respiracionBucal')}
            onCheckedChange={(checked) => setValue('habitosEstiloVida.respiracionBucal', checked as boolean)}
          />
          <Label htmlFor="respiracionBucal" className="font-normal">
            Respiración bucal
          </Label>
        </div>
      </div>

      {/* Alimentación */}
      <div className="border-t pt-4 mt-6">
        <h4 className="text-md font-medium text-gray-800 mb-4">Alimentación</h4>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Tipo de alimentación *</Label>
            <Select
              value={tipoAlimentacion || ''}
              onValueChange={(value) => setValue('habitosEstiloVida.tipoAlimentacion', value as TipoAlimentacion)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Seleccionar" />
              </SelectTrigger>
              <SelectContent>
                {TIPOS_ALIMENTACION.map((tipo) => (
                  <SelectItem key={tipo.value} value={tipo.value}>
                    {tipo.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {tipoAlimentacion === 'otra' && (
            <Input
              {...register('habitosEstiloVida.alimentacionDetalle')}
              placeholder="Especificar tipo de dieta"
            />
          )}

          <div className="space-y-2">
            <Label>Consumo de azúcar *</Label>
            <RadioGroup
              value={watch('habitosEstiloVida.consumoAzucar') || ''}
              onValueChange={(value) => setValue('habitosEstiloVida.consumoAzucar', value as 'bajo' | 'moderado' | 'alto')}
              className="flex gap-4"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="bajo" id="azucar-bajo" />
                <Label htmlFor="azucar-bajo" className="font-normal">Bajo</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="moderado" id="azucar-mod" />
                <Label htmlFor="azucar-mod" className="font-normal">Moderado</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="alto" id="azucar-alto" />
                <Label htmlFor="azucar-alto" className="font-normal">Alto</Label>
              </div>
            </RadioGroup>
          </div>
        </div>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Consumo de cafeína</Label>
            <RadioGroup
              value={watch('habitosEstiloVida.consumoCafeina') || ''}
              onValueChange={(value) => setValue('habitosEstiloVida.consumoCafeina', value as 'ninguno' | 'bajo' | 'moderado' | 'alto')}
              className="grid grid-cols-2 gap-2"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="ninguno" id="cafe-ninguno" />
                <Label htmlFor="cafe-ninguno" className="font-normal">Ninguno</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="bajo" id="cafe-bajo" />
                <Label htmlFor="cafe-bajo" className="font-normal">Bajo (1-2/día)</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="moderado" id="cafe-mod" />
                <Label htmlFor="cafe-mod" className="font-normal">Moderado (3-4/día)</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="alto" id="cafe-alto" />
                <Label htmlFor="cafe-alto" className="font-normal">Alto (+5/día)</Label>
              </div>
            </RadioGroup>
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="consumoBebidasAcidas"
              checked={watch('habitosEstiloVida.consumoBebidasAcidas')}
              onCheckedChange={(checked) => setValue('habitosEstiloVida.consumoBebidasAcidas', checked as boolean)}
            />
            <Label htmlFor="consumoBebidasAcidas" className="font-normal">
              Consumo frecuente de bebidas ácidas (refrescos, cítricos)
            </Label>
          </div>

          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="trastornosAlimenticios"
                checked={trastornosAlimenticios}
                onCheckedChange={(checked) => setValue('habitosEstiloVida.trastornosAlimenticios', checked as boolean)}
              />
              <Label htmlFor="trastornosAlimenticios" className="font-normal">
                Trastornos alimenticios
              </Label>
            </div>
            {trastornosAlimenticios && (
              <Input
                {...register('habitosEstiloVida.trastornosDetalle')}
                placeholder="Especificar (confidencial)"
                className="ml-6"
              />
            )}
          </div>
        </div>
      </div>

      {/* Estilo de vida */}
      <div className="border-t pt-4 mt-6">
        <h4 className="text-md font-medium text-gray-800 mb-4">Estilo de Vida</h4>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Nivel de estrés *</Label>
            <div className="flex flex-wrap gap-2">
              {NIVELES_ESTRES.map((nivel) => (
                <button
                  key={nivel.value}
                  type="button"
                  onClick={() => setValue('habitosEstiloVida.nivelEstres', nivel.value)}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                    nivelEstres === nivel.value
                      ? `${nivel.color} ring-2 ring-offset-2 ring-gray-400`
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {nivel.label}
                </button>
              ))}
            </div>
          </div>

          {(nivelEstres === 'alto' || nivelEstres === 'muy_alto') && (
            <div className="space-y-2">
              <Label className="text-sm text-gray-600">Principales fuentes de estrés</Label>
              <Textarea
                {...register('habitosEstiloVida.fuentesEstres')}
                placeholder="Trabajo, familia, salud, finanzas..."
                rows={2}
              />
            </div>
          )}

          <div className="space-y-2">
            <Label>Calidad de sueño *</Label>
            <Select
              value={calidadSueno || ''}
              onValueChange={(value) => setValue('habitosEstiloVida.calidadSueno', value as CalidadSueno)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Seleccionar" />
              </SelectTrigger>
              <SelectContent>
                {CALIDAD_SUENO.map((calidad) => (
                  <SelectItem key={calidad.value} value={calidad.value}>
                    {calidad.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Horas de sueño promedio</Label>
            <Input
              type="number"
              min={1}
              max={16}
              {...register('habitosEstiloVida.horasSueno', { valueAsNumber: true })}
              placeholder="Horas"
              className="w-24"
            />
          </div>
        </div>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Ejercicio físico</Label>
            <Select
              value={ejercicio || ''}
              onValueChange={(value) => setValue('habitosEstiloVida.ejercicio', value as FrecuenciaEjercicio)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Seleccionar frecuencia" />
              </SelectTrigger>
              <SelectContent>
                {FRECUENCIA_EJERCICIO.map((freq) => (
                  <SelectItem key={freq.value} value={freq.value}>
                    {freq.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {(ejercicio === 'regular' || ejercicio === 'diario') && (
            <Input
              {...register('habitosEstiloVida.tipoEjercicio')}
              placeholder="Tipo de ejercicio (gimnasio, correr, natación...)"
            />
          )}

          <div className="space-y-2">
            <Label>Consumo de agua diario *</Label>
            <RadioGroup
              value={watch('habitosEstiloVida.consumoAguaDiario') || ''}
              onValueChange={(value) => setValue('habitosEstiloVida.consumoAguaDiario', value as 'menos_1L' | '1_2L' | '2_3L' | 'mas_3L')}
              className="grid grid-cols-2 gap-2"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="menos_1L" id="agua-menos1" />
                <Label htmlFor="agua-menos1" className="font-normal">Menos de 1L</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="1_2L" id="agua-1-2" />
                <Label htmlFor="agua-1-2" className="font-normal">1-2 Litros</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="2_3L" id="agua-2-3" />
                <Label htmlFor="agua-2-3" className="font-normal">2-3 Litros</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="mas_3L" id="agua-mas3" />
                <Label htmlFor="agua-mas3" className="font-normal">Más de 3L</Label>
              </div>
            </RadioGroup>
          </div>

          <div className="space-y-2">
            <Label>Exposición solar</Label>
            <RadioGroup
              value={watch('habitosEstiloVida.exposicionSolar') || ''}
              onValueChange={(value) => setValue('habitosEstiloVida.exposicionSolar', value as 'baja' | 'moderada' | 'alta')}
              className="flex gap-4"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="baja" id="sol-baja" />
                <Label htmlFor="sol-baja" className="font-normal">Baja</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="moderada" id="sol-mod" />
                <Label htmlFor="sol-mod" className="font-normal">Moderada</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="alta" id="sol-alta" />
                <Label htmlFor="sol-alta" className="font-normal">Alta</Label>
              </div>
            </RadioGroup>
          </div>
        </div>
      </div>
    </div>
  )
}
