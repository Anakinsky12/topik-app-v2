import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { VOCAB } from '../data/vocab'
import { GRAMMAR } from '../data/grammar'
import { useWordProgress } from '../lib/useWordProgress'
import { useSRS } from '../lib/useSRS'

const FEATURES = [
  { to: '/srs', icon: '🧠', title: 'Aqlli takrorlash', sub: 'SRS — eng samarali yodlash', hot: true },
  { to: '/vocab', icon: '📖', title: "Lug'at", sub: "1000 ta so'z, audio bilan" },
  { to: '/flashcard', icon: '🃏', title: 'Flashcard', sub: 'Bildim / Bilmadim' },
  { to: '/grammar', icon: '📝', title: 'Grammatika', sub: '100+ pattern' },
  { to: '/dialogs', icon: '💬', title: 'Dialoglar', sub: '20 hayotiy suhbat' },
  { to: '/phonetics', icon: '🔤', title: 'Talaffuz', sub: 'Fonetik qoidalar' },
  { to: '/reading', icon: '📖', title: "O'qish mashqi", sub: '11 matn + savollar' },
  { to: '/mock-test', icon: '📊', title: 'Mock Test', sub: 'Vaqtli imtihon' },
  { to: '/gichul', icon: '🎯', title: '기출문제', sub: 'Real imtihonlar' },
  { to: '/ai-writing', icon: '✍️', title: 'AI Yozuv', sub: 'AI baholaydi', hot: true },
  { to: '/stats', icon: '📈', title: 'Statistika', sub: 'Progress tahlili' },
  { to: '/achievements', icon: '🏆', title: 'Yutuqlar', sub: 'Gamifikatsiya' },
  { to: '/plan', icon: '📅', title: 'Kunlik Reja', sub: 'Streak va vazifalar' },
]

export default function Dashboard() {
  const { user } = useAuth()
  const { knownCount } = useWordProgress()
  const { dueCount, masteredCount } = useSRS()
  const name = user?.user_metadata?.full_name || user?.email?.split('@')[0] || ''
  const pct = Math.round(knownCount / VOCAB.length * 100)

  return (
    <div className="max-w-5xl mx-auto p-5">
      <h1 className="text-2xl font-bold mb-1">Xush kelibsiz, {name}! 👋</h1>
      <p className="text-text2 text-sm mb-5">
        {VOCAB.length} so'z · {GRAMMAR.length} grammatika · 20 dialog — hammasi cloud'da
      </p>

      {dueCount > 0 && (
        <Link to="/srs" className="block bg-gradient-to-r from-accent/20 to-accent2/20 border border-accent/40 rounded-xl p-4 mb-5 hover:-translate-y-0.5 transition-transform">
          <div className="flex items-center justify-between">
            <div>
              <div className="font-bold">🧠 Bugun {dueCount} ta so'z takrorlash kerak</div>
              <div className="text-xs text-text2 mt-0.5">Aqlli takrorlash mashqini boshlang →</div>
            </div>
            <span className="text-2xl">→</span>
          </div>
        </Link>
      )}

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-5">
        {[
          [VOCAB.length, "Jami so'zlar"],
          [knownCount, "O'rganildi"],
          [masteredCount, "Mukammal 🧠"],
          [`${pct}%`, 'Progress'],
        ].map(([num, label]) => (
          <div key={label} className="bg-bg2 border border-border1 rounded-xl p-4 text-center">
            <div className="text-2xl font-bold text-accent">{num}</div>
            <div className="text-xs text-text2 mt-1">{label}</div>
          </div>
        ))}
      </div>

      <div className="bg-bg3 rounded-full h-2 overflow-hidden mb-7">
        <div className="bg-gradient-to-r from-accent to-accent2 h-full transition-all" style={{ width: `${pct}%` }} />
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {FEATURES.map(f => (
          <Link key={f.to} to={f.to}
            className="relative bg-bg2 border border-border1 rounded-xl p-5 hover:border-accent hover:-translate-y-0.5 transition-all">
            {f.hot && <span className="absolute top-3 right-3 text-[10px] bg-accent text-white px-2 py-0.5 rounded-full font-bold">YANGI</span>}
            <div className="text-2xl mb-2">{f.icon}</div>
            <div className="font-semibold">{f.title}</div>
            <div className="text-xs text-text2 mt-1">{f.sub}</div>
          </Link>
        ))}
      </div>
    </div>
  )
}
