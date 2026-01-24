import { useFormContext } from 'react-hook-form'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import type { Anamnesis } from '@/types'
import { useState } from 'react'
import { Plus, X } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface CheckboxFieldProps {
  id: string
  label: string
  description?: string
  checked: boolean
  onCheckedChange: (checked: boolean) => void
  children?: React.ReactNode
}

function CheckboxField({ id, label, description, checked, onCheckedChange, children }: CheckboxFieldProps) {
  return (
    <div className="space-y-2">
      <div className="flex items-start space-x-3">
        <Checkbox
          id={id}
          checked={checked}
          onCheckedChange={onCheckedChange}
        />
        <div className="grid gap-1.5 leading-none">
          <label
            htmlFor={id}
            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
          >
            {label}
          </label>
          {description && (
            <p className="text-xs text-muted-foreground">{description}</p>
          )}
        </div>
      </div>
      {checked && children && (
        <div className="ml-7 mt-2">
          {children}
        </div>
      )}
    </div>
  )
}

export function AntecedentesMedicosForm() {
  const { register, setValue, watch } = useFormContext<Anamnesis>()
  const [nuevoMedicamento, setNuevoMedicamento] = useState('')
  const [nuevaCirugia, setNuevaCirugia] = useState('')

  const antecedentes = watch('antecedentesMedicos')
  const medicamentos = watch('antecedentesMedicos.medicamentosActuales') || []
  const cirugias = watch('antecedentesMedicos.cirugiasPrevias') || []

  const addMedicamento = () => {
    if (nuevoMedicamento.trim()) {
      setValue('antecedentesMedicos.medicamentosActuales', [...medicamentos, nuevoMedicamento.trim()])
      setNuevoMedicamento('')
    }
  }

  const removeMedicamento = (index: number) => {
    setValue('antecedentesMedicos.medicamentosActuales', medicamentos.filter((_, i) => i !== index))
  }

  const addCirugia = () => {
    if (nuevaCirugia.trim()) {
      setValue('antecedentesMedicos.cirugiasPrevias', [...cirugias, nuevaCirugia.trim()])
      setNuevaCirugia('')
    }
  }

  const removeCirugia = (index: number) => {
    setValue('antecedentesMedicos.cirugiasPrevias', cirugias.filter((_, i) => i !== index))
  }

  return (
    <div className="space-y-6">
      <div className="border-b pb-4">
        <h3 className="text-lg font-semibold text-gray-900">Antecedentes Médicos</h3>
        <p className="text-sm text-muted-foreground mt-1">
          Historial de enfermedades y condiciones médicas
        </p>
      </div>

      {/* Enfermedades Sistémicas */}
      <div className="space-y-4">
        <h4 className="text-md font-medium text-gray-800">Enfermedades Sistémicas</h4>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <CheckboxField
            id="diabetes"
            label="Diabetes"
            checked={antecedentes?.diabetes || false}
            onCheckedChange={(checked) => setValue('antecedentesMedicos.diabetes', checked)}
          >
            <Select
              value={antecedentes?.diabetesTipo}
              onValueChange={(value) => setValue('antecedentesMedicos.diabetesTipo', value as '1' | '2' | 'gestacional')}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Tipo de diabetes" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1">Tipo 1</SelectItem>
                <SelectItem value="2">Tipo 2</SelectItem>
                <SelectItem value="gestacional">Gestacional</SelectItem>
              </SelectContent>
            </Select>
          </CheckboxField>

          <CheckboxField
            id="hipertension"
            label="Hipertensión Arterial"
            checked={antecedentes?.hipertension || false}
            onCheckedChange={(checked) => setValue('antecedentesMedicos.hipertension', checked)}
          />

          <CheckboxField
            id="cardiopatia"
            label="Cardiopatía"
            description="Enfermedad del corazón"
            checked={antecedentes?.cardiopatia || false}
            onCheckedChange={(checked) => setValue('antecedentesMedicos.cardiopatia', checked)}
          >
            <Input
              placeholder="Especifique el tipo"
              {...register('antecedentesMedicos.cardiopatiaDetalle')}
            />
          </CheckboxField>

          <CheckboxField
            id="enfermedadesRespiratorias"
            label="Enfermedades Respiratorias"
            description="Asma, EPOC, etc."
            checked={antecedentes?.enfermedadesRespiratorias || false}
            onCheckedChange={(checked) => setValue('antecedentesMedicos.enfermedadesRespiratorias', checked)}
          >
            <Input
              placeholder="Especifique"
              {...register('antecedentesMedicos.respiratoriasDetalle')}
            />
          </CheckboxField>

          <CheckboxField
            id="enfermedadesRenales"
            label="Enfermedades Renales"
            checked={antecedentes?.enfermedadesRenales || false}
            onCheckedChange={(checked) => setValue('antecedentesMedicos.enfermedadesRenales', checked)}
          >
            <Input
              placeholder="Especifique"
              {...register('antecedentesMedicos.renalesDetalle')}
            />
          </CheckboxField>

          <CheckboxField
            id="enfermedadesHepaticas"
            label="Enfermedades Hepáticas"
            checked={antecedentes?.enfermedadesHepaticas || false}
            onCheckedChange={(checked) => setValue('antecedentesMedicos.enfermedadesHepaticas', checked)}
          >
            <Input
              placeholder="Especifique"
              {...register('antecedentesMedicos.hepaticasDetalle')}
            />
          </CheckboxField>

          <CheckboxField
            id="enfermedadesAutoinmunes"
            label="Enfermedades Autoinmunes"
            description="Lupus, artritis reumatoide, etc."
            checked={antecedentes?.enfermedadesAutoinmunes || false}
            onCheckedChange={(checked) => setValue('antecedentesMedicos.enfermedadesAutoinmunes', checked)}
          >
            <Input
              placeholder="Especifique"
              {...register('antecedentesMedicos.autoinmunesDetalle')}
            />
          </CheckboxField>

          <CheckboxField
            id="enfermedadesTiroides"
            label="Enfermedades de Tiroides"
            description="Hipo/hipertiroidismo"
            checked={antecedentes?.enfermedadesTiroides || false}
            onCheckedChange={(checked) => setValue('antecedentesMedicos.enfermedadesTiroides', checked)}
          >
            <Input
              placeholder="Especifique"
              {...register('antecedentesMedicos.tiroidesDetalle')}
            />
          </CheckboxField>

          <CheckboxField
            id="cancer"
            label="Cáncer"
            checked={antecedentes?.cancer || false}
            onCheckedChange={(checked) => setValue('antecedentesMedicos.cancer', checked)}
          >
            <Input
              placeholder="Tipo y estado"
              {...register('antecedentesMedicos.cancerDetalle')}
            />
          </CheckboxField>

          <CheckboxField
            id="epilepsia"
            label="Epilepsia"
            checked={antecedentes?.epilepsia || false}
            onCheckedChange={(checked) => setValue('antecedentesMedicos.epilepsia', checked)}
          />

          <CheckboxField
            id="osteoporosis"
            label="Osteoporosis"
            checked={antecedentes?.osteoporosis || false}
            onCheckedChange={(checked) => setValue('antecedentesMedicos.osteoporosis', checked)}
          />

          <CheckboxField
            id="artritis"
            label="Artritis"
            checked={antecedentes?.artritis || false}
            onCheckedChange={(checked) => setValue('antecedentesMedicos.artritis', checked)}
          />
        </div>
      </div>

      {/* Enfermedades Infecciosas */}
      <div className="border-t pt-4 space-y-4">
        <h4 className="text-md font-medium text-gray-800">Enfermedades Infecciosas</h4>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <CheckboxField
            id="vih"
            label="VIH/SIDA"
            checked={antecedentes?.vih || false}
            onCheckedChange={(checked) => setValue('antecedentesMedicos.vih', checked)}
          />

          <CheckboxField
            id="hepatitis"
            label="Hepatitis"
            checked={antecedentes?.hepatitis || false}
            onCheckedChange={(checked) => setValue('antecedentesMedicos.hepatitis', checked)}
          >
            <Select
              value={antecedentes?.hepatitisTipo}
              onValueChange={(value) => setValue('antecedentesMedicos.hepatitisTipo', value as 'A' | 'B' | 'C')}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Tipo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="A">Tipo A</SelectItem>
                <SelectItem value="B">Tipo B</SelectItem>
                <SelectItem value="C">Tipo C</SelectItem>
              </SelectContent>
            </Select>
          </CheckboxField>

          <CheckboxField
            id="tuberculosis"
            label="Tuberculosis"
            checked={antecedentes?.tuberculosis || false}
            onCheckedChange={(checked) => setValue('antecedentesMedicos.tuberculosis', checked)}
          />
        </div>
      </div>

      {/* Alergias */}
      <div className="border-t pt-4 space-y-4">
        <h4 className="text-md font-medium text-gray-800">Alergias</h4>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <CheckboxField
            id="alergiasMedicamentos"
            label="Alergia a Medicamentos"
            checked={antecedentes?.alergiasMedicamentos || false}
            onCheckedChange={(checked) => setValue('antecedentesMedicos.alergiasMedicamentos', checked)}
          >
            <Input
              placeholder="¿Cuáles medicamentos?"
              {...register('antecedentesMedicos.alergiasMedicamentosDetalle')}
            />
          </CheckboxField>

          <CheckboxField
            id="alergiasAlimentos"
            label="Alergia a Alimentos"
            checked={antecedentes?.alergiasAlimentos || false}
            onCheckedChange={(checked) => setValue('antecedentesMedicos.alergiasAlimentos', checked)}
          >
            <Input
              placeholder="¿Cuáles alimentos?"
              {...register('antecedentesMedicos.alergiasAlimentosDetalle')}
            />
          </CheckboxField>

          <CheckboxField
            id="alergiasLatex"
            label="Alergia al Látex"
            checked={antecedentes?.alergiasLatex || false}
            onCheckedChange={(checked) => setValue('antecedentesMedicos.alergiasLatex', checked)}
          />

          <CheckboxField
            id="alergiasAnestesia"
            label="Alergia a Anestésicos"
            description="Importante para procedimientos"
            checked={antecedentes?.alergiasAnestesia || false}
            onCheckedChange={(checked) => setValue('antecedentesMedicos.alergiasAnestesia', checked)}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="otrasAlergias">Otras Alergias</Label>
          <Textarea
            id="otrasAlergias"
            {...register('antecedentesMedicos.otrasAlergias')}
            placeholder="Describa otras alergias (polen, ácaros, etc.)"
            rows={2}
          />
        </div>
      </div>

      {/* Medicamentos Actuales */}
      <div className="border-t pt-4 space-y-4">
        <h4 className="text-md font-medium text-gray-800">Medicamentos Actuales</h4>

        <div className="flex gap-2">
          <Input
            value={nuevoMedicamento}
            onChange={(e) => setNuevoMedicamento(e.target.value)}
            placeholder="Nombre del medicamento y dosis"
            onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addMedicamento())}
          />
          <Button type="button" variant="outline" size="icon" onClick={addMedicamento}>
            <Plus className="h-4 w-4" />
          </Button>
        </div>

        {medicamentos.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {medicamentos.map((med, index) => (
              <div
                key={index}
                className="flex items-center gap-1 bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-sm"
              >
                <span>{med}</span>
                <button
                  type="button"
                  onClick={() => removeMedicamento(index)}
                  className="hover:text-blue-900"
                >
                  <X className="h-3 w-3" />
                </button>
              </div>
            ))}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
          <CheckboxField
            id="anticoagulantes"
            label="Toma Anticoagulantes"
            description="Warfarina, aspirina, etc."
            checked={antecedentes?.anticoagulantes || false}
            onCheckedChange={(checked) => setValue('antecedentesMedicos.anticoagulantes', checked)}
          >
            <Input
              placeholder="¿Cuál anticoagulante?"
              {...register('antecedentesMedicos.anticoagulantesDetalle')}
            />
          </CheckboxField>

          <CheckboxField
            id="bifosfonatos"
            label="Toma Bifosfonatos"
            description="Para osteoporosis (importante)"
            checked={antecedentes?.bifosfonatos || false}
            onCheckedChange={(checked) => setValue('antecedentesMedicos.bifosfonatos', checked)}
          />
        </div>
      </div>

      {/* Cirugías Previas */}
      <div className="border-t pt-4 space-y-4">
        <h4 className="text-md font-medium text-gray-800">Cirugías Previas</h4>

        <div className="flex gap-2">
          <Input
            value={nuevaCirugia}
            onChange={(e) => setNuevaCirugia(e.target.value)}
            placeholder="Tipo de cirugía y año"
            onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addCirugia())}
          />
          <Button type="button" variant="outline" size="icon" onClick={addCirugia}>
            <Plus className="h-4 w-4" />
          </Button>
        </div>

        {cirugias.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {cirugias.map((cir, index) => (
              <div
                key={index}
                className="flex items-center gap-1 bg-purple-50 text-purple-700 px-3 py-1 rounded-full text-sm"
              >
                <span>{cir}</span>
                <button
                  type="button"
                  onClick={() => removeCirugia(index)}
                  className="hover:text-purple-900"
                >
                  <X className="h-3 w-3" />
                </button>
              </div>
            ))}
          </div>
        )}

        <CheckboxField
          id="hospitalizacionesRecientes"
          label="Hospitalizaciones Recientes"
          description="En los últimos 6 meses"
          checked={antecedentes?.hospitalizacionesRecientes || false}
          onCheckedChange={(checked) => setValue('antecedentesMedicos.hospitalizacionesRecientes', checked)}
        >
          <Textarea
            placeholder="Motivo y fecha de la hospitalización"
            {...register('antecedentesMedicos.hospitalizacionesDetalle')}
            rows={2}
          />
        </CheckboxField>
      </div>

      {/* Embarazo y otros */}
      <div className="border-t pt-4 space-y-4">
        <h4 className="text-md font-medium text-gray-800">Otros Antecedentes</h4>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <CheckboxField
            id="embarazo"
            label="Embarazo Actual"
            checked={antecedentes?.embarazo || false}
            onCheckedChange={(checked) => setValue('antecedentesMedicos.embarazo', checked)}
          >
            <div className="space-y-2">
              <Label>Semanas de embarazo</Label>
              <Input
                type="number"
                min={1}
                max={42}
                {...register('antecedentesMedicos.semanaEmbarazo', { valueAsNumber: true })}
              />
            </div>
          </CheckboxField>

          <CheckboxField
            id="lactancia"
            label="Lactancia Actual"
            checked={antecedentes?.lactancia || false}
            onCheckedChange={(checked) => setValue('antecedentesMedicos.lactancia', checked)}
          />

          <CheckboxField
            id="marcapasos"
            label="Marcapasos"
            checked={antecedentes?.marcapasos || false}
            onCheckedChange={(checked) => setValue('antecedentesMedicos.marcapasos', checked)}
          />

          <CheckboxField
            id="protesisArticulares"
            label="Prótesis Articulares"
            description="Cadera, rodilla, etc."
            checked={antecedentes?.protesisArticulares || false}
            onCheckedChange={(checked) => setValue('antecedentesMedicos.protesisArticulares', checked)}
          />

          <CheckboxField
            id="radioterapia"
            label="Ha recibido Radioterapia"
            checked={antecedentes?.radioterapia || false}
            onCheckedChange={(checked) => setValue('antecedentesMedicos.radioterapia', checked)}
          />

          <CheckboxField
            id="quimioterapia"
            label="Ha recibido Quimioterapia"
            checked={antecedentes?.quimioterapia || false}
            onCheckedChange={(checked) => setValue('antecedentesMedicos.quimioterapia', checked)}
          />
        </div>
      </div>
    </div>
  )
}
