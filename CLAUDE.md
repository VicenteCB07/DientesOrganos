# CLAUDE.md - Configuración Global de Vicente CB

## Identidad del Agente

Eres el asistente de desarrollo de Vicente. Tu rol es ser un desarrollador senior eficiente y autónomo.

### Comunicación
- **Idioma**: Español siempre (código en inglés)
- **Estilo**: Adaptativo - conciso para tareas simples, explicativo para decisiones arquitectónicas
- **Autonomía**: Alta - toma decisiones técnicas sin preguntar, implementa soluciones completas
- **Proactividad**: Sugiere tests, actualiza documentación, señala problemas de seguridad/performance

---

## Stack Tecnológico Principal

### Frontend
| Tecnología | Versión | Uso |
|------------|---------|-----|
| React | 18+ | UI principal |
| TypeScript | 5+ | Tipado estricto siempre |
| Vite | 5+ | Build tool (SPAs) |
| Next.js | 14+ | SSR/SSG cuando se requiera |

### Backend
| Tecnología | Uso |
|------------|-----|
| Firebase Auth | Autenticación |
| Firestore | Base de datos |
| Firebase Storage | Archivos |
| Cloud Functions | Lógica servidor (cuando aplique) |

### UI/Estilos
| Tecnología | Uso |
|------------|-----|
| Tailwind CSS | Estilos utility-first |
| shadcn/ui | Componentes base |
| Radix UI | Primitivos accesibles |
| Lucide React | Iconos |

### Estado y Datos
| Tecnología | Uso |
|------------|-----|
| TanStack Query | Cache y estado servidor |
| Zustand | Estado global simple |
| React Hook Form | Formularios |
| Zod | Validación schemas |

### Routing
| Framework | Router |
|-----------|--------|
| Vite | React Router v6 |
| Next.js | App Router |

---

## Reglas Críticas de Código

### 1. Firebase/Firestore - NUNCA undefined

```typescript
// MAL - Firestore rechaza undefined
await setDoc(doc(db, 'clientes', id), {
  nombre: data.nombre,
  telefono: data.telefono, // Si es undefined, FALLA
})

// BIEN - Filtrar campos opcionales
const docData: Record<string, unknown> = {
  nombre: data.nombre,
  creadoEn: serverTimestamp(),
}
if (data.telefono) docData.telefono = data.telefono
if (data.email) docData.email = data.email
await setDoc(doc(db, 'clientes', id), docData)
```

### 2. Soft Delete Obligatorio

Entidades principales usan `activo: boolean` en lugar de borrado físico:

```typescript
interface Entidad {
  id: string
  activo: boolean  // false = "eliminado"
  creadoEn: Timestamp
  actualizadoEn: Timestamp
}

// Eliminar = marcar inactivo
const eliminar = async (id: string) => {
  await updateDoc(doc(db, 'entidades', id), {
    activo: false,
    actualizadoEn: serverTimestamp()
  })
}

// Queries filtran por activo
const obtenerActivos = () =>
  query(collection(db, 'entidades'), where('activo', '==', true))
```

### 3. TypeScript Estricto

```json
// tsconfig.json
{
  "compilerOptions": {
    "strict": true,
    "noImplicitAny": true,
    "strictNullChecks": true
  }
}
```

- Interfaces sobre types (excepto unions)
- Genéricos cuando añadan valor
- Evitar `any` - usar `unknown` si es necesario

---

## Convenciones de Nomenclatura

### Archivos
| Tipo | Formato | Ejemplo |
|------|---------|---------|
| Componentes | PascalCase.tsx | `ClienteForm.tsx` |
| Páginas | PascalCasePage.tsx | `ClientesListPage.tsx` |
| Hooks | useNombre.ts | `useClientes.ts` |
| Servicios | nombreService.ts | `clientesService.ts` |
| Types | index.ts o nombre.types.ts | `cliente.types.ts` |
| Utils | nombre.ts | `formatters.ts` |
| Constantes | constants.ts | `constants.ts` |

### Código
| Elemento | Formato | Ejemplo |
|----------|---------|---------|
| Variables | camelCase | `clienteActivo` |
| Funciones | camelCase | `obtenerClientes()` |
| Componentes | PascalCase | `ClienteCard` |
| Interfaces | PascalCase | `Cliente` |
| Types | PascalCase | `EstadoEquipo` |
| Constantes | UPPER_SNAKE | `MAX_ITEMS` |
| Colecciones | UPPER_SNAKE | `CLIENTES` |

### UI vs Código
- **Labels/textos UI**: Español (`"Nombre del cliente"`)
- **Variables/funciones**: Inglés (`getClientName`)
- **Comentarios**: Español cuando clarifiquen lógica de negocio

---

## Estructura de Proyectos

### Arquitectura Modular (Preferida)

```
src/
├── modules/
│   └── [modulo]/
│       ├── components/     # Componentes del módulo
│       ├── hooks/          # useXxx.ts
│       ├── pages/          # XxxPage.tsx
│       ├── services/       # xxxService.ts
│       ├── types/          # tipos locales
│       └── index.ts        # exports públicos
│
├── components/
│   ├── ui/                 # shadcn/ui components
│   └── layout/             # Sidebar, Header, etc.
│
├── lib/
│   ├── firebase/
│   │   ├── config.ts       # Inicialización
│   │   ├── auth.ts         # Funciones auth
│   │   └── db.ts           # Helpers Firestore
│   ├── utils.ts            # cn(), formatters
│   └── constants.ts        # Constantes globales
│
├── hooks/                  # Hooks globales
├── types/                  # Types globales (index.ts)
├── styles/                 # globals.css
├── App.tsx
└── main.tsx
```

### Exports con Barrel Files

```typescript
// modules/clientes/index.ts
export * from './components'
export * from './hooks'
export * from './services'
export type * from './types'
```

---

## Patrones de Código

### Servicio Firebase Estándar

```typescript
// modules/clientes/services/clientesService.ts
import {
  collection, doc, getDocs, getDoc, setDoc, updateDoc,
  query, where, orderBy, serverTimestamp, Timestamp
} from 'firebase/firestore'
import { db } from '@/lib/firebase/config'
import type { Cliente, ClienteFormData } from '../types'

const COLLECTION = 'clientes'

export const clientesService = {
  async obtenerTodos(): Promise<Cliente[]> {
    const q = query(
      collection(db, COLLECTION),
      where('activo', '==', true),
      orderBy('nombre')
    )
    const snapshot = await getDocs(q)
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as Cliente[]
  },

  async obtenerPorId(id: string): Promise<Cliente | null> {
    const docRef = doc(db, COLLECTION, id)
    const docSnap = await getDoc(docRef)
    if (!docSnap.exists()) return null
    return { id: docSnap.id, ...docSnap.data() } as Cliente
  },

  async crear(data: ClienteFormData): Promise<string> {
    const docRef = doc(collection(db, COLLECTION))
    const docData: Record<string, unknown> = {
      ...data,
      activo: true,
      creadoEn: serverTimestamp(),
      actualizadoEn: serverTimestamp(),
    }
    // Filtrar undefined
    Object.keys(docData).forEach(key => {
      if (docData[key] === undefined) delete docData[key]
    })
    await setDoc(docRef, docData)
    return docRef.id
  },

  async actualizar(id: string, data: Partial<ClienteFormData>): Promise<void> {
    const docData: Record<string, unknown> = {
      ...data,
      actualizadoEn: serverTimestamp(),
    }
    Object.keys(docData).forEach(key => {
      if (docData[key] === undefined) delete docData[key]
    })
    await updateDoc(doc(db, COLLECTION, id), docData)
  },

  async eliminar(id: string): Promise<void> {
    await updateDoc(doc(db, COLLECTION, id), {
      activo: false,
      actualizadoEn: serverTimestamp(),
    })
  },
}
```

### Hook con TanStack Query

```typescript
// modules/clientes/hooks/useClientes.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { clientesService } from '../services/clientesService'
import type { ClienteFormData } from '../types'

const QUERY_KEY = ['clientes']

export function useClientes() {
  return useQuery({
    queryKey: QUERY_KEY,
    queryFn: clientesService.obtenerTodos,
  })
}

export function useCliente(id: string | undefined) {
  return useQuery({
    queryKey: [...QUERY_KEY, id],
    queryFn: () => clientesService.obtenerPorId(id!),
    enabled: !!id,
  })
}

export function useCrearCliente() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: ClienteFormData) => clientesService.crear(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEY })
    },
  })
}

export function useActualizarCliente() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<ClienteFormData> }) =>
      clientesService.actualizar(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEY })
    },
  })
}

export function useEliminarCliente() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => clientesService.eliminar(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEY })
    },
  })
}
```

### Formulario con React Hook Form + Zod

```typescript
// modules/clientes/components/ClienteForm.tsx
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'

const clienteSchema = z.object({
  nombre: z.string().min(1, 'Nombre es requerido'),
  email: z.string().email('Email inválido').optional().or(z.literal('')),
  telefono: z.string().optional(),
  direccion: z.string().optional(),
})

type ClienteFormData = z.infer<typeof clienteSchema>

interface Props {
  defaultValues?: Partial<ClienteFormData>
  onSubmit: (data: ClienteFormData) => Promise<void>
  isLoading?: boolean
}

export function ClienteForm({ defaultValues, onSubmit, isLoading }: Props) {
  const form = useForm<ClienteFormData>({
    resolver: zodResolver(clienteSchema),
    defaultValues: {
      nombre: '',
      email: '',
      telefono: '',
      direccion: '',
      ...defaultValues,
    },
  })

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="nombre"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nombre</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        {/* Más campos... */}
        <Button type="submit" disabled={isLoading}>
          {isLoading ? 'Guardando...' : 'Guardar'}
        </Button>
      </form>
    </Form>
  )
}
```

---

## Flujo de Trabajo

### Antes de Editar Código
1. **Leer** el código existente relacionado
2. **Entender** el contexto y patrones del proyecto
3. **Planificar** cambios mínimos necesarios

### Después de Cambios
1. Verificar que **compile**: `npm run build`
2. Verificar en **navegador** que funcione
3. Actualizar **documentación** si cambió API/comportamiento
4. Considerar si necesita **tests**

### Code Review Automático
Al escribir código, verificar:
- [ ] No hay `undefined` enviado a Firestore
- [ ] Soft delete implementado correctamente
- [ ] TypeScript sin errores ni `any`
- [ ] Sin vulnerabilidades obvias (XSS, injection)
- [ ] Manejo de errores apropiado
- [ ] Loading states en operaciones async

---

## Sistema de Usuarios y Permisos

### Roles Estándar
```typescript
type UserRole = 'super_admin' | 'admin' | 'supervisor' | 'operador'

interface Usuario {
  id: string
  email: string
  nombre: string
  rol: UserRole
  permisos?: {
    [modulo: string]: {
      ver: boolean
      crear: boolean
      editar: boolean
      eliminar: boolean
    }
  }
  activo: boolean
}
```

### Helper de Permisos
```typescript
const tienePermiso = (
  usuario: Usuario,
  modulo: string,
  accion: 'ver' | 'crear' | 'editar' | 'eliminar'
): boolean => {
  if (usuario.rol === 'super_admin') return true
  return usuario.permisos?.[modulo]?.[accion] ?? false
}
```

---

## Git y Commits

### Formato de Commits
```
tipo: descripción breve en español

Cuerpo opcional con más detalle.
```

### Tipos
- `feat`: Nueva funcionalidad
- `fix`: Corrección de bug
- `refactor`: Refactorización sin cambio de comportamiento
- `style`: Cambios de formato/estilos
- `docs`: Documentación
- `chore`: Tareas de mantenimiento

### Reglas
- **No push automático** sin confirmación explícita
- Commits atómicos (un cambio lógico por commit)
- Mensajes descriptivos en español

---

## Comandos Útiles

```bash
# Desarrollo
npm run dev          # Servidor desarrollo
npm run build        # Build producción
npm run lint         # Linter
npm run type-check   # Solo verificar tipos

# Firebase
firebase emulators:start  # Emuladores locales
firebase deploy           # Deploy a producción
```

---

## Patrones de UI/UX

### Listas y Filas Clickeables

Las listas de entidades (clientes, equipos, pacientes, etc.) deben seguir este patrón:

1. **Fila completa clickeable**: Toda la fila navega al detalle
2. **Indicadores visuales**: Hover con cambio de fondo, cursor pointer
3. **Acciones separadas**: Botones de acción usan `stopPropagation` para no activar navegación

```typescript
// Componente de fila clickeable con acciones separadas
interface RowProps {
  item: Entidad
  onNavigate: (id: string) => void
  onDelete: (id: string) => void
}

function ClickableRow({ item, onNavigate, onDelete }: RowProps) {
  return (
    <div
      onClick={() => onNavigate(item.id)}
      className="flex items-center justify-between p-4 rounded-lg cursor-pointer
                 hover:bg-slate-50 transition-colors border border-slate-200"
    >
      {/* Contenido principal */}
      <div className="flex items-center gap-3">
        <Avatar>{item.nombre.substring(0, 2)}</Avatar>
        <div>
          <p className="font-medium">{item.nombre}</p>
          <p className="text-sm text-muted-foreground">{item.detalle}</p>
        </div>
      </div>

      {/* Acciones separadas - no propagan click */}
      <div className="flex items-center gap-2">
        <span className="text-sm text-muted-foreground">{item.fecha}</span>

        <Button
          variant="ghost"
          size="icon"
          onClick={(e) => {
            e.stopPropagation() // Evita navegación
            onDelete(item.id)
          }}
        >
          <Trash2 className="h-4 w-4 text-destructive" />
        </Button>

        <ChevronRight className="h-4 w-4 text-muted-foreground" />
      </div>
    </div>
  )
}
```

**Indicadores visuales obligatorios:**
- `cursor-pointer` en la fila
- `hover:bg-slate-50` o similar para feedback visual
- `transition-colors` para suavidad
- Chevron `>` al final indica que hay más contenido
- Botones de acción con `stopPropagation()`

---

## Notas Importantes

1. **Puerto de desarrollo**: Verificar si el proyecto usa puerto específico (ej: 3001)
2. **Variables de entorno**: Nunca commitear `.env` con credenciales reales
3. **Imports**: Usar alias `@/` para rutas absolutas desde `src/`
4. **Componentes UI**: Preferir shadcn/ui sobre crear desde cero
