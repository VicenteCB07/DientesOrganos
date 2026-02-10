import { useState, useEffect, useRef, useMemo } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { useAuthContext } from '@/modules/auth'
import { usePatient, useUpdatePatient, useOdontograma, useOdontogramasHistorial, useCreateOdontograma, useUpdateTooth, useUpdateOdontogramaObservaciones, useCerrarOdontograma } from '../hooks/usePatients'
import { formatearNombreCompleto, calcularEdad } from '../services/patientsService'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog'
import { ArrowLeft, User, LogOut, Calendar, Phone, MapPin, FileText, Activity, AlertTriangle, Heart, Loader2, Search, X, Download, Pencil, Plus, History, Lock, FolderOpen, Trash2 } from 'lucide-react'
import type { DientePaciente, EstadoDiente, Odontograma, ArchivoAdjunto } from '@/types'
import { TEETH_DATA } from '@/modules/teeth/data/teethData'
import { LanguageSelector } from '@/components/LanguageSelector'
import { ThemeToggle } from '@/components/ThemeToggle'
import { useLanguage } from '@/lib/i18n/LanguageContext'
import { generatePatientReport } from '../services/pdfReportService'
import { deleteFile } from '@/lib/firebase/storage'

// Estados de diente disponibles - Lista completa sincronizada con EstadoDiente type
const ESTADOS_DIENTE_RAW: { value: EstadoDiente; label: string; color: string; categoria: string }[] = [
  // === ESTADO NORMAL ===
  { value: 'sano', label: 'Sano', color: 'bg-green-500', categoria: 'Estado Normal' },

  // === CARIES Y LESIONES CARIOSAS ===
  { value: 'caries', label: 'Caries', color: 'bg-yellow-500', categoria: 'Caries' },
  { value: 'caries_incipiente', label: 'Caries incipiente (mancha blanca)', color: 'bg-yellow-300', categoria: 'Caries' },
  { value: 'caries_recurrente', label: 'Caries recurrente/secundaria', color: 'bg-yellow-600', categoria: 'Caries' },
  { value: 'caries_radicular', label: 'Caries radicular', color: 'bg-yellow-700', categoria: 'Caries' },
  { value: 'caries_rampante', label: 'Caries rampante (agresiva)', color: 'bg-yellow-800', categoria: 'Caries' },

  // === RESTAURACIONES ===
  { value: 'obturado', label: 'Obturado/Restaurado', color: 'bg-blue-500', categoria: 'Restauraciones' },
  { value: 'obturado_amalgama', label: 'Obturación amalgama', color: 'bg-gray-500', categoria: 'Restauraciones' },
  { value: 'obturado_composite', label: 'Obturación composite/resina', color: 'bg-blue-400', categoria: 'Restauraciones' },
  { value: 'obturado_ionomero', label: 'Obturación ionómero de vidrio', color: 'bg-blue-300', categoria: 'Restauraciones' },
  { value: 'obturado_temporal', label: 'Obturación temporal', color: 'bg-blue-200', categoria: 'Restauraciones' },
  { value: 'obturado_filtrado', label: 'Obturación filtrada', color: 'bg-blue-700', categoria: 'Restauraciones' },
  { value: 'inlay', label: 'Inlay', color: 'bg-indigo-400', categoria: 'Restauraciones' },
  { value: 'onlay', label: 'Onlay', color: 'bg-indigo-500', categoria: 'Restauraciones' },
  { value: 'overlay', label: 'Overlay', color: 'bg-indigo-600', categoria: 'Restauraciones' },
  { value: 'sellante', label: 'Sellante de fisuras', color: 'bg-teal-400', categoria: 'Restauraciones' },
  { value: 'carilla', label: 'Carilla/Veneer', color: 'bg-sky-400', categoria: 'Restauraciones' },

  // === CORONAS Y PRÓTESIS FIJA ===
  { value: 'corona', label: 'Corona', color: 'bg-purple-500', categoria: 'Coronas/Prótesis' },
  { value: 'corona_metal', label: 'Corona metálica', color: 'bg-gray-600', categoria: 'Coronas/Prótesis' },
  { value: 'corona_porcelana', label: 'Corona porcelana', color: 'bg-purple-400', categoria: 'Coronas/Prótesis' },
  { value: 'corona_metal_porcelana', label: 'Corona metal-cerámica', color: 'bg-purple-600', categoria: 'Coronas/Prótesis' },
  { value: 'corona_zirconio', label: 'Corona zirconio', color: 'bg-violet-400', categoria: 'Coronas/Prótesis' },
  { value: 'corona_provisional', label: 'Corona provisional', color: 'bg-purple-300', categoria: 'Coronas/Prótesis' },
  { value: 'puente_pilar', label: 'Pilar de puente', color: 'bg-fuchsia-500', categoria: 'Coronas/Prótesis' },
  { value: 'puente_pontico', label: 'Póntico de puente', color: 'bg-fuchsia-400', categoria: 'Coronas/Prótesis' },
  { value: 'protesis_fija', label: 'Prótesis fija', color: 'bg-fuchsia-600', categoria: 'Coronas/Prótesis' },

  // === ENDODONCIA ===
  { value: 'endodoncia', label: 'Endodoncia realizada', color: 'bg-orange-500', categoria: 'Endodoncia' },
  { value: 'endodoncia_iniciada', label: 'Endodoncia en proceso', color: 'bg-orange-400', categoria: 'Endodoncia' },
  { value: 'endodoncia_fallida', label: 'Endodoncia fallida', color: 'bg-orange-700', categoria: 'Endodoncia' },
  { value: 'pulpotomia', label: 'Pulpotomía', color: 'bg-orange-300', categoria: 'Endodoncia' },
  { value: 'pulpectomia', label: 'Pulpectomía', color: 'bg-orange-350', categoria: 'Endodoncia' },
  { value: 'apicoformacion', label: 'Apicoformación', color: 'bg-orange-200', categoria: 'Endodoncia' },
  { value: 'apicectomia', label: 'Apicectomía realizada', color: 'bg-orange-600', categoria: 'Endodoncia' },
  { value: 'poste', label: 'Poste/perno', color: 'bg-amber-500', categoria: 'Endodoncia' },
  { value: 'poste_munon', label: 'Poste + muñón', color: 'bg-amber-600', categoria: 'Endodoncia' },

  // === PATOLOGÍA PULPAR ===
  { value: 'pulpitis_reversible', label: 'Pulpitis reversible', color: 'bg-red-400', categoria: 'Patología Pulpar' },
  { value: 'pulpitis_irreversible', label: 'Pulpitis irreversible', color: 'bg-red-500', categoria: 'Patología Pulpar' },
  { value: 'necrosis_pulpar', label: 'Necrosis pulpar', color: 'bg-red-800', categoria: 'Patología Pulpar' },
  { value: 'diente_no_vital', label: 'Diente no vital', color: 'bg-gray-700', categoria: 'Patología Pulpar' },

  // === PATOLOGÍA PERIAPICAL ===
  { value: 'absceso', label: 'Absceso periapical', color: 'bg-red-900', categoria: 'Patología Periapical' },
  { value: 'granuloma', label: 'Granuloma periapical', color: 'bg-red-700', categoria: 'Patología Periapical' },
  { value: 'quiste_periapical', label: 'Quiste periapical', color: 'bg-red-800', categoria: 'Patología Periapical' },
  { value: 'periodontitis_apical', label: 'Periodontitis apical', color: 'bg-red-600', categoria: 'Patología Periapical' },
  { value: 'osteitis_condensante', label: 'Osteítis condensante', color: 'bg-red-950', categoria: 'Patología Periapical' },
  { value: 'fistula', label: 'Fístula/tracto sinuoso', color: 'bg-rose-700', categoria: 'Patología Periapical' },

  // === ENFERMEDAD PERIODONTAL ===
  { value: 'periodontitis', label: 'Periodontitis', color: 'bg-pink-600', categoria: 'Periodontal' },
  { value: 'periodontitis_leve', label: 'Periodontitis leve (estadio I)', color: 'bg-pink-500', categoria: 'Periodontal' },
  { value: 'periodontitis_moderada', label: 'Periodontitis moderada (estadio II)', color: 'bg-pink-600', categoria: 'Periodontal' },
  { value: 'periodontitis_severa', label: 'Periodontitis severa (estadio III-IV)', color: 'bg-pink-700', categoria: 'Periodontal' },
  { value: 'gingivitis', label: 'Gingivitis', color: 'bg-pink-400', categoria: 'Periodontal' },
  { value: 'movilidad', label: 'Movilidad dental', color: 'bg-rose-500', categoria: 'Periodontal' },
  { value: 'movilidad_grado_1', label: 'Movilidad grado I (<1mm)', color: 'bg-rose-400', categoria: 'Periodontal' },
  { value: 'movilidad_grado_2', label: 'Movilidad grado II (1-2mm)', color: 'bg-rose-500', categoria: 'Periodontal' },
  { value: 'movilidad_grado_3', label: 'Movilidad grado III (>2mm)', color: 'bg-rose-700', categoria: 'Periodontal' },
  { value: 'furcacion', label: 'Lesión de furcación', color: 'bg-rose-600', categoria: 'Periodontal' },
  { value: 'furcacion_grado_1', label: 'Furcación grado I', color: 'bg-rose-500', categoria: 'Periodontal' },
  { value: 'furcacion_grado_2', label: 'Furcación grado II', color: 'bg-rose-600', categoria: 'Periodontal' },
  { value: 'furcacion_grado_3', label: 'Furcación grado III', color: 'bg-rose-700', categoria: 'Periodontal' },
  { value: 'recesion_gingival', label: 'Recesión gingival', color: 'bg-pink-300', categoria: 'Periodontal' },

  // === TRAUMATISMOS Y FRACTURAS ===
  { value: 'fracturado', label: 'Fracturado', color: 'bg-amber-600', categoria: 'Fracturas' },
  { value: 'fractura_esmalte', label: 'Fractura de esmalte', color: 'bg-amber-400', categoria: 'Fracturas' },
  { value: 'fractura_coronaria', label: 'Fractura coronaria (esmalte+dentina)', color: 'bg-amber-500', categoria: 'Fracturas' },
  { value: 'fractura_radicular', label: 'Fractura radicular', color: 'bg-amber-700', categoria: 'Fracturas' },
  { value: 'fractura_vertical', label: 'Fractura vertical', color: 'bg-amber-800', categoria: 'Fracturas' },
  { value: 'fisura', label: 'Fisura/línea de fractura', color: 'bg-amber-300', categoria: 'Fracturas' },
  { value: 'luxacion', label: 'Luxación dental', color: 'bg-orange-600', categoria: 'Fracturas' },
  { value: 'avulsion', label: 'Avulsión dental', color: 'bg-orange-800', categoria: 'Fracturas' },
  { value: 'reimplantado', label: 'Diente reimplantado', color: 'bg-teal-600', categoria: 'Fracturas' },
  { value: 'ferulizado', label: 'Ferulizado', color: 'bg-slate-400', categoria: 'Fracturas' },

  // === DESGASTE DENTAL ===
  { value: 'atricion', label: 'Atrición (desgaste oclusal)', color: 'bg-stone-500', categoria: 'Desgaste' },
  { value: 'abrasion', label: 'Abrasión (agente externo)', color: 'bg-stone-400', categoria: 'Desgaste' },
  { value: 'erosion', label: 'Erosión (ácido)', color: 'bg-stone-600', categoria: 'Desgaste' },
  { value: 'abfraccion', label: 'Abfracción (lesión cervical)', color: 'bg-stone-500', categoria: 'Desgaste' },
  { value: 'desgaste_severo', label: 'Desgaste dental severo', color: 'bg-stone-700', categoria: 'Desgaste' },

  // === ANOMALÍAS DEL DESARROLLO ===
  { value: 'hipoplasia', label: 'Hipoplasia del esmalte', color: 'bg-lime-500', categoria: 'Anomalías' },
  { value: 'hipomineralizacion', label: 'Hipomineralización (MIH)', color: 'bg-lime-400', categoria: 'Anomalías' },
  { value: 'fluorosis', label: 'Fluorosis dental', color: 'bg-lime-600', categoria: 'Anomalías' },
  { value: 'amelogenesis', label: 'Amelogénesis imperfecta', color: 'bg-emerald-400', categoria: 'Anomalías' },
  { value: 'dentinogenesis', label: 'Dentinogénesis imperfecta', color: 'bg-emerald-500', categoria: 'Anomalías' },
  { value: 'diente_fusionado', label: 'Diente fusionado', color: 'bg-emerald-600', categoria: 'Anomalías' },
  { value: 'diente_geminado', label: 'Diente geminado', color: 'bg-emerald-500', categoria: 'Anomalías' },
  { value: 'dens_in_dente', label: 'Dens invaginatus', color: 'bg-emerald-700', categoria: 'Anomalías' },
  { value: 'taurodontismo', label: 'Taurodontismo', color: 'bg-teal-500', categoria: 'Anomalías' },
  { value: 'dilaceracion', label: 'Dilaceración radicular', color: 'bg-teal-600', categoria: 'Anomalías' },
  { value: 'microdoncia', label: 'Microdoncia', color: 'bg-emerald-400', categoria: 'Anomalías' },
  { value: 'macrodoncia', label: 'Macrodoncia', color: 'bg-emerald-600', categoria: 'Anomalías' },
  { value: 'supernumerario', label: 'Supernumerario', color: 'bg-violet-500', categoria: 'Anomalías' },

  // === POSICIÓN Y ERUPCIÓN ===
  { value: 'retenido', label: 'Retenido/Impactado', color: 'bg-slate-500', categoria: 'Posición' },
  { value: 'semi_retenido', label: 'Semi-retenido', color: 'bg-slate-400', categoria: 'Posición' },
  { value: 'no_erupcionado', label: 'No erupcionado', color: 'bg-slate-300', categoria: 'Posición' },
  { value: 'parcialmente_erupcionado', label: 'Parcialmente erupcionado', color: 'bg-slate-350', categoria: 'Posición' },
  { value: 'ectopico', label: 'Erupción ectópica', color: 'bg-zinc-500', categoria: 'Posición' },
  { value: 'rotado', label: 'Rotado', color: 'bg-zinc-400', categoria: 'Posición' },
  { value: 'inclinado', label: 'Inclinado/Tipped', color: 'bg-zinc-450', categoria: 'Posición' },
  { value: 'extruido', label: 'Extruido', color: 'bg-zinc-600', categoria: 'Posición' },
  { value: 'intruido', label: 'Intruido', color: 'bg-zinc-550', categoria: 'Posición' },
  { value: 'transposicion', label: 'Transposición dental', color: 'bg-zinc-500', categoria: 'Posición' },
  { value: 'diastema', label: 'Diastema', color: 'bg-zinc-300', categoria: 'Posición' },

  // === AUSENCIA Y EXTRACCIÓN ===
  { value: 'ausente', label: 'Ausente', color: 'bg-gray-400', categoria: 'Ausencia' },
  { value: 'ausente_congenito', label: 'Agenesia (ausencia congénita)', color: 'bg-gray-500', categoria: 'Ausencia' },
  { value: 'extraccion_indicada', label: 'Extracción indicada', color: 'bg-red-500', categoria: 'Ausencia' },
  { value: 'raiz_retenida', label: 'Raíz retenida/resto radicular', color: 'bg-gray-600', categoria: 'Ausencia' },
  { value: 'alveolo_en_cicatrizacion', label: 'Alvéolo en cicatrización', color: 'bg-gray-300', categoria: 'Ausencia' },

  // === IMPLANTES ===
  { value: 'implante', label: 'Implante dental', color: 'bg-cyan-500', categoria: 'Implantes' },
  { value: 'implante_oseointegrado', label: 'Implante oseointegrado', color: 'bg-cyan-600', categoria: 'Implantes' },
  { value: 'implante_fallido', label: 'Implante fallido', color: 'bg-cyan-800', categoria: 'Implantes' },
  { value: 'implante_provisional', label: 'Implante provisional', color: 'bg-cyan-400', categoria: 'Implantes' },
  { value: 'pilar_implante', label: 'Pilar sobre implante', color: 'bg-cyan-550', categoria: 'Implantes' },
  { value: 'corona_sobre_implante', label: 'Corona sobre implante', color: 'bg-cyan-450', categoria: 'Implantes' },

  // === PRÓTESIS REMOVIBLE ===
  { value: 'protesis_removible', label: 'Prótesis removible', color: 'bg-pink-500', categoria: 'Prótesis Removible' },
  { value: 'protesis_total', label: 'Prótesis total/dentadura', color: 'bg-pink-600', categoria: 'Prótesis Removible' },
  { value: 'gancho_protesis', label: 'Gancho de prótesis', color: 'bg-pink-400', categoria: 'Prótesis Removible' },

  // === ORTODONCIA ===
  { value: 'bracket', label: 'Bracket ortodóntico', color: 'bg-sky-500', categoria: 'Ortodoncia' },
  { value: 'banda_ortodontica', label: 'Banda ortodóntica', color: 'bg-sky-600', categoria: 'Ortodoncia' },
  { value: 'retenedor_fijo', label: 'Retenedor fijo', color: 'bg-sky-400', categoria: 'Ortodoncia' },
  { value: 'en_tratamiento_ortodoncia', label: 'En tratamiento ortodóntico', color: 'bg-sky-300', categoria: 'Ortodoncia' },

  // === SENSIBILIDAD ===
  { value: 'hipersensibilidad', label: 'Hipersensibilidad dentinaria', color: 'bg-blue-300', categoria: 'Sensibilidad' },
  { value: 'sensibilidad_frio', label: 'Sensibilidad al frío', color: 'bg-blue-200', categoria: 'Sensibilidad' },
  { value: 'sensibilidad_calor', label: 'Sensibilidad al calor', color: 'bg-blue-250', categoria: 'Sensibilidad' },

  // === ESTÉTICA ===
  { value: 'discromia', label: 'Discromía (cambio de color)', color: 'bg-amber-400', categoria: 'Estética' },
  { value: 'tincion_intrinseca', label: 'Tinción intrínseca', color: 'bg-amber-500', categoria: 'Estética' },
  { value: 'tincion_extrinseca', label: 'Tinción extrínseca', color: 'bg-amber-300', categoria: 'Estética' },
  { value: 'blanqueamiento_interno', label: 'Blanqueamiento interno realizado', color: 'bg-white', categoria: 'Estética' },

  // === OTROS ===
  { value: 'en_observacion', label: 'En observación', color: 'bg-neutral-400', categoria: 'Otros' },
  { value: 'tratamiento_pendiente', label: 'Tratamiento pendiente', color: 'bg-neutral-500', categoria: 'Otros' },
  { value: 'derivar_especialista', label: 'Derivar a especialista', color: 'bg-neutral-600', categoria: 'Otros' },
]

// Ordenar alfabéticamente por label (A-Z)
const ESTADOS_DIENTE = [...ESTADOS_DIENTE_RAW].sort((a, b) =>
  a.label.localeCompare(b.label, 'es', { sensitivity: 'base' })
)

// Función de búsqueda flexible - busca coincidencias de todas las palabras
const matchesSearch = (estado: typeof ESTADOS_DIENTE[0], searchTerm: string): boolean => {
  if (!searchTerm.trim()) return true

  // Normalizar: quitar acentos y convertir a minúsculas
  const normalize = (str: string) =>
    str.toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')

  const searchText = normalize(`${estado.label} ${estado.categoria}`)
  const searchWords = normalize(searchTerm).split(/\s+/).filter(Boolean)

  // Todas las palabras deben estar presentes
  return searchWords.every(word => searchText.includes(word))
}

// Condiciones generales que afectan toda la boca
interface CondicionesGenerales {
  periodontitisGeneralizada: boolean
  periodontitisGrado?: 'leve' | 'moderada' | 'severa'
  gingivitis: boolean
  halitosis: boolean
  sequedadBucal: boolean
  bruxismo: boolean
  maloclusionTipo?: string
  observacionesGenerales?: string
}

export function PatientDetailPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { usuario, signOut } = useAuthContext()
  const { t } = useLanguage()

  const { data: paciente, isLoading: loadingPaciente } = usePatient(id)
  const { data: odontogramaActual, isLoading: loadingOdontograma } = useOdontograma(id)
  const { data: historialOdontogramas } = useOdontogramasHistorial(id)
  const createOdontograma = useCreateOdontograma()
  const updateTooth = useUpdateTooth()
  const updateObservaciones = useUpdateOdontogramaObservaciones()
  const cerrarOdontograma = useCerrarOdontograma()
  const updatePatient = useUpdatePatient()

  // Eliminar archivo del paciente
  const handleDeleteArchivo = async (archivoId: string, archivoUrl: string) => {
    if (!paciente || !id) return

    const archivosActuales = paciente.anamnesis?.antecedentesOdontologicos?.archivosAdjuntos || []
    const archivosActualizados = archivosActuales.filter(a => a.id !== archivoId)

    try {
      // Eliminar de Storage si es una URL de Firebase (no local)
      if (archivoUrl.includes('firebasestorage') || archivoUrl.includes('googleapis')) {
        await deleteFile(archivoUrl)
      }

      // Actualizar el paciente en Firestore
      await updatePatient.mutateAsync({
        id,
        data: {
          anamnesis: {
            ...paciente.anamnesis,
            antecedentesOdontologicos: {
              ...paciente.anamnesis.antecedentesOdontologicos,
              archivosAdjuntos: archivosActualizados,
            },
          },
        } as never,
      })
    } catch (error) {
      console.error('Error al eliminar archivo:', error)
    }
  }

  // Estado para seleccionar qué odontograma ver del historial
  const [selectedOdontogramaId, setSelectedOdontogramaId] = useState<string | null>(null)

  // Modal de nueva visita
  const [isNewVisitDialogOpen, setIsNewVisitDialogOpen] = useState(false)
  const [newVisitMotivo, setNewVisitMotivo] = useState('')
  const [newVisitCopiarEstado, setNewVisitCopiarEstado] = useState(true)

  // El odontograma a mostrar: el seleccionado del historial o el actual
  const odontograma = useMemo(() => {
    if (!historialOdontogramas || historialOdontogramas.length === 0) return odontogramaActual
    if (!selectedOdontogramaId) return odontogramaActual
    return historialOdontogramas.find(o => o.id === selectedOdontogramaId) || odontogramaActual
  }, [historialOdontogramas, selectedOdontogramaId, odontogramaActual])

  // Determinar si el odontograma actual es el más reciente (editable)
  const isOdontogramaEditable = useMemo(() => {
    if (!odontograma || !odontogramaActual) return false
    return odontograma.id === odontogramaActual.id
  }, [odontograma, odontogramaActual])

  const [selectedTooth, setSelectedTooth] = useState<DientePaciente | null>(null)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [editingState, setEditingState] = useState<EstadoDiente>('sano')
  const [editingObservaciones, setEditingObservaciones] = useState('')
  const [editingCampoInterferente, setEditingCampoInterferente] = useState(false)
  const [editingCampoInterferenteNotas, setEditingCampoInterferenteNotas] = useState('')
  const [editingDescripcion, setEditingDescripcion] = useState('') // Diagnóstico del diente
  const [editingHallazgos, setEditingHallazgos] = useState('') // Hallazgos clínicos
  const [estadoSearchTerm, setEstadoSearchTerm] = useState('') // Buscador de estados

  // Observaciones generales del odontograma
  const [observacionesGeneralesOdontograma, setObservacionesGeneralesOdontograma] = useState('')

  // Condiciones generales (en el futuro esto se guardará en Firestore)
  const [condicionesGenerales, setCondicionesGenerales] = useState<CondicionesGenerales>({
    periodontitisGeneralizada: false,
    gingivitis: false,
    halitosis: false,
    sequedadBucal: false,
    bruxismo: false,
  })

  // Ref para evitar crear odontograma múltiples veces
  const odontogramaCreated = useRef(false)
  const previousPatientId = useRef<string | undefined>(undefined)

  // Resetear ref cuando cambia el paciente
  useEffect(() => {
    if (id !== previousPatientId.current) {
      odontogramaCreated.current = false
      previousPatientId.current = id
    }
  }, [id])

  // Crear odontograma si no existe o si el actual está cerrado
  useEffect(() => {
    if (
      id &&
      usuario?.id &&
      !loadingOdontograma &&
      paciente &&
      !odontogramaCreated.current &&
      !createOdontograma.isPending
    ) {
      // Si no hay odontograma, crear uno nuevo
      if (!odontogramaActual) {
        odontogramaCreated.current = true
        createOdontograma.mutate({ pacienteId: id, odontologoId: usuario.id })
      }
      // Si el odontograma actual está cerrado, crear uno nuevo copiando el estado
      else if (odontogramaActual.cerrado) {
        odontogramaCreated.current = true
        createOdontograma.mutate({
          pacienteId: id,
          odontologoId: usuario.id,
          copiarDe: odontogramaActual.id,
        })
      }
    }
  }, [id, usuario?.id, loadingOdontograma, odontogramaActual, paciente, createOdontograma.isPending])

  // Ref para almacenar el ID del odontograma actual para el cierre
  const odontogramaIdRef = useRef<string | null>(null)
  const pacienteIdRef = useRef<string | undefined>(id)
  const cerrarOdontogramaRef = useRef(cerrarOdontograma)

  // Mantener actualizado el ref de la función de cierre
  useEffect(() => {
    cerrarOdontogramaRef.current = cerrarOdontograma
  }, [cerrarOdontograma])

  // Mantener actualizado el ref del odontograma actual
  useEffect(() => {
    if (odontogramaActual?.id && !odontogramaActual.cerrado) {
      odontogramaIdRef.current = odontogramaActual.id
    }
    pacienteIdRef.current = id
  }, [odontogramaActual?.id, odontogramaActual?.cerrado, id])

  // Función para cerrar el odontograma (usada en cleanup y beforeunload)
  const cerrarOdontogramaActual = useRef(() => {
    if (odontogramaIdRef.current && pacienteIdRef.current) {
      cerrarOdontogramaRef.current.mutate({
        odontogramaId: odontogramaIdRef.current,
        pacienteId: pacienteIdRef.current,
      })
    }
  })

  // Actualizar la función de cierre cuando cambien las refs
  useEffect(() => {
    cerrarOdontogramaActual.current = () => {
      if (odontogramaIdRef.current && pacienteIdRef.current) {
        cerrarOdontogramaRef.current.mutate({
          odontogramaId: odontogramaIdRef.current,
          pacienteId: pacienteIdRef.current,
        })
      }
    }
  }, [])

  // Cerrar odontograma al salir de la página o cerrar pestaña
  useEffect(() => {
    const handleBeforeUnload = () => {
      cerrarOdontogramaActual.current()
    }

    window.addEventListener('beforeunload', handleBeforeUnload)

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload)
      // Al desmontar, cerrar el odontograma si existe y no está cerrado
      cerrarOdontogramaActual.current()
    }
  }, [])

  // Cargar condiciones desde anamnesis del paciente
  useEffect(() => {
    if (paciente) {
      const antOdont = paciente.anamnesis.antecedentesOdontologicos
      setCondicionesGenerales({
        periodontitisGeneralizada: antOdont.sangradoEncias || false,
        gingivitis: antOdont.sangradoEncias || false,
        halitosis: antOdont.halitosis || false,
        sequedadBucal: antOdont.sequedadBucal || false,
        bruxismo: antOdont.bruxismo || false,
      })
    }
  }, [paciente])

  // Cargar observaciones del odontograma cuando se carga
  useEffect(() => {
    if (odontograma?.observacionesGenerales !== undefined) {
      setObservacionesGeneralesOdontograma(odontograma.observacionesGenerales || '')
    }
  }, [odontograma?.observacionesGenerales])

  // Ref para tracking si el usuario ha modificado el campo
  const observacionesModificadas = useRef(false)

  // Autoguardado de observaciones con debounce (1.5 segundos después de dejar de escribir)
  useEffect(() => {
    // No guardar si no hay odontograma o id, o si no se ha modificado
    if (!odontograma?.id || !id || !observacionesModificadas.current) return

    const timeoutId = setTimeout(() => {
      updateObservaciones.mutate({
        odontogramaId: odontograma.id,
        pacienteId: id,
        observaciones: observacionesGeneralesOdontograma,
      })
    }, 1500)

    return () => clearTimeout(timeoutId)
  }, [observacionesGeneralesOdontograma, odontograma?.id, id])

  // Crear nueva visita/diagnóstico
  const handleCreateNewVisit = async () => {
    if (!id || !usuario?.id) return

    try {
      await createOdontograma.mutateAsync({
        pacienteId: id,
        odontologoId: usuario.id,
        motivo: newVisitMotivo.trim() || undefined,
        copiarDe: newVisitCopiarEstado && odontogramaActual?.id ? odontogramaActual.id : undefined,
      })
      setIsNewVisitDialogOpen(false)
      setNewVisitMotivo('')
      setNewVisitCopiarEstado(true)
      setSelectedOdontogramaId(null) // Volver al más reciente
    } catch (error) {
      console.error('Error al crear nueva visita:', error)
      alert('Error al crear nueva visita. Revisa la consola para más detalles.')
    }
  }

  // Formatear fecha de odontograma
  const formatOdontogramaDate = (odonto: Odontograma) => {
    const fecha = odonto.fechaCreacion?.toDate?.()
    if (!fecha) return 'Sin fecha'
    return fecha.toLocaleDateString('es-ES', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    })
  }

  const handleToothClick = (numeroDiente: number) => {
    // Si es histórico (solo lectura), no permitir editar
    if (!isOdontogramaEditable) {
      console.log('Odontograma en modo lectura')
      return
    }

    console.log('Click en diente:', numeroDiente, 'Odontograma:', odontograma)
    const diente = odontograma?.dientes.find(d => d.numeroDiente === numeroDiente)
    if (diente) {
      setSelectedTooth(diente)
      setEditingState(diente.estado)
      setEditingDescripcion(diente.descripcion || '')
      setEditingHallazgos(diente.hallazgosClinicos || '')
      setEditingObservaciones(diente.observaciones || '')
      setEditingCampoInterferente(diente.campoInterferente)
      setEditingCampoInterferenteNotas(diente.campoInterferenteNotas || '')
      setIsEditDialogOpen(true)
    } else {
      console.log('Diente no encontrado en odontograma')
    }
  }

  const handleSaveTooth = async () => {
    if (!selectedTooth || !odontograma || !id) return

    try {
      // Construir objeto sin campos undefined (Firestore no los acepta)
      const dataToUpdate: Record<string, unknown> = {
        estado: editingState,
        campoInterferente: editingCampoInterferente,
      }

      // Solo agregar campos con valor (no vacíos)
      if (editingDescripcion.trim()) {
        dataToUpdate.descripcion = editingDescripcion.trim()
      }
      if (editingHallazgos.trim()) {
        dataToUpdate.hallazgosClinicos = editingHallazgos.trim()
      }
      if (editingObservaciones.trim()) {
        dataToUpdate.observaciones = editingObservaciones.trim()
      }
      if (editingCampoInterferenteNotas.trim()) {
        dataToUpdate.campoInterferenteNotas = editingCampoInterferenteNotas.trim()
      }

      await updateTooth.mutateAsync({
        odontogramaId: odontograma.id,
        pacienteId: id,
        numeroDiente: selectedTooth.numeroDiente,
        data: dataToUpdate,
      })
      setIsEditDialogOpen(false)
      setSelectedTooth(null)
    } catch (error) {
      console.error('Error al actualizar diente:', error)
    }
  }

  const getToothInfo = (numeroDiente: number) => {
    return TEETH_DATA.find(t => t.numero === numeroDiente)
  }

  const getEstadoColor = (estado: EstadoDiente) => {
    return ESTADOS_DIENTE.find(e => e.value === estado)?.color || 'bg-gray-300'
  }

  if (loadingPaciente || loadingOdontograma) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-blue-50">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto text-blue-600" />
          <p className="mt-2 text-gray-600">{t.patientDetail.loadingPatient}</p>
        </div>
      </div>
    )
  }

  if (!paciente) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-blue-50">
        <Card className="p-8 text-center">
          <AlertTriangle className="h-12 w-12 text-yellow-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900">{t.patientDetail.patientNotFound}</h2>
          <p className="text-gray-600 mt-2">{t.patientDetail.patientNotFound}</p>
          <Button className="mt-4" onClick={() => navigate('/patients')}>
            {t.patientDetail.backToList}
          </Button>
        </Card>
      </div>
    )
  }

  const edad = calcularEdad(paciente.anamnesis.datosPersonales.fechaNacimiento)

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900 dark:to-slate-800">
      {/* Header */}
      <header className="bg-white dark:bg-slate-900 shadow-sm border-b dark:border-slate-700">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" onClick={() => navigate('/patients')}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              {t.common.back}
            </Button>
            <div className="border-l pl-4">
              <Link to="/teeth">
                <h1 className="text-xl font-bold text-gray-900 hover:text-blue-600 transition-colors">
                  {t.app.name}
                </h1>
              </Link>
              <p className="text-sm text-muted-foreground">
                {t.patients.viewRecord}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate(`/patients/${id}/edit`)}
            >
              <Pencil className="h-4 w-4 mr-2" />
              {t.common.edit}
            </Button>
            <Button
              variant="default"
              size="sm"
              onClick={() => generatePatientReport(paciente, odontograma)}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              <Download className="h-4 w-4 mr-2" />
              PDF
            </Button>
            <div className="hidden md:flex items-center gap-2 text-sm text-muted-foreground">
              <User className="h-4 w-4" />
              <span>{usuario?.nombre || usuario?.email}</span>
            </div>
            <ThemeToggle />
            <LanguageSelector />
            <Button variant="outline" size="sm" onClick={signOut}>
              <LogOut className="h-4 w-4 mr-2" />
              {t.auth.logout}
            </Button>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Info del paciente */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="flex items-start gap-6">
              {/* Avatar */}
              <div className="shrink-0">
                {paciente.anamnesis.datosPersonales.fotoPerfil ? (
                  <img
                    src={paciente.anamnesis.datosPersonales.fotoPerfil}
                    alt={formatearNombreCompleto(paciente)}
                    className="w-24 h-24 rounded-full object-cover border-4 border-white shadow-lg"
                  />
                ) : (
                  <div className="w-24 h-24 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white text-3xl font-bold shadow-lg">
                    {paciente.anamnesis.datosPersonales.nombre[0]}
                    {paciente.anamnesis.datosPersonales.apellido[0]}
                  </div>
                )}
              </div>

              {/* Datos */}
              <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">
                    {formatearNombreCompleto(paciente)}
                  </h2>
                  <p className="text-gray-600">{edad} {t.patientDetail.years}</p>
                  <div className="flex items-center gap-2 mt-2 text-sm text-gray-500">
                    <FileText className="h-4 w-4" />
                    <span>{paciente.anamnesis.datosPersonales.documentoIdentidad}</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Phone className="h-4 w-4" />
                    <span>{paciente.anamnesis.datosPersonales.telefono}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <MapPin className="h-4 w-4" />
                    <span>{paciente.anamnesis.datosPersonales.ciudad}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Calendar className="h-4 w-4" />
                    <span>
                      Registrado: {paciente.creadoEn?.toDate?.()?.toLocaleDateString() || 'N/A'}
                    </span>
                  </div>
                </div>

                <div>
                  <p className="text-sm font-medium text-gray-700">Motivo de consulta:</p>
                  <p className="text-sm text-gray-600 mt-1">
                    {paciente.anamnesis.antecedentesOdontologicos.motivoConsulta}
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Tabs de contenido */}
        <Tabs defaultValue="anamnesis" className="space-y-6">
          <TabsList className="bg-white border shadow-sm">
            <TabsTrigger value="anamnesis" className="gap-2">
              <FileText className="h-4 w-4" />
              {t.tabs.anamnesis}
            </TabsTrigger>
            <TabsTrigger value="condiciones" className="gap-2">
              <Heart className="h-4 w-4" />
              {t.tabs.generalConditions}
            </TabsTrigger>
            <TabsTrigger value="odontograma" className="gap-2">
              <Activity className="h-4 w-4" />
              {t.tabs.odontogram}
            </TabsTrigger>
            <TabsTrigger value="documentos" className="gap-2">
              <FolderOpen className="h-4 w-4" />
              {t.documents.title}
            </TabsTrigger>
          </TabsList>

          {/* Tab Odontograma */}
          <TabsContent value="odontograma">
            <Card>
              <CardHeader>
                <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      Odontograma del Paciente
                      {!isOdontogramaEditable && (
                        <Badge variant="secondary" className="ml-2">
                          <Lock className="h-3 w-3 mr-1" />
                          Solo lectura
                        </Badge>
                      )}
                    </CardTitle>
                    <CardDescription>
                      {isOdontogramaEditable
                        ? 'Haz clic en un diente para ver o modificar su estado'
                        : 'Estás viendo un diagnóstico anterior (solo lectura)'}
                    </CardDescription>
                  </div>

                  {/* Controles de historial */}
                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2">
                    {/* Selector de visitas */}
                    {historialOdontogramas && historialOdontogramas.length > 1 && (
                      <Select
                        value={selectedOdontogramaId || odontogramaActual?.id || ''}
                        onValueChange={(value) => setSelectedOdontogramaId(value === odontogramaActual?.id ? null : value)}
                      >
                        <SelectTrigger className="w-[200px]">
                          <History className="h-4 w-4 mr-2 shrink-0" />
                          <SelectValue placeholder="Seleccionar visita" />
                        </SelectTrigger>
                        <SelectContent>
                          {historialOdontogramas.map((odonto, index) => (
                            <SelectItem key={odonto.id} value={odonto.id}>
                              <div className="flex items-center gap-2">
                                <span>{formatOdontogramaDate(odonto)}</span>
                                {index === 0 && (
                                  <Badge variant="outline" className="text-xs">Actual</Badge>
                                )}
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}

                    {/* Mostrar número de visitas si hay más de 1 */}
                    {historialOdontogramas && historialOdontogramas.length > 1 && (
                      <span className="text-xs text-muted-foreground">
                        {historialOdontogramas.length} visitas
                      </span>
                    )}

                    {/* Botón Nueva Visita */}
                    <Button
                      variant="default"
                      size="sm"
                      onClick={() => setIsNewVisitDialogOpen(true)}
                      className="gap-2"
                    >
                      <Plus className="h-4 w-4" />
                      Nueva Visita
                    </Button>
                  </div>
                </div>

                {/* Información del odontograma seleccionado */}
                {odontograma && (
                  <div className="mt-4 p-3 bg-muted/50 rounded-lg text-sm">
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
                      <span className="text-muted-foreground">
                        <strong>Fecha:</strong> {formatOdontogramaDate(odontograma)}
                      </span>
                      {odontograma.motivo && (
                        <span className="text-muted-foreground">
                          <strong>Motivo:</strong> {odontograma.motivo}
                        </span>
                      )}
                      {!isOdontogramaEditable && (
                        <Button
                          variant="link"
                          size="sm"
                          className="p-0 h-auto text-primary"
                          onClick={() => setSelectedOdontogramaId(null)}
                        >
                          ← Volver al actual
                        </Button>
                      )}
                    </div>
                  </div>
                )}
              </CardHeader>
              <CardContent>
                {/* Odontograma visual */}
                <div className="bg-white rounded-xl border p-6">
                  {/* Arcada Superior */}
                  <div className="mb-2">
                    <div className="flex justify-center gap-1">
                      {/* Cuadrante 1 - Superior Derecho (18-11) */}
                      {[18, 17, 16, 15, 14, 13, 12, 11].map((num) => (
                        <ToothButton
                          key={num}
                          numero={num}
                          diente={odontograma?.dientes.find(d => d.numeroDiente === num)}
                          onClick={() => handleToothClick(num)}
                          getEstadoColor={getEstadoColor}
                          isEditable={isOdontogramaEditable}
                        />
                      ))}
                      <div className="w-2" /> {/* Separador */}
                      {/* Cuadrante 2 - Superior Izquierdo (21-28) */}
                      {[21, 22, 23, 24, 25, 26, 27, 28].map((num) => (
                        <ToothButton
                          key={num}
                          numero={num}
                          diente={odontograma?.dientes.find(d => d.numeroDiente === num)}
                          onClick={() => handleToothClick(num)}
                          getEstadoColor={getEstadoColor}
                          isEditable={isOdontogramaEditable}
                        />
                      ))}
                    </div>
                    <div className="flex justify-between px-4 mt-1">
                      <span className="text-xs text-gray-400">Superior Derecho</span>
                      <span className="text-xs text-gray-400">Superior Izquierdo</span>
                    </div>
                  </div>

                  {/* Línea divisoria */}
                  <div className="border-t border-dashed border-gray-300 my-4" />

                  {/* Arcada Inferior */}
                  <div>
                    <div className="flex justify-center gap-1">
                      {/* Cuadrante 4 - Inferior Derecho (48-41) */}
                      {[48, 47, 46, 45, 44, 43, 42, 41].map((num) => (
                        <ToothButton
                          key={num}
                          numero={num}
                          diente={odontograma?.dientes.find(d => d.numeroDiente === num)}
                          onClick={() => handleToothClick(num)}
                          getEstadoColor={getEstadoColor}
                          isEditable={isOdontogramaEditable}
                        />
                      ))}
                      <div className="w-2" /> {/* Separador */}
                      {/* Cuadrante 3 - Inferior Izquierdo (31-38) */}
                      {[31, 32, 33, 34, 35, 36, 37, 38].map((num) => (
                        <ToothButton
                          key={num}
                          numero={num}
                          diente={odontograma?.dientes.find(d => d.numeroDiente === num)}
                          onClick={() => handleToothClick(num)}
                          getEstadoColor={getEstadoColor}
                          isEditable={isOdontogramaEditable}
                        />
                      ))}
                    </div>
                    <div className="flex justify-between px-4 mt-1">
                      <span className="text-xs text-gray-400">Inferior Derecho</span>
                      <span className="text-xs text-gray-400">Inferior Izquierdo</span>
                    </div>
                  </div>
                </div>

                {/* Resumen de estados - Listado con conteo por estado específico */}
                {(() => {
                  if (!odontograma?.dientes) {
                    return (
                      <div className="mt-6 text-center text-gray-500 py-4">
                        No hay estados registrados en el odontograma
                      </div>
                    )
                  }

                  // Contar dientes por cada estado específico
                  const conteosPorEstado: Record<string, number> = {}
                  odontograma.dientes.forEach(d => {
                    conteosPorEstado[d.estado] = (conteosPorEstado[d.estado] || 0) + 1
                  })

                  // Convertir a array y ordenar: primero "sano", luego el resto por cantidad descendente
                  const estadosConConteo = Object.entries(conteosPorEstado)
                    .map(([estado, count]) => {
                      const estadoInfo = ESTADOS_DIENTE.find(e => e.value === estado)
                      return {
                        estado,
                        label: estadoInfo?.label || estado,
                        color: estadoInfo?.color || 'bg-gray-400',
                        count,
                      }
                    })
                    .sort((a, b) => {
                      // "sano" siempre primero
                      if (a.estado === 'sano') return -1
                      if (b.estado === 'sano') return 1
                      // Resto ordenado por cantidad descendente
                      return b.count - a.count
                    })

                  return (
                    <div className="mt-6 bg-gray-50 rounded-lg p-4">
                      <h4 className="text-sm font-medium text-gray-700 mb-3">Resumen del Odontograma</h4>
                      <div className="space-y-2">
                        {estadosConConteo.map(({ estado, label, color, count }) => (
                          <div key={estado} className="flex items-center gap-3">
                            <div className={`w-3 h-3 rounded-full ${color} shrink-0`} />
                            <span className="text-sm text-gray-900">
                              <span className="font-semibold">{count}</span> {label.toLowerCase()}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )
                })()}

                {/* Reporte de Campos Interferentes */}
                {odontograma?.dientes.some(d => d.campoInterferente) && (
                  <div className="mt-6 border-t pt-6">
                    <div className="flex items-center gap-2 mb-4">
                      <AlertTriangle className="h-5 w-5 text-red-500" />
                      <h3 className="text-lg font-semibold text-gray-900">Campos Interferentes (Terapia Neural)</h3>
                    </div>
                    <div className="space-y-3">
                      {odontograma.dientes
                        .filter(d => d.campoInterferente)
                        .map((diente) => {
                          const toothInfo = TEETH_DATA.find(t => t.numero === diente.numeroDiente)
                          const estadoInfo = ESTADOS_DIENTE.find(e => e.value === diente.estado)
                          return (
                            <div
                              key={diente.numeroDiente}
                              className="bg-red-50 border border-red-200 rounded-lg p-4"
                            >
                              <div className="flex items-start justify-between">
                                <div className="flex-1">
                                  <div className="flex items-center gap-2">
                                    <span className="font-semibold text-red-900">
                                      Diente #{diente.numeroDiente}
                                    </span>
                                    {toothInfo && (
                                      <span className="text-sm text-red-700">
                                        - {toothInfo.nombre}
                                      </span>
                                    )}
                                    <div className={`w-3 h-3 rounded-full ${estadoInfo?.color || 'bg-gray-300'}`} />
                                  </div>

                                  {/* Estado actual */}
                                  <div className="mt-2 text-sm">
                                    <span className="text-gray-600">Estado:</span>{' '}
                                    <span className="font-medium text-gray-900">
                                      {estadoInfo?.label || diente.estado}
                                    </span>
                                  </div>

                                  {/* Diagnóstico */}
                                  {diente.descripcion && (
                                    <div className="mt-1 text-sm">
                                      <span className="text-gray-600">Diagnóstico:</span>{' '}
                                      <span className="text-gray-900">{diente.descripcion}</span>
                                    </div>
                                  )}

                                  {/* Hallazgos Clínicos */}
                                  {diente.hallazgosClinicos && (
                                    <div className="mt-1 text-sm">
                                      <span className="text-gray-600">Hallazgos:</span>{' '}
                                      <span className="text-gray-900">{diente.hallazgosClinicos}</span>
                                    </div>
                                  )}

                                  {/* Notas del campo interferente */}
                                  {diente.campoInterferenteNotas && (
                                    <div className="mt-1 text-sm">
                                      <span className="text-gray-600">Notas CI:</span>{' '}
                                      <span className="text-red-800">{diente.campoInterferenteNotas}</span>
                                    </div>
                                  )}

                                  {/* Relación con órganos según MTC */}
                                  {toothInfo && (
                                    <div className="mt-3 p-2 bg-white rounded border border-red-100">
                                      <p className="text-xs font-medium text-gray-700 mb-1">
                                        Relación Diente-Órgano (MTC):
                                      </p>
                                      <div className="text-xs text-gray-600 space-y-0.5">
                                        <p>
                                          <span className="text-gray-500">Elemento:</span>{' '}
                                          <span className="font-medium">{toothInfo.elemento}</span>
                                        </p>
                                        <p>
                                          <span className="text-gray-500">Órganos asociados:</span>{' '}
                                          <span className="font-medium">{toothInfo.organos.join(', ')}</span>
                                        </p>
                                        <p>
                                          <span className="text-gray-500">Emoción:</span>{' '}
                                          <span className="font-medium">{toothInfo.emocion}</span>
                                        </p>
                                        {toothInfo.vertebras && toothInfo.vertebras.length > 0 && (
                                          <p>
                                            <span className="text-gray-500">Vértebras:</span>{' '}
                                            <span className="font-medium">{toothInfo.vertebras.join(', ')}</span>
                                          </p>
                                        )}
                                        {toothInfo.articulaciones && toothInfo.articulaciones.length > 0 && (
                                          <p>
                                            <span className="text-gray-500">Articulaciones:</span>{' '}
                                            <span className="font-medium">{toothInfo.articulaciones.join(', ')}</span>
                                          </p>
                                        )}
                                      </div>
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>
                          )
                        })}
                    </div>
                    <p className="mt-3 text-xs text-muted-foreground">
                      Los campos interferentes son focos irritativos que pueden afectar órganos y sistemas distantes según la Odontología Neurofocal y la Terapia Neural.
                    </p>
                  </div>
                )}

                {/* Observaciones generales del estado bucal */}
                <div className="mt-6 space-y-2">
                  <Label htmlFor="observacionesOdontograma" className="text-base font-medium">
                    Observaciones Generales del Estado Bucal
                    {!isOdontogramaEditable && (
                      <Badge variant="secondary" className="ml-2 text-xs">
                        <Lock className="h-3 w-3 mr-1" />
                        Solo lectura
                      </Badge>
                    )}
                  </Label>
                  <Textarea
                    id="observacionesOdontograma"
                    value={observacionesGeneralesOdontograma}
                    onChange={(e) => {
                      if (!isOdontogramaEditable) return
                      observacionesModificadas.current = true
                      setObservacionesGeneralesOdontograma(e.target.value)
                    }}
                    placeholder="Notas generales sobre el estado de la boca del paciente: higiene oral, estado de encías, oclusión, etc."
                    rows={4}
                    className="resize-none"
                    disabled={!isOdontogramaEditable}
                  />
                  <p className="text-xs text-muted-foreground flex items-center gap-2">
                    {!isOdontogramaEditable ? (
                      'Observaciones de esta visita histórica.'
                    ) : updateObservaciones.isPending ? (
                      <>
                        <Loader2 className="h-3 w-3 animate-spin" />
                        Guardando...
                      </>
                    ) : (
                      'Estas observaciones se guardan automáticamente.'
                    )}
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Tab Condiciones Generales */}
          <TabsContent value="condiciones">
            <Card>
              <CardHeader>
                <CardTitle>Condiciones Generales de la Boca</CardTitle>
                <CardDescription>
                  Condiciones que afectan la salud bucal en general
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Periodontitis */}
                  <div className="p-4 border rounded-lg">
                    <div className="flex items-center gap-3 mb-3">
                      <Checkbox
                        id="periodontitis"
                        checked={condicionesGenerales.periodontitisGeneralizada}
                        onCheckedChange={(checked) =>
                          setCondicionesGenerales(prev => ({
                            ...prev,
                            periodontitisGeneralizada: checked as boolean
                          }))
                        }
                      />
                      <Label htmlFor="periodontitis" className="font-medium">
                        Periodontitis Generalizada
                      </Label>
                    </div>
                    {condicionesGenerales.periodontitisGeneralizada && (
                      <Select
                        value={condicionesGenerales.periodontitisGrado || ''}
                        onValueChange={(value) =>
                          setCondicionesGenerales(prev => ({
                            ...prev,
                            periodontitisGrado: value as 'leve' | 'moderada' | 'severa'
                          }))
                        }
                      >
                        <SelectTrigger className="mt-2">
                          <SelectValue placeholder="Seleccionar grado" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="leve">Leve</SelectItem>
                          <SelectItem value="moderada">Moderada</SelectItem>
                          <SelectItem value="severa">Severa</SelectItem>
                        </SelectContent>
                      </Select>
                    )}
                  </div>

                  {/* Gingivitis */}
                  <div className="p-4 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <Checkbox
                        id="gingivitis"
                        checked={condicionesGenerales.gingivitis}
                        onCheckedChange={(checked) =>
                          setCondicionesGenerales(prev => ({
                            ...prev,
                            gingivitis: checked as boolean
                          }))
                        }
                      />
                      <Label htmlFor="gingivitis" className="font-medium">
                        Gingivitis
                      </Label>
                    </div>
                    <p className="text-xs text-gray-500 mt-1 ml-6">
                      Inflamación de las encías
                    </p>
                  </div>

                  {/* Bruxismo */}
                  <div className="p-4 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <Checkbox
                        id="bruxismo"
                        checked={condicionesGenerales.bruxismo}
                        onCheckedChange={(checked) =>
                          setCondicionesGenerales(prev => ({
                            ...prev,
                            bruxismo: checked as boolean
                          }))
                        }
                      />
                      <Label htmlFor="bruxismo" className="font-medium">
                        Bruxismo
                      </Label>
                    </div>
                    <p className="text-xs text-gray-500 mt-1 ml-6">
                      Rechinamiento o apretamiento de dientes
                    </p>
                  </div>

                  {/* Halitosis */}
                  <div className="p-4 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <Checkbox
                        id="halitosis"
                        checked={condicionesGenerales.halitosis}
                        onCheckedChange={(checked) =>
                          setCondicionesGenerales(prev => ({
                            ...prev,
                            halitosis: checked as boolean
                          }))
                        }
                      />
                      <Label htmlFor="halitosis" className="font-medium">
                        Halitosis
                      </Label>
                    </div>
                    <p className="text-xs text-gray-500 mt-1 ml-6">
                      Mal aliento crónico
                    </p>
                  </div>

                  {/* Sequedad Bucal */}
                  <div className="p-4 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <Checkbox
                        id="sequedad"
                        checked={condicionesGenerales.sequedadBucal}
                        onCheckedChange={(checked) =>
                          setCondicionesGenerales(prev => ({
                            ...prev,
                            sequedadBucal: checked as boolean
                          }))
                        }
                      />
                      <Label htmlFor="sequedad" className="font-medium">
                        Xerostomía (Sequedad Bucal)
                      </Label>
                    </div>
                    <p className="text-xs text-gray-500 mt-1 ml-6">
                      Boca seca por falta de saliva
                    </p>
                  </div>
                </div>

                {/* Observaciones generales */}
                <div className="space-y-2">
                  <Label htmlFor="observaciones">Observaciones Generales</Label>
                  <Textarea
                    id="observaciones"
                    value={condicionesGenerales.observacionesGenerales || ''}
                    onChange={(e) =>
                      setCondicionesGenerales(prev => ({
                        ...prev,
                        observacionesGenerales: e.target.value
                      }))
                    }
                    placeholder="Notas adicionales sobre la salud bucal del paciente..."
                    rows={4}
                  />
                </div>

                <div className="flex justify-end">
                  <Button onClick={() => alert('Guardado de condiciones generales: Próximamente')}>
                    Guardar Condiciones
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Tab Anamnesis */}
          <TabsContent value="anamnesis">
            <Card>
              <CardHeader>
                <CardTitle>Resumen de Anamnesis</CardTitle>
                <CardDescription>
                  Información relevante de la historia clínica
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Antecedentes médicos relevantes */}
                  <div>
                    <h4 className="font-medium text-gray-900 mb-3">Antecedentes Médicos</h4>
                    <div className="space-y-2">
                      {paciente.anamnesis.antecedentesMedicos.diabetes && (
                        <Badge variant="outline" className="mr-2">
                          Diabetes {paciente.anamnesis.antecedentesMedicos.diabetesTipo && `Tipo ${paciente.anamnesis.antecedentesMedicos.diabetesTipo}`}
                        </Badge>
                      )}
                      {paciente.anamnesis.antecedentesMedicos.hipertension && (
                        <Badge variant="outline" className="mr-2">Hipertensión</Badge>
                      )}
                      {paciente.anamnesis.antecedentesMedicos.cardiopatia && (
                        <Badge variant="outline" className="mr-2">
                          Cardiopatía {paciente.anamnesis.antecedentesMedicos.cardiopatiaDetalle && `(${paciente.anamnesis.antecedentesMedicos.cardiopatiaDetalle})`}
                        </Badge>
                      )}
                      {paciente.anamnesis.antecedentesMedicos.anticoagulantes && (
                        <Badge variant="secondary" className="mr-2">
                          Anticoagulantes {paciente.anamnesis.antecedentesMedicos.anticoagulantesDetalle && `(${paciente.anamnesis.antecedentesMedicos.anticoagulantesDetalle})`}
                        </Badge>
                      )}
                    </div>

                    {/* Alergias a medicamentos - Mostrar detalle */}
                    {paciente.anamnesis.antecedentesMedicos.alergiasMedicamentos && (
                      <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-lg">
                        <div className="flex items-center gap-2 mb-2">
                          <AlertTriangle className="h-4 w-4 text-red-600" />
                          <span className="font-medium text-red-700">Alergias a Medicamentos</span>
                        </div>
                        <p className="text-sm text-red-600">
                          {paciente.anamnesis.antecedentesMedicos.alergiasMedicamentosDetalle || 'No se especificaron los medicamentos'}
                        </p>
                      </div>
                    )}

                    {/* Otras alergias */}
                    {(paciente.anamnesis.antecedentesMedicos.alergiasLatex ||
                      paciente.anamnesis.antecedentesMedicos.alergiasAnestesia ||
                      paciente.anamnesis.antecedentesMedicos.alergiasAlimentos ||
                      paciente.anamnesis.antecedentesMedicos.otrasAlergias) && (
                      <div className="mt-3 p-3 bg-amber-50 border border-amber-200 rounded-lg">
                        <span className="font-medium text-amber-700 text-sm">Otras Alergias:</span>
                        <ul className="text-sm text-amber-600 mt-1 list-disc list-inside">
                          {paciente.anamnesis.antecedentesMedicos.alergiasLatex && (
                            <li>Látex</li>
                          )}
                          {paciente.anamnesis.antecedentesMedicos.alergiasAnestesia && (
                            <li>Anestesia</li>
                          )}
                          {paciente.anamnesis.antecedentesMedicos.alergiasAlimentos && (
                            <li>Alimentos: {paciente.anamnesis.antecedentesMedicos.alergiasAlimentosDetalle || 'No especificado'}</li>
                          )}
                          {paciente.anamnesis.antecedentesMedicos.otrasAlergias && (
                            <li>{paciente.anamnesis.antecedentesMedicos.otrasAlergias}</li>
                          )}
                        </ul>
                      </div>
                    )}
                  </div>

                  {/* Estado emocional */}
                  <div>
                    <h4 className="font-medium text-gray-900 mb-3">Estado Emocional</h4>
                    <div className="space-y-2 text-sm">
                      <p>
                        <span className="text-gray-500">Estado general:</span>{' '}
                        <span className="capitalize">
                          {paciente.anamnesis.estadoEmocional.estadoAnimoGeneral}
                        </span>
                      </p>
                      <p>
                        <span className="text-gray-500">Nivel de estrés:</span>{' '}
                        <span className="capitalize">
                          {paciente.anamnesis.habitosEstiloVida.nivelEstres}
                        </span>
                      </p>
                      <p>
                        <span className="text-gray-500">Relaciones familiares:</span>{' '}
                        <span className="capitalize">
                          {paciente.anamnesis.estadoEmocional.relacionesFamiliares}
                        </span>
                      </p>
                    </div>
                  </div>

                  {/* Hábitos */}
                  <div>
                    <h4 className="font-medium text-gray-900 mb-3">Hábitos</h4>
                    <div className="space-y-1 text-sm">
                      {paciente.anamnesis.habitosEstiloVida.tabaquismo && (
                        <p className="text-yellow-700">Fumador</p>
                      )}
                      {paciente.anamnesis.habitosEstiloVida.alcohol && (
                        <p className="text-yellow-700">Consumo de alcohol</p>
                      )}
                      {paciente.anamnesis.antecedentesOdontologicos.bruxismo && (
                        <p className="text-orange-700">Bruxismo</p>
                      )}
                      <p>
                        Cepillado: {paciente.anamnesis.antecedentesOdontologicos.frecuenciaCepillado}x día
                      </p>
                    </div>
                  </div>

                  {/* Observaciones */}
                  {paciente.anamnesis.observacionesAdicionales && (
                    <div>
                      <h4 className="font-medium text-gray-900 mb-3">Observaciones</h4>
                      <p className="text-sm text-gray-600">
                        {paciente.anamnesis.observacionesAdicionales}
                      </p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Tab Documentos */}
          <TabsContent value="documentos">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FolderOpen className="h-5 w-5" />
                  {t.documents.title}
                </CardTitle>
                <CardDescription>
                  {t.dentalHistory.attachedFilesDesc}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <DocumentosSection
                  archivos={paciente.anamnesis.antecedentesOdontologicos.archivosAdjuntos || []}
                  t={t}
                  onDelete={handleDeleteArchivo}
                />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>

      {/* Dialog para editar diente */}
      <Dialog open={isEditDialogOpen} onOpenChange={(open) => {
        setIsEditDialogOpen(open)
        if (!open) setEstadoSearchTerm('') // Limpiar búsqueda al cerrar
      }}>
        <DialogContent className="max-w-md max-h-[90vh] flex flex-col">
          <DialogHeader className="shrink-0">
            <DialogTitle>
              Diente #{selectedTooth?.numeroDiente}
              {selectedTooth && (
                <span className="text-sm font-normal text-gray-500 ml-2">
                  {getToothInfo(selectedTooth.numeroDiente)?.nombre}
                </span>
              )}
            </DialogTitle>
            <DialogDescription>
              Editar estado, hallazgos clínicos y diagnóstico del diente
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4 overflow-y-auto flex-1 pr-2">
            {/* Info del diente según MTC */}
            {selectedTooth && (
              <div className="bg-gray-50 rounded-lg p-3 text-sm">
                {(() => {
                  const info = getToothInfo(selectedTooth.numeroDiente)
                  if (!info) return null
                  return (
                    <div className="space-y-1">
                      <p><span className="text-gray-500">Elemento:</span> {info.elemento}</p>
                      <p><span className="text-gray-500">Órganos:</span> {info.organos.join(', ')}</p>
                      <p><span className="text-gray-500">Emoción:</span> {info.emocion}</p>
                    </div>
                  )
                })()}
              </div>
            )}

            {/* Estado del diente con buscador */}
            <div className="space-y-2">
              <Label>Estado del diente</Label>
              {/* Buscador de estados */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  value={estadoSearchTerm}
                  onChange={(e) => setEstadoSearchTerm(e.target.value)}
                  placeholder="Buscar estado..."
                  className="pl-9 pr-8"
                />
                {estadoSearchTerm && (
                  <button
                    type="button"
                    onClick={() => setEstadoSearchTerm('')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    <X className="h-4 w-4" />
                  </button>
                )}
              </div>
              <Select value={editingState} onValueChange={(v) => setEditingState(v as EstadoDiente)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="max-h-60">
                  {ESTADOS_DIENTE
                    .filter((estado) => matchesSearch(estado, estadoSearchTerm))
                    .map((estado) => (
                      <SelectItem key={estado.value} value={estado.value}>
                        <div className="flex items-center gap-2">
                          <div className={`w-3 h-3 rounded-full ${estado.color}`} />
                          <span>{estado.label}</span>
                          <span className="text-xs text-muted-foreground">({estado.categoria})</span>
                        </div>
                      </SelectItem>
                    ))}
                  {ESTADOS_DIENTE.filter((estado) => matchesSearch(estado, estadoSearchTerm)).length === 0 && (
                    <div className="px-2 py-4 text-sm text-center text-muted-foreground">
                      No se encontraron estados
                    </div>
                  )}
                </SelectContent>
              </Select>
              {estadoSearchTerm && (
                <p className="text-xs text-muted-foreground">
                  {ESTADOS_DIENTE.filter((estado) => matchesSearch(estado, estadoSearchTerm)).length} resultados encontrados
                </p>
              )}
            </div>

            {/* Hallazgos Clínicos */}
            <div className="space-y-2">
              <Label>Hallazgos Clínicos</Label>
              <Textarea
                value={editingHallazgos}
                onChange={(e) => setEditingHallazgos(e.target.value)}
                placeholder="Lo que se observa clínicamente: cambio de color, inflamación gingival, presencia de placa, sondaje profundo, sangrado al sondaje, movilidad, etc."
                rows={2}
              />
              <p className="text-xs text-muted-foreground">
                Describe lo que observas durante la exploración clínica.
              </p>
            </div>

            {/* Descripción / Diagnóstico del diente */}
            <div className="space-y-2">
              <Label>Diagnóstico</Label>
              <Textarea
                value={editingDescripcion}
                onChange={(e) => setEditingDescripcion(e.target.value)}
                placeholder="Diagnóstico del diente: caries mesial profunda, pulpitis irreversible, periodontitis localizada, fractura vertical, etc."
                rows={2}
              />
              <p className="text-xs text-muted-foreground">
                El diagnóstico basado en los hallazgos clínicos y radiográficos.
              </p>
            </div>

            {/* Campo interferente */}
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Checkbox
                  id="campoInterferente"
                  checked={editingCampoInterferente}
                  onCheckedChange={(checked) => setEditingCampoInterferente(checked as boolean)}
                />
                <Label htmlFor="campoInterferente">Campo Interferente (Terapia Neural)</Label>
              </div>
              {editingCampoInterferente && (
                <Textarea
                  value={editingCampoInterferenteNotas}
                  onChange={(e) => setEditingCampoInterferenteNotas(e.target.value)}
                  placeholder="Notas sobre el campo interferente..."
                  rows={2}
                />
              )}
            </div>

            {/* Observaciones */}
            <div className="space-y-2">
              <Label>Observaciones</Label>
              <Textarea
                value={editingObservaciones}
                onChange={(e) => setEditingObservaciones(e.target.value)}
                placeholder="Notas adicionales sobre este diente..."
                rows={3}
              />
            </div>
          </div>

          <DialogFooter className="shrink-0 border-t pt-4">
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleSaveTooth} disabled={updateTooth.isPending}>
              {updateTooth.isPending ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Guardando...
                </>
              ) : (
                'Guardar'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dialog para crear nueva visita */}
      <Dialog open={isNewVisitDialogOpen} onOpenChange={setIsNewVisitDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Plus className="h-5 w-5" />
              Nueva Visita / Diagnóstico
            </DialogTitle>
            <DialogDescription>
              Crea un nuevo registro de diagnóstico para esta visita. El diagnóstico anterior se conservará en el historial.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            {/* Motivo de la visita */}
            <div className="space-y-2">
              <Label htmlFor="motivo">Motivo de la visita (opcional)</Label>
              <Input
                id="motivo"
                value={newVisitMotivo}
                onChange={(e) => setNewVisitMotivo(e.target.value)}
                placeholder="Ej: Control semestral, Dolor en muela 36, Limpieza..."
              />
              <p className="text-xs text-muted-foreground">
                Describe brevemente el motivo de esta consulta
              </p>
            </div>

            {/* Opción de copiar estado actual */}
            <div className="flex items-start space-x-3 p-3 bg-muted/50 rounded-lg">
              <Checkbox
                id="copiarEstado"
                checked={newVisitCopiarEstado}
                onCheckedChange={(checked) => setNewVisitCopiarEstado(checked as boolean)}
                className="mt-0.5"
              />
              <div>
                <Label htmlFor="copiarEstado" className="font-medium cursor-pointer">
                  Copiar estado actual de los dientes
                </Label>
                <p className="text-xs text-muted-foreground mt-1">
                  {newVisitCopiarEstado
                    ? 'Se creará un nuevo diagnóstico con el mismo estado de dientes que el actual'
                    : 'Se creará un nuevo diagnóstico con todos los dientes en estado "sano"'}
                </p>
              </div>
            </div>

            {/* Información sobre el historial */}
            {historialOdontogramas && historialOdontogramas.length > 0 && (
              <div className="p-3 bg-blue-50 dark:bg-blue-950 rounded-lg text-sm">
                <div className="flex items-center gap-2 text-blue-700 dark:text-blue-300">
                  <History className="h-4 w-4" />
                  <span className="font-medium">
                    Este paciente tiene {historialOdontogramas.length} diagnóstico(s) previo(s)
                  </span>
                </div>
                <p className="text-blue-600 dark:text-blue-400 text-xs mt-1">
                  Todos los diagnósticos anteriores se conservarán en el historial
                </p>
              </div>
            )}
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setIsNewVisitDialogOpen(false)
                setNewVisitMotivo('')
                setNewVisitCopiarEstado(true)
              }}
            >
              Cancelar
            </Button>
            <Button
              onClick={handleCreateNewVisit}
              disabled={createOdontograma.isPending}
            >
              {createOdontograma.isPending ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Creando...
                </>
              ) : (
                <>
                  <Plus className="h-4 w-4 mr-2" />
                  Crear Nueva Visita
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

// Componente para mostrar los documentos del paciente (solo lista, sin vista previa)
function DocumentosSection({
  archivos,
  t,
  onDelete,
}: {
  archivos: ArchivoAdjunto[]
  t: ReturnType<typeof useLanguage>['t']
  onDelete?: (archivoId: string, archivoUrl: string) => Promise<void>
}) {
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null)

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
  }

  const getTipoLabel = (tipo: ArchivoAdjunto['tipo']) => {
    return t.documents.types[tipo] || tipo
  }

  const isPdf = (mimeType: string) => mimeType === 'application/pdf'

  const handleDelete = async (archivo: ArchivoAdjunto) => {
    if (!onDelete) return
    setDeletingId(archivo.id)
    try {
      await onDelete(archivo.id, archivo.url)
    } finally {
      setDeletingId(null)
      setConfirmDeleteId(null)
    }
  }

  if (!archivos || archivos.length === 0) {
    return (
      <div className="text-center py-12">
        <FolderOpen className="h-12 w-12 text-gray-300 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
          {t.documents.noDocuments}
        </h3>
        <p className="text-muted-foreground">
          {t.documents.noDocumentsHint}
        </p>
      </div>
    )
  }

  // Agrupar archivos por tipo
  const archivosPorTipo = archivos.reduce((acc, archivo) => {
    if (!acc[archivo.tipo]) acc[archivo.tipo] = []
    acc[archivo.tipo].push(archivo)
    return acc
  }, {} as Record<string, ArchivoAdjunto[]>)

  return (
    <div className="space-y-6">
      {/* Resumen */}
      <div className="flex items-center gap-4 text-sm text-muted-foreground">
        <span>{archivos.length} archivo(s) adjunto(s)</span>
      </div>

      {/* Archivos agrupados por tipo */}
      {Object.entries(archivosPorTipo).map(([tipo, archivosDelTipo]) => (
        <div key={tipo}>
          <h4 className="font-medium text-gray-900 dark:text-gray-100 mb-3 flex items-center gap-2">
            <Badge variant="outline">{getTipoLabel(tipo as ArchivoAdjunto['tipo'])}</Badge>
            <span className="text-sm text-muted-foreground">({archivosDelTipo.length})</span>
          </h4>
          <div className="space-y-2">
            {archivosDelTipo.map((archivo) => (
              <div
                key={archivo.id}
                className="flex items-center justify-between p-3 bg-white dark:bg-slate-800 border dark:border-slate-700 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
              >
                <div className="flex items-center gap-3 min-w-0">
                  {/* Icono según tipo */}
                  <div className="shrink-0 w-10 h-10 rounded-lg bg-gray-100 dark:bg-slate-600 flex items-center justify-center">
                    {isPdf(archivo.mimeType) ? (
                      <FileText className="h-5 w-5 text-red-500" />
                    ) : (
                      <FileText className="h-5 w-5 text-gray-400" />
                    )}
                  </div>
                  {/* Info */}
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
                      {archivo.nombre}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {formatFileSize(archivo.tamanio)}
                      {archivo.descripcion && ` • ${archivo.descripcion}`}
                    </p>
                  </div>
                </div>
                {/* Acciones */}
                <div className="flex items-center gap-2 shrink-0">
                  {/* Confirmación de eliminación inline */}
                  {confirmDeleteId === archivo.id ? (
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-red-600 dark:text-red-400">Eliminar?</span>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleDelete(archivo)}
                        disabled={deletingId === archivo.id}
                      >
                        {deletingId === archivo.id ? (
                          <Loader2 className="h-3 w-3 animate-spin" />
                        ) : (
                          'Sí'
                        )}
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setConfirmDeleteId(null)}
                        disabled={deletingId === archivo.id}
                      >
                        No
                      </Button>
                    </div>
                  ) : (
                    <>
                      {onDelete && (
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-muted-foreground hover:text-red-600"
                          onClick={() => setConfirmDeleteId(archivo.id)}
                          title="Eliminar archivo"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => window.open(archivo.url, '_blank')}
                      >
                        <Download className="h-4 w-4 mr-2" />
                        {t.documents.open}
                      </Button>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}

// Componente para cada diente en el odontograma
function ToothButton({
  numero,
  diente,
  onClick,
  getEstadoColor,
  isEditable = true,
}: {
  numero: number
  diente?: DientePaciente
  onClick: () => void
  getEstadoColor: (estado: EstadoDiente) => string
  isEditable?: boolean
}) {
  const estado = diente?.estado || 'sano'
  const colorClass = getEstadoColor(estado)
  const isCampoInterferente = diente?.campoInterferente

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={!isEditable}
      className={`
        w-8 h-10 md:w-10 md:h-12 rounded-lg border-2 flex flex-col items-center justify-center
        transition-all bg-white dark:bg-slate-800
        ${isEditable
          ? 'hover:scale-110 hover:shadow-md cursor-pointer'
          : 'cursor-default opacity-75'}
        ${isCampoInterferente
          ? 'border-red-500 ring-2 ring-red-200'
          : isEditable
            ? 'border-gray-200 dark:border-slate-600 hover:border-blue-400'
            : 'border-gray-200 dark:border-slate-600'}
      `}
    >
      <div className={`w-4 h-4 md:w-5 md:h-5 rounded-full ${colorClass}`} />
      <span className="text-[10px] md:text-xs text-gray-600 dark:text-gray-400 mt-0.5">{numero}</span>
    </button>
  )
}
