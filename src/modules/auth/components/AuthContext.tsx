import { createContext, useContext, type ReactNode } from 'react'
import type { User } from 'firebase/auth'
import { useAuth } from '../hooks/useAuth'
import type { Usuario } from '@/types'

interface AuthContextType {
  user: User | null
  usuario: Usuario | null
  loading: boolean
  error: string | null
  isAuthenticated: boolean
  signIn: (email: string, password: string) => Promise<void>
  signUp: (email: string, password: string, nombre: string, apellido: string) => Promise<void>
  signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

interface AuthProviderProps {
  children: ReactNode
}

export function AuthProvider({ children }: AuthProviderProps) {
  const auth = useAuth()

  return <AuthContext.Provider value={auth}>{children}</AuthContext.Provider>
}

export function useAuthContext() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuthContext debe usarse dentro de un AuthProvider')
  }
  return context
}
