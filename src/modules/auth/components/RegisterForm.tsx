import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { useAuthContext } from './AuthContext'
import { useLanguage } from '@/lib/i18n/LanguageContext'

interface RegisterFormProps {
  onToggleMode: () => void
}

export function RegisterForm({ onToggleMode }: RegisterFormProps) {
  const { signUp, loading, error } = useAuthContext()
  const { t } = useLanguage()
  const [nombre, setNombre] = useState('')
  const [apellido, setApellido] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [localError, setLocalError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLocalError('')

    if (!nombre || !apellido || !email || !password || !confirmPassword) {
      setLocalError(t.validation.fillAllFields)
      return
    }

    if (password !== confirmPassword) {
      setLocalError(t.validation.passwordMismatch)
      return
    }

    if (password.length < 6) {
      setLocalError(t.validation.passwordTooShort)
      return
    }

    try {
      await signUp(email, password, nombre, apellido)
    } catch {
      setLocalError(t.validation.accountCreationError)
    }
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl">{t.auth.createAccount}</CardTitle>
        <CardDescription>
          {t.app.tagline}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label htmlFor="nombre" className="text-sm font-medium">
                {t.auth.firstName}
              </label>
              <Input
                id="nombre"
                type="text"
                placeholder={t.auth.firstNamePlaceholder}
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                disabled={loading}
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="apellido" className="text-sm font-medium">
                {t.auth.lastName}
              </label>
              <Input
                id="apellido"
                type="text"
                placeholder={t.auth.lastNamePlaceholder || 'Tu apellido'}
                value={apellido}
                onChange={(e) => setApellido(e.target.value)}
                disabled={loading}
              />
            </div>
          </div>
          <div className="space-y-2">
            <label htmlFor="email" className="text-sm font-medium">
              {t.auth.email}
            </label>
            <Input
              id="email"
              type="email"
              placeholder={t.personalData.emailPlaceholder}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={loading}
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="password" className="text-sm font-medium">
              {t.auth.password}
            </label>
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={loading}
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="confirmPassword" className="text-sm font-medium">
              {t.auth.confirmPassword}
            </label>
            <Input
              id="confirmPassword"
              type="password"
              placeholder="••••••••"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              disabled={loading}
            />
          </div>

          {(localError || error) && (
            <p className="text-sm text-destructive">{localError || error}</p>
          )}

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? t.common.loading : t.auth.registerButton}
          </Button>

          <p className="text-center text-sm text-muted-foreground">
            {t.auth.hasAccount}{' '}
            <button
              type="button"
              onClick={onToggleMode}
              className="text-primary hover:underline"
            >
              {t.auth.login}
            </button>
          </p>
        </form>
      </CardContent>
    </Card>
  )
}
