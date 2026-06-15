import { useState } from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import { LiveClock } from './Common'

export default function Navbar() {
  const [open, setOpen] = useState(false)
  const loc = useLocation()

  const GROUPS = [
    { title: 'Asosiy', links: [
      ['/', '🏠', 'Bosh'],
      ['/srs', '🧠', 'Aqlli takrorlash'],
      ['/stats', '📈', 'Statistika'],
      ['/plan', '📅', 'Kunlik Reja'],
    ]},
    { title: "O'rganish", links: [
      ['/vocab', '📖', "Lug'at"],
      ['/flashcard', '🃏', 'Flashcard'],
      ['/learn', '🎴', 'Yodlash'],
      ['/grammar', '📝', 'Grammatika'],
      ['/dialogs', '💬', 'Dialoglar'],
      ['/phonetics', '🔤', 'Talaffuz'],
    ]},
    { title: 'Imtihon', links: [
      ['/reading', '📑', "O'qish mashqi"],
      ['/mock-test', '⏱️', 'Mock Test'],
      ['/gichul', '🎯', '기출문제'],
      ['/ai-writing', '✍️', 'AI Yozuv'],
    ]},
    { title: 'Boshqa', links: [
      ['/achievements', '🏆', 'Yutuqlar'],
      ['/profile', '👤', 'Profil'],
    ]},
  ]

  const BOTTOM = [
    ['/', '🏠', 'Bosh'],
    ['/srs', '🧠', 'SRS'],
    ['/vocab', '📖', "Lug'at"],
    ['/grammar', '📝', 'Grammatika'],
    ['/stats', '📈', 'Statistika'],
  ]

  const allLinks = GROUPS.flatMap(g => g.links)
  const current = allLinks.find(([to]) => to === loc.pathname)

  return (
    <>
      <nav className="sticky top-0 z-50 bg-bg/80 backdrop-blur-xl border-b border-border1 px-4 h-14 flex items-center justify-between">
        <button onClick={() => setOpen(true)}
          className="flex items-center gap-2.5 text-text1 hover:text-accent transition-colors">
          <span className="grid place-items-center w-8 h-8 rounded-lg border border-border1 hover:border-border2 transition-colors">
            <svg width="15" height="15" viewBox="0 0 15 15" fill="none"><path d="M2 4h11M2 7.5h11M2 11h11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>
          </span>
          <span className="font-bold tracking-tight text-accent">TOPIK</span>
        </button>

        {current && (
          <span className="text-sm text-text2 font-medium absolute left-1/2 -translate-x-1/2 hidden md:flex items-center gap-1.5">
            <span>{current[1]}</span> {current[2]}
          </span>
        )}

        <LiveClock />
      </nav>

      {open && (
        <>
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60]" onClick={() => setOpen(false)} />
          <div className="fixed top-0 left-0 bottom-0 w-72 max-w-[82vw] bg-bg2 border-r border-border1 z-[70] overflow-y-auto animate-[slideIn_.22s_cubic-bezier(0.16,1,0.3,1)]">
            <div className="flex items-center justify-between px-4 h-14 border-b border-border1 sticky top-0 bg-bg2/95 backdrop-blur-xl">
              <span className="font-bold tracking-tight text-accent">TOPIK {'menyu'}</span>
              <button onClick={() => setOpen(false)}
                className="grid place-items-center w-8 h-8 rounded-lg text-text2 hover:text-text1 hover:bg-bg3 transition-colors">✕</button>
            </div>
            <div className="p-3">
              {GROUPS.map(group => (
                <div key={group.title} className="mb-5">
                  <div className="text-[10px] uppercase tracking-[0.18em] text-text3 px-3 mb-1.5 font-semibold">{group.title}</div>
                  {group.links.map(([to, icon, label]) => (
                    <NavLink key={to} to={to} end={to === '/'}
                      onClick={() => setOpen(false)}
                      className={({ isActive }) =>
                        `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors ${
                          isActive ? 'bg-accent/12 text-accent font-semibold' : 'text-text1 hover:bg-bg3'
                        }`}>
                      <span className="text-base w-5 text-center">{icon}</span>
                      {label}
                    </NavLink>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </>
      )}

      <nav className="fixed bottom-0 left-0 right-0 z-50 bg-bg2/95 backdrop-blur-xl border-t border-border1 flex sm:hidden">
        {BOTTOM.map(([to, icon, label]) => (
          <NavLink key={to} to={to} end={to === '/'}
            className={({ isActive }) =>
              `flex-1 flex flex-col items-center justify-center py-2.5 text-[10px] gap-1 font-medium transition-colors ${
                isActive ? 'text-accent' : 'text-text3'
              }`}>
            <span className="text-base">{icon}</span>
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
