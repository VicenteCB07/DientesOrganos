# Dientes & Órganos

Sistema de gestión odontológica integral con enfoque en Medicina Tradicional China (MTC), Terapia Neural y Biorregulación.

## Descripción

Aplicación web para odontólogos que integra:
- **Gestión de pacientes** con anamnesis completa (5 formularios)
- **Odontograma interactivo** con relaciones diente-órgano-emoción según MTC
- **Protocolos terapéuticos** (Terapia Neural, Biorregulación, Medicina Funcional)
- **Sistema de autenticación** seguro con Firebase

---

## Stack Tecnológico

| Categoría | Tecnología | Versión |
|-----------|------------|---------|
| **Frontend** | React | 19.2.0 |
| **Lenguaje** | TypeScript | 5.9.3 |
| **Build Tool** | Vite | 7.2.4 |
| **Routing** | React Router | 7.13.0 |
| **Estilos** | Tailwind CSS | 4.1.18 |
| **UI Components** | Radix UI + shadcn/ui | - |
| **Iconos** | Lucide React | 0.563.0 |
| **Estado Servidor** | TanStack Query | 5.90.20 |
| **Formularios** | React Hook Form | 7.71.1 |
| **Validación** | Zod | 4.3.6 |
| **Backend** | Firebase | 12.8.0 |

---

## Instalación

```bash
# Clonar repositorio
git clone https://github.com/[usuario]/DientesOrganos.git
cd DientesOrganos

# Instalar dependencias
npm install

# Configurar variables de entorno
cp .env.example .env
# Editar .env con credenciales de Firebase

# Iniciar servidor de desarrollo
npm run dev
```

El servidor estará disponible en `http://localhost:3050`

---

## Scripts Disponibles

```bash
npm run dev      # Servidor de desarrollo (puerto 3050)
npm run build    # Build de producción
npm run lint     # Linting con ESLint
npm run preview  # Preview del build de producción
```

---

## Estructura del Proyecto

```
src/
├── App.tsx                          # Router principal
├── main.tsx                         # Punto de entrada
│
├── modules/                         # Módulos por dominio
│   ├── auth/                        # Autenticación
│   │   ├── components/              # AuthContext, LoginForm, RegisterForm
│   │   ├── hooks/                   # useAuth
│   │   ├── pages/                   # AuthPage
│   │   └── services/                # authService
│   │
│   ├── patients/                    # Gestión de pacientes
│   │   ├── components/anamnesis/    # Formularios de anamnesis (5 pasos)
│   │   ├── hooks/                   # usePatients, useFileUpload
│   │   ├── pages/                   # List, Detail, New
│   │   └── services/                # patientsService, odontogramasService
│   │
│   ├── teeth/                       # Odontograma
│   │   ├── components/              # ToothChart, Tooth, ToothDetail
│   │   ├── data/                    # teethData (32 dientes + MTC)
│   │   └── pages/                   # TeethChartPage
│   │
│   └── protocols/                   # Protocolos terapéuticos
│       └── data/                    # protocolsData
│
├── components/
│   └── ui/                          # Componentes shadcn/ui
│
├── lib/
│   ├── firebase/                    # Configuración Firebase
│   └── utils.ts                     # Utilidades (cn())
│
├── types/                           # Tipos globales
│   └── index.ts
│
└── styles/
    └── index.css                    # Estilos globales
```

---

## Módulos

### Auth
Gestión de autenticación y usuarios (odontólogos).

- **Componentes**: `AuthContext`, `LoginForm`, `RegisterForm`
- **Hook**: `useAuth()` - Estado de autenticación con Firebase Auth
- **Servicio**: Login, registro, logout, obtener usuario

### Patients
Gestión completa de pacientes con anamnesis detallada.

**Formularios de Anamnesis (5 pasos)**:
1. **Datos Personales** - Nombre, documento, contacto, foto
2. **Antecedentes Médicos** - Enfermedades, alergias, medicamentos
3. **Antecedentes Odontológicos** - Historial dental, síntomas, higiene
4. **Hábitos y Estilo de Vida** - Alimentación, ejercicio, tabaco, estrés
5. **Estado Emocional y Familiar** - Estado mental, antecedentes familiares

**Hooks**:
- `usePatients()` - Lista de pacientes
- `usePatient(id)` - Detalle de paciente
- `useCreatePatient()` / `useUpdatePatient()` / `useDeletePatient()`
- `useOdontograma(id)` - Odontograma del paciente
- `useUpdateTooth()` - Actualizar estado de diente

### Teeth
Visualización del odontograma con relaciones según Medicina Tradicional China.

**Datos por diente**:
- Número FDI (11-48)
- Elemento MTC (Agua, Madera, Fuego, Tierra, Metal)
- Órganos relacionados
- Emoción asociada
- Vértebras y articulaciones
- Meridianos
- Función simbólica

### Protocols
Protocolos terapéuticos organizados por enfoque:

- **Terapia Neural** (3 protocolos)
- **Biorregulación** (4 protocolos)
- **Medicina Funcional** (4 protocolos)
- **Mixtos** (1 protocolo)

---

## Tipos Principales

### Usuario
```typescript
interface Usuario {
  id: string
  email: string
  nombre: string
  apellido: string
  rol: 'super_admin' | 'admin' | 'odontologo'
  activo: boolean
}
```

### Paciente
```typescript
interface Paciente {
  id: string
  odontologoId: string
  anamnesis: Anamnesis
  activo: boolean
  creadoEn: Timestamp
  actualizadoEn: Timestamp
}
```

### Odontograma
```typescript
interface Odontograma {
  id: string
  pacienteId: string
  dientes: DientePaciente[]  // 32 dientes
  fechaCreacion: Timestamp
}

interface DientePaciente {
  numeroDiente: number
  estado: EstadoDiente
  descripcion?: string
  campoInterferente: boolean
  patologias: PatologiaDental[]
}
```

### Estados de Diente
```typescript
type EstadoDiente =
  | 'sano' | 'caries' | 'obturado' | 'corona'
  | 'endodoncia' | 'extraccion_indicada' | 'ausente'
  | 'implante' | 'protesis_fija' | 'protesis_removible'
  | 'fracturado' | 'movilidad' | 'periodontitis'
  | 'absceso' | 'retenido' | 'supernumerario'
```

---

## Rutas

| Ruta | Componente | Descripción |
|------|------------|-------------|
| `/auth` | AuthPage | Login/Registro (pública) |
| `/teeth` | TeethChartPage | Gráfica dental interactiva |
| `/patients` | PatientsListPage | Lista de pacientes |
| `/patients/new` | NewPatientPage | Crear paciente (anamnesis) |
| `/patients/:id` | PatientDetailPage | Detalle del paciente |

---

## Configuración Firebase

### Variables de Entorno

Crear archivo `.env` con:

```env
VITE_FIREBASE_API_KEY=tu_api_key
VITE_FIREBASE_AUTH_DOMAIN=tu_proyecto.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=tu_proyecto
VITE_FIREBASE_STORAGE_BUCKET=tu_proyecto.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=tu_sender_id
VITE_FIREBASE_APP_ID=tu_app_id
```

### Colecciones Firestore

| Colección | Descripción |
|-----------|-------------|
| `usuarios` | Odontólogos registrados |
| `pacientes` | Pacientes con anamnesis |
| `odontogramas` | Odontogramas (32 dientes) |

---

## Características Técnicas

### Patrones Implementados
- **Soft Delete** - Campo `activo: boolean` en lugar de borrado físico
- **Sanitización Firestore** - Limpieza de `undefined` antes de guardar
- **TypeScript Estricto** - `strict: true`, `noImplicitAny: true`
- **Arquitectura Modular** - Módulos independientes por dominio
- **Barrel Files** - Exports organizados con `index.ts`

### Gestión de Estado
- **TanStack Query** para estado de servidor (caché, invalidaciones)
- **Context API** para autenticación global
- **React Hook Form** para formularios complejos
- **Zod** para validación de datos

---

## Componentes UI

Basados en [shadcn/ui](https://ui.shadcn.com/) y [Radix UI](https://www.radix-ui.com/):

- Button, Input, Textarea
- Card, Badge
- Dialog, Select, Checkbox
- RadioGroup, Tabs
- Tooltip, Popover
- FileUpload (custom)

---

## Relaciones Diente-Órgano (MTC)

| Diente | Elemento | Órganos | Emoción |
|--------|----------|---------|---------|
| Incisivos | Agua | Riñón, Vejiga | Miedo |
| Caninos | Madera | Hígado, Vesícula | Ira |
| Premolares Sup. | Metal | Pulmón, Int. Grueso | Tristeza |
| Premolares Inf. | Tierra | Estómago, Bazo | Preocupación |
| Molares Sup. | Tierra | Estómago, Bazo | Preocupación |
| Molares Inf. | Metal | Pulmón, Int. Grueso | Tristeza |
| Cordales | Fuego | Corazón, Int. Delgado | Alegría |

---

## Licencia

Proyecto privado.

---

## Autor

Desarrollado para odontología integrativa con enfoque holístico.
