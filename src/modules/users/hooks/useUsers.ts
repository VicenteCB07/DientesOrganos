import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { usersService } from '../services/usersService'
import type { UpdateUsuarioData } from '../services/usersService'
import type { UserRole } from '@/types'

const QUERY_KEY = ['usuarios']

export function useUsers() {
  return useQuery({
    queryKey: QUERY_KEY,
    queryFn: usersService.obtenerTodos,
  })
}

export function useActiveUsers() {
  return useQuery({
    queryKey: [...QUERY_KEY, 'activos'],
    queryFn: usersService.obtenerActivos,
  })
}

export function useUser(id: string | undefined) {
  return useQuery({
    queryKey: [...QUERY_KEY, id],
    queryFn: () => usersService.obtenerPorId(id!),
    enabled: !!id,
  })
}

export function useUpdateUser() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateUsuarioData }) =>
      usersService.actualizar(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEY })
    },
  })
}

export function useChangeUserRole() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, rol }: { id: string; rol: UserRole }) =>
      usersService.cambiarRol(id, rol),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEY })
    },
  })
}

export function useDeactivateUser() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => usersService.desactivar(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEY })
    },
  })
}

export function useReactivateUser() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => usersService.reactivar(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEY })
    },
  })
}
