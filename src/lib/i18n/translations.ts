// Traducciones de la aplicación
export type Language = 'es' | 'en'

export const translations = {
  es: {
    // General
    app: {
      name: 'Dientes & Órganos',
      tagline: 'Odontología Integrativa',
    },

    // Auth
    auth: {
      login: 'Iniciar Sesión',
      register: 'Registrarse',
      logout: 'Salir',
      email: 'Correo electrónico',
      password: 'Contraseña',
      confirmPassword: 'Confirmar contraseña',
      firstName: 'Nombre',
      lastName: 'Apellido',
      forgotPassword: '¿Olvidaste tu contraseña?',
      noAccount: '¿No tienes cuenta?',
      hasAccount: '¿Ya tienes cuenta?',
      createAccount: 'Crear cuenta',
      loginButton: 'Ingresar',
      registerButton: 'Registrarme',
    },

    // Navigation
    nav: {
      patients: 'Pacientes',
      teethChart: 'Gráfica Dental',
      protocols: 'Protocolos',
      settings: 'Configuración',
    },

    // Patients
    patients: {
      title: 'Mis Pacientes',
      subtitle: 'Gestión de Pacientes',
      newPatient: 'Nuevo Paciente',
      addPatient: 'Agregar Paciente',
      searchPlaceholder: 'Buscar por nombre o documento...',
      searchHint: 'Escribe al menos 2 caracteres para buscar',
      noPatients: 'Sin pacientes registrados',
      noPatientsHint: 'Comienza agregando tu primer paciente',
      noResults: 'No se encontraron resultados',
      noResultsHint: 'Intenta con otro término de búsqueda',
      viewRecord: 'Ver Ficha',
      registered: 'pacientes registrados',
      deleteConfirm: 'Confirmar eliminación',
      deleteMessage: '¿Estás seguro de que deseas eliminar al paciente',
      deleteNote: 'Esta acción marcará al paciente como inactivo.',
      cancel: 'Cancelar',
      delete: 'Eliminar',
      deleting: 'Eliminando...',
    },

    // Patient Detail
    patientDetail: {
      loadingPatient: 'Cargando información del paciente...',
      patientNotFound: 'Paciente no encontrado',
      backToList: 'Volver a la lista',
      years: 'años',
      phone: 'Teléfono',
      document: 'Documento',
      address: 'Dirección',
      occupation: 'Ocupación',
      email: 'Email',
      bloodType: 'Grupo sanguíneo',
      emergencyPhone: 'Tel. Emergencia',
    },

    // Tabs
    tabs: {
      anamnesis: 'Anamnesis',
      generalConditions: 'Condiciones Generales',
      odontogram: 'Odontograma',
    },

    // Odontogram
    odontogram: {
      title: 'Odontograma del Paciente',
      subtitle: 'Haz clic en cualquier diente para editar su estado',
      upperRight: 'Superior Derecho',
      upperLeft: 'Superior Izquierdo',
      lowerLeft: 'Inferior Izquierdo',
      lowerRight: 'Inferior Derecho',
      summary: 'Resumen del Estado Dental',
      generalObservations: 'Observaciones Generales del Estado Bucal',
      generalObservationsPlaceholder: 'Notas generales sobre el estado de la boca del paciente: higiene oral, estado de encías, oclusión, etc.',
      generalObservationsHint: 'Estas observaciones se guardan automáticamente con el odontograma.',
    },

    // Tooth States
    toothStates: {
      sano: 'Sano',
      caries: 'Caries',
      obturado: 'Obturado',
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
    },

    // Tooth Edit Dialog
    toothEdit: {
      editTooth: 'Editar Diente',
      tooth: 'Diente',
      state: 'Estado del Diente',
      selectState: 'Selecciona un estado',
      description: 'Descripción / Diagnóstico',
      descriptionPlaceholder: 'Describe lo que tiene el diente: caries mesial profunda, restauración antigua filtrada, fractura vertical, etc.',
      interferingField: 'Campo Interferente (Terapia Neural)',
      interferingFieldNotes: 'Notas del Campo Interferente',
      interferingFieldPlaceholder: 'Describe por qué se considera campo interferente...',
      observations: 'Observaciones Adicionales',
      observationsPlaceholder: 'Notas adicionales sobre el diente...',
      save: 'Guardar Cambios',
      saving: 'Guardando...',
      cancel: 'Cancelar',
    },

    // General Conditions
    generalConditions: {
      title: 'Condiciones Generales de la Boca',
      subtitle: 'Condiciones que afectan toda la cavidad oral',
      periodontitis: 'Periodontitis Generalizada',
      periodontitisDesc: 'Inflamación crónica de los tejidos de soporte dental',
      gingivitis: 'Gingivitis',
      gingivitisDesc: 'Inflamación de las encías',
      halitosis: 'Halitosis',
      halitosisDesc: 'Mal aliento persistente',
      dryMouth: 'Sequedad Bucal',
      dryMouthDesc: 'Xerostomía o boca seca',
      bruxism: 'Bruxismo',
      bruxismDesc: 'Rechinamiento o apretamiento de dientes',
      severity: 'Grado',
      mild: 'Leve',
      moderate: 'Moderada',
      severe: 'Severa',
    },

    // Anamnesis
    anamnesis: {
      title: 'Resumen de Anamnesis',
      subtitle: 'Información relevante del historial del paciente',
      medicalHistory: 'Antecedentes Médicos',
      emotionalState: 'Estado Emocional',
      generalState: 'Estado general',
      familyRelations: 'Relaciones familiares',
      jobSatisfaction: 'Satisfacción laboral',
      habits: 'Hábitos',
      smoker: 'Fumador',
      alcoholConsumption: 'Consumo de alcohol',
      brushingFrequency: 'Cepillado',
      timesPerDay: 'x día',
      diabetes: 'Diabetes',
      type: 'Tipo',
      hypertension: 'Hipertensión',
      heartDisease: 'Cardiopatía',
      anticoagulants: 'Anticoagulantes',
      medicationAllergies: 'Alergias a Medicamentos',
      otherAllergies: 'Otras Alergias',
      latex: 'Látex',
      anesthesia: 'Anestesia',
      food: 'Alimentos',
      notSpecified: 'No especificado',
      medicationsNotSpecified: 'No se especificaron los medicamentos',
    },

    // Anamnesis Form Steps
    anamnesisForm: {
      step1: 'Datos Personales',
      step2: 'Antecedentes Médicos',
      step3: 'Antecedentes Odontológicos',
      step4: 'Hábitos y Estilo de Vida',
      step5: 'Estado Emocional y Familiar',
      next: 'Siguiente',
      previous: 'Anterior',
      save: 'Guardar Paciente',
      saving: 'Guardando...',
    },

    // Common
    common: {
      loading: 'Cargando...',
      save: 'Guardar',
      cancel: 'Cancelar',
      delete: 'Eliminar',
      edit: 'Editar',
      close: 'Cerrar',
      yes: 'Sí',
      no: 'No',
      confirm: 'Confirmar',
      back: 'Volver',
      error: 'Error',
      success: 'Éxito',
      warning: 'Advertencia',
    },

    // Teeth Chart Page
    teethChart: {
      title: 'Gráfica Dental',
      subtitle: 'Relación Diente-Órgano según MTC',
      selectTooth: 'Selecciona un diente para ver sus relaciones',
      element: 'Elemento',
      organs: 'Órganos',
      emotion: 'Emoción',
      vertebrae: 'Vértebras',
      joints: 'Articulaciones',
      meridians: 'Meridianos',
      symbolicFunction: 'Función Simbólica',
      quadrantMeaning: 'Significado del Cuadrante',
    },

    // MTC Elements
    elements: {
      agua: 'Agua',
      madera: 'Madera',
      fuego: 'Fuego',
      tierra: 'Tierra',
      metal: 'Metal',
    },

    // Emotions
    emotions: {
      miedo: 'Miedo',
      ira: 'Ira',
      alegria: 'Alegría',
      preocupacion: 'Preocupación',
      tristeza: 'Tristeza',
    },

    // Language
    language: {
      select: 'Idioma',
      spanish: 'Español',
      english: 'English',
    },
  },

  en: {
    // General
    app: {
      name: 'Teeth & Organs',
      tagline: 'Integrative Dentistry',
    },

    // Auth
    auth: {
      login: 'Login',
      register: 'Register',
      logout: 'Logout',
      email: 'Email',
      password: 'Password',
      confirmPassword: 'Confirm password',
      firstName: 'First name',
      lastName: 'Last name',
      forgotPassword: 'Forgot your password?',
      noAccount: "Don't have an account?",
      hasAccount: 'Already have an account?',
      createAccount: 'Create account',
      loginButton: 'Sign in',
      registerButton: 'Sign up',
    },

    // Navigation
    nav: {
      patients: 'Patients',
      teethChart: 'Teeth Chart',
      protocols: 'Protocols',
      settings: 'Settings',
    },

    // Patients
    patients: {
      title: 'My Patients',
      subtitle: 'Patient Management',
      newPatient: 'New Patient',
      addPatient: 'Add Patient',
      searchPlaceholder: 'Search by name or ID...',
      searchHint: 'Type at least 2 characters to search',
      noPatients: 'No registered patients',
      noPatientsHint: 'Start by adding your first patient',
      noResults: 'No results found',
      noResultsHint: 'Try a different search term',
      viewRecord: 'View Record',
      registered: 'registered patients',
      deleteConfirm: 'Confirm deletion',
      deleteMessage: 'Are you sure you want to delete patient',
      deleteNote: 'This action will mark the patient as inactive.',
      cancel: 'Cancel',
      delete: 'Delete',
      deleting: 'Deleting...',
    },

    // Patient Detail
    patientDetail: {
      loadingPatient: 'Loading patient information...',
      patientNotFound: 'Patient not found',
      backToList: 'Back to list',
      years: 'years',
      phone: 'Phone',
      document: 'ID Document',
      address: 'Address',
      occupation: 'Occupation',
      email: 'Email',
      bloodType: 'Blood type',
      emergencyPhone: 'Emergency phone',
    },

    // Tabs
    tabs: {
      anamnesis: 'Medical History',
      generalConditions: 'General Conditions',
      odontogram: 'Odontogram',
    },

    // Odontogram
    odontogram: {
      title: 'Patient Odontogram',
      subtitle: 'Click on any tooth to edit its status',
      upperRight: 'Upper Right',
      upperLeft: 'Upper Left',
      lowerLeft: 'Lower Left',
      lowerRight: 'Lower Right',
      summary: 'Dental Status Summary',
      generalObservations: 'General Observations of Oral Status',
      generalObservationsPlaceholder: 'General notes about the patient\'s oral condition: oral hygiene, gum status, occlusion, etc.',
      generalObservationsHint: 'These observations are automatically saved with the odontogram.',
    },

    // Tooth States
    toothStates: {
      sano: 'Healthy',
      caries: 'Cavity',
      obturado: 'Filled',
      corona: 'Crown',
      endodoncia: 'Root Canal',
      extraccion_indicada: 'Extraction Indicated',
      ausente: 'Missing',
      implante: 'Implant',
      protesis_fija: 'Fixed Prosthesis',
      protesis_removible: 'Removable Prosthesis',
      fracturado: 'Fractured',
      movilidad: 'Mobility',
      periodontitis: 'Periodontitis',
      absceso: 'Abscess',
      retenido: 'Impacted',
      supernumerario: 'Supernumerary',
    },

    // Tooth Edit Dialog
    toothEdit: {
      editTooth: 'Edit Tooth',
      tooth: 'Tooth',
      state: 'Tooth Status',
      selectState: 'Select a status',
      description: 'Description / Diagnosis',
      descriptionPlaceholder: 'Describe what the tooth has: deep mesial cavity, old leaking restoration, vertical fracture, etc.',
      interferingField: 'Interfering Field (Neural Therapy)',
      interferingFieldNotes: 'Interfering Field Notes',
      interferingFieldPlaceholder: 'Describe why it is considered an interfering field...',
      observations: 'Additional Observations',
      observationsPlaceholder: 'Additional notes about the tooth...',
      save: 'Save Changes',
      saving: 'Saving...',
      cancel: 'Cancel',
    },

    // General Conditions
    generalConditions: {
      title: 'General Oral Conditions',
      subtitle: 'Conditions affecting the entire oral cavity',
      periodontitis: 'Generalized Periodontitis',
      periodontitisDesc: 'Chronic inflammation of dental support tissues',
      gingivitis: 'Gingivitis',
      gingivitisDesc: 'Gum inflammation',
      halitosis: 'Halitosis',
      halitosisDesc: 'Persistent bad breath',
      dryMouth: 'Dry Mouth',
      dryMouthDesc: 'Xerostomia or dry mouth',
      bruxism: 'Bruxism',
      bruxismDesc: 'Teeth grinding or clenching',
      severity: 'Severity',
      mild: 'Mild',
      moderate: 'Moderate',
      severe: 'Severe',
    },

    // Anamnesis
    anamnesis: {
      title: 'Medical History Summary',
      subtitle: 'Relevant information from patient history',
      medicalHistory: 'Medical History',
      emotionalState: 'Emotional State',
      generalState: 'General state',
      familyRelations: 'Family relations',
      jobSatisfaction: 'Job satisfaction',
      habits: 'Habits',
      smoker: 'Smoker',
      alcoholConsumption: 'Alcohol consumption',
      brushingFrequency: 'Brushing',
      timesPerDay: 'x day',
      diabetes: 'Diabetes',
      type: 'Type',
      hypertension: 'Hypertension',
      heartDisease: 'Heart Disease',
      anticoagulants: 'Anticoagulants',
      medicationAllergies: 'Medication Allergies',
      otherAllergies: 'Other Allergies',
      latex: 'Latex',
      anesthesia: 'Anesthesia',
      food: 'Food',
      notSpecified: 'Not specified',
      medicationsNotSpecified: 'Medications not specified',
    },

    // Anamnesis Form Steps
    anamnesisForm: {
      step1: 'Personal Data',
      step2: 'Medical History',
      step3: 'Dental History',
      step4: 'Habits and Lifestyle',
      step5: 'Emotional and Family State',
      next: 'Next',
      previous: 'Previous',
      save: 'Save Patient',
      saving: 'Saving...',
    },

    // Common
    common: {
      loading: 'Loading...',
      save: 'Save',
      cancel: 'Cancel',
      delete: 'Delete',
      edit: 'Edit',
      close: 'Close',
      yes: 'Yes',
      no: 'No',
      confirm: 'Confirm',
      back: 'Back',
      error: 'Error',
      success: 'Success',
      warning: 'Warning',
    },

    // Teeth Chart Page
    teethChart: {
      title: 'Teeth Chart',
      subtitle: 'Tooth-Organ Relationship according to TCM',
      selectTooth: 'Select a tooth to see its relationships',
      element: 'Element',
      organs: 'Organs',
      emotion: 'Emotion',
      vertebrae: 'Vertebrae',
      joints: 'Joints',
      meridians: 'Meridians',
      symbolicFunction: 'Symbolic Function',
      quadrantMeaning: 'Quadrant Meaning',
    },

    // MTC Elements
    elements: {
      agua: 'Water',
      madera: 'Wood',
      fuego: 'Fire',
      tierra: 'Earth',
      metal: 'Metal',
    },

    // Emotions
    emotions: {
      miedo: 'Fear',
      ira: 'Anger',
      alegria: 'Joy',
      preocupacion: 'Worry',
      tristeza: 'Sadness',
    },

    // Language
    language: {
      select: 'Language',
      spanish: 'Español',
      english: 'English',
    },
  },
} as const

export type TranslationKeys = typeof translations.es
