import { jsPDF } from 'jspdf'
import autoTable from 'jspdf-autotable'
import type { Paciente, Odontograma, DientePaciente } from '@/types'
import { TEETH_DATA } from '@/modules/teeth/data/teethData'
import { formatearNombreCompleto, calcularEdad } from './patientsService'

// Colores del tema - Paleta azul profesional
const COLORS = {
  primary: [59, 130, 246] as [number, number, number],      // blue-500
  primaryDark: [37, 99, 235] as [number, number, number],   // blue-600
  secondary: [75, 85, 99] as [number, number, number],      // #4B5563 - Gris medio
  danger: [239, 68, 68] as [number, number, number],        // red-500 (para alergias)
  warning: [245, 158, 11] as [number, number, number],      // amber-500
  success: [34, 197, 94] as [number, number, number],       // green-500
  text: [17, 24, 39] as [number, number, number],           // #111827 - Texto oscuro
  textLight: [75, 85, 99] as [number, number, number],      // #4B5563 - Texto muted
  border: [229, 231, 235] as [number, number, number],      // #E5E7EB - Bordes
  background: [249, 250, 251] as [number, number, number],  // #F9FAFB - Fondo
}

// Estados de diente con colores para el PDF
const ESTADOS_DIENTE_MAP: Record<string, { label: string; color: [number, number, number] }> = {
  sano: { label: 'Sano', color: [34, 197, 94] },
  caries: { label: 'Caries', color: [245, 158, 11] },
  caries_incipiente: { label: 'Caries incipiente', color: [253, 224, 71] },
  caries_recurrente: { label: 'Caries recurrente', color: [217, 119, 6] },
  caries_radicular: { label: 'Caries radicular', color: [180, 83, 9] },
  caries_rampante: { label: 'Caries rampante', color: [146, 64, 14] },
  obturado: { label: 'Obturado/Restaurado', color: [59, 130, 246] },
  obturado_amalgama: { label: 'Obturación amalgama', color: [107, 114, 128] },
  obturado_composite: { label: 'Obturación composite', color: [96, 165, 250] },
  obturado_ionomero: { label: 'Obturación ionómero', color: [147, 197, 253] },
  obturado_temporal: { label: 'Obturación temporal', color: [191, 219, 254] },
  obturado_filtrado: { label: 'Obturación filtrada', color: [29, 78, 216] },
  endodoncia: { label: 'Endodoncia realizada', color: [249, 115, 22] },
  endodoncia_iniciada: { label: 'Endodoncia en proceso', color: [251, 146, 60] },
  endodoncia_fallida: { label: 'Endodoncia fallida', color: [194, 65, 12] },
  corona: { label: 'Corona', color: [168, 85, 247] },
  corona_metal: { label: 'Corona metálica', color: [75, 85, 99] },
  corona_porcelana: { label: 'Corona porcelana', color: [192, 132, 252] },
  ausente: { label: 'Ausente', color: [156, 163, 175] },
  ausente_congenito: { label: 'Agenesia', color: [107, 114, 128] },
  extraccion_indicada: { label: 'Extracción indicada', color: [239, 68, 68] },
  fracturado: { label: 'Fracturado', color: [217, 119, 6] },
  implante: { label: 'Implante', color: [6, 182, 212] },
  periodontitis: { label: 'Periodontitis', color: [236, 72, 153] },
  periodontitis_leve: { label: 'Periodontitis leve', color: [244, 114, 182] },
  periodontitis_moderada: { label: 'Periodontitis moderada', color: [236, 72, 153] },
  periodontitis_severa: { label: 'Periodontitis severa', color: [190, 24, 93] },
  movilidad: { label: 'Movilidad dental', color: [244, 63, 94] },
  necrosis_pulpar: { label: 'Necrosis pulpar', color: [127, 29, 29] },
  absceso: { label: 'Absceso periapical', color: [127, 29, 29] },
  pulpitis_irreversible: { label: 'Pulpitis irreversible', color: [239, 68, 68] },
  pulpitis_reversible: { label: 'Pulpitis reversible', color: [248, 113, 113] },
}

function getEstadoInfo(estado: string): { label: string; color: [number, number, number] } {
  return ESTADOS_DIENTE_MAP[estado] || { label: estado, color: [156, 163, 175] }
}


export function generatePatientReport(
  paciente: Paciente,
  odontograma: Odontograma | null | undefined
): void {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  })

  const pageWidth = doc.internal.pageSize.getWidth()
  const pageHeight = doc.internal.pageSize.getHeight()
  const margin = 15
  const contentWidth = pageWidth - margin * 2
  let y = margin

  // ============================================
  // HEADER
  // ============================================
  const drawHeader = () => {
    // Fondo del header
    doc.setFillColor(...COLORS.primary)
    doc.rect(0, 0, pageWidth, 40, 'F')

    // Línea decorativa
    doc.setFillColor(...COLORS.primaryDark)
    doc.rect(0, 40, pageWidth, 3, 'F')

    // Título
    doc.setTextColor(255, 255, 255)
    doc.setFontSize(22)
    doc.setFont('helvetica', 'bold')
    doc.text('Dientes & Órganos', margin, 18)

    // Subtítulo
    doc.setFontSize(10)
    doc.setFont('helvetica', 'normal')
    doc.text('Odontología Integrativa', margin, 26)

    // Fecha del reporte
    doc.setFontSize(9)
    doc.text(`Reporte generado: ${new Date().toLocaleDateString('es-ES', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })}`, pageWidth - margin, 18, { align: 'right' })

    doc.text('REPORTE CLÍNICO', pageWidth - margin, 26, { align: 'right' })

    return 50
  }

  y = drawHeader()

  // ============================================
  // DATOS DEL PACIENTE
  // ============================================
  const drawPatientInfo = (startY: number): number => {
    let currentY = startY

    // Título de sección
    doc.setFillColor(...COLORS.background)
    doc.roundedRect(margin, currentY, contentWidth, 10, 2, 2, 'F')
    doc.setTextColor(...COLORS.primary)
    doc.setFontSize(12)
    doc.setFont('helvetica', 'bold')
    doc.text('DATOS DEL PACIENTE', margin + 4, currentY + 7)
    currentY += 15

    // Información del paciente en columnas
    doc.setTextColor(...COLORS.text)
    doc.setFontSize(10)

    const datos = paciente.anamnesis.datosPersonales
    const edad = calcularEdad(datos.fechaNacimiento)
    const nombreCompleto = formatearNombreCompleto(paciente)

    // Columna izquierda
    doc.setFont('helvetica', 'bold')
    doc.text('Nombre:', margin, currentY)
    doc.setFont('helvetica', 'normal')
    doc.text(nombreCompleto, margin + 25, currentY)

    // Columna derecha
    doc.setFont('helvetica', 'bold')
    doc.text('Documento:', pageWidth / 2, currentY)
    doc.setFont('helvetica', 'normal')
    doc.text(datos.documentoIdentidad || 'No registrado', pageWidth / 2 + 30, currentY)
    currentY += 6

    doc.setFont('helvetica', 'bold')
    doc.text('Edad:', margin, currentY)
    doc.setFont('helvetica', 'normal')
    doc.text(`${edad} años`, margin + 25, currentY)

    doc.setFont('helvetica', 'bold')
    doc.text('Teléfono:', pageWidth / 2, currentY)
    doc.setFont('helvetica', 'normal')
    doc.text(datos.telefono || 'No registrado', pageWidth / 2 + 30, currentY)
    currentY += 6

    doc.setFont('helvetica', 'bold')
    doc.text('Género:', margin, currentY)
    doc.setFont('helvetica', 'normal')
    const generoLabels: Record<string, string> = {
      masculino: 'Masculino',
      femenino: 'Femenino',
      otro: 'Otro',
      prefiero_no_decir: 'Prefiere no decir'
    }
    doc.text(generoLabels[datos.genero] || datos.genero, margin + 25, currentY)

    doc.setFont('helvetica', 'bold')
    doc.text('Ciudad:', pageWidth / 2, currentY)
    doc.setFont('helvetica', 'normal')
    doc.text(datos.ciudad || 'No registrada', pageWidth / 2 + 30, currentY)
    currentY += 10

    // Motivo de consulta
    doc.setFont('helvetica', 'bold')
    doc.text('Motivo de consulta:', margin, currentY)
    currentY += 5
    doc.setFont('helvetica', 'normal')
    doc.setFontSize(9)
    const motivoTexto = paciente.anamnesis.antecedentesOdontologicos.motivoConsulta || 'No especificado'
    const motivoLines = doc.splitTextToSize(motivoTexto, contentWidth)
    doc.text(motivoLines, margin, currentY)
    currentY += motivoLines.length * 4 + 5

    // Línea divisoria
    doc.setDrawColor(...COLORS.border)
    doc.setLineWidth(0.5)
    doc.line(margin, currentY, pageWidth - margin, currentY)

    return currentY + 8
  }

  y = drawPatientInfo(y)

  // ============================================
  // ANTECEDENTES MÉDICOS RELEVANTES
  // ============================================
  const drawMedicalHistory = (startY: number): number => {
    let currentY = startY

    // Título de sección
    doc.setFillColor(...COLORS.background)
    doc.roundedRect(margin, currentY, contentWidth, 10, 2, 2, 'F')
    doc.setTextColor(...COLORS.danger)
    doc.setFontSize(12)
    doc.setFont('helvetica', 'bold')
    doc.text('ANTECEDENTES MÉDICOS RELEVANTES', margin + 4, currentY + 7)
    currentY += 15

    const antMed = paciente.anamnesis.antecedentesMedicos
    const condiciones: string[] = []

    if (antMed.diabetes) condiciones.push(`Diabetes ${antMed.diabetesTipo ? `Tipo ${antMed.diabetesTipo}` : ''}`)
    if (antMed.hipertension) condiciones.push('Hipertensión')
    if (antMed.cardiopatia) condiciones.push(`Cardiopatía ${antMed.cardiopatiaDetalle ? `(${antMed.cardiopatiaDetalle})` : ''}`)
    if (antMed.anticoagulantes) condiciones.push(`En tratamiento anticoagulante ${antMed.anticoagulantesDetalle ? `(${antMed.anticoagulantesDetalle})` : ''}`)
    if (antMed.enfermedadesRespiratorias) condiciones.push('Enfermedades respiratorias')
    if (antMed.enfermedadesHepaticas) condiciones.push('Enfermedades hepáticas')
    if (antMed.enfermedadesRenales) condiciones.push('Enfermedades renales')
    if (antMed.cancer) condiciones.push(`Antecedente de cáncer ${antMed.cancerDetalle ? `(${antMed.cancerDetalle})` : ''}`)
    if (antMed.vih) condiciones.push('VIH/SIDA')
    if (antMed.embarazo) condiciones.push(`Embarazada ${antMed.semanaEmbarazo ? `(${antMed.semanaEmbarazo} semanas)` : ''}`)

    doc.setTextColor(...COLORS.text)
    doc.setFontSize(9)
    doc.setFont('helvetica', 'normal')

    if (condiciones.length > 0) {
      condiciones.forEach(cond => {
        doc.text(`• ${cond}`, margin, currentY)
        currentY += 5
      })
    } else {
      doc.setTextColor(...COLORS.textLight)
      doc.text('Sin antecedentes médicos relevantes reportados', margin, currentY)
      currentY += 5
    }

    // Alergias
    currentY += 3
    doc.setTextColor(...COLORS.danger)
    doc.setFont('helvetica', 'bold')
    doc.text('Alergias:', margin, currentY)
    currentY += 5

    const alergias: string[] = []
    if (antMed.alergiasMedicamentos) alergias.push(`Medicamentos: ${antMed.alergiasMedicamentosDetalle || 'No especificado'}`)
    if (antMed.alergiasLatex) alergias.push('Látex')
    if (antMed.alergiasAnestesia) alergias.push('Anestesia local')
    if (antMed.alergiasAlimentos) alergias.push(`Alimentos: ${antMed.alergiasAlimentosDetalle || 'No especificado'}`)
    if (antMed.otrasAlergias) alergias.push(antMed.otrasAlergias)

    doc.setFont('helvetica', 'normal')
    if (alergias.length > 0) {
      doc.setTextColor(...COLORS.danger)
      alergias.forEach(alergia => {
        doc.text(`⚠ ${alergia}`, margin + 5, currentY)
        currentY += 5
      })
    } else {
      doc.setTextColor(...COLORS.success)
      doc.text('✓ Sin alergias conocidas', margin + 5, currentY)
      currentY += 5
    }

    currentY += 3

    // Línea divisoria
    doc.setDrawColor(...COLORS.border)
    doc.setLineWidth(0.5)
    doc.line(margin, currentY, pageWidth - margin, currentY)

    return currentY + 8
  }

  y = drawMedicalHistory(y)

  // ============================================
  // ODONTOGRAMA - RESUMEN DE HALLAZGOS
  // ============================================
  const drawOdontogramaSummary = (startY: number): number => {
    let currentY = startY

    // Título de sección
    doc.setFillColor(...COLORS.background)
    doc.roundedRect(margin, currentY, contentWidth, 10, 2, 2, 'F')
    doc.setTextColor(...COLORS.primary)
    doc.setFontSize(12)
    doc.setFont('helvetica', 'bold')
    doc.text('RESUMEN DEL ODONTOGRAMA', margin + 4, currentY + 7)
    currentY += 15

    if (!odontograma) {
      doc.setTextColor(...COLORS.textLight)
      doc.setFontSize(9)
      doc.setFont('helvetica', 'italic')
      doc.text('Odontograma no disponible', margin, currentY)
      return currentY + 10
    }

    // Conteo de estados
    const conteos = {
      sanos: odontograma.dientes.filter(d => d.estado.startsWith('sano')).length,
      caries: odontograma.dientes.filter(d => d.estado.startsWith('caries')).length,
      obturados: odontograma.dientes.filter(d =>
        d.estado.startsWith('obturado') || ['inlay', 'onlay', 'overlay', 'sellante', 'carilla'].some(p => d.estado.startsWith(p))
      ).length,
      ausentes: odontograma.dientes.filter(d =>
        d.estado.startsWith('ausente') || ['raiz_retenida', 'alveolo_en_cicatrizacion'].some(p => d.estado.startsWith(p))
      ).length,
      endodoncias: odontograma.dientes.filter(d => d.estado.startsWith('endodoncia')).length,
      coronas: odontograma.dientes.filter(d => d.estado.startsWith('corona')).length,
      camposInterferentes: odontograma.dientes.filter(d => d.campoInterferente).length,
    }

    // Estadísticas en cajas
    const boxWidth = (contentWidth - 15) / 4
    const boxHeight = 18
    const boxes = [
      { label: 'Sanos', value: conteos.sanos, color: COLORS.success },
      { label: 'Caries', value: conteos.caries, color: COLORS.warning },
      { label: 'Obturados', value: conteos.obturados, color: COLORS.primary },
      { label: 'Ausentes', value: conteos.ausentes, color: COLORS.secondary },
    ]

    boxes.forEach((box, i) => {
      const x = margin + i * (boxWidth + 5)
      doc.setFillColor(box.color[0], box.color[1], box.color[2])
      doc.roundedRect(x, currentY, boxWidth, boxHeight, 2, 2, 'F')

      doc.setTextColor(255, 255, 255)
      doc.setFontSize(14)
      doc.setFont('helvetica', 'bold')
      doc.text(box.value.toString(), x + boxWidth / 2, currentY + 10, { align: 'center' })

      doc.setFontSize(7)
      doc.setFont('helvetica', 'normal')
      doc.text(box.label, x + boxWidth / 2, currentY + 15, { align: 'center' })
    })

    currentY += boxHeight + 8

    // Más estadísticas
    doc.setTextColor(...COLORS.text)
    doc.setFontSize(9)
    if (conteos.endodoncias > 0) {
      doc.text(`• Endodoncias realizadas: ${conteos.endodoncias}`, margin, currentY)
      currentY += 5
    }
    if (conteos.coronas > 0) {
      doc.text(`• Coronas/Prótesis fijas: ${conteos.coronas}`, margin, currentY)
      currentY += 5
    }
    if (conteos.camposInterferentes > 0) {
      doc.setTextColor(...COLORS.primary)
      doc.setFont('helvetica', 'bold')
      doc.text(`• Campos Interferentes identificados: ${conteos.camposInterferentes}`, margin, currentY)
      currentY += 5
    }

    currentY += 3

    // Línea divisoria
    doc.setDrawColor(...COLORS.border)
    doc.setLineWidth(0.5)
    doc.line(margin, currentY, pageWidth - margin, currentY)

    return currentY + 8
  }

  y = drawOdontogramaSummary(y)

  // ============================================
  // TABLA DE HALLAZGOS CLÍNICOS
  // ============================================
  const drawClinicalFindings = (startY: number): number => {
    let currentY = startY

    // Verificar si necesitamos nueva página
    if (currentY > pageHeight - 80) {
      doc.addPage()
      currentY = margin
    }

    // Título de sección
    doc.setFillColor(...COLORS.background)
    doc.roundedRect(margin, currentY, contentWidth, 10, 2, 2, 'F')
    doc.setTextColor(...COLORS.primary)
    doc.setFontSize(12)
    doc.setFont('helvetica', 'bold')
    doc.text('HALLAZGOS CLÍNICOS Y DIAGNÓSTICO POR DIENTE', margin + 4, currentY + 7)
    currentY += 15

    if (!odontograma) {
      return currentY
    }

    // Filtrar dientes con hallazgos relevantes (no sanos)
    const dientesConHallazgos = odontograma.dientes.filter(
      d => d.estado !== 'sano' || d.descripcion || d.hallazgosClinicos || d.campoInterferente
    )

    if (dientesConHallazgos.length === 0) {
      doc.setTextColor(...COLORS.success)
      doc.setFontSize(10)
      doc.text('✓ Todos los dientes se encuentran en estado saludable', margin, currentY)
      return currentY + 10
    }

    // Crear tabla de hallazgos
    const tableData = dientesConHallazgos.map(diente => {
      const toothInfo = TEETH_DATA.find(t => t.numero === diente.numeroDiente)
      const estadoInfo = getEstadoInfo(diente.estado)

      return [
        `#${diente.numeroDiente}`,
        toothInfo?.nombre || '-',
        estadoInfo.label,
        diente.hallazgosClinicos || '-',
        diente.descripcion || '-',
        diente.campoInterferente ? 'Sí' : '-',
      ]
    })

    autoTable(doc, {
      startY: currentY,
      head: [['Diente', 'Nombre', 'Estado', 'Hallazgos Clínicos', 'Diagnóstico', 'CI']],
      body: tableData,
      theme: 'striped',
      headStyles: {
        fillColor: COLORS.primary,
        textColor: [255, 255, 255],
        fontSize: 8,
        fontStyle: 'bold',
      },
      bodyStyles: {
        fontSize: 7,
        textColor: COLORS.text,
      },
      columnStyles: {
        0: { cellWidth: 12, halign: 'center' },
        1: { cellWidth: 25 },
        2: { cellWidth: 30 },
        3: { cellWidth: 45 },
        4: { cellWidth: 45 },
        5: { cellWidth: 10, halign: 'center' },
      },
      alternateRowStyles: {
        fillColor: [248, 250, 252],
      },
      margin: { left: margin, right: margin },
      didDrawCell: (data) => {
        // Colorear la celda de Campo Interferente si es "Sí" (color azul profesional)
        if (data.column.index === 5 && data.cell.text[0] === 'Sí') {
          doc.setTextColor(...COLORS.primary)
        }
      },
    })

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    currentY = (doc as any).lastAutoTable.finalY + 8

    return currentY
  }

  y = drawClinicalFindings(y)

  // ============================================
  // CAMPOS INTERFERENTES (TERAPIA NEURAL)
  // ============================================
  const drawInterferenceFields = (startY: number): number => {
    let currentY = startY

    if (!odontograma) return currentY

    const camposInterferentes = odontograma.dientes.filter(d => d.campoInterferente)

    if (camposInterferentes.length === 0) return currentY

    // Verificar si necesitamos nueva página
    if (currentY > pageHeight - 60) {
      doc.addPage()
      currentY = margin
    }

    // Título de sección
    doc.setFillColor(...COLORS.background)
    doc.roundedRect(margin, currentY, contentWidth, 10, 2, 2, 'F')
    doc.setTextColor(...COLORS.primary)
    doc.setFontSize(12)
    doc.setFont('helvetica', 'bold')
    doc.text('CAMPOS INTERFERENTES (ODONTOLOGÍA NEUROFOCAL)', margin + 4, currentY + 7)
    currentY += 15

    camposInterferentes.forEach((diente: DientePaciente) => {
      // Verificar espacio
      if (currentY > pageHeight - 50) {
        doc.addPage()
        currentY = margin
      }

      const toothInfo = TEETH_DATA.find(t => t.numero === diente.numeroDiente)
      const estadoInfo = getEstadoInfo(diente.estado)

      // Caja del diente - colores neutros
      doc.setFillColor(241, 245, 249) // slate-100
      doc.setDrawColor(...COLORS.primary)
      doc.setLineWidth(0.5)
      doc.roundedRect(margin, currentY, contentWidth, 35, 2, 2, 'FD')

      // Número y nombre del diente
      doc.setTextColor(...COLORS.primaryDark)
      doc.setFontSize(11)
      doc.setFont('helvetica', 'bold')
      doc.text(`Diente #${diente.numeroDiente} - ${toothInfo?.nombre || 'Desconocido'}`, margin + 4, currentY + 7)

      // Estado
      doc.setTextColor(...COLORS.text)
      doc.setFontSize(8)
      doc.setFont('helvetica', 'normal')
      doc.text(`Estado: ${estadoInfo.label}`, margin + 4, currentY + 13)

      // Diagnóstico
      if (diente.descripcion) {
        doc.text(`Diagnóstico: ${diente.descripcion}`, margin + 4, currentY + 19)
      }

      // Notas del campo interferente
      if (diente.campoInterferenteNotas) {
        doc.setTextColor(...COLORS.textLight)
        doc.text(`Notas CI: ${diente.campoInterferenteNotas}`, margin + 4, currentY + 25)
      }

      // Relación con órganos (columna derecha)
      if (toothInfo) {
        const rightX = margin + contentWidth / 2
        doc.setFillColor(255, 255, 255)
        doc.roundedRect(rightX, currentY + 2, contentWidth / 2 - 6, 31, 2, 2, 'F')

        doc.setTextColor(...COLORS.primary)
        doc.setFontSize(7)
        doc.setFont('helvetica', 'bold')
        doc.text('Relación Diente-Órgano (MTC):', rightX + 3, currentY + 8)

        doc.setFont('helvetica', 'normal')
        doc.setTextColor(...COLORS.text)
        doc.text(`Elemento: ${toothInfo.elemento}`, rightX + 3, currentY + 14)
        doc.text(`Órganos: ${toothInfo.organos.join(', ')}`, rightX + 3, currentY + 20)
        doc.text(`Emoción: ${toothInfo.emocion}`, rightX + 3, currentY + 26)
        if (toothInfo.vertebras && toothInfo.vertebras.length > 0) {
          doc.text(`Vértebras: ${toothInfo.vertebras.join(', ')}`, rightX + 3, currentY + 32)
        }
      }

      currentY += 40
    })

    // Nota explicativa
    doc.setTextColor(...COLORS.textLight)
    doc.setFontSize(7)
    doc.setFont('helvetica', 'italic')
    const nota = 'Los campos interferentes son focos irritativos que pueden afectar órganos y sistemas distantes según la Odontología Neurofocal y la Terapia Neural de Huneke.'
    const notaLines = doc.splitTextToSize(nota, contentWidth)
    doc.text(notaLines, margin, currentY)
    currentY += notaLines.length * 3 + 5

    return currentY
  }

  y = drawInterferenceFields(y)

  // ============================================
  // RELACIÓN DIENTE-ÓRGANO (MTC)
  // ============================================
  const drawToothOrganTable = (startY: number): number => {
    let currentY = startY

    if (!odontograma) return currentY

    // Filtrar dientes con alguna condición (no sanos)
    const dientesAfectados = odontograma.dientes.filter(
      d => d.estado !== 'sano'
    )

    if (dientesAfectados.length === 0) return currentY

    // Verificar si necesitamos nueva página
    if (currentY > pageHeight - 60) {
      doc.addPage()
      currentY = margin
    }

    // Título de sección
    doc.setFillColor(...COLORS.background)
    doc.roundedRect(margin, currentY, contentWidth, 10, 2, 2, 'F')
    doc.setTextColor(...COLORS.primary)
    doc.setFontSize(12)
    doc.setFont('helvetica', 'bold')
    doc.text('RELACIÓN DIENTE-ÓRGANO (MEDICINA TRADICIONAL CHINA)', margin + 4, currentY + 7)
    currentY += 15

    const tableData = dientesAfectados.map(diente => {
      const toothInfo = TEETH_DATA.find(t => t.numero === diente.numeroDiente)
      const estadoInfo = getEstadoInfo(diente.estado)

      return [
        `#${diente.numeroDiente}`,
        toothInfo?.nombreCorto || '-',
        estadoInfo.label,
        toothInfo?.elemento || '-',
        toothInfo?.organos.join(', ') || '-',
        toothInfo?.emocion || '-',
        toothInfo?.meridianos.join(', ') || '-',
      ]
    })

    autoTable(doc, {
      startY: currentY,
      head: [['Diente', 'Nombre', 'Estado', 'Elemento', 'Órganos', 'Emoción', 'Meridianos']],
      body: tableData,
      theme: 'striped',
      headStyles: {
        fillColor: COLORS.primary,
        textColor: [255, 255, 255],
        fontSize: 7,
        fontStyle: 'bold',
      },
      bodyStyles: {
        fontSize: 6.5,
        textColor: COLORS.text,
      },
      columnStyles: {
        0: { cellWidth: 12, halign: 'center' },
        1: { cellWidth: 24 },
        2: { cellWidth: 26 },
        3: { cellWidth: 16 },
        4: { cellWidth: 38 },
        5: { cellWidth: 22 },
        6: { cellWidth: 30 },
      },
      alternateRowStyles: {
        fillColor: [248, 250, 252],
      },
      margin: { left: margin, right: margin },
    })

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    currentY = (doc as any).lastAutoTable.finalY + 5

    // Nota explicativa
    doc.setTextColor(...COLORS.textLight)
    doc.setFontSize(7)
    doc.setFont('helvetica', 'italic')
    const nota = 'Relaciones basadas en la Medicina Tradicional China (MTC) y la Odontología Neurofocal. Cada diente se asocia a meridianos energéticos, órganos y emociones específicas.'
    const notaLines = doc.splitTextToSize(nota, contentWidth)
    doc.text(notaLines, margin, currentY)
    currentY += notaLines.length * 3 + 5

    return currentY
  }

  y = drawToothOrganTable(y)

  // ============================================
  // ARCHIVOS ADJUNTOS
  // ============================================
  const drawAttachedFiles = (startY: number): number => {
    let currentY = startY

    const archivos = paciente.anamnesis?.antecedentesOdontologicos?.archivosAdjuntos
    if (!archivos || archivos.length === 0) return currentY

    // Verificar si necesitamos nueva página
    if (currentY > pageHeight - 60) {
      doc.addPage()
      currentY = margin
    }

    // Título de sección
    doc.setFillColor(...COLORS.background)
    doc.roundedRect(margin, currentY, contentWidth, 10, 2, 2, 'F')
    doc.setTextColor(...COLORS.primary)
    doc.setFontSize(12)
    doc.setFont('helvetica', 'bold')
    doc.text('ARCHIVOS ADJUNTOS', margin + 4, currentY + 7)
    currentY += 15

    // Resumen
    doc.setTextColor(...COLORS.text)
    doc.setFontSize(9)
    doc.setFont('helvetica', 'normal')
    doc.text(`${archivos.length} archivo(s) adjunto(s)`, margin, currentY)
    currentY += 7

    // Labels de tipos
    const tipoLabels: Record<string, string> = {
      radiografia: 'Radiografía',
      foto_intraoral: 'Foto Intraoral',
      foto_extraoral: 'Foto Extraoral',
      documento: 'Documento',
      otro: 'Otro',
    }

    const formatFileSize = (bytes: number): string => {
      if (bytes < 1024) return `${bytes} B`
      if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
      return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
    }

    // Tabla de archivos con enlace
    const fileUrls: string[] = []
    const tableData = archivos.map(archivo => {
      fileUrls.push(archivo.url)
      return [
        archivo.nombre,
        tipoLabels[archivo.tipo] || archivo.tipo,
        formatFileSize(archivo.tamanio),
        archivo.descripcion || '-',
        archivo.fechaSubida ? new Date(archivo.fechaSubida).toLocaleDateString('es-ES') : '-',
        '', // Celda vacía — el texto "Abrir" se dibuja manualmente con link
      ]
    })

    autoTable(doc, {
      startY: currentY,
      head: [['Nombre del archivo', 'Tipo', 'Tamaño', 'Descripción', 'Fecha', 'Enlace']],
      body: tableData,
      theme: 'striped',
      headStyles: {
        fillColor: COLORS.primary,
        textColor: [255, 255, 255],
        fontSize: 8,
        fontStyle: 'bold',
      },
      bodyStyles: {
        fontSize: 7,
        textColor: COLORS.text,
      },
      columnStyles: {
        0: { cellWidth: 45 },
        1: { cellWidth: 25 },
        2: { cellWidth: 16 },
        3: { cellWidth: 42 },
        4: { cellWidth: 20 },
        5: { cellWidth: 18, halign: 'center' },
      },
      alternateRowStyles: {
        fillColor: [248, 250, 252],
      },
      margin: { left: margin, right: margin },
      didDrawCell: (data) => {
        // Dibujar texto "Abrir" en azul con hipervínculo externo clickeable
        if (data.section === 'body' && data.column.index === 5) {
          const fileUrl = fileUrls[data.row.index]
          if (fileUrl) {
            const textX = data.cell.x + 3
            const textY = data.cell.y + data.cell.height / 2 + 1
            doc.setTextColor(...COLORS.primary)
            doc.setFontSize(7)
            doc.setFont('helvetica', 'bold')
            // textWithLink dibuja texto + crea área clickeable con URL externa
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            ;(doc as any).textWithLink('Abrir archivo', textX, textY, { url: fileUrl })
          }
        }
      },
    })

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    currentY = (doc as any).lastAutoTable.finalY + 5

    // Nota
    doc.setTextColor(...COLORS.textLight)
    doc.setFontSize(7)
    doc.setFont('helvetica', 'italic')
    doc.text('Los archivos digitales están disponibles en el sistema para visualización y descarga.', margin, currentY)
    currentY += 8

    return currentY
  }

  y = drawAttachedFiles(y)

  // ============================================
  // FOOTER EN CADA PÁGINA
  // ============================================
  const totalPages = doc.getNumberOfPages()
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i)

    // Línea del footer
    doc.setDrawColor(...COLORS.border)
    doc.setLineWidth(0.5)
    doc.line(margin, pageHeight - 15, pageWidth - margin, pageHeight - 15)

    // Texto del footer
    doc.setTextColor(...COLORS.textLight)
    doc.setFontSize(7)
    doc.setFont('helvetica', 'normal')
    doc.text('Este documento es de carácter confidencial y forma parte de la historia clínica del paciente.', margin, pageHeight - 10)
    doc.text(`Página ${i} de ${totalPages}`, pageWidth - margin, pageHeight - 10, { align: 'right' })
  }

  // ============================================
  // DESCARGAR PDF
  // ============================================
  const nombrePaciente = formatearNombreCompleto(paciente).replace(/\s+/g, '_')
  const fecha = new Date().toISOString().split('T')[0]
  doc.save(`Reporte_Clinico_${nombrePaciente}_${fecha}.pdf`)
}
