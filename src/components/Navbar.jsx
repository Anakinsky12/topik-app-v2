import { useState } from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import { LiveClock } from './Common'

// Sahifalar guruhlar bo'yicha (hamburger menyu uchun)
const GROUPS = [
  {
    title: 'Asosiy',
    links: [
      ['/', '🏠', 'Bosh'],
      ['/srs', '🧠', 'Aqlli takror (SRS)'],
      ['/stats', '📈', 'Statistika'],
      ['/plan', '📅', 'Kunlik reja'],
    ],
  },
  {
    title: 'O\'rganish',
    links: [
      ['/vocab', '📖', "Lug'at"],
      ['/flashcard', '🃏', 'Kartochka'],
      ['/grammar', '📝', 'Grammatika'],
      ['/dialogs', '💬', 'Dialoglar'],
      ['/phonetics', '🔤', 'Talaffuz'],
    ],
  },
  {
    title: 'Imtihon',
    links: [
      ['/reading', '📖', "O'qish mashqi"],
      ['/mock-test', '📊', 'Mock Test'],
      ['/gichul', '🎯', '기출문제'],
      ['/ai-writing', '✍️', 'AI Yozuv'],
    ],
  },
  {
    title: 'Boshqa',
    links: [
      ['/achievements', '🏆', 'Yutuqlar'],
      ['/profile', '👤', 'Profil'],
    ],
  },
]

// Pastki menyu — telefonда doim ko'rinadigan eng muhim 5 ta
const BOTTOM = [
  ['/', '🏠', 'Bosh'],
  ['/srs', '🧠', 'SRS'],
  ['/vocab', '📖', "Lug'at"],
  ['/grammar', '📝', 'Gram'],
  ['/stats', '📈', 'Stats'],
]

export default function Navbar() {
  const [open, setOpen] = useState(false)
  const loc = useLocation()

  // Hozirgi sahifa nomi (yuqorida ko'rsatish uchun)
  const allLinks = GROUPS.flatMap(g => g.links)
  const current = allLinks.find(([to]) => to === loc.pathname)

  return (
    <>
      {/* === Yuqori panel === */}
      <nav className="sticky top-0 z-50 bg-bg2 border-b border-border1 px-4 h-14 flex items-center justify-between">
        <button onClick={() => setOpen(true)}
          className="flex items-center gap-2 text-text1 hover:text-accent transition-colors">
          <span className="text-xl">☰</span>
          <span className="font-bold text-accent">📚 TOPIK</span>
        </button>

        {current && (
          <span className="text-sm text-text2 absolute left-1/2 -translate-x-1/2 hidden sm:block">
            {current[1]} {current[2]}
          </span>
        )}

        <LiveClock />
      </nav>

      {/* === Hamburger menyu (chap tomondan ochiladi) === */}
      {open && (
        <>
          <div className="fixed inset-0 bg-black/60 z-[60]" onClick={() => setOpen(false)} />
          <div className="fixed top-0 left-0 bottom-0 w-72 max-w-[80vw] bg-bg2 border-r border-border1 z-[70] overflow-y-auto animate-[slideIn_.2s_ease]">
            <div className="flex items-center justify-between p-4 border-b border-border1 sticky top-0 bg-bg2">
              <span className="font-bold text-accent">📚 TOPIK menyu</span>
              <button onClick={() => setOpen(false)} className="text-text2 hover:text-text1 text-xl">✕</button>
            </div>
            <div className="p-3">
              {GROUPS.map(group => (
                <div key={group.title} className="mb-4">
                  <div className="text-[11px] uppercase tracking-wide text-text2 px-3 mb-1">{group.title}</div>
                  {group.links.map(([to, icon, label]) => (
                    <NavLink key={to} to={to} end={to === '/'}
                      onClick={() => setOpen(false)}
                      className={({ isActive }) =>
                        `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors ${
                          isActive ? 'bg-accent/15 text-accent' : 'text-text1 hover:bg-bg3'
                        }`}>
                      <span className="text-lg">{icon}</span>
                      {label}
                    </NavLink>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </>
      )}

      {/* === Pastki menyu (telefonда doim ko'rinadi) === */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 bg-bg2 border-t border-border1 flex sm:hidden">
        {BOTTOM.map(([to, icon, label]) => (
          <NavLink key={to} to={to} end={to === '/'}
            className={({ isActive }) =>
              `flex-1 flex flex-col items-center justify-center py-2 text-[10px] gap-0.5 transition-colors ${
                isActive ? 'text-accent' : 'text-text2'
              }`}>
            <span className="text-lg">{icon}</span>
            {label}
          </NavLink>
        ))}
      </nav>

      <style>{`
        @keyframes slideIn { from { transform: translateX(-100%) } to { transform: translateX(0) } }
      `}</style>
    </>
  )
}
