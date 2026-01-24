// Services
export { patientsService, odontogramasService, calcularEdad, formatearNombreCompleto } from './services/patientsService'
export type { PacienteFormData } from './services/patientsService'
export { generatePatientReport } from './services/pdfReportService'

// Hooks
export {
  usePatients,
  useSearchPatients,
  usePatient,
  useCreatePatient,
  useUpdatePatient,
  useDeletePatient,
  useOdontograma,
  useOdontogramasHistorial,
  useCreateOdontograma,
  useUpdateTooth,
  useToggleCampoInterferente,
  useUpdateOdontogramaObservaciones,
  useCerrarOdontograma,
} from './hooks/usePatients'

// Components
export * from './components'

// Pages
export { PatientsListPage, NewPatientPage, PatientDetailPage, EditPatientPage } from './pages'
