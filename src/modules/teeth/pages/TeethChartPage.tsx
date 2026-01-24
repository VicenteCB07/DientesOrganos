import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ToothChart } from '../components/ToothChart'
import { useAuthContext } from '@/modules/auth'
import { Button } from '@/components/ui/button'
import { LogOut, User, Users, ChevronDown, ChevronRight, Stethoscope, ClipboardList, Home, PanelLeftClose, PanelLeft } from 'lucide-react'
import { LanguageSelector } from '@/components/LanguageSelector'
import { ThemeToggle } from '@/components/ThemeToggle'
import { useLanguage } from '@/lib/i18n/LanguageContext'
import { cn } from '@/lib/utils'

export function TeethChartPage() {
  const { usuario, signOut } = useAuthContext()
  const { t } = useLanguage()
  const navigate = useNavigate()
  const [isPatientsOpen, setIsPatientsOpen] = useState(true)
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false)

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900 dark:to-slate-800">
      {/* Header */}
      <header className="bg-white dark:bg-slate-900 shadow-sm border-b dark:border-slate-700">
        <div className="max-w-full mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            {/* Botón para colapsar sidebar en desktop */}
            <Button
              variant="ghost"
              size="icon"
              className="hidden lg:flex h-9 w-9"
              onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
            >
              {isSidebarCollapsed ? (
                <PanelLeft className="h-5 w-5" />
              ) : (
                <PanelLeftClose className="h-5 w-5" />
              )}
            </Button>
            <div>
              <h1 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white">
                {t.app.name}
              </h1>
              <p className="text-sm text-muted-foreground">
                {t.app.tagline}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <Link to="/patients">
              <Button variant="outline" size="sm">
                <Users className="h-4 w-4 mr-2" />
                {t.nav.patients}
              </Button>
            </Link>
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

      {/* Main layout with sidebar */}
      <div className="flex">
        {/* Sidebar izquierdo - Navegación */}
        <aside
          className={cn(
            "hidden lg:block shrink-0 border-r bg-white dark:bg-slate-900 dark:border-slate-700 min-h-[calc(100vh-73px)] sticky top-0 transition-all duration-300 relative",
            isSidebarCollapsed ? "w-16" : "w-64"
          )}
        >
          <nav className="p-4 space-y-2">
            {/* Inicio */}
            <button
              onClick={() => navigate('/')}
              className={cn(
                "w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-800 hover:text-gray-900 dark:hover:text-white transition-colors",
                isSidebarCollapsed && "justify-center"
              )}
              title={isSidebarCollapsed ? "Inicio" : undefined}
            >
              <Home className="h-5 w-5 shrink-0" />
              {!isSidebarCollapsed && <span>Inicio</span>}
            </button>

            {/* Pacientes - Con submenú */}
            <div className="space-y-1">
              <button
                onClick={() => !isSidebarCollapsed && setIsPatientsOpen(!isPatientsOpen)}
                className={cn(
                  "w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                  isPatientsOpen && !isSidebarCollapsed
                    ? "bg-primary/10 text-primary"
                    : "text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-800 hover:text-gray-900 dark:hover:text-white",
                  isSidebarCollapsed && "justify-center"
                )}
                title={isSidebarCollapsed ? "Pacientes" : undefined}
              >
                <div className={cn("flex items-center gap-3", isSidebarCollapsed && "justify-center")}>
                  <Users className="h-5 w-5 shrink-0" />
                  {!isSidebarCollapsed && <span>Pacientes</span>}
                </div>
                {!isSidebarCollapsed && (
                  isPatientsOpen ? (
                    <ChevronDown className="h-4 w-4" />
                  ) : (
                    <ChevronRight className="h-4 w-4" />
                  )
                )}
              </button>

              {/* Submenú de Pacientes */}
              {isPatientsOpen && !isSidebarCollapsed && (
                <div className="ml-4 pl-4 border-l border-gray-200 dark:border-slate-700 space-y-1">
                  <Link
                    to="/patients"
                    className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-800 hover:text-gray-900 dark:hover:text-white transition-colors"
                  >
                    <Stethoscope className="h-4 w-4" />
                    <span>Diagnóstico</span>
                  </Link>
                  <Link
                    to="/patients"
                    className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-800 hover:text-gray-900 dark:hover:text-white transition-colors"
                  >
                    <ClipboardList className="h-4 w-4" />
                    <span>Tratamiento</span>
                  </Link>
                </div>
              )}
            </div>
          </nav>

          {/* Info del usuario en la parte inferior */}
          <div className={cn(
            "absolute bottom-0 left-0 right-0 p-4 border-t bg-gray-50 dark:bg-slate-800 dark:border-slate-700",
            isSidebarCollapsed && "p-2"
          )}>
            <div className={cn("flex items-center gap-3", isSidebarCollapsed && "justify-center")}>
              <div className={cn(
                "rounded-full bg-primary/10 flex items-center justify-center shrink-0",
                isSidebarCollapsed ? "w-8 h-8" : "w-10 h-10"
              )}>
                <User className={cn("text-primary", isSidebarCollapsed ? "h-4 w-4" : "h-5 w-5")} />
              </div>
              {!isSidebarCollapsed && (
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                    {usuario?.nombre || 'Usuario'}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                    {usuario?.email}
                  </p>
                </div>
              )}
            </div>
          </div>
        </aside>

        {/* Main content */}
        <main className="flex-1 py-8">
          <div className="max-w-6xl mx-auto px-4">
            <div className="text-center mb-8">
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
                Mapa relación dientes-órganos
              </h2>
              <p className="text-muted-foreground mt-2 max-w-2xl mx-auto">
                Explora la relación entre cada diente y los órganos del cuerpo según
                la Medicina Tradicional China y la Odontología Neurofocal
              </p>
            </div>

            <ToothChart />

            {/* Información adicional */}
            <div className="mt-12 grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
              <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm border dark:border-slate-700">
                <h3 className="font-semibold text-lg mb-2 dark:text-white">Medicina Tradicional China</h3>
                <p className="text-sm text-muted-foreground">
                  Los meridianos son canales energéticos que conectan los dientes con
                  órganos específicos del cuerpo.
                </p>
              </div>

              <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm border dark:border-slate-700">
                <h3 className="font-semibold text-lg mb-2 dark:text-white">Biodescodificación</h3>
                <p className="text-sm text-muted-foreground">
                  Cada cuadrante de la boca representa diferentes aspectos de nuestra
                  vida: autoridad, afectos, hogar y trabajo.
                </p>
              </div>

              <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm border dark:border-slate-700">
                <h3 className="font-semibold text-lg mb-2 dark:text-white">Odontología Neurofocal</h3>
                <p className="text-sm text-muted-foreground">
                  Los problemas dentales pueden ser focos irritativos que afectan
                  a órganos distantes a través del sistema nervioso.
                </p>
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* Footer */}
      <footer className="bg-white dark:bg-slate-900 border-t dark:border-slate-700 py-6">
        <div className="max-w-7xl mx-auto px-4 text-center text-sm text-muted-foreground">
          <p>
            Esta información es de carácter educativo y no sustituye el consejo médico profesional.
          </p>
          <p className="mt-1">
            Basado en la Medicina Tradicional China y la Odontología Integrativa.
          </p>
        </div>
      </footer>
    </div>
  )
}
