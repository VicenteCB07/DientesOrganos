import { useState } from 'react'
import { Tooth } from './Tooth'
import { ToothDetail } from './ToothDetail'
import { TEETH_DATA, CUADRANTES_INFO, ELEMENTOS_INFO } from '../data/teethData'
import type { ToothData } from '../types'

export function ToothChart() {
  const [selectedTooth, setSelectedTooth] = useState<ToothData | null>(null)

  // Separar dientes por cuadrante
  const upperRight = TEETH_DATA.filter((t) => t.cuadrante === 1).sort((a, b) => a.numero - b.numero)
  const upperLeft = TEETH_DATA.filter((t) => t.cuadrante === 2).sort((a, b) => a.numero - b.numero)
  const lowerLeft = TEETH_DATA.filter((t) => t.cuadrante === 3).sort((a, b) => b.numero - a.numero)
  const lowerRight = TEETH_DATA.filter((t) => t.cuadrante === 4).sort((a, b) => b.numero - a.numero)

  const handleToothClick = (tooth: ToothData) => {
    setSelectedTooth(tooth.id === selectedTooth?.id ? null : tooth)
  }

  return (
    <div className="w-full max-w-5xl mx-auto p-4">
      {/* Leyenda de elementos */}
      <div className="flex flex-wrap justify-center gap-3 md:gap-6 mb-8">
        {Object.entries(ELEMENTOS_INFO).map(([key, info]) => (
          <div
            key={key}
            className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white shadow-sm border"
          >
            <div
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: getElementColor(key) }}
            />
            <span className="text-sm font-medium text-gray-700">{info.nombre}</span>
            <span className="text-xs text-gray-400">({info.estacion})</span>
          </div>
        ))}
      </div>

      {/* Diagrama dental */}
      <div className="bg-gradient-to-b from-gray-50 to-white rounded-2xl shadow-xl p-6 md:p-8 mb-6 border border-gray-100">
        {/* Etiquetas de cuadrantes superiores */}
        <div className="flex justify-between mb-4 px-2 md:px-8">
          <div className="text-center">
            <span className="text-xs md:text-sm font-medium text-gray-600">
              {CUADRANTES_INFO[1].nombre}
            </span>
            <p className="text-[10px] text-gray-400 hidden md:block">
              {CUADRANTES_INFO[1].significado}
            </p>
          </div>
          <div className="text-center">
            <span className="text-xs md:text-sm font-medium text-gray-600">
              {CUADRANTES_INFO[2].nombre}
            </span>
            <p className="text-[10px] text-gray-400 hidden md:block">
              {CUADRANTES_INFO[2].significado}
            </p>
          </div>
        </div>

        {/* Arcada superior */}
        <div className="relative flex justify-center items-end mb-4">
          {/* Curva de la encía superior */}
          <div className="absolute inset-x-0 bottom-0 h-8 bg-gradient-to-t from-pink-50 to-transparent rounded-b-full opacity-50" />

          {/* Cuadrante 1 - Superior Derecho (visualmente a la izquierda) */}
          <div className="flex items-end">
            {[...upperRight].reverse().map((tooth) => (
              <Tooth
                key={tooth.id}
                tooth={tooth}
                isSelected={selectedTooth?.id === tooth.id}
                onClick={handleToothClick}
                isUpper={true}
              />
            ))}
          </div>

          {/* Línea divisoria central */}
          <div className="w-px h-20 bg-gradient-to-b from-gray-200 to-gray-300 mx-1 md:mx-2" />

          {/* Cuadrante 2 - Superior Izquierdo (visualmente a la derecha) */}
          <div className="flex items-end">
            {upperLeft.map((tooth) => (
              <Tooth
                key={tooth.id}
                tooth={tooth}
                isSelected={selectedTooth?.id === tooth.id}
                onClick={handleToothClick}
                isUpper={true}
              />
            ))}
          </div>
        </div>

        {/* Espacio entre arcadas (representa la mordida) */}
        <div className="relative h-6 md:h-8 flex items-center justify-center">
          <div className="absolute inset-x-12 md:inset-x-24 h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent" />
          <span className="relative bg-white px-4 text-xs text-gray-400 font-medium">
            Arcada Dental
          </span>
        </div>

        {/* Arcada inferior */}
        <div className="relative flex justify-center items-start mt-4">
          {/* Curva de la encía inferior */}
          <div className="absolute inset-x-0 top-0 h-8 bg-gradient-to-b from-pink-50 to-transparent rounded-t-full opacity-50" />

          {/* Cuadrante 4 - Inferior Derecho (visualmente a la izquierda) */}
          <div className="flex items-start">
            {lowerRight.map((tooth) => (
              <Tooth
                key={tooth.id}
                tooth={tooth}
                isSelected={selectedTooth?.id === tooth.id}
                onClick={handleToothClick}
                isUpper={false}
              />
            ))}
          </div>

          {/* Línea divisoria central */}
          <div className="w-px h-20 bg-gradient-to-t from-gray-200 to-gray-300 mx-1 md:mx-2" />

          {/* Cuadrante 3 - Inferior Izquierdo (visualmente a la derecha) */}
          <div className="flex items-start">
            {[...lowerLeft].reverse().map((tooth) => (
              <Tooth
                key={tooth.id}
                tooth={tooth}
                isSelected={selectedTooth?.id === tooth.id}
                onClick={handleToothClick}
                isUpper={false}
              />
            ))}
          </div>
        </div>

        {/* Etiquetas de cuadrantes inferiores */}
        <div className="flex justify-between mt-4 px-2 md:px-8">
          <div className="text-center">
            <span className="text-xs md:text-sm font-medium text-gray-600">
              {CUADRANTES_INFO[4].nombre}
            </span>
            <p className="text-[10px] text-gray-400 hidden md:block">
              {CUADRANTES_INFO[4].significado}
            </p>
          </div>
          <div className="text-center">
            <span className="text-xs md:text-sm font-medium text-gray-600">
              {CUADRANTES_INFO[3].nombre}
            </span>
            <p className="text-[10px] text-gray-400 hidden md:block">
              {CUADRANTES_INFO[3].significado}
            </p>
          </div>
        </div>
      </div>

      {/* Detalle del diente seleccionado */}
      {selectedTooth && (
        <ToothDetail
          tooth={selectedTooth}
          onClose={() => setSelectedTooth(null)}
        />
      )}

      {/* Mensaje cuando no hay diente seleccionado */}
      {!selectedTooth && (
        <div className="text-center py-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 mb-4">
            <svg className="w-8 h-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122" />
            </svg>
          </div>
          <p className="text-lg font-medium text-gray-700">Selecciona un diente</p>
          <p className="text-sm text-gray-500 mt-1 max-w-md mx-auto">
            Haz clic en cualquier diente para ver su relación con órganos, emociones y meridianos según la Medicina Tradicional China
          </p>
        </div>
      )}
    </div>
  )
}

// Helper para obtener el color del elemento
function getElementColor(elemento: string): string {
  const colors: Record<string, string> = {
    agua: '#1976D2',
    madera: '#388E3C',
    fuego: '#D32F2F',
    tierra: '#F57C00',
    metal: '#7B1FA2',
  }
  return colors[elemento] || '#666'
}
