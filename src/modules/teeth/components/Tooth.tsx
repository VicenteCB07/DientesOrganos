import { cn } from '@/lib/utils'
import type { ToothData } from '../types'
import type { TipoDiente } from '@/types'
import { ELEMENTOS_INFO } from '../data/teethData'

interface ToothProps {
  tooth: ToothData
  isSelected: boolean
  onClick: (tooth: ToothData) => void
  isUpper: boolean
}

// SVG paths para diferentes tipos de dientes (vista oclusal simplificada)
function getToothShape(tipoDiente: TipoDiente, isUpper: boolean) {
  switch (tipoDiente) {
    case 'incisivo_central':
    case 'incisivo_lateral':
      // Incisivos: forma rectangular/pala
      return isUpper
        ? 'M12,4 C16,4 20,6 22,10 L24,28 C24,32 22,36 18,38 L12,40 L6,38 C2,36 0,32 0,28 L2,10 C4,6 8,4 12,4 Z'
        : 'M12,2 L6,4 C2,6 0,10 0,14 L2,32 C4,36 8,38 12,38 C16,38 20,36 22,32 L24,14 C24,10 22,6 18,4 L12,2 Z'
    case 'canino':
      // Caninos: forma puntiaguda
      return isUpper
        ? 'M12,2 C18,2 22,8 24,16 L22,34 C20,38 16,40 12,40 C8,40 4,38 2,34 L0,16 C2,8 6,2 12,2 Z'
        : 'M12,2 C8,2 4,6 2,12 L0,30 C2,36 6,40 12,40 C18,40 22,36 24,30 L22,12 C20,6 16,2 12,2 Z'
    case 'primer_premolar':
    case 'segundo_premolar':
      // Premolares: forma ovalada con dos cúspides
      return isUpper
        ? 'M12,3 C18,3 23,8 24,14 L24,30 C23,36 18,40 12,40 C6,40 1,36 0,30 L0,14 C1,8 6,3 12,3 Z'
        : 'M12,2 C6,2 1,7 0,13 L0,29 C1,35 6,40 12,40 C18,40 23,35 24,29 L24,13 C23,7 18,2 12,2 Z'
    case 'primer_molar':
    case 'segundo_molar':
      // Molares: forma más cuadrada y grande
      return isUpper
        ? 'M4,4 L20,4 C24,4 26,8 26,12 L26,32 C26,38 22,42 16,42 L10,42 C4,42 0,38 0,32 L0,12 C0,8 2,4 4,4 Z'
        : 'M4,2 L20,2 C24,2 26,6 26,10 L26,30 C26,36 22,42 16,42 L10,42 C4,42 0,36 0,30 L0,10 C0,6 2,2 4,2 Z'
    case 'tercer_molar':
      // Muelas del juicio: forma irregular
      return isUpper
        ? 'M6,4 L18,4 C22,5 24,10 24,14 L23,32 C22,38 18,42 13,42 L11,42 C6,42 2,38 1,32 L0,14 C0,10 2,5 6,4 Z'
        : 'M6,2 L18,2 C22,3 24,8 24,12 L23,30 C22,36 18,42 13,42 L11,42 C6,42 2,36 1,30 L0,12 C0,8 2,3 6,2 Z'
    default:
      return 'M12,4 C18,4 24,10 24,20 C24,30 18,38 12,38 C6,38 0,30 0,20 C0,10 6,4 12,4 Z'
  }
}

// Obtener el tamaño del viewBox según el tipo de diente
function getViewBox(tipoDiente: TipoDiente) {
  if (tipoDiente.includes('molar') && !tipoDiente.includes('premolar')) {
    return '0 0 26 44'
  }
  return '0 0 24 42'
}

// Obtener el ancho según el tipo de diente
function getToothWidth(tipoDiente: TipoDiente) {
  switch (tipoDiente) {
    case 'incisivo_central':
      return 'w-8 md:w-10'
    case 'incisivo_lateral':
      return 'w-7 md:w-9'
    case 'canino':
      return 'w-7 md:w-9'
    case 'primer_premolar':
    case 'segundo_premolar':
      return 'w-8 md:w-10'
    case 'primer_molar':
    case 'segundo_molar':
      return 'w-10 md:w-12'
    case 'tercer_molar':
      return 'w-9 md:w-11'
    default:
      return 'w-8 md:w-10'
  }
}

// Colores de elementos más suaves para aspecto dental
const ELEMENTO_COLORS: Record<string, { fill: string; stroke: string; selected: string }> = {
  agua: { fill: '#E3F2FD', stroke: '#1976D2', selected: '#1976D2' },
  madera: { fill: '#E8F5E9', stroke: '#388E3C', selected: '#388E3C' },
  fuego: { fill: '#FFEBEE', stroke: '#D32F2F', selected: '#D32F2F' },
  tierra: { fill: '#FFF8E1', stroke: '#F57C00', selected: '#F57C00' },
  metal: { fill: '#F3E5F5', stroke: '#7B1FA2', selected: '#7B1FA2' },
}

export function Tooth({ tooth, isSelected, onClick, isUpper }: ToothProps) {
  const elementoInfo = ELEMENTOS_INFO[tooth.elemento]
  const colors = ELEMENTO_COLORS[tooth.elemento] || ELEMENTO_COLORS.agua
  const path = getToothShape(tooth.tipoDiente, isUpper)
  const viewBox = getViewBox(tooth.tipoDiente)
  const widthClass = getToothWidth(tooth.tipoDiente)

  return (
    <button
      onClick={() => onClick(tooth)}
      className={cn(
        'relative flex flex-col items-center transition-all duration-200',
        'focus:outline-none group',
        widthClass,
        isUpper ? 'pb-1' : 'pt-1'
      )}
      title={`${tooth.numero} - ${tooth.nombre}`}
    >
      {/* Número del diente - arriba para superiores, abajo para inferiores */}
      {isUpper && (
        <span
          className={cn(
            'text-[10px] md:text-xs font-semibold mb-0.5 transition-colors',
            isSelected ? 'text-primary' : 'text-gray-500 group-hover:text-gray-700'
          )}
        >
          {tooth.numero}
        </span>
      )}

      {/* SVG del diente */}
      <svg
        viewBox={viewBox}
        className={cn(
          'h-12 md:h-16 transition-all duration-200',
          'drop-shadow-sm group-hover:drop-shadow-md',
          isSelected && 'drop-shadow-lg scale-110',
          !isUpper && 'rotate-180'
        )}
      >
        {/* Sombra/resplandor de selección */}
        {isSelected && (
          <path
            d={path}
            fill={colors.selected}
            opacity="0.2"
            transform="translate(1, 1)"
          />
        )}

        {/* Diente principal */}
        <path
          d={path}
          fill={isSelected ? colors.fill : '#FAFAFA'}
          stroke={isSelected ? colors.selected : '#CBD5E1'}
          strokeWidth={isSelected ? 2 : 1.5}
          className="transition-all duration-200 group-hover:fill-gray-50"
        />

        {/* Indicador de elemento (pequeño círculo de color) */}
        <circle
          cx={viewBox.includes('26') ? 13 : 12}
          cy={isUpper ? 24 : 18}
          r="4"
          fill={colors.stroke}
          opacity={isSelected ? 1 : 0.7}
          className="transition-opacity group-hover:opacity-100"
        />

        {/* Detalle de raíz (línea sutil) */}
        <path
          d={isUpper
            ? `M${viewBox.includes('26') ? 13 : 12},${viewBox.includes('44') ? 38 : 36} L${viewBox.includes('26') ? 13 : 12},${viewBox.includes('44') ? 42 : 40}`
            : `M${viewBox.includes('26') ? 13 : 12},2 L${viewBox.includes('26') ? 13 : 12},6`
          }
          stroke="#CBD5E1"
          strokeWidth="2"
          strokeLinecap="round"
          opacity="0.5"
        />
      </svg>

      {/* Número del diente - abajo para inferiores */}
      {!isUpper && (
        <span
          className={cn(
            'text-[10px] md:text-xs font-semibold mt-0.5 transition-colors',
            isSelected ? 'text-primary' : 'text-gray-500 group-hover:text-gray-700'
          )}
        >
          {tooth.numero}
        </span>
      )}

      {/* Indicador de elemento en hover */}
      <div
        className={cn(
          'absolute opacity-0 group-hover:opacity-100 transition-opacity',
          'bg-white px-2 py-1 rounded shadow-lg text-xs whitespace-nowrap z-20',
          'pointer-events-none',
          isUpper ? 'top-full mt-1' : 'bottom-full mb-1'
        )}
        style={{ borderLeft: `3px solid ${colors.stroke}` }}
      >
        {elementoInfo.nombre}
      </div>
    </button>
  )
}
