import { useState, useEffect, useCallback } from 'react'
import type { User } from 'firebase/auth'
import { authService } from '../services/authService'
import type { Usuario } from '@/types'

interface AuthState {
  user: User | null
  usuario: Usuario | null
  loading: boolean
  error: string | null
}

export function useAuth() {
  const [state, setState] = useState<AuthState>({
    user: null,
    usuario: null,
    loading: true,
    error: null,
  })

  useEffect(() => {
    const unsubscribe = authService.onAuthChange(async (user) => {
      if (user) {
        try {
          const usuario = await authService.getUsuario(user.uid)
          setState({
            user,
            usuario,
            loading: false,
            error: null,
          })
        } catch {
          setState({
            user,
            usuario: null,
            loading: false,
            error: 'Error al cargar datos del usuario',
          })
        }
      } else {
        setState({
          user: null,
          usuario: null,
          loading: false,
          error: null,
        })
      }
    })

    return () => unsubscribe()
  }, [])

  const signIn = useCallback(async (email: string, password: string) => {
    setState((prev) => ({ ...prev, loading: true, error: null }))
    try {
      await authService.signIn(email, password)
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Error al iniciar sesión'
      setState((prev) => ({ ...prev, loading: false, error: message }))
      throw error
    }
  }, [])

  const signUp = useCallback(async (email: string, password: string, nombre: string, apellido: string) => {
    setState((prev) => ({ ...prev, loading: true, error: null }))
    try {
      await authService.signUp(email, password, nombre, apellido)
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Error al registrarse'
      setState((prev) => ({ ...prev, loading: false, error: message }))
      throw error
    }
  }, [])

  const signOut = useCallback(async () => {
    setState((prev) => ({ ...prev, loading: true }))
    try {
      await authService.signOut()
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Error al cerrar sesión'
      setState((prev) => ({ ...prev, loading: false, error: message }))
      throw error
    }
  }, [])

  return {
    ...state,
    signIn,
    signUp,
    signOut,
    isAuthenticated: !!state.user,
  }
}
