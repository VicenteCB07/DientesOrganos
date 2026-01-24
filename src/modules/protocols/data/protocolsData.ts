import type { ProtocoloTerapeutico, EstadoDiente, ElementoMTC } from '@/types'

// ============================================
// PROTOCOLOS DE TERAPIA NEURAL
// ============================================

export const PROTOCOLOS_TERAPIA_NEURAL: ProtocoloTerapeutico[] = [
  {
    id: 'tn-campo-interferente-basico',
    nombre: 'Protocolo Básico de Campo Interferente Dental',
    enfoque: 'terapia_neural',
    patologiasIndicadas: ['endodoncia', 'absceso', 'periodontitis', 'extraccion_indicada'],
    descripcion:
      'Tratamiento de campos interferentes dentales mediante infiltración de procaína según el protocolo Huneke. Busca repolarizar células en despolarización crónica y restaurar el equilibrio del sistema neurovegetativo.',
    objetivos: [
      'Identificar y neutralizar campo interferente dental',
      'Restaurar potencial de membrana celular',
      'Aliviar síntomas a distancia relacionados con el diente',
      'Evaluar respuesta mediante el Fenómeno en Segundos de Huneke',
    ],
    tratamientos: [
      {
        nombre: 'Procaína 0.5-1%',
        tipo: 'medicamento',
        viaAdministracion: 'inyectable',
        dosis: '0.5-2 ml por punto',
        frecuencia: '3 días consecutivos inicial, luego semanal',
        duracion: '4-6 semanas según respuesta',
        observaciones: 'Infiltración periapical y en encía adherida',
      },
      {
        nombre: 'Evaluación de Fenómeno Huneke',
        tipo: 'procedimiento',
        observaciones:
          'Observar desaparición instantánea de síntomas a distancia. Si ocurre, confirma campo interferente.',
      },
    ],
    contraindicaciones: [
      'Alergia a anestésicos locales tipo éster',
      'Infección activa en zona de punción',
      'Anticoagulación severa',
      'Miastenia gravis',
    ],
    consideracionesEspeciales:
      'Siempre realizar prueba de sensibilidad previa. El paciente debe permanecer 15-30 min en observación post-infiltración.',
    duracionEstimada: '4-8 semanas',
    frecuenciaSesiones: 'Semanal tras fase inicial',
    evidenciaCientifica: 'empirica',
    referencias: [
      'Huneke F. Das Sekundenphänomen in der Neuraltherapie',
      'Dosch P. Manual de Terapia Neural según Huneke',
    ],
  },
  {
    id: 'tn-cicatriz-interferente',
    nombre: 'Tratamiento de Cicatriz Interferente Oral',
    enfoque: 'terapia_neural',
    patologiasIndicadas: ['ausente', 'implante'],
    descripcion:
      'Las cicatrices de extracciones previas pueden actuar como campos interferentes. Este protocolo trata cicatrices alveolares que generan alteraciones a distancia.',
    objetivos: [
      'Desactivar cicatriz como campo interferente',
      'Mejorar síntomas sistémicos relacionados',
      'Restaurar flujo energético del meridiano afectado',
    ],
    tratamientos: [
      {
        nombre: 'Procaína 1%',
        tipo: 'medicamento',
        viaAdministracion: 'inyectable',
        dosis: '0.5-1 ml en la cicatriz',
        frecuencia: 'Semanal',
        duracion: '3-6 sesiones',
        observaciones: 'Pápulas intradérmicas siguiendo el trayecto de la cicatriz',
      },
    ],
    contraindicaciones: [
      'Alergia a procaína',
      'Infección local activa',
    ],
    duracionEstimada: '3-6 semanas',
    frecuenciaSesiones: 'Semanal',
    evidenciaCientifica: 'empirica',
  },
  {
    id: 'tn-segmental-trigémino',
    nombre: 'Terapia Segmental del Trigémino',
    enfoque: 'terapia_neural',
    patologiasIndicadas: ['caries', 'periodontitis', 'absceso', 'fracturado'],
    descripcion:
      'Tratamiento segmental que aborda el territorio del nervio trigémino para dolores faciales y dentales de difícil manejo.',
    objetivos: [
      'Modular respuesta dolorosa del trigémino',
      'Reducir inflamación neurogénica',
      'Tratar neuralgias faciales asociadas',
    ],
    tratamientos: [
      {
        nombre: 'Procaína 1%',
        tipo: 'medicamento',
        viaAdministracion: 'inyectable',
        dosis: '1-2 ml por punto',
        frecuencia: '2 veces por semana',
        duracion: '2-4 semanas',
        observaciones: 'Puntos en emergencia de ramas del trigémino',
      },
      {
        nombre: 'Bloqueo del ganglio esfenopalatino',
        tipo: 'procedimiento',
        observaciones: 'Técnica avanzada para casos refractarios',
      },
    ],
    contraindicaciones: [
      'Alergia a anestésicos',
      'Coagulopatía severa',
      'Infección en zona de punción',
    ],
    duracionEstimada: '2-4 semanas',
    frecuenciaSesiones: '2 veces/semana',
    evidenciaCientifica: 'moderada',
  },
]

// ============================================
// PROTOCOLOS DE BIORREGULACIÓN (HOMOTOXICOLOGÍA)
// ============================================

export const PROTOCOLOS_BIORREGULACION: ProtocoloTerapeutico[] = [
  {
    id: 'bio-inflamacion-aguda',
    nombre: 'Protocolo Antiinflamatorio Agudo',
    enfoque: 'biorregulacion',
    patologiasIndicadas: ['absceso', 'periodontitis', 'fracturado'],
    descripcion:
      'Manejo de procesos inflamatorios agudos mediante medicamentos biorreguladores que modulan la respuesta inflamatoria sin suprimirla completamente.',
    objetivos: [
      'Modular respuesta inflamatoria',
      'Reducir dolor sin efectos adversos de AINEs',
      'Acelerar resolución del proceso',
      'Minimizar complicaciones',
    ],
    tratamientos: [
      {
        nombre: 'Traumeel S tabletas',
        tipo: 'medicamento',
        viaAdministracion: 'sublingual',
        dosis: '1 tableta',
        frecuencia: 'Cada 15 minutos hasta remisión, luego 3 veces/día',
        duracion: '5-7 días',
        observaciones: 'Dejar disolver bajo la lengua',
      },
      {
        nombre: 'Traumeel S gotas',
        tipo: 'medicamento',
        viaAdministracion: 'oral',
        dosis: '10 gotas',
        frecuencia: '3 veces al día',
        duracion: '7-10 días',
        observaciones: 'Alternativa a tabletas',
      },
      {
        nombre: 'Traumeel S inyectable',
        tipo: 'medicamento',
        viaAdministracion: 'inyectable',
        dosis: '2.2 ml',
        frecuencia: '1-3 veces por semana',
        duracion: '2-4 semanas',
        observaciones: 'Para casos severos. Infiltración local o IM.',
      },
    ],
    contraindicaciones: [
      'Hipersensibilidad a plantas de la familia Compositae',
      'Tuberculosis activa',
      'Leucemia',
      'Enfermedades autoinmunes severas',
    ],
    consideracionesEspeciales:
      'Puede usarse en embarazo y lactancia bajo supervisión. Compatible con tratamiento convencional.',
    duracionEstimada: '1-2 semanas',
    frecuenciaSesiones: 'Diario en fase aguda',
    evidenciaCientifica: 'moderada',
    referencias: ['Schneider C. et al. Traumeel - an emerging option to nonsteroidal anti-inflammatory drugs'],
  },
  {
    id: 'bio-post-extraccion',
    nombre: 'Protocolo Post-Extracción Dental',
    enfoque: 'biorregulacion',
    patologiasIndicadas: ['extraccion_indicada', 'ausente'],
    descripcion:
      'Protocolo para minimizar dolor, inflamación y hemorragia tras extracciones dentales, acelerando la cicatrización.',
    objetivos: [
      'Reducir dolor postoperatorio',
      'Minimizar inflamación',
      'Controlar hemorragia',
      'Acelerar cicatrización alveolar',
    ],
    tratamientos: [
      {
        nombre: 'Traumeel S tabletas',
        tipo: 'medicamento',
        viaAdministracion: 'sublingual',
        dosis: '1 tableta 4 veces al día',
        frecuencia: '2 días antes del procedimiento',
        duracion: '2 días pre + 5 días post',
        observaciones: 'Iniciar 2 días antes de la extracción',
      },
      {
        nombre: 'Arnica montana D6',
        tipo: 'medicamento',
        viaAdministracion: 'sublingual',
        dosis: '5 glóbulos',
        frecuencia: '3 veces al día',
        duracion: '1 semana',
        observaciones: 'Complemento para equimosis',
      },
      {
        nombre: 'Phosphorus D12',
        tipo: 'medicamento',
        viaAdministracion: 'sublingual',
        dosis: '5 glóbulos',
        frecuencia: '2 veces al día',
        duracion: '3-5 días',
        observaciones: 'Para control de hemorragia',
      },
    ],
    contraindicaciones: [
      'Alergia conocida a componentes',
    ],
    consideracionesEspeciales:
      'Estudios muestran menor dolor e inflamación comparado con analgésicos convencionales.',
    duracionEstimada: '1 semana',
    evidenciaCientifica: 'moderada',
    referencias: ['Efectos de Traumeel S sobre dolor, inflamación y hemorragia postextracciones'],
  },
  {
    id: 'bio-periodontitis',
    nombre: 'Protocolo Periodontal Biorregulador',
    enfoque: 'biorregulacion',
    patologiasIndicadas: ['periodontitis', 'movilidad'],
    descripcion:
      'Tratamiento complementario de la enfermedad periodontal mediante biorregulación, enfocado en modular la inflamación crónica y estimular regeneración tisular.',
    objetivos: [
      'Reducir inflamación gingival crónica',
      'Disminuir sangrado al sondaje',
      'Estimular regeneración del tejido de soporte',
      'Controlar progresión de la enfermedad',
    ],
    tratamientos: [
      {
        nombre: 'Traumeel S',
        tipo: 'medicamento',
        viaAdministracion: 'oral',
        dosis: '1 tableta 3 veces al día',
        frecuencia: 'Diario',
        duracion: '4-8 semanas',
      },
      {
        nombre: 'Zeel T',
        tipo: 'medicamento',
        viaAdministracion: 'oral',
        dosis: '1 tableta 3 veces al día',
        frecuencia: 'Diario',
        duracion: '8-12 semanas',
        observaciones: 'Para regeneración de tejido conectivo',
      },
      {
        nombre: 'Lymphomyosot',
        tipo: 'medicamento',
        viaAdministracion: 'oral',
        dosis: '10 gotas 3 veces al día',
        frecuencia: 'Diario',
        duracion: '4-6 semanas',
        observaciones: 'Para drenaje linfático y detoxificación',
      },
    ],
    contraindicaciones: [
      'Hipersensibilidad a componentes',
      'Enfermedades tiroideas (Lymphomyosot contiene Iodium)',
    ],
    duracionEstimada: '8-12 semanas',
    frecuenciaSesiones: 'Diario',
    evidenciaCientifica: 'baja',
  },
  {
    id: 'bio-dolor-cronico',
    nombre: 'Protocolo para Dolor Crónico Orofacial',
    enfoque: 'biorregulacion',
    patologiasIndicadas: ['endodoncia', 'periodontitis', 'fracturado'],
    descripcion:
      'Manejo del dolor crónico orofacial mediante biorregulación, especialmente útil en dolores post-endodónticos y ATM.',
    objetivos: [
      'Reducir dolor crónico',
      'Disminuir necesidad de analgésicos convencionales',
      'Mejorar calidad de vida',
      'Tratar componente inflamatorio residual',
    ],
    tratamientos: [
      {
        nombre: 'Traumeel S',
        tipo: 'medicamento',
        viaAdministracion: 'sublingual',
        dosis: '1 tableta 3 veces al día',
        frecuencia: 'Diario',
        duracion: '4-6 semanas',
      },
      {
        nombre: 'Spascupreel',
        tipo: 'medicamento',
        viaAdministracion: 'sublingual',
        dosis: '1 tableta',
        frecuencia: '3 veces al día o según necesidad',
        duracion: '2-4 semanas',
        observaciones: 'Para componente espasmódico del dolor',
      },
      {
        nombre: 'Gelsemium-Homaccord',
        tipo: 'medicamento',
        viaAdministracion: 'oral',
        dosis: '10 gotas 3 veces al día',
        frecuencia: 'Diario',
        duracion: '2-4 semanas',
        observaciones: 'Para neuralgias',
      },
    ],
    contraindicaciones: ['Hipersensibilidad a componentes'],
    duracionEstimada: '4-6 semanas',
    frecuenciaSesiones: 'Diario',
    evidenciaCientifica: 'baja',
  },
]

// ============================================
// PROTOCOLOS DE MEDICINA FUNCIONAL
// ============================================

export const PROTOCOLOS_MEDICINA_FUNCIONAL: ProtocoloTerapeutico[] = [
  {
    id: 'mf-remineralizacion',
    nombre: 'Protocolo de Remineralización Dental',
    enfoque: 'medicina_funcional',
    patologiasIndicadas: ['caries'],
    descripcion:
      'Enfoque de mínima intervención para lesiones de caries incipientes, basado en remineralización activa y control de factores de riesgo.',
    objetivos: [
      'Detener progresión de lesiones incipientes',
      'Promover remineralización del esmalte',
      'Modificar ambiente oral hacia uno protector',
      'Evitar tratamiento restaurador invasivo',
    ],
    tratamientos: [
      {
        nombre: 'Barniz de flúor 5%',
        tipo: 'procedimiento',
        frecuencia: 'Cada 3-6 meses',
        observaciones: 'Aplicación profesional',
      },
      {
        nombre: 'Pasta dental con hidroxiapatita',
        tipo: 'medicamento',
        viaAdministracion: 'topica',
        frecuencia: '2 veces al día',
        duracion: 'Continuo',
        observaciones: 'Alternativa al flúor',
      },
      {
        nombre: 'CPP-ACP (Recaldent)',
        tipo: 'medicamento',
        viaAdministracion: 'topica',
        dosis: 'Aplicar en dientes afectados',
        frecuencia: '1-2 veces al día',
        duracion: '3-6 meses',
        observaciones: 'Crema remineralizante',
      },
      {
        nombre: 'Xilitol',
        tipo: 'suplemento',
        viaAdministracion: 'oral',
        dosis: '6-10 g/día',
        frecuencia: 'Dividido en 3-5 tomas',
        duracion: 'Continuo',
        observaciones: 'Chicles o pastillas con xilitol',
      },
      {
        nombre: 'Vitamina D3',
        tipo: 'suplemento',
        viaAdministracion: 'oral',
        dosis: '2000-4000 UI/día',
        frecuencia: 'Diario',
        duracion: 'Continuo con monitoreo',
        observaciones: 'Esencial para metabolismo del calcio',
      },
      {
        nombre: 'Vitamina K2 (MK-7)',
        tipo: 'suplemento',
        viaAdministracion: 'oral',
        dosis: '100-200 mcg/día',
        frecuencia: 'Diario',
        duracion: 'Continuo',
        observaciones: 'Dirige calcio a dientes y huesos',
      },
    ],
    contraindicaciones: [
      'Alergia a proteínas lácteas (para CPP-ACP)',
      'Hipervitaminosis D',
    ],
    consideracionesEspeciales:
      'Requiere modificación dietética: reducir azúcares refinados, aumentar minerales. Control de pH salival.',
    duracionEstimada: '3-6 meses evaluación',
    frecuenciaSesiones: 'Control mensual inicial',
    evidenciaCientifica: 'alta',
  },
  {
    id: 'mf-periodontitis-sistemica',
    nombre: 'Abordaje Sistémico de Periodontitis',
    enfoque: 'medicina_funcional',
    patologiasIndicadas: ['periodontitis', 'movilidad'],
    descripcion:
      'Tratamiento que aborda las causas sistémicas de la enfermedad periodontal: inflamación crónica, disbiosis intestinal, deficiencias nutricionales y estrés oxidativo.',
    objetivos: [
      'Reducir inflamación sistémica',
      'Corregir deficiencias nutricionales',
      'Restaurar equilibrio del microbioma oral',
      'Potenciar capacidad regenerativa del periodonto',
    ],
    tratamientos: [
      {
        nombre: 'Omega-3 (EPA/DHA)',
        tipo: 'suplemento',
        viaAdministracion: 'oral',
        dosis: '2-3 g/día',
        frecuencia: 'Dividido en 2 tomas con comidas',
        duracion: '3-6 meses',
        observaciones: 'Antiinflamatorio potente',
      },
      {
        nombre: 'Coenzima Q10',
        tipo: 'suplemento',
        viaAdministracion: 'oral',
        dosis: '100-200 mg/día',
        frecuencia: 'Diario',
        duracion: '3-6 meses',
        observaciones: 'Mejora salud gingival',
      },
      {
        nombre: 'Vitamina C',
        tipo: 'suplemento',
        viaAdministracion: 'oral',
        dosis: '1-2 g/día',
        frecuencia: 'Dividido en 2-3 tomas',
        duracion: 'Continuo',
        observaciones: 'Esencial para síntesis de colágeno',
      },
      {
        nombre: 'Probióticos orales',
        tipo: 'suplemento',
        viaAdministracion: 'oral',
        dosis: 'Según producto (Lactobacillus reuteri)',
        frecuencia: 'Diario',
        duracion: '3 meses mínimo',
        observaciones: 'Restaura microbioma oral',
      },
      {
        nombre: 'Zinc',
        tipo: 'suplemento',
        viaAdministracion: 'oral',
        dosis: '15-30 mg/día',
        frecuencia: 'Diario',
        duracion: '3 meses',
        observaciones: 'Cicatrización e inmunidad',
      },
      {
        nombre: 'Curcumina',
        tipo: 'suplemento',
        viaAdministracion: 'oral',
        dosis: '500-1000 mg/día',
        frecuencia: 'Con comidas grasas',
        duracion: '3-6 meses',
        observaciones: 'Antiinflamatorio natural',
      },
    ],
    contraindicaciones: [
      'Anticoagulantes (precaución con Omega-3 a altas dosis)',
      'Cirugía programada (suspender Omega-3 1 semana antes)',
    ],
    consideracionesEspeciales:
      'Evaluar niveles de vitamina D, hierro y B12. Considerar prueba de permeabilidad intestinal.',
    duracionEstimada: '3-6 meses',
    frecuenciaSesiones: 'Control mensual',
    evidenciaCientifica: 'moderada',
  },
  {
    id: 'mf-detox-amalgamas',
    nombre: 'Protocolo de Detoxificación Post-Amalgama',
    enfoque: 'medicina_funcional',
    patologiasIndicadas: ['obturado'],
    descripcion:
      'Protocolo de apoyo para pacientes tras remoción segura de amalgamas, enfocado en quelación suave y soporte de rutas de detoxificación.',
    objetivos: [
      'Apoyar eliminación de mercurio residual',
      'Proteger sistema nervioso',
      'Optimizar rutas de detoxificación hepática',
      'Restaurar antioxidantes depletados',
    ],
    tratamientos: [
      {
        nombre: 'N-Acetil Cisteína (NAC)',
        tipo: 'suplemento',
        viaAdministracion: 'oral',
        dosis: '600-1200 mg/día',
        frecuencia: 'Dividido en 2 tomas',
        duracion: '3-6 meses',
        observaciones: 'Precursor del glutatión',
      },
      {
        nombre: 'Selenio',
        tipo: 'suplemento',
        viaAdministracion: 'oral',
        dosis: '200 mcg/día',
        frecuencia: 'Diario',
        duracion: '3 meses',
        observaciones: 'Contrarresta toxicidad del mercurio',
      },
      {
        nombre: 'Clorella',
        tipo: 'suplemento',
        viaAdministracion: 'oral',
        dosis: '3-6 g/día',
        frecuencia: 'Con comidas',
        duracion: '3-6 meses',
        observaciones: 'Quelante suave',
      },
      {
        nombre: 'Vitamina C liposomal',
        tipo: 'suplemento',
        viaAdministracion: 'oral',
        dosis: '1-2 g/día',
        frecuencia: 'Diario',
        duracion: '3-6 meses',
        observaciones: 'Antioxidante y quelante',
      },
      {
        nombre: 'Alfa lipoico',
        tipo: 'suplemento',
        viaAdministracion: 'oral',
        dosis: '300-600 mg/día',
        frecuencia: 'Alejado de comidas',
        duracion: '3 meses',
        observaciones: 'Cruza barrera hematoencefálica',
      },
    ],
    contraindicaciones: [
      'No iniciar antes de remoción completa de amalgamas',
      'Insuficiencia renal severa',
      'Quelación agresiva sin supervisión',
    ],
    consideracionesEspeciales:
      'Iniciar 2 semanas después de última remoción. Asegurar movimiento intestinal diario. Hidratación abundante.',
    duracionEstimada: '3-6 meses',
    frecuenciaSesiones: 'Control mensual con laboratorios',
    evidenciaCientifica: 'baja',
  },
  {
    id: 'mf-bruxismo',
    nombre: 'Protocolo Integrativo para Bruxismo',
    enfoque: 'medicina_funcional',
    patologiasIndicadas: ['fracturado'],
    descripcion:
      'Abordaje multifactorial del bruxismo considerando estrés, deficiencias nutricionales, trastornos del sueño y parasitosis.',
    objetivos: [
      'Reducir frecuencia e intensidad del bruxismo',
      'Mejorar calidad del sueño',
      'Modular respuesta al estrés',
      'Proteger estructuras dentales',
    ],
    tratamientos: [
      {
        nombre: 'Magnesio glicinato',
        tipo: 'suplemento',
        viaAdministracion: 'oral',
        dosis: '300-400 mg/día',
        frecuencia: 'Antes de dormir',
        duracion: '3 meses mínimo',
        observaciones: 'Relajante muscular natural',
      },
      {
        nombre: 'L-Teanina',
        tipo: 'suplemento',
        viaAdministracion: 'oral',
        dosis: '200-400 mg',
        frecuencia: 'Antes de dormir',
        duracion: '2-3 meses',
        observaciones: 'Promueve relajación sin sedación',
      },
      {
        nombre: 'Vitaminas B6 + B12',
        tipo: 'suplemento',
        viaAdministracion: 'oral',
        dosis: 'B6: 50mg, B12: 1000mcg',
        frecuencia: 'Diario',
        duracion: '3 meses',
        observaciones: 'Apoyo sistema nervioso',
      },
      {
        nombre: 'Férula oclusal',
        tipo: 'procedimiento',
        frecuencia: 'Uso nocturno',
        duracion: 'Continuo',
        observaciones: 'Protección mecánica',
      },
      {
        nombre: 'Técnicas de relajación/Mindfulness',
        tipo: 'terapia',
        frecuencia: 'Diario',
        observaciones: 'Fundamental para manejo del estrés',
      },
    ],
    contraindicaciones: ['Evaluar interacciones con medicamentos'],
    consideracionesEspeciales:
      'Descartar apnea del sueño y parasitosis intestinal (causa frecuente en niños). Evaluar niveles de cortisol.',
    duracionEstimada: '3-6 meses',
    frecuenciaSesiones: 'Control mensual',
    evidenciaCientifica: 'moderada',
  },
]

// ============================================
// PROTOCOLOS MIXTOS
// ============================================

export const PROTOCOLOS_MIXTOS: ProtocoloTerapeutico[] = [
  {
    id: 'mix-absceso-integral',
    nombre: 'Protocolo Integral para Absceso Dental',
    enfoque: 'mixto',
    patologiasIndicadas: ['absceso'],
    descripcion:
      'Combinación de tratamiento convencional con apoyo biorregulador y medicina funcional para manejo de abscesos dentales.',
    objetivos: [
      'Resolver infección aguda',
      'Modular inflamación',
      'Prevenir recurrencia',
      'Apoyar sistema inmune',
    ],
    tratamientos: [
      {
        nombre: 'Drenaje del absceso',
        tipo: 'procedimiento',
        observaciones: 'Tratamiento convencional esencial',
      },
      {
        nombre: 'Tratamiento endodóntico o extracción',
        tipo: 'procedimiento',
        observaciones: 'Según evaluación clínica',
      },
      {
        nombre: 'Traumeel S',
        tipo: 'medicamento',
        viaAdministracion: 'sublingual',
        dosis: '1 tableta 4 veces al día',
        frecuencia: 'Diario',
        duracion: '7-10 días',
        observaciones: 'Modulación inflamatoria',
      },
      {
        nombre: 'Vitamina C',
        tipo: 'suplemento',
        viaAdministracion: 'oral',
        dosis: '2-3 g/día divididos',
        frecuencia: 'Cada 4-6 horas',
        duracion: '7-14 días',
        observaciones: 'Apoyo inmunológico',
      },
      {
        nombre: 'Zinc',
        tipo: 'suplemento',
        viaAdministracion: 'oral',
        dosis: '30 mg/día',
        frecuencia: 'Diario',
        duracion: '2 semanas',
        observaciones: 'Apoyo inmunológico',
      },
      {
        nombre: 'Procaína 1% perilesional',
        tipo: 'medicamento',
        viaAdministracion: 'inyectable',
        dosis: '1-2 ml',
        frecuencia: 'Posterior al drenaje',
        observaciones: 'Terapia neural coadyuvante',
      },
    ],
    contraindicaciones: [
      'Alergias conocidas',
      'Puede requerir antibiótico si hay celulitis o compromiso sistémico',
    ],
    consideracionesEspeciales:
      'El antibiótico se reserva para casos con extensión celulítica, fiebre o compromiso sistémico. Monitorear signos de alarma.',
    duracionEstimada: '2-4 semanas',
    frecuenciaSesiones: 'Control a las 48-72h, luego semanal',
    evidenciaCientifica: 'moderada',
  },
]

// ============================================
// TODOS LOS PROTOCOLOS
// ============================================

export const TODOS_PROTOCOLOS: ProtocoloTerapeutico[] = [
  ...PROTOCOLOS_TERAPIA_NEURAL,
  ...PROTOCOLOS_BIORREGULACION,
  ...PROTOCOLOS_MEDICINA_FUNCIONAL,
  ...PROTOCOLOS_MIXTOS,
]

// ============================================
// HELPERS
// ============================================

/**
 * Obtiene protocolos sugeridos para una patología específica
 */
export function getProtocolosPorPatologia(patologia: EstadoDiente): ProtocoloTerapeutico[] {
  return TODOS_PROTOCOLOS.filter((p) => p.patologiasIndicadas.includes(patologia))
}

/**
 * Obtiene protocolos por enfoque terapéutico
 */
export function getProtocolosPorEnfoque(enfoque: ProtocoloTerapeutico['enfoque']): ProtocoloTerapeutico[] {
  return TODOS_PROTOCOLOS.filter((p) => p.enfoque === enfoque)
}

/**
 * Obtiene protocolos relacionados con un elemento de MTC
 */
export function getProtocolosPorElemento(elemento: ElementoMTC): ProtocoloTerapeutico[] {
  return TODOS_PROTOCOLOS.filter((p) => p.elementoMTC === elemento)
}

/**
 * Obtiene un protocolo por ID
 */
export function getProtocoloPorId(id: string): ProtocoloTerapeutico | undefined {
  return TODOS_PROTOCOLOS.find((p) => p.id === id)
}

/**
 * Mapeo de patologías principales a nombres legibles
 * (Solo incluye las patologías más comunes usadas en protocolos)
 */
export const PATOLOGIA_LABELS: Partial<Record<EstadoDiente, string>> = {
  sano: 'Sano',
  caries: 'Caries',
  obturado: 'Obturado/Restaurado',
  corona: 'Corona',
  endodoncia: 'Endodoncia',
  extraccion_indicada: 'Extracción Indicada',
  ausente: 'Ausente',
  implante: 'Implante',
  protesis_fija: 'Prótesis Fija',
  protesis_removible: 'Prótesis Removible',
  fracturado: 'Fracturado',
  movilidad: 'Movilidad',
  periodontitis: 'Periodontitis',
  absceso: 'Absceso',
  retenido: 'Retenido',
  supernumerario: 'Supernumerario',
  pulpitis_reversible: 'Pulpitis Reversible',
  pulpitis_irreversible: 'Pulpitis Irreversible',
  necrosis_pulpar: 'Necrosis Pulpar',
  gingivitis: 'Gingivitis',
  granuloma: 'Granuloma',
  quiste_periapical: 'Quiste Periapical',
}

/**
 * Mapeo de enfoques a nombres legibles
 */
export const ENFOQUE_LABELS: Record<ProtocoloTerapeutico['enfoque'], string> = {
  terapia_neural: 'Terapia Neural',
  biorregulacion: 'Biorregulación / Homotoxicología',
  medicina_funcional: 'Medicina Funcional',
  convencional: 'Convencional',
  mixto: 'Mixto / Integrativo',
}

/**
 * Colores para cada enfoque (para UI)
 */
export const ENFOQUE_COLORS: Record<ProtocoloTerapeutico['enfoque'], string> = {
  terapia_neural: '#1976D2',
  biorregulacion: '#388E3C',
  medicina_funcional: '#F57C00',
  convencional: '#616161',
  mixto: '#7B1FA2',
}
