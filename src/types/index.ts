import type { Timestamp } from 'firebase/firestore'

// Roles de usuario - solo odontólogos
export type UserRole = 'super_admin' | 'admin' | 'odontologo'

// Usuario (Odontólogo)
export interface Usuario {
  id: string
  email: string
  nombre: string
  apellido: string
  rol: UserRole
  especialidad?: string
  matriculaProfesional?: string
  telefono?: string
  activo: boolean
  creadoEn: Timestamp
  actualizadoEn: Timestamp
}

// Elementos de MTC
export type ElementoMTC = 'agua' | 'madera' | 'fuego' | 'tierra' | 'metal'

// Emociones asociadas
export type Emocion = 'miedo' | 'ira' | 'alegria' | 'preocupacion' | 'tristeza'

// Cuadrante dental
export type Cuadrante = 1 | 2 | 3 | 4

// Tipo de diente
export type TipoDiente =
  | 'incisivo_central'
  | 'incisivo_lateral'
  | 'canino'
  | 'primer_premolar'
  | 'segundo_premolar'
  | 'primer_molar'
  | 'segundo_molar'
  | 'tercer_molar'

// Mapeo de tipo de diente a nombre legible
export const TIPO_DIENTE_LABELS: Record<TipoDiente, string> = {
  incisivo_central: 'Incisivo Central',
  incisivo_lateral: 'Incisivo Lateral',
  canino: 'Canino',
  primer_premolar: 'Primer Premolar',
  segundo_premolar: 'Segundo Premolar',
  primer_molar: 'Primer Molar',
  segundo_molar: 'Segundo Molar',
  tercer_molar: 'Tercer Molar',
}

// ============================================
// PACIENTE Y ANAMNESIS
// ============================================

export type Genero = 'masculino' | 'femenino' | 'otro'
export type EstadoCivil = 'soltero' | 'casado' | 'divorciado' | 'viudo' | 'union_libre'
export type GrupoSanguineo = 'A+' | 'A-' | 'B+' | 'B-' | 'AB+' | 'AB-' | 'O+' | 'O-'
export type NivelEstres = 'bajo' | 'moderado' | 'alto' | 'muy_alto'
export type CalidadSueno = 'buena' | 'regular' | 'mala' | 'insomnio'
export type FrecuenciaEjercicio = 'nunca' | 'ocasional' | 'regular' | 'diario'
export type TipoAlimentacion = 'omnivora' | 'vegetariana' | 'vegana' | 'cetogenica' | 'mediterranea' | 'otra'

// Datos personales del paciente
export interface DatosPersonales {
  nombre: string
  apellido: string
  fechaNacimiento: string // ISO date string
  genero: Genero
  estadoCivil: EstadoCivil
  ocupacion: string
  telefono: string
  telefonoEmergencia?: string
  email?: string
  direccion: string
  ciudad: string
  grupoSanguineo?: GrupoSanguineo
  documentoIdentidad: string
  fotoPerfil?: string // URL de la foto del paciente
}

// Antecedentes médicos
export interface AntecedentesMedicos {
  // Enfermedades sistémicas
  diabetes: boolean
  diabetesTipo?: '1' | '2' | 'gestacional'
  hipertension: boolean
  cardiopatia: boolean
  cardiopatiaDetalle?: string
  enfermedadesRespiratorias: boolean
  respiratoriasDetalle?: string
  enfermedadesRenales: boolean
  renalesDetalle?: string
  enfermedadesHepaticas: boolean
  hepaticasDetalle?: string
  enfermedadesAutoinmunes: boolean
  autoinmunesDetalle?: string
  cancer: boolean
  cancerDetalle?: string
  vih: boolean
  hepatitis: boolean
  hepatitisTipo?: 'A' | 'B' | 'C'
  tuberculosis: boolean
  epilepsia: boolean
  enfermedadesTiroides: boolean
  tiroidesDetalle?: string
  osteoporosis: boolean
  artritis: boolean

  // Alergias
  alergiasMedicamentos: boolean
  alergiasMedicamentosDetalle?: string
  alergiasAlimentos: boolean
  alergiasAlimentosDetalle?: string
  alergiasLatex: boolean
  alergiasAnestesia: boolean
  otrasAlergias?: string

  // Medicamentos actuales
  medicamentosActuales: string[]
  anticoagulantes: boolean
  anticoagulantesDetalle?: string
  bifosfonatos: boolean // Importante para procedimientos óseos

  // Cirugías previas
  cirugiasPrevias: string[]
  hospitalizacionesRecientes: boolean
  hospitalizacionesDetalle?: string

  // Embarazo/Lactancia
  embarazo: boolean
  semanaEmbarazo?: number
  lactancia: boolean

  // Otros
  marcapasos: boolean
  protesisArticulares: boolean
  radioterapia: boolean
  quimioterapia: boolean
}

// Antecedentes odontológicos
export interface AntecedentesOdontologicos {
  motivoConsulta: string
  ultimaVisitaDentista?: string // ISO date
  experienciasNegativas: boolean
  experienciasNegativasDetalle?: string
  sangradoEncias: boolean
  sensibilidadDental: boolean
  sensibilidadDetalle?: 'frio' | 'calor' | 'dulce' | 'todos'
  bruxismo: boolean
  bruxismoDiaNoche?: 'dia' | 'noche' | 'ambos'
  usaFerula: boolean
  dolorATM: boolean
  chasquidoATM: boolean
  dificultadAbrirBoca: boolean
  tratamientoOrtodoncia: boolean
  ortodonciaActual: boolean
  protesisDental: boolean
  protesisTipo?: 'fija' | 'removible' | 'total' | 'implantes'
  implantes: boolean
  implantesNumero?: number
  endodoncias: boolean
  endodonciasDetalle?: string
  extracciones: boolean
  extraccionesDetalle?: string
  problemasAnestesia: boolean
  anestesiaDetalle?: string
  hemorragiasPostExtraccion: boolean
  halitosis: boolean
  sequedadBucal: boolean

  // Otros síntomas
  otrosSintomas: boolean
  otrosSintomasDetalle?: string

  // Otros ATM
  otrosATM: boolean
  otrosATMDetalle?: string

  // Otros tratamientos
  otrosTratamientos: boolean
  otrosTratamientosDetalle?: string

  // Higiene oral
  frecuenciaCepillado: '1' | '2' | '3' | 'mas_de_3'
  usoHiloDental: boolean
  usoEnjuagueBucal: boolean
  tipoCepillo: 'manual' | 'electrico'

  // Archivos adjuntos
  archivosAdjuntos?: ArchivoAdjunto[]
}

// Archivo adjunto (radiografías, fotos, documentos)
export type TipoArchivo = 'radiografia' | 'foto_intraoral' | 'foto_extraoral' | 'documento' | 'otro'

export interface ArchivoAdjunto {
  id: string
  nombre: string
  tipo: TipoArchivo
  url: string
  tamanio: number // en bytes
  mimeType: string
  descripcion?: string
  fechaSubida: string // ISO date
}

// Hábitos y estilo de vida
export interface HabitosEstiloVida {
  // Hábitos nocivos
  tabaquismo: boolean
  tabaquismoFrecuencia?: string // ej: "10 cigarros/día"
  tabaquismoAnios?: number
  exFumador: boolean
  aniosDejarFumar?: number
  alcohol: boolean
  alcoholFrecuencia?: 'ocasional' | 'social' | 'frecuente' | 'diario'
  drogas: boolean
  drogasDetalle?: string

  // Hábitos orales
  onicofagia: boolean // Morderse las uñas
  mordisqueoLabios: boolean
  mordisqueoObjetos: boolean
  succionDigital: boolean
  respiracionBucal: boolean

  // Alimentación
  tipoAlimentacion: TipoAlimentacion
  alimentacionDetalle?: string
  consumoAzucar: 'bajo' | 'moderado' | 'alto'
  consumoCafeina: 'ninguno' | 'bajo' | 'moderado' | 'alto'
  consumoBebidasAcidas: boolean // Refrescos, cítricos en exceso
  trastornosAlimenticios: boolean
  trastornosDetalle?: string

  // Estilo de vida
  nivelEstres: NivelEstres
  fuentesEstres?: string
  calidadSueno: CalidadSueno
  horasSueno: number
  ejercicio: FrecuenciaEjercicio
  tipoEjercicio?: string

  // Hidratación
  consumoAguaDiario: 'menos_1L' | '1_2L' | '2_3L' | 'mas_3L'

  // Exposición solar
  exposicionSolar: 'baja' | 'moderada' | 'alta'
}

// Antecedentes familiares
export interface AntecedentesFamiliares {
  diabetesFamiliar: boolean
  hipertensionFamiliar: boolean
  cardiopatiaFamiliar: boolean
  cancerFamiliar: boolean
  cancerTipo?: string
  enfermedadesAutoinmunesFamiliar: boolean
  problemasPeriodontalsFamiliar: boolean
  perdidaDentalTempranaFamiliar: boolean
  maloclusionFamiliar: boolean
  otrosAntecedentesFamiliares?: string
}

// Estado emocional (importante para biodescodificación)
export interface EstadoEmocional {
  estadoAnimoGeneral: 'estable' | 'ansioso' | 'deprimido' | 'irritable' | 'variable'
  eventoEstresanteReciente: boolean
  eventoDetalle?: string
  tratamientoPsicologico: boolean
  medicacionPsiquiatrica: boolean
  medicacionPsiquiatricaDetalle?: string
  relacionesFamiliares: 'buenas' | 'regulares' | 'conflictivas'
  satisfaccionLaboral: 'alta' | 'media' | 'baja'
  redApoyo: boolean
}

// Anamnesis completa
export interface Anamnesis {
  datosPersonales: DatosPersonales
  antecedentesMedicos: AntecedentesMedicos
  antecedentesOdontologicos: AntecedentesOdontologicos
  habitosEstiloVida: HabitosEstiloVida
  antecedentesFamiliares: AntecedentesFamiliares
  estadoEmocional: EstadoEmocional
  observacionesAdicionales?: string
  consentimientoInformado: boolean
  fechaConsentimiento?: Timestamp
}

// Paciente completo
export interface Paciente {
  id: string
  odontologoId: string // Odontólogo que lo registró
  anamnesis: Anamnesis
  activo: boolean
  creadoEn: Timestamp
  actualizadoEn: Timestamp
}

// ============================================
// ODONTOGRAMA Y PATOLOGÍAS
// ============================================

// Estados y condiciones del diente (clasificación completa)
export type EstadoDiente =
  // === ESTADO NORMAL ===
  | 'sano'

  // === CARIES Y LESIONES CARIOSAS ===
  | 'caries'                    // Caries activa
  | 'caries_incipiente'         // Mancha blanca, lesión inicial
  | 'caries_recurrente'         // Caries secundaria (junto a restauración)
  | 'caries_radicular'          // Caries en raíz expuesta
  | 'caries_rampante'           // Caries agresiva múltiple

  // === RESTAURACIONES ===
  | 'obturado'                  // Restauración/obturación
  | 'obturado_amalgama'         // Restauración con amalgama
  | 'obturado_composite'        // Restauración con resina/composite
  | 'obturado_ionomero'         // Restauración con ionómero de vidrio
  | 'obturado_temporal'         // Restauración temporal
  | 'obturado_filtrado'         // Restauración con filtración marginal
  | 'inlay'                     // Incrustación inlay
  | 'onlay'                     // Incrustación onlay
  | 'overlay'                   // Incrustación overlay
  | 'sellante'                  // Sellante de fosas y fisuras
  | 'carilla'                   // Carilla/veneer

  // === CORONAS Y PRÓTESIS FIJA ===
  | 'corona'                    // Corona dental
  | 'corona_metal'              // Corona metálica
  | 'corona_porcelana'          // Corona de porcelana
  | 'corona_metal_porcelana'    // Corona metal-cerámica
  | 'corona_zirconio'           // Corona de zirconio
  | 'corona_provisional'        // Corona temporal/provisional
  | 'puente_pilar'              // Pilar de puente
  | 'puente_pontico'            // Póntico de puente
  | 'protesis_fija'             // Prótesis fija genérica

  // === ENDODONCIA ===
  | 'endodoncia'                // Tratamiento de conducto realizado
  | 'endodoncia_iniciada'       // Endodoncia en proceso
  | 'endodoncia_fallida'        // Endodoncia fracasada
  | 'pulpotomia'                // Pulpotomía
  | 'pulpectomia'               // Pulpectomía
  | 'apicoformacion'            // Apicoformación
  | 'apicectomia'               // Cirugía apical realizada
  | 'poste'                     // Poste/perno intrarradicular
  | 'poste_munon'               // Poste + muñón

  // === PATOLOGÍA PULPAR ===
  | 'pulpitis_reversible'       // Pulpitis reversible
  | 'pulpitis_irreversible'     // Pulpitis irreversible
  | 'necrosis_pulpar'           // Necrosis pulpar
  | 'diente_no_vital'           // Diente desvitalizado

  // === PATOLOGÍA PERIAPICAL ===
  | 'absceso'                   // Absceso periapical
  | 'granuloma'                 // Granuloma periapical
  | 'quiste_periapical'         // Quiste periapical
  | 'periodontitis_apical'      // Periodontitis apical
  | 'osteitis_condensante'      // Osteítis condensante
  | 'fistula'                   // Fístula/tracto sinuoso

  // === ENFERMEDAD PERIODONTAL ===
  | 'periodontitis'             // Periodontitis
  | 'periodontitis_leve'        // Periodontitis estadio I
  | 'periodontitis_moderada'    // Periodontitis estadio II
  | 'periodontitis_severa'      // Periodontitis estadio III-IV
  | 'gingivitis'                // Gingivitis
  | 'movilidad'                 // Movilidad dental
  | 'movilidad_grado_1'         // Movilidad grado I (<1mm)
  | 'movilidad_grado_2'         // Movilidad grado II (1-2mm)
  | 'movilidad_grado_3'         // Movilidad grado III (>2mm, depresible)
  | 'furcacion'                 // Lesión de furcación
  | 'furcacion_grado_1'         // Furcación grado I
  | 'furcacion_grado_2'         // Furcación grado II
  | 'furcacion_grado_3'         // Furcación grado III
  | 'recesion_gingival'         // Recesión gingival

  // === TRAUMATISMOS Y FRACTURAS ===
  | 'fracturado'                // Fractura dental genérica
  | 'fractura_esmalte'          // Fractura solo esmalte
  | 'fractura_coronaria'        // Fractura coronaria (esmalte + dentina)
  | 'fractura_radicular'        // Fractura radicular
  | 'fractura_vertical'         // Fractura vertical
  | 'fisura'                    // Fisura/línea de fractura
  | 'luxacion'                  // Luxación dental
  | 'avulsion'                  // Avulsión dental
  | 'reimplantado'              // Diente reimplantado
  | 'ferulizado'                // Diente ferulizado

  // === DESGASTE DENTAL ===
  | 'atricion'                  // Desgaste por contacto oclusal
  | 'abrasion'                  // Desgaste por agente externo
  | 'erosion'                   // Desgaste químico/ácido
  | 'abfraccion'                // Lesión cervical por estrés oclusal
  | 'desgaste_severo'           // Desgaste dental severo

  // === ANOMALÍAS DEL DESARROLLO ===
  | 'hipoplasia'                // Hipoplasia del esmalte
  | 'hipomineralizacion'        // Hipomineralización (MIH)
  | 'fluorosis'                 // Fluorosis dental
  | 'amelogenesis'              // Amelogénesis imperfecta
  | 'dentinogenesis'            // Dentinogénesis imperfecta
  | 'diente_fusionado'          // Fusión dental
  | 'diente_geminado'           // Geminación dental
  | 'dens_in_dente'             // Dens invaginatus
  | 'taurodontismo'             // Taurodontismo
  | 'dilaceracion'              // Dilaceración radicular
  | 'microdoncia'               // Microdoncia
  | 'macrodoncia'               // Macrodoncia
  | 'supernumerario'            // Diente supernumerario

  // === POSICIÓN Y ERUPCIÓN ===
  | 'retenido'                  // Diente retenido/impactado
  | 'semi_retenido'             // Diente semi-retenido
  | 'no_erupcionado'            // Diente no erupcionado
  | 'parcialmente_erupcionado'  // Parcialmente erupcionado
  | 'ectopico'                  // Erupción ectópica
  | 'rotado'                    // Diente rotado
  | 'inclinado'                 // Diente inclinado/tipped
  | 'extruido'                  // Diente extruido
  | 'intruido'                  // Diente intruido
  | 'transposicion'             // Transposición dental
  | 'diastema'                  // Diastema

  // === AUSENCIA Y EXTRACCIÓN ===
  | 'ausente'                   // Diente ausente
  | 'ausente_congenito'         // Agenesia/ausencia congénita
  | 'extraccion_indicada'       // Extracción indicada
  | 'raiz_retenida'             // Raíz retenida/resto radicular
  | 'alveolo_en_cicatrizacion'  // Sitio de extracción reciente

  // === IMPLANTES ===
  | 'implante'                  // Implante dental
  | 'implante_oseointegrado'    // Implante oseointegrado
  | 'implante_fallido'          // Implante fracasado
  | 'implante_provisional'      // Implante provisional
  | 'pilar_implante'            // Pilar sobre implante
  | 'corona_sobre_implante'     // Corona sobre implante

  // === PRÓTESIS REMOVIBLE ===
  | 'protesis_removible'        // Prótesis parcial removible
  | 'protesis_total'            // Prótesis total/dentadura
  | 'gancho_protesis'           // Gancho/retenedor de prótesis

  // === ORTODONCIA ===
  | 'bracket'                   // Bracket ortodóntico
  | 'banda_ortodontica'         // Banda ortodóntica
  | 'retenedor_fijo'            // Retenedor fijo
  | 'en_tratamiento_ortodoncia' // En tratamiento ortodóntico

  // === SENSIBILIDAD ===
  | 'hipersensibilidad'         // Hipersensibilidad dentinaria
  | 'sensibilidad_frio'         // Sensibilidad al frío
  | 'sensibilidad_calor'        // Sensibilidad al calor

  // === ESTÉTICA ===
  | 'discromia'                 // Cambio de color/discromía
  | 'tincion_intrinseca'        // Tinción intrínseca
  | 'tincion_extrinseca'        // Tinción extrínseca
  | 'blanqueamiento_interno'    // Blanqueamiento interno realizado

  // === OTROS ===
  | 'en_observacion'            // Bajo observación
  | 'tratamiento_pendiente'     // Tratamiento pendiente
  | 'derivar_especialista'      // Requiere derivación

export type SuperficieDental = 'oclusal' | 'mesial' | 'distal' | 'vestibular' | 'palatino' | 'lingual' | 'incisal' | 'cervical'

// Patología específica en un diente
export interface PatologiaDental {
  id: string
  tipo: EstadoDiente
  superficies?: SuperficieDental[]
  severidad: 'leve' | 'moderada' | 'severa'
  fechaDeteccion: Timestamp
  tratamientoRealizado?: string
  fechaTratamiento?: Timestamp
  observaciones?: string
}

// Estado de un diente específico del paciente
export interface DientePaciente {
  numeroDiente: number
  estado: EstadoDiente
  descripcion?: string // Descripción/diagnóstico del diente
  hallazgosClinicos?: string // Hallazgos clínicos observados (lo que se ve)
  patologias: PatologiaDental[]
  campoInterferente: boolean // Terapia Neural
  campoInterferenteNotas?: string
  protocolosAplicados: string[] // IDs de protocolos
  observaciones?: string
  ultimaActualizacion: Timestamp
}

// Odontograma del paciente
export interface Odontograma {
  id: string
  pacienteId: string
  odontologoId: string
  dientes: DientePaciente[]
  fechaCreacion: Timestamp
  fechaActualizacion: Timestamp
  observacionesGenerales?: string
  motivo?: string // Motivo de la visita/diagnóstico
  cerrado?: boolean // true cuando la visita ha terminado
  fechaCierre?: Timestamp // Fecha en que se cerró la visita
}

// ============================================
// PROTOCOLOS TERAPÉUTICOS
// ============================================

export type EnfoqueTerapeutico =
  | 'terapia_neural'
  | 'biorregulacion'
  | 'medicina_funcional'
  | 'convencional'
  | 'mixto'

export type ViaAdministracion =
  | 'oral'
  | 'sublingual'
  | 'inyectable'
  | 'topica'
  | 'inhalacion'

// Medicamento/tratamiento individual
export interface Tratamiento {
  nombre: string
  tipo: 'medicamento' | 'procedimiento' | 'terapia' | 'suplemento'
  viaAdministracion?: ViaAdministracion
  dosis?: string
  frecuencia?: string
  duracion?: string
  observaciones?: string
}

// Protocolo terapéutico
export interface ProtocoloTerapeutico {
  id: string
  nombre: string
  enfoque: EnfoqueTerapeutico
  patologiasIndicadas: EstadoDiente[]
  elementoMTC?: ElementoMTC // Relación con elemento
  descripcion: string
  objetivos: string[]
  tratamientos: Tratamiento[]
  contraindicaciones: string[]
  consideracionesEspeciales?: string
  duracionEstimada?: string
  frecuenciaSesiones?: string
  evidenciaCientifica?: 'alta' | 'moderada' | 'baja' | 'empirica'
  referencias?: string[]
}

// Protocolo aplicado a un paciente
export interface ProtocoloAplicado {
  id: string
  pacienteId: string
  odontologoId: string
  protocoloId: string
  dienteNumero?: number
  fechaInicio: Timestamp
  fechaFin?: Timestamp
  estado: 'activo' | 'completado' | 'suspendido'
  motivoSuspension?: string
  evolucion: NotaEvolucion[]
  resultados?: string
}

// Nota de evolución
export interface NotaEvolucion {
  fecha: Timestamp
  descripcion: string
  mejoria: 'ninguna' | 'leve' | 'moderada' | 'significativa' | 'completa'
  efectosAdversos?: string
  ajustesTratamiento?: string
}

// ============================================
// CONSULTA/CITA
// ============================================

export interface Consulta {
  id: string
  pacienteId: string
  odontologoId: string
  fecha: Timestamp
  motivo: string
  diagnostico?: string
  tratamientosRealizados: string[]
  protocolosIniciados: string[] // IDs de ProtocoloAplicado
  proximaCita?: Timestamp
  observaciones?: string
  duracionMinutos?: number
}

// ============================================
// DIENTE (actualizado)
// ============================================

export interface Diente {
  id: string
  numero: number
  nombre: string
  tipoDiente: TipoDiente
  cuadrante: Cuadrante
  elemento: ElementoMTC
  organos: string[]
  emocion: Emocion
  vertebras: string[]
  articulaciones: string[]
  funcionSimbolica: string
  significadoCuadrante: string
  meridianos: string[]
  protocolosSugeridos: string[] // IDs de protocolos sugeridos para este diente
}

// Órgano
export interface Organo {
  id: string
  nombre: string
  sistema: string
  elemento: ElementoMTC
  meridiano: string
  descripcion: string
}

// Relación diente-órgano para visualización
export interface RelacionDienteOrgano {
  dienteId: string
  organoId: string
  tipoRelacion: 'primaria' | 'secundaria'
}
