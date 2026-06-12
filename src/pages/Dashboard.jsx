import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { VOCAB } from '../data/vocab'
import { GRAMMAR } from '../data/grammar'
import { useWordProgress } from '../lib/useWordProgress'

const FEATURES = [
  { to: '/vocab', icon: '📖', title: "Lug'at", sub: "1000 ta so'z, 3-4 va 5-6 daraja" },
  { to: '/flashcard', icon: '🃏', title: 'Flashcard', sub: 'Bildim / Bilmadim tizimi' },
  { to: '/grammar', icon: '📝', title: 'Grammatika', sub: '100 ta pattern + misollar' },
  { to: '/mock-test', icon: '📊', title: 'Mock Test', sub: 'Vaqtli imtihon simulyatsiyasi' },
  { to: '/stats', icon: '📈', title: 'Statistika', sub: 'Progress tahlili' },
  { to: '/plan', icon: '📅', title: 'Kunlik Reja', sub: 'Streak va vazifalar' },
]

export default function Dashboard() {
  const { user } = useAuth()
  const { knownCount } = useWordProgress()
  const name = user?.user_metadata?.full_name || user?.email?.split('@')[0] || ''
  const pct = Math.round(knownCount / VOCAB.length * 100)

  return (
    <div className="max-w-5xl mx-auto p-5">
      <h1 className="text-2xl font-bold mb-1">Xush kelibsiz, {name}! 👋</h1>
      <p className="text-text2 text-sm mb-6">
        {VOCAB.length} so'z · {GRAMMAR.length} grammatika · 20 dialog — hammasi cloud'da
      </p>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-5">
        {[
          [VOCAB.length, "Jami so'zlar"],
          [knownCount, "O'rganildi"],
          [GRAMMAR.length, 'Grammatika'],
          [`${pct}%`, 'Progress'],
        ].map(([num, label]) => (
          <div key={label} className="bg-bg2 border border-border1 rounded-xl p-4 text-center">
            <div className="text-2xl font-bold text-accent">{num}</div>
            <div className="text-xs text-text2 mt-1">{label}</div>
          </div>
        ))}
      </div>

      <div className="bg-bg3 rounded-full h-2 overflow-hidden mb-7">
        <div className="bg-gradient-to-r from-accent to-accent2 h-full transition-all"
          style={{ width: `${pct}%` }} />
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {FEATURES.map(f => (
          <Link key={f.to} to={f.to}
            className="bg-bg2 border border-border1 rounded-xl p-5 hover:border-accent hover:-translate-y-0.5 transition-all">
            <div className="text-2xl mb-2">{f.icon}</div>
            <div className="font-semibold">{f.title}</div>
            <div className="text-xs text-text2 mt-1">{f.sub}</div>
          </Link>
        ))}
      </div>
    </div>
  )
}
