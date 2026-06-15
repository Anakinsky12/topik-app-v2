import { createContext, useContext, useEffect, useState } from 'react'
import { TRANSLATIONS } from '../i18n/translations'

const LanguageContext = createContext(null)

// localStorage o'rniga oddiy o'zgaruvchi (artifact cheklovi yo'q, lekin xavfsiz)
function getInitialLang() {
  try {
    const saved = window.localStorage?.getItem('topik_lang')
    if (saved && TRANSLATIONS[saved]) return saved
  } catch {}
  // Brauzer tiliga qarab taxmin
  const nav = navigator.language?.slice(0, 2)
  if (nav === 'ko') return 'ko'
  if (nav === 'en') return 'en'
  return 'uz'
}

export function LanguageProvider({ children }) {
  const [lang, setLangState] = useState(getInitialLang)

  const setLang = (l) => {
    if (!TRANSLATIONS[l]) return
    setLangState(l)
    try { window.localStorage?.setItem('topik_lang', l) } catch {}
  }

  // t() — tarjima funksiyasi. Topilmasa o'zbekchaga, keyin key'ga qaytadi
  const t = (key) => TRANSLATIONS[lang]?.[key] ?? TRANSLATIONS.uz[key] ?? key

  useEffect(() => {
    document.documentElement.lang = lang
  }, [lang])

  return (
    <LanguageContext.Provider value={{ lang, setLang, t }}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLang() {
  const ctx = useContext(LanguageContext)
  if (!ctx) throw new Error('useLang must be used within LanguageProvider')
  return ctx
}
