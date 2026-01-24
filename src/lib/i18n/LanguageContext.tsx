import { createContext, useContext, useState, useEffect } from 'react'
import type { ReactNode } from 'react'
import { translations } from './translations'
import type { Language } from './translations'

type Translations = typeof translations.es

interface LanguageContextType {
  language: Language
  setLanguage: (lang: Language) => void
  t: Translations
}

const LanguageContext = createContext<LanguageContextType | null>(null)

const LANGUAGE_STORAGE_KEY = 'dientes-organos-language'

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>(() => {
    // Intentar obtener idioma guardado
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem(LANGUAGE_STORAGE_KEY)
      if (saved === 'es' || saved === 'en') {
        return saved
      }
      // Detectar idioma del navegador
      const browserLang = navigator.language.slice(0, 2)
      return browserLang === 'en' ? 'en' : 'es'
    }
    return 'es'
  })

  const setLanguage = (lang: Language) => {
    setLanguageState(lang)
    localStorage.setItem(LANGUAGE_STORAGE_KEY, lang)
  }

  useEffect(() => {
    // Actualizar atributo lang del documento
    document.documentElement.lang = language
  }, [language])

  const t = translations[language] as Translations

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  const context = useContext(LanguageContext)
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider')
  }
  return context
}

// Hook para obtener solo las traducciones (útil para componentes que no cambian idioma)
export function useTranslations() {
  const { t } = useLanguage()
  return t
}
