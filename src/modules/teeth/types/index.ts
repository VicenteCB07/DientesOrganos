import type { ElementoMTC, Emocion, Cuadrante, TipoDiente } from '@/types'

export interface ToothData {
  id: string
  numero: number
  nombre: string
  nombreCorto: string
  tipoDiente: TipoDiente
  cuadrante: Cuadrante
  elemento: ElementoMTC
  organos: string[]
  emocion: Emocion
  emocionDescripcion: string
  vertebras: string[]
  articulaciones: string[]
  funcionSimbolica: string
  significadoCuadrante: string
  meridianos: string[]
}

export interface ToothPosition {
  x: number
  y: number
  width: number
  height: number
}

export interface ElementoInfo {
  nombre: string
  color: string
  colorHover: string
  estacion: string
  meridianos: string[]
}
