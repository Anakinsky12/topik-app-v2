import { useState, useRef, useEffect } from 'react'
import { useLang } from '../context/LanguageContext'
import { LANGUAGES } from '../i18n/translations'

export default function LangSwitcher() {
  const { lang, setLang } = useLang()
  const [open, setOpen] = useState(false)
  const ref = useRef(null)

  useEffect(() => {
    const close = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false) }
    document.addEventListener('mousedown', close)
    return () => document.removeEventListener('mousedown', close)
  }, [])

  const current = LANGUAGES.find(l => l.code === lang) || LANGUAGES[0]

  return (
    <div className="relative" ref={ref}>
      <button onClick={() => setOpen(o => !o)}
        className="flex items-center gap-1.5 px-2.5 h-8 rounded-lg border border-border1 hover:border-border2 transition-colors text-sm">
        <span>{current.flag}</span>
        <span className="font-medium text-xs uppercase tracking-wide text-text2">{current.code}</span>
      </button>

      {open && (
        <div className="absolute right-0 top-10 w-40 bg-bg2 border border-border1 rounded-xl overflow-hidden z-[80] shadow-xl">
          {LANGUAGES.map(l => (
            <button key={l.code}
              onClick={() => { setLang(l.code); setOpen(false) }}
              className={`w-full flex items-center gap-2.5 px-3.5 py-2.5 text-sm transition-colors ${
                l.code === lang ? 'bg-accent/12 text-accent font-semibold' : 'text-text1 hover:bg-bg3'
              }`}>
              <span className="text-base">{l.flag}</span>
              {l.label}
              {l.code === lang && <span className="ml-auto text-xs">✓</span>}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
