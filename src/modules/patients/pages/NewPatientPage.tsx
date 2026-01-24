import { useNavigate, Link } from 'react-router-dom'
import { useAuthContext } from '@/modules/auth'
import { useCreatePatient } from '../hooks/usePatients'
import { AnamnesisWizard } from '../components/anamnesis'
import { Button } from '@/components/ui/button'
import { ArrowLeft, User, LogOut } from 'lucide-react'
import { ThemeToggle } from '@/components/ThemeToggle'
import type { Anamnesis } from '@/types'

export function NewPatientPage() {
  const navigate = useNavigate()
  const { usuario, signOut } = useAuthContext()
  const createPatient = useCreatePatient()

  const handleSubmit = async (data: Anamnesis) => {
    if (!usuario?.id) {
      console.error('No hay usuario logueado')
      return
    }

    try {
      console.log('Intentando guardar paciente...', { odontologoId: usuario.id, data })
      const pacienteId = await createPatient.mutateAsync({
        odontologoId: usuario.id,
        data: { anamnesis: data },
      })
      console.log('Paciente creado con ID:', pacienteId)
      navigate('/patients')
    } catch (error) {
      console.error('Error al crear paciente:', error)
      alert('Error al guardar el paciente. Revisa la consola para más detalles.')
    }
  }

  const handleCancel = () => {
    navigate('/patients')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900 dark:to-slate-800">
      {/* Header */}
      <header className="bg-white dark:bg-slate-900 shadow-sm border-b dark:border-slate-700">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" onClick={() => navigate('/patients')}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Volver
            </Button>
            <div className="border-l pl-4">
              <Link to="/teeth">
                <h1 className="text-xl font-bold text-gray-900 hover:text-blue-600 transition-colors">
                  Dientes & Órganos
                </h1>
              </Link>
              <p className="text-sm text-muted-foreground">
                Nuevo Paciente
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden md:flex items-center gap-2 text-sm text-muted-foreground">
              <User className="h-4 w-4" />
              <span>{usuario?.nombre || usuario?.email}</span>
            </div>
            <ThemeToggle />
            <Button variant="outline" size="sm" onClick={signOut}>
              <LogOut className="h-4 w-4 mr-2" />
              Salir
            </Button>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-8 text-center">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            Registro de Nuevo Paciente
          </h2>
          <p className="text-muted-foreground mt-2">
            Complete la anamnesis del paciente paso a paso
          </p>
        </div>

        <AnamnesisWizard
          onSubmit={handleSubmit}
          onCancel={handleCancel}
          isLoading={createPatient.isPending}
        />
      </main>
    </div>
  )
}
