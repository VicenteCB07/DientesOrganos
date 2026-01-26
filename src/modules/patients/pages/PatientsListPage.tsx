import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuthContext } from '@/modules/auth'
import { usePatients, useSearchPatients, useDeletePatient } from '../hooks/usePatients'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  LogOut,
  User,
  Plus,
  Search,
  Loader2,
  Users,
  Calendar,
  Phone,
  ChevronRight,
  Trash2,
  AlertTriangle,
} from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { LanguageSelector } from '@/components/LanguageSelector'
import { ThemeToggle } from '@/components/ThemeToggle'
import { useLanguage } from '@/lib/i18n/LanguageContext'

export function PatientsListPage() {
  const { usuario, signOut } = useAuthContext()
  const { t } = useLanguage()
  const navigate = useNavigate()
  const [searchTerm, setSearchTerm] = useState('')
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [patientToDelete, setPatientToDelete] = useState<{ id: string; nombre: string } | null>(null)

  const { data: patients, isLoading: loadingAll } = usePatients(usuario?.id)
  const { data: searchResults, isLoading: loadingSearch } = useSearchPatients(usuario?.id, searchTerm)
  const deletePatient = useDeletePatient()

  const displayPatients = searchTerm.length >= 2 ? searchResults : patients
  const isLoading = searchTerm.length >= 2 ? loadingSearch : loadingAll

  const handleDeleteClick = (id: string, nombre: string) => {
    setPatientToDelete({ id, nombre })
    setDeleteDialogOpen(true)
  }

  const confirmDelete = async () => {
    if (patientToDelete) {
      await deletePatient.mutateAsync(patientToDelete.id)
      setDeleteDialogOpen(false)
      setPatientToDelete(null)
    }
  }

  const formatDate = (timestamp: { seconds: number } | undefined) => {
    if (!timestamp) return '-'
    return new Date(timestamp.seconds * 1000).toLocaleDateString('es-CO', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    })
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900 dark:to-slate-800">
      {/* Header */}
      <header className="bg-white dark:bg-slate-900 shadow-sm border-b dark:border-slate-700">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div>
            <Link to="/teeth">
              <h1 className="text-xl md:text-2xl font-bold text-gray-900 hover:text-primary transition-colors">
                {t.app.name}
              </h1>
            </Link>
            <p className="text-sm text-muted-foreground">
              {t.patients.subtitle}
            </p>
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden md:flex items-center gap-2 text-sm text-muted-foreground">
              <User className="h-4 w-4" />
              <span>{usuario?.nombre || usuario?.email}</span>
            </div>
            <ThemeToggle />
            <LanguageSelector />
            <Button variant="outline" size="sm" onClick={signOut}>
              <LogOut className="h-4 w-4 mr-2" />
              {t.auth.logout}
            </Button>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Title and actions */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
              <Users className="h-6 w-6 text-primary" />
              {t.patients.title}
            </h2>
            <p className="text-muted-foreground mt-1">
              {patients?.length || 0} {t.patients.registered}
            </p>
          </div>

          <Link to="/patients/new">
            <Button className="w-full sm:w-auto">
              <Plus className="h-4 w-4 mr-2" />
              {t.patients.newPatient}
            </Button>
          </Link>
        </div>

        {/* Search */}
        <div className="mb-6">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder={t.patients.searchPlaceholder}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          {searchTerm.length > 0 && searchTerm.length < 2 && (
            <p className="text-xs text-muted-foreground mt-1">
              {t.patients.searchHint}
            </p>
          )}
        </div>

        {/* Patients list */}
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
          </div>
        ) : displayPatients && displayPatients.length > 0 ? (
          <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border dark:border-slate-700 overflow-hidden">
            <div className="divide-y dark:divide-slate-700">
              {displayPatients.map((patient) => (
                <div
                  key={patient.id}
                  onClick={() => navigate(`/patients/${patient.id}`)}
                  className="p-4 cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center shrink-0">
                          <span className="text-blue-600 dark:text-blue-300 font-semibold">
                            {patient.anamnesis.datosPersonales.nombre[0]}
                            {patient.anamnesis.datosPersonales.apellido[0]}
                          </span>
                        </div>
                        <div className="min-w-0">
                          <h3 className="font-semibold text-gray-900 dark:text-gray-100 truncate">
                            {patient.anamnesis.datosPersonales.nombre}{' '}
                            {patient.anamnesis.datosPersonales.apellido}
                          </h3>
                          <p className="text-sm text-muted-foreground">
                            Doc: {patient.anamnesis.datosPersonales.documentoIdentidad}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="hidden md:flex items-center gap-6 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Phone className="h-4 w-4" />
                        <span>{patient.anamnesis.datosPersonales.telefono}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        <span>{formatDate(patient.creadoEn)}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 ml-4">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={(e) => {
                          e.stopPropagation()
                          handleDeleteClick(
                            patient.id,
                            `${patient.anamnesis.datosPersonales.nombre} ${patient.anamnesis.datosPersonales.apellido}`
                          )
                        }}
                      >
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                      <ChevronRight className="h-4 w-4 text-muted-foreground" />
                    </div>
                  </div>

                  {/* Mobile info */}
                  <div className="md:hidden mt-3 flex items-center gap-4 text-xs text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Phone className="h-3 w-3" />
                      <span>{patient.anamnesis.datosPersonales.telefono}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      <span>{formatDate(patient.creadoEn)}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="text-center py-12">
            <Users className="h-12 w-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {searchTerm ? t.patients.noResults : t.patients.noPatients}
            </h3>
            <p className="text-muted-foreground mb-6">
              {searchTerm
                ? t.patients.noResultsHint
                : t.patients.noPatientsHint}
            </p>
            {!searchTerm && (
              <Link to="/patients/new">
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  {t.patients.addPatient}
                </Button>
              </Link>
            )}
          </div>
        )}
      </main>

      {/* Delete confirmation dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-amber-500" />
              {t.patients.deleteConfirm}
            </DialogTitle>
            <DialogDescription>
              {t.patients.deleteMessage}{' '}
              <strong>{patientToDelete?.nombre}</strong>? {t.patients.deleteNote}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>
              {t.patients.cancel}
            </Button>
            <Button
              variant="destructive"
              onClick={confirmDelete}
              disabled={deletePatient.isPending}
            >
              {deletePatient.isPending ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  {t.patients.deleting}
                </>
              ) : (
                t.patients.delete
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
