import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { patientsService, odontogramasService } from '../services/patientsService'
import type { PacienteFormData } from '../services/patientsService'
import type { DientePaciente } from '@/types'

const PATIENTS_KEY = ['patients']
const ODONTOGRAMA_KEY = ['odontograma']

// ============================================
// HOOKS DE PACIENTES
// ============================================

/**
 * Obtener todos los pacientes del odontólogo actual
 */
export function usePatients(odontologoId: string | undefined) {
  return useQuery({
    queryKey: [...PATIENTS_KEY, odontologoId],
    queryFn: () => patientsService.obtenerTodos(odontologoId!),
    enabled: !!odontologoId,
  })
}

/**
 * Buscar pacientes
 */
export function useSearchPatients(odontologoId: string | undefined, searchTerm: string) {
  return useQuery({
    queryKey: [...PATIENTS_KEY, 'search', odontologoId, searchTerm],
    queryFn: () => patientsService.buscar(odontologoId!, searchTerm),
    enabled: !!odontologoId && searchTerm.length >= 2,
  })
}

/**
 * Obtener un paciente por ID
 */
export function usePatient(id: string | undefined) {
  return useQuery({
    queryKey: [...PATIENTS_KEY, id],
    queryFn: () => patientsService.obtenerPorId(id!),
    enabled: !!id,
  })
}

/**
 * Crear un nuevo paciente
 */
export function useCreatePatient() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ odontologoId, data }: { odontologoId: string; data: PacienteFormData }) =>
      patientsService.crear(odontologoId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: PATIENTS_KEY })
    },
  })
}

/**
 * Actualizar un paciente
 */
export function useUpdatePatient() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<PacienteFormData> }) =>
      patientsService.actualizar(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: PATIENTS_KEY })
      queryClient.invalidateQueries({ queryKey: [...PATIENTS_KEY, variables.id] })
    },
  })
}

/**
 * Eliminar un paciente (soft delete)
 */
export function useDeletePatient() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => patientsService.eliminar(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: PATIENTS_KEY })
    },
  })
}

// ============================================
// HOOKS DE ODONTOGRAMA
// ============================================

/**
 * Obtener odontograma más reciente de un paciente
 */
export function useOdontograma(pacienteId: string | undefined) {
  return useQuery({
    queryKey: [...ODONTOGRAMA_KEY, pacienteId],
    queryFn: () => odontogramasService.obtenerPorPaciente(pacienteId!),
    enabled: !!pacienteId,
  })
}

/**
 * Obtener historial completo de odontogramas de un paciente
 */
export function useOdontogramasHistorial(pacienteId: string | undefined) {
  return useQuery({
    queryKey: [...ODONTOGRAMA_KEY, 'historial', pacienteId],
    queryFn: () => odontogramasService.obtenerHistorial(pacienteId!),
    enabled: !!pacienteId,
  })
}

/**
 * Crear odontograma para un paciente
 * @param opciones.motivo - Motivo de la visita/diagnóstico
 * @param opciones.copiarDe - ID del odontograma del cual copiar los dientes
 */
export function useCreateOdontograma() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({
      pacienteId,
      odontologoId,
      motivo,
      copiarDe,
    }: {
      pacienteId: string
      odontologoId: string
      motivo?: string
      copiarDe?: string
    }) => odontogramasService.crear(pacienteId, odontologoId, { motivo, copiarDe }),
    onSuccess: (_, variables) => {
      // Invalidar tanto el odontograma actual como el historial
      queryClient.invalidateQueries({ queryKey: [...ODONTOGRAMA_KEY, variables.pacienteId] })
      queryClient.invalidateQueries({ queryKey: [...ODONTOGRAMA_KEY, 'historial', variables.pacienteId] })
    },
  })
}

/**
 * Actualizar un diente del odontograma
 */
export function useUpdateTooth() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({
      odontogramaId,
      numeroDiente,
      data,
    }: {
      odontogramaId: string
      pacienteId: string
      numeroDiente: number
      data: Partial<DientePaciente>
    }) => odontogramasService.actualizarDiente(odontogramaId, numeroDiente, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: [...ODONTOGRAMA_KEY, variables.pacienteId] })
    },
  })
}

/**
 * Toggle campo interferente en un diente
 */
export function useToggleCampoInterferente() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({
      odontogramaId,
      numeroDiente,
      notas,
    }: {
      odontogramaId: string
      pacienteId: string
      numeroDiente: number
      notas?: string
    }) => odontogramasService.toggleCampoInterferente(odontogramaId, numeroDiente, notas),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: [...ODONTOGRAMA_KEY, variables.pacienteId] })
    },
  })
}

/**
 * Actualizar observaciones generales del odontograma
 */
export function useUpdateOdontogramaObservaciones() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({
      odontogramaId,
      observaciones,
    }: {
      odontogramaId: string
      pacienteId: string
      observaciones: string
    }) => odontogramasService.actualizarObservaciones(odontogramaId, observaciones),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: [...ODONTOGRAMA_KEY, variables.pacienteId] })
    },
  })
}

/**
 * Cerrar un odontograma (marcar visita como terminada)
 */
export function useCerrarOdontograma() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({
      odontogramaId,
    }: {
      odontogramaId: string
      pacienteId: string
    }) => odontogramasService.cerrar(odontogramaId),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: [...ODONTOGRAMA_KEY, variables.pacienteId] })
      queryClient.invalidateQueries({ queryKey: [...ODONTOGRAMA_KEY, 'historial', variables.pacienteId] })
    },
  })
}
