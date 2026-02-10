import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuthContext } from '@/modules/auth'
import { useUsers, useDeactivateUser, useReactivateUser, useChangeUserRole } from '../hooks/useUsers'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  LogOut,
  User,
  Search,
  Loader2,
  Users,
  Calendar,
  Mail,
  Shield,
  ShieldCheck,
  ShieldAlert,
  UserX,
  UserCheck,
  AlertTriangle,
  ArrowLeft,
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
import type { Usuario, UserRole } from '@/types'

const ROL_LABELS: Record<UserRole, string> = {
  super_admin: 'Super Admin',
  admin: 'Administrador',
  odontologo: 'Odontólogo',
}

const ROL_COLORS: Record<UserRole, string> = {
  super_admin: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300',
  admin: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
  odontologo: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
}

const ROL_ICONS: Record<UserRole, typeof Shield> = {
  super_admin: ShieldAlert,
  admin: ShieldCheck,
  odontologo: Shield,
}

export function UsersListPage() {
  const { usuario, signOut } = useAuthContext()
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'inactive'>('all')
  const [actionDialogOpen, setActionDialogOpen] = useState(false)
  const [selectedUser, setSelectedUser] = useState<Usuario | null>(null)
  const [actionType, setActionType] = useState<'deactivate' | 'reactivate' | 'changeRole'>('deactivate')
  const [newRole, setNewRole] = useState<UserRole>('odontologo')

  const { data: users, isLoading } = useUsers()
  const deactivateUser = useDeactivateUser()
  const reactivateUser = useReactivateUser()
  const changeRole = useChangeUserRole()

  // Filtrar usuarios
  const filteredUsers = users?.filter((user) => {
    const matchesSearch =
      searchTerm.length < 2 ||
      `${user.nombre} ${user.apellido}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesStatus =
      filterStatus === 'all' ||
      (filterStatus === 'active' && user.activo) ||
      (filterStatus === 'inactive' && !user.activo)

    return matchesSearch && matchesStatus
  })

  const handleAction = (user: Usuario, action: 'deactivate' | 'reactivate' | 'changeRole') => {
    setSelectedUser(user)
    setActionType(action)
    if (action === 'changeRole') {
      setNewRole(user.rol)
    }
    setActionDialogOpen(true)
  }

  const confirmAction = async () => {
    if (!selectedUser) return

    try {
      if (actionType === 'deactivate') {
        await deactivateUser.mutateAsync(selectedUser.id)
      } else if (actionType === 'reactivate') {
        await reactivateUser.mutateAsync(selectedUser.id)
      } else if (actionType === 'changeRole') {
        await changeRole.mutateAsync({ id: selectedUser.id, rol: newRole })
      }
      setActionDialogOpen(false)
      setSelectedUser(null)
    } catch (error) {
      console.error('Error al ejecutar acción:', error)
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

  const isActionLoading = deactivateUser.isPending || reactivateUser.isPending || changeRole.isPending

  // Solo admins pueden ver esta página
  const canManageUsers = usuario?.rol === 'super_admin' || usuario?.rol === 'admin'

  if (!canManageUsers) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900 dark:to-slate-800 flex items-center justify-center">
        <div className="text-center">
          <ShieldAlert className="h-16 w-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Acceso Denegado</h2>
          <p className="text-muted-foreground mb-4">No tienes permisos para acceder a esta sección.</p>
          <Link to="/teeth">
            <Button>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Volver al inicio
            </Button>
          </Link>
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
            <Link to="/teeth">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Volver
              </Button>
            </Link>
            <div className="border-l pl-4 dark:border-slate-700">
              <h1 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white">
                Administración de Usuarios
              </h1>
              <p className="text-sm text-muted-foreground">
                Control de acceso a la aplicación
              </p>
            </div>
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
              Salir
            </Button>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Title and stats */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <Users className="h-6 w-6 text-primary" />
              Usuarios Registrados
            </h2>
            <p className="text-muted-foreground mt-1">
              {users?.length || 0} usuarios en total • {users?.filter(u => u.activo).length || 0} activos
            </p>
          </div>
        </div>

        {/* Filters */}
        <div className="mb-6 flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Buscar por nombre o email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={filterStatus} onValueChange={(v) => setFilterStatus(v as typeof filterStatus)}>
            <SelectTrigger className="w-full sm:w-[180px]">
              <SelectValue placeholder="Filtrar por estado" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos</SelectItem>
              <SelectItem value="active">Activos</SelectItem>
              <SelectItem value="inactive">Inactivos</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Users list */}
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
          </div>
        ) : filteredUsers && filteredUsers.length > 0 ? (
          <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border dark:border-slate-700 overflow-hidden">
            <div className="divide-y dark:divide-slate-700">
              {filteredUsers.map((user) => {
                const RolIcon = ROL_ICONS[user.rol]
                const isSelf = user.id === usuario?.id

                return (
                  <div
                    key={user.id}
                    className={`p-4 ${!user.activo ? 'bg-slate-50 dark:bg-slate-800/50' : ''}`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-3">
                          <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${
                            user.activo
                              ? 'bg-blue-100 dark:bg-blue-900'
                              : 'bg-gray-100 dark:bg-gray-800'
                          }`}>
                            <span className={`font-semibold ${
                              user.activo
                                ? 'text-blue-600 dark:text-blue-300'
                                : 'text-gray-400'
                            }`}>
                              {user.nombre?.[0] || user.email[0].toUpperCase()}
                              {user.apellido?.[0] || ''}
                            </span>
                          </div>
                          <div className="min-w-0">
                            <div className="flex items-center gap-2">
                              <h3 className={`font-semibold truncate ${
                                user.activo
                                  ? 'text-gray-900 dark:text-gray-100'
                                  : 'text-gray-500'
                              }`}>
                                {user.nombre} {user.apellido}
                                {isSelf && (
                                  <span className="text-xs text-muted-foreground ml-2">(Tú)</span>
                                )}
                              </h3>
                              {!user.activo && (
                                <Badge variant="secondary" className="text-xs">
                                  Inactivo
                                </Badge>
                              )}
                            </div>
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                              <Mail className="h-3 w-3" />
                              <span className="truncate">{user.email}</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="hidden md:flex items-center gap-6">
                        <Badge className={`${ROL_COLORS[user.rol]} flex items-center gap-1`}>
                          <RolIcon className="h-3 w-3" />
                          {ROL_LABELS[user.rol]}
                        </Badge>
                        <div className="flex items-center gap-1 text-sm text-muted-foreground">
                          <Calendar className="h-4 w-4" />
                          <span>{formatDate(user.creadoEn)}</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 ml-4">
                        {/* Cambiar rol */}
                        {!isSelf && usuario?.rol === 'super_admin' && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleAction(user, 'changeRole')}
                          >
                            <Shield className="h-4 w-4 mr-1" />
                            <span className="hidden sm:inline">Rol</span>
                          </Button>
                        )}

                        {/* Activar/Desactivar */}
                        {!isSelf && (
                          user.activo ? (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleAction(user, 'deactivate')}
                              className="text-amber-600 hover:text-amber-700 hover:bg-amber-50"
                            >
                              <UserX className="h-4 w-4 mr-1" />
                              <span className="hidden sm:inline">Desactivar</span>
                            </Button>
                          ) : (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleAction(user, 'reactivate')}
                              className="text-green-600 hover:text-green-700 hover:bg-green-50"
                            >
                              <UserCheck className="h-4 w-4 mr-1" />
                              <span className="hidden sm:inline">Activar</span>
                            </Button>
                          )
                        )}
                      </div>
                    </div>

                    {/* Mobile info */}
                    <div className="md:hidden mt-3 flex items-center gap-4 text-xs text-muted-foreground">
                      <Badge className={`${ROL_COLORS[user.rol]} text-xs`}>
                        {ROL_LABELS[user.rol]}
                      </Badge>
                      <div className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        <span>{formatDate(user.creadoEn)}</span>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        ) : (
          <div className="text-center py-12">
            <Users className="h-12 w-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              {searchTerm ? 'No se encontraron usuarios' : 'No hay usuarios registrados'}
            </h3>
            <p className="text-muted-foreground">
              {searchTerm
                ? 'Intenta con otros términos de búsqueda'
                : 'Los usuarios aparecerán aquí cuando se registren'}
            </p>
          </div>
        )}
      </main>

      {/* Action confirmation dialog */}
      <Dialog open={actionDialogOpen} onOpenChange={setActionDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              {actionType === 'deactivate' && (
                <>
                  <AlertTriangle className="h-5 w-5 text-amber-500" />
                  Desactivar Usuario
                </>
              )}
              {actionType === 'reactivate' && (
                <>
                  <UserCheck className="h-5 w-5 text-green-500" />
                  Reactivar Usuario
                </>
              )}
              {actionType === 'changeRole' && (
                <>
                  <Shield className="h-5 w-5 text-blue-500" />
                  Cambiar Rol
                </>
              )}
            </DialogTitle>
            <DialogDescription>
              {actionType === 'deactivate' && (
                <>
                  ¿Estás seguro de desactivar a <strong>{selectedUser?.nombre} {selectedUser?.apellido}</strong>?
                  El usuario no podrá acceder a la aplicación.
                </>
              )}
              {actionType === 'reactivate' && (
                <>
                  ¿Deseas reactivar a <strong>{selectedUser?.nombre} {selectedUser?.apellido}</strong>?
                  El usuario podrá acceder nuevamente a la aplicación.
                </>
              )}
              {actionType === 'changeRole' && (
                <div className="mt-4">
                  <p className="mb-4">
                    Cambiar rol de <strong>{selectedUser?.nombre} {selectedUser?.apellido}</strong>:
                  </p>
                  <Select value={newRole} onValueChange={(v) => setNewRole(v as UserRole)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="odontologo">Odontólogo</SelectItem>
                      <SelectItem value="admin">Administrador</SelectItem>
                      <SelectItem value="super_admin">Super Admin</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setActionDialogOpen(false)}>
              Cancelar
            </Button>
            <Button
              variant={actionType === 'deactivate' ? 'destructive' : 'default'}
              onClick={confirmAction}
              disabled={isActionLoading}
            >
              {isActionLoading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  Procesando...
                </>
              ) : (
                'Confirmar'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
