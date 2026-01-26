import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { useAuthContext } from './AuthContext'
import { useLanguage } from '@/lib/i18n/LanguageContext'

interface LoginFormProps {
  onToggleMode: () => void
}

export function LoginForm({ onToggleMode }: LoginFormProps) {
  const { signIn, loading, error } = useAuthContext()
  const { t } = useLanguage()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [localError, setLocalError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLocalError('')

    if (!email || !password) {
      setLocalError(t.validation.fillAllFields)
      return
    }

    try {
      await signIn(email, password)
    } catch {
      setLocalError(t.validation.invalidCredentials)
    }
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl">{t.auth.login}</CardTitle>
        <CardDescription>
          {t.app.tagline}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
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

          {(localError || error) && (
            <p className="text-sm text-destructive">{localError || error}</p>
          )}

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? t.common.loading : t.auth.loginButton}
          </Button>

          <p className="text-center text-sm text-muted-foreground">
            {t.auth.noAccount}{' '}
            <button
              type="button"
              onClick={onToggleMode}
              className="text-primary hover:underline"
            >
              {t.auth.register}
            </button>
          </p>
        </form>
      </CardContent>
    </Card>
  )
}
