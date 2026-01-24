import { useNavigate, useParams, Link } from 'react-router-dom'
import { useAuthContext } from '@/modules/auth'
import { usePatient, useUpdatePatient } from '../hooks/usePatients'
import { AnamnesisWizard } from '../components/anamnesis'
import { Button } from '@/components/ui/button'
import { ArrowLeft, User, LogOut, Loader2 } from 'lucide-react'
import { ThemeToggle } from '@/components/ThemeToggle'
import type { Anamnesis } from '@/types'

export function EditPatientPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { usuario, signOut } = useAuthContext()
  const { data: paciente, isLoading: isLoadingPatient } = usePatient(id)
  const updatePatient = useUpdatePatient()

  const handleSubmit = async (data: Anamnesis) => {
    if (!id) {
      console.error('No hay ID de paciente')
      return
    }

    try {
      console.log('Actualizando paciente...', { id, data })
      await updatePatient.mutateAsync({
        id,
        data: { anamnesis: data },
      })
      console.log('Paciente actualizado')
      navigate(`/patients/${id}`)
    } catch (error) {
      console.error('Error al actualizar paciente:', error)
      alert('Error al actualizar el paciente. Revisa la consola para más detalles.')
    }
  }

  const handleCancel = () => {
    navigate(`/patients/${id}`)
  }

  if (isLoadingPatient) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900 dark:to-slate-800">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-muted-foreground">Cargando datos del paciente...</p>
        </div>
      </div>
    )
  }

  if (!paciente) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900 dark:to-slate-800">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Paciente no encontrado</h2>
          <p className="text-muted-foreground mb-4">El paciente que buscas no existe o fue eliminado.</p>
          <Button onClick={() => navigate('/patients')}>
            Volver a la lista
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900 dark:to-slate-800">
      {/* Header */}
      <header className="bg-white dark:bg-slate-900 shadow-sm border-b dark:border-slate-700">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" onClick={() => navigate(`/patients/${id}`)}>
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
                Editar Paciente
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
            Editar Ficha de Paciente
          </h2>
          <p className="text-muted-foreground mt-2">
            {paciente.anamnesis.datosPersonales.nombre} {paciente.anamnesis.datosPersonales.apellido}
          </p>
        </div>

        <AnamnesisWizard
          onSubmit={handleSubmit}
          onCancel={handleCancel}
          isLoading={updatePatient.isPending}
          initialData={paciente.anamnesis}
        />
      </main>
    </div>
  )
}
