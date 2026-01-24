import { useState } from 'react'
import { useForm, FormProvider } from 'react-hook-form'
import { Button } from '@/components/ui/button'
import { DatosPersonalesForm } from './DatosPersonalesForm'
import { AntecedentesMedicosForm } from './AntecedentesMedicosForm'
import { AntecedentesOdontologicosForm } from './AntecedentesOdontologicosForm'
import { HabitosEstiloVidaForm } from './HabitosEstiloVidaForm'
import { EstadoEmocionalFamiliarForm } from './EstadoEmocionalFamiliarForm'
import type { Anamnesis } from '@/types'
import { ChevronLeft, ChevronRight, Check, User, Stethoscope, SmilePlus, HeartPulse, Brain } from 'lucide-react'
import { cn } from '@/lib/utils'

const STEPS = [
  {
    id: 1,
    title: 'Datos Personales',
    shortTitle: 'Personal',
    icon: User,
    description: 'Información básica del paciente',
  },
  {
    id: 2,
    title: 'Antecedentes Médicos',
    shortTitle: 'Médicos',
    icon: Stethoscope,
    description: 'Historial de enfermedades y medicamentos',
  },
  {
    id: 3,
    title: 'Antecedentes Odontológicos',
    shortTitle: 'Odontológicos',
    icon: SmilePlus,
    description: 'Historia dental y hábitos de higiene',
  },
  {
    id: 4,
    title: 'Hábitos y Estilo de Vida',
    shortTitle: 'Hábitos',
    icon: HeartPulse,
    description: 'Alimentación, ejercicio y hábitos',
  },
  {
    id: 5,
    title: 'Estado Emocional',
    shortTitle: 'Emocional',
    icon: Brain,
    description: 'Salud mental y antecedentes familiares',
  },
]

// Valores por defecto para la anamnesis
const DEFAULT_ANAMNESIS: Partial<Anamnesis> = {
  datosPersonales: {
    nombre: '',
    apellido: '',
    fechaNacimiento: '',
    genero: 'masculino',
    estadoCivil: 'soltero',
    ocupacion: '',
    telefono: '',
    direccion: '',
    ciudad: '',
    documentoIdentidad: '',
  },
  antecedentesMedicos: {
    diabetes: false,
    hipertension: false,
    cardiopatia: false,
    enfermedadesRespiratorias: false,
    enfermedadesRenales: false,
    enfermedadesHepaticas: false,
    enfermedadesAutoinmunes: false,
    cancer: false,
    vih: false,
    hepatitis: false,
    tuberculosis: false,
    epilepsia: false,
    enfermedadesTiroides: false,
    osteoporosis: false,
    artritis: false,
    alergiasMedicamentos: false,
    alergiasAlimentos: false,
    alergiasLatex: false,
    alergiasAnestesia: false,
    medicamentosActuales: [],
    anticoagulantes: false,
    bifosfonatos: false,
    cirugiasPrevias: [],
    hospitalizacionesRecientes: false,
    embarazo: false,
    lactancia: false,
    marcapasos: false,
    protesisArticulares: false,
    radioterapia: false,
    quimioterapia: false,
  },
  antecedentesOdontologicos: {
    motivoConsulta: '',
    experienciasNegativas: false,
    sangradoEncias: false,
    sensibilidadDental: false,
    bruxismo: false,
    usaFerula: false,
    dolorATM: false,
    chasquidoATM: false,
    dificultadAbrirBoca: false,
    tratamientoOrtodoncia: false,
    ortodonciaActual: false,
    protesisDental: false,
    implantes: false,
    endodoncias: false,
    extracciones: false,
    problemasAnestesia: false,
    hemorragiasPostExtraccion: false,
    halitosis: false,
    sequedadBucal: false,
    frecuenciaCepillado: '2',
    usoHiloDental: false,
    usoEnjuagueBucal: false,
    tipoCepillo: 'manual',
    archivosAdjuntos: [],
    otrosSintomas: false,
    otrosATM: false,
    otrosTratamientos: false,
  },
  habitosEstiloVida: {
    tabaquismo: false,
    exFumador: false,
    alcohol: false,
    drogas: false,
    onicofagia: false,
    mordisqueoLabios: false,
    mordisqueoObjetos: false,
    succionDigital: false,
    respiracionBucal: false,
    tipoAlimentacion: 'omnivora',
    consumoAzucar: 'moderado',
    consumoCafeina: 'bajo',
    consumoBebidasAcidas: false,
    trastornosAlimenticios: false,
    nivelEstres: 'moderado',
    calidadSueno: 'regular',
    horasSueno: 7,
    ejercicio: 'ocasional',
    consumoAguaDiario: '1_2L',
    exposicionSolar: 'moderada',
  },
  antecedentesFamiliares: {
    diabetesFamiliar: false,
    hipertensionFamiliar: false,
    cardiopatiaFamiliar: false,
    cancerFamiliar: false,
    enfermedadesAutoinmunesFamiliar: false,
    problemasPeriodontalsFamiliar: false,
    perdidaDentalTempranaFamiliar: false,
    maloclusionFamiliar: false,
  },
  estadoEmocional: {
    estadoAnimoGeneral: 'estable',
    eventoEstresanteReciente: false,
    tratamientoPsicologico: false,
    medicacionPsiquiatrica: false,
    relacionesFamiliares: 'buenas',
    satisfaccionLaboral: 'media',
    redApoyo: true,
  },
  consentimientoInformado: false,
}

interface AnamnesisWizardProps {
  onSubmit: (data: Anamnesis) => Promise<void>
  onCancel?: () => void
  isLoading?: boolean
  initialData?: Partial<Anamnesis>
}

export function AnamnesisWizard({ onSubmit, onCancel, isLoading, initialData }: AnamnesisWizardProps) {
  const [currentStep, setCurrentStep] = useState(1)

  const methods = useForm<Anamnesis>({
    defaultValues: { ...DEFAULT_ANAMNESIS, ...initialData } as Anamnesis,
    mode: 'onBlur',
  })

  const { handleSubmit, trigger, watch } = methods

  // Validar paso actual antes de avanzar
  const validateCurrentStep = async (): Promise<boolean> => {
    let fieldsToValidate: string[] = []

    switch (currentStep) {
      case 1:
        fieldsToValidate = [
          'datosPersonales.nombre',
          'datosPersonales.apellido',
          'datosPersonales.documentoIdentidad',
          'datosPersonales.fechaNacimiento',
          'datosPersonales.ocupacion',
          'datosPersonales.telefono',
          'datosPersonales.direccion',
          'datosPersonales.ciudad',
        ]
        break
      case 2:
        // Los antecedentes médicos no tienen campos requeridos obligatorios
        return true
      case 3:
        fieldsToValidate = ['antecedentesOdontologicos.motivoConsulta']
        break
      case 4:
      case 5:
        // Estos pasos no tienen campos requeridos obligatorios
        return true
    }

    const result = await trigger(fieldsToValidate as (keyof Anamnesis)[])
    return result
  }

  const handleNext = async () => {
    const isValid = await validateCurrentStep()
    if (isValid && currentStep < STEPS.length) {
      setCurrentStep(currentStep + 1)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

  const handlePrev = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

  const handleFormSubmit = async (data: Anamnesis) => {
    // Verificar consentimiento
    if (!data.consentimientoInformado) {
      alert('Debe aceptar el consentimiento informado para continuar')
      return
    }
    await onSubmit(data)
  }

  const consentimientoAceptado = watch('consentimientoInformado')

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return <DatosPersonalesForm />
      case 2:
        return <AntecedentesMedicosForm />
      case 3:
        return <AntecedentesOdontologicosForm />
      case 4:
        return <HabitosEstiloVidaForm />
      case 5:
        return <EstadoEmocionalFamiliarForm />
      default:
        return null
    }
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* Progress Steps */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          {STEPS.map((step, index) => {
            const StepIcon = step.icon
            const isActive = currentStep === step.id
            const isCompleted = currentStep > step.id

            return (
              <div key={step.id} className="flex items-center">
                {/* Step circle */}
                <button
                  type="button"
                  onClick={() => {
                    if (isCompleted) setCurrentStep(step.id)
                  }}
                  disabled={!isCompleted}
                  className={cn(
                    'flex items-center justify-center w-10 h-10 rounded-full border-2 transition-all',
                    isActive && 'border-blue-600 bg-blue-600 text-white',
                    isCompleted && 'border-green-600 bg-green-600 text-white cursor-pointer hover:bg-green-700',
                    !isActive && !isCompleted && 'border-gray-300 bg-white text-gray-400'
                  )}
                >
                  {isCompleted ? (
                    <Check className="w-5 h-5" />
                  ) : (
                    <StepIcon className="w-5 h-5" />
                  )}
                </button>

                {/* Step label */}
                <div className="hidden md:block ml-2">
                  <p
                    className={cn(
                      'text-sm font-medium',
                      isActive && 'text-blue-600',
                      isCompleted && 'text-green-600',
                      !isActive && !isCompleted && 'text-gray-400'
                    )}
                  >
                    {step.shortTitle}
                  </p>
                </div>

                {/* Connector line */}
                {index < STEPS.length - 1 && (
                  <div
                    className={cn(
                      'hidden sm:block w-8 md:w-16 lg:w-24 h-0.5 mx-2',
                      currentStep > step.id ? 'bg-green-600' : 'bg-gray-200'
                    )}
                  />
                )}
              </div>
            )
          })}
        </div>

        {/* Current step info */}
        <div className="mt-4 text-center">
          <h2 className="text-xl font-semibold text-gray-900">
            {STEPS[currentStep - 1].title}
          </h2>
          <p className="text-sm text-muted-foreground">
            {STEPS[currentStep - 1].description}
          </p>
        </div>
      </div>

      {/* Form */}
      <FormProvider {...methods}>
        <form onSubmit={handleSubmit(handleFormSubmit)}>
          <div className="bg-white rounded-xl shadow-sm border p-6 md:p-8">
            {renderStepContent()}
          </div>

          {/* Navigation buttons */}
          <div className="mt-6 flex items-center justify-between">
            <div>
              {onCancel && (
                <Button type="button" variant="ghost" onClick={onCancel}>
                  Cancelar
                </Button>
              )}
            </div>

            <div className="flex items-center gap-3">
              {currentStep > 1 && (
                <Button type="button" variant="outline" onClick={handlePrev}>
                  <ChevronLeft className="w-4 h-4 mr-1" />
                  Anterior
                </Button>
              )}

              {currentStep < STEPS.length ? (
                <Button type="button" onClick={handleNext}>
                  Siguiente
                  <ChevronRight className="w-4 h-4 ml-1" />
                </Button>
              ) : (
                <Button
                  type="submit"
                  disabled={isLoading || !consentimientoAceptado}
                  className="bg-green-600 hover:bg-green-700"
                >
                  {isLoading ? (
                    <>
                      <span className="animate-spin mr-2">⏳</span>
                      Guardando...
                    </>
                  ) : (
                    <>
                      <Check className="w-4 h-4 mr-1" />
                      Guardar Paciente
                    </>
                  )}
                </Button>
              )}
            </div>
          </div>
        </form>
      </FormProvider>
    </div>
  )
}
