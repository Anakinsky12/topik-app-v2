import { NavLink } from 'react-router-dom'

const LINKS = [
  ['/', '🏠 Bosh'],
  ['/vocab', "📖 Lug'at"],
  ['/flashcard', '🃏 Kartochka'],
  ['/grammar', '📝 Grammatika'],
  ['/mock-test', '📊 Mock Test'],
  ['/stats', '📈 Statistika'],
  ['/plan', '📅 Reja'],
  ['/profile', '👤 Profil'],
]

export default function Navbar() {
  return (
    <nav className="sticky top-0 z-50 bg-bg2 border-b border-border1 px-4 flex items-center gap-1 overflow-x-auto [scrollbar-width:none]">
      <span className="font-bold text-accent mr-3 py-4 whitespace-nowrap">📚 TOPIK</span>
      {LINKS.map(([to, label]) => (
        <NavLink key={to} to={to} end={to === '/'}
          className={({ isActive }) =>
            `px-3 py-4 text-sm whitespace-nowrap border-b-2 transition-colors ${
              isActive ? 'text-accent border-accent' : 'text-text2 border-transparent hover:text-text1'
            }`}>
          {label}
        </NavLink>
      ))}
    </nav>
  )
}
