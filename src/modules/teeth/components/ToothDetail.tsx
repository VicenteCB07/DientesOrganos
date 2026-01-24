import { X, Heart, Brain, Bone, Activity, Sparkles } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import type { ToothData } from '../types'
import { ELEMENTOS_INFO, CUADRANTES_INFO } from '../data/teethData'

interface ToothDetailProps {
  tooth: ToothData
  onClose: () => void
}

export function ToothDetail({ tooth, onClose }: ToothDetailProps) {
  const elementoInfo = ELEMENTOS_INFO[tooth.elemento]
  const cuadranteInfo = CUADRANTES_INFO[tooth.cuadrante]

  const emocionEmoji: Record<string, string> = {
    miedo: '😨',
    ira: '😠',
    alegria: '😊',
    preocupacion: '😟',
    tristeza: '😢',
  }

  return (
    <Card className="w-full animate-in slide-in-from-bottom-4 duration-300">
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="text-xl md:text-2xl flex items-center gap-2">
              <span className={`w-4 h-4 rounded ${elementoInfo.color}`} />
              Diente {tooth.numero}
            </CardTitle>
            <p className="text-muted-foreground mt-1">{tooth.nombre}</p>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-5 w-5" />
          </Button>
        </div>
      </CardHeader>

      <CardContent className="grid gap-6 md:grid-cols-2">
        {/* Elemento y Cuadrante */}
        <div className="space-y-4">
          <div className={`p-4 rounded-lg ${elementoInfo.color} text-white`}>
            <h3 className="font-semibold flex items-center gap-2">
              <Sparkles className="h-4 w-4" />
              Elemento: {elementoInfo.nombre}
            </h3>
            <p className="text-sm opacity-90 mt-1">
              Estación: {elementoInfo.estacion}
            </p>
            <p className="text-sm opacity-90">
              Meridianos: {elementoInfo.meridianos.join(', ')}
            </p>
          </div>

          <div className="p-4 rounded-lg bg-secondary">
            <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wider">
              Cuadrante {tooth.cuadrante} - {cuadranteInfo.nombre}
            </h3>
            <p className="mt-2 font-medium">{cuadranteInfo.significado}</p>
            <p className="text-sm text-muted-foreground mt-1">
              {cuadranteInfo.relacion}
            </p>
          </div>
        </div>

        {/* Órganos y Emociones */}
        <div className="space-y-4">
          <div className="p-4 rounded-lg border">
            <h3 className="font-semibold flex items-center gap-2 mb-2">
              <Heart className="h-4 w-4 text-red-500" />
              Órganos Relacionados
            </h3>
            <ul className="space-y-1">
              {tooth.organos.map((organo, i) => (
                <li key={i} className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-red-400" />
                  {organo}
                </li>
              ))}
            </ul>
          </div>

          <div className="p-4 rounded-lg border">
            <h3 className="font-semibold flex items-center gap-2 mb-2">
              <Brain className="h-4 w-4 text-purple-500" />
              Emoción Asociada {emocionEmoji[tooth.emocion]}
            </h3>
            <p className="capitalize font-medium">{tooth.emocion}</p>
            <p className="text-sm text-muted-foreground mt-1">
              {tooth.emocionDescripcion}
            </p>
          </div>
        </div>

        {/* Vértebras y Articulaciones */}
        <div className="p-4 rounded-lg border">
          <h3 className="font-semibold flex items-center gap-2 mb-2">
            <Bone className="h-4 w-4 text-gray-500" />
            Vértebras
          </h3>
          <div className="flex flex-wrap gap-2">
            {tooth.vertebras.map((v, i) => (
              <span
                key={i}
                className="px-2 py-1 bg-gray-100 rounded text-sm font-mono"
              >
                {v}
              </span>
            ))}
          </div>

          <h3 className="font-semibold flex items-center gap-2 mb-2 mt-4">
            <Activity className="h-4 w-4 text-orange-500" />
            Articulaciones
          </h3>
          <div className="flex flex-wrap gap-2">
            {tooth.articulaciones.map((a, i) => (
              <span
                key={i}
                className="px-2 py-1 bg-orange-50 text-orange-700 rounded text-sm"
              >
                {a}
              </span>
            ))}
          </div>
        </div>

        {/* Función Simbólica */}
        <div className="p-4 rounded-lg bg-gradient-to-br from-indigo-50 to-purple-50 border border-indigo-100">
          <h3 className="font-semibold text-indigo-900 mb-2">
            Función Simbólica
          </h3>
          <p className="text-indigo-800">{tooth.funcionSimbolica}</p>

          <h3 className="font-semibold text-indigo-900 mb-2 mt-4">
            Significado en el Cuadrante
          </h3>
          <p className="text-indigo-800">{tooth.significadoCuadrante}</p>
        </div>
      </CardContent>
    </Card>
  )
}
