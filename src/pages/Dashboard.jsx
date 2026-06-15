import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { VOCAB } from '../data/vocab'
import { useWordProgress } from '../lib/useWordProgress'
import { useSRS } from '../lib/useSRS'

export default function Dashboard() {
  const { user } = useAuth()
  const { knownCount } = useWordProgress()
  const { dueCount, masteredCount } = useSRS()
  const name = user?.user_metadata?.full_name || user?.email?.split('@')[0] || ''
  const pct = Math.round(knownCount / VOCAB.length * 100)

  const GROUPS = [
    { label: 'Mashq', items: [
      { to: '/srs', icon: '🧠', title: 'Aqlli takrorlash', sub: 'Aqlli takrorlash — eng samarali usul', hot: true },
      { to: '/vocab', icon: '📖', title: "Lug'at", sub: "So'zlar" },
      { to: '/flashcard', icon: '🃏', title: 'Flashcard', sub: 'Bildim / Bilmadim' },
    ]},
    { label: 'Materiallar', items: [
      { to: '/grammar', icon: '📝', title: 'Grammatika', sub: 'Pattern' },
      { to: '/dialogs', icon: '💬', title: 'Dialoglar', sub: '' },
      { to: '/phonetics', icon: '🔤', title: 'Talaffuz', sub: '' },
    ]},
    { label: 'Imtihon', items: [
      { to: '/reading', icon: '📑', title: "O'qish mashqi", sub: '' },
      { to: '/mock-test', icon: '⏱️', title: 'Mock Test', sub: '' },
      { to: '/gichul', icon: '🎯', title: '기출문제', sub: '' },
      { to: '/ai-writing', icon: '✍️', title: 'AI Yozuv', sub: '', hot: true },
    ]},
    { label: 'Kuzatuv', items: [
      { to: '/stats', icon: '📈', title: 'Statistika', sub: '' },
      { to: '/achievements', icon: '🏆', title: 'Yutuqlar', sub: '' },
      { to: '/plan', icon: '📅', title: 'Kunlik Reja', sub: '' },
    ]},
  ]

  return (
    <div className="max-w-5xl mx-auto px-5 py-8 fade-up">
      <div className="mb-8">
        <div className="text-[11px] uppercase tracking-[0.2em] text-text3 mb-2 font-semibold">TOPIK II · 한국어</div>
        <h1 className="text-3xl font-bold tracking-tight">{'Salom'}, {name}</h1>
        <p className="text-text2 text-sm mt-1.5">{"Bugun o'rganishni davom ettiramizmi?"}</p>
      </div>

      {dueCount > 0 && (
        <Link to="/srs"
          className="group flex items-center justify-between bg-accent2/10 border border-accent/30 rounded-2xl px-5 py-4 mb-8 hover:bg-accent2/15 transition-colors">
          <div className="flex items-center gap-4">
            <div className="w-11 h-11 rounded-xl bg-accent/15 grid place-items-center text-xl shrink-0">🧠</div>
            <div>
              <div className="font-semibold text-[15px]"><span className="tabular text-accent">{dueCount}</span> {"ta so\'z takrorlash kerak"}</div>
              <div className="text-xs text-text2 mt-0.5">{'Aqlli takrorlash — eng samarali usul'}</div>
            </div>
          </div>
          <span className="text-text3 group-hover:text-accent group-hover:translate-x-0.5 transition-all text-lg">→</span>
        </Link>
      )}

      <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-border1 rounded-2xl overflow-hidden mb-3">
        {[
          [VOCAB.length, "Jami so'z"],
          [knownCount, "O'rganildi"],
          [masteredCount, 'Mukammal'],
          [`${pct}%`, 'Progress'],
        ].map(([num, label]) => (
          <div key={label} className="bg-bg2 px-4 py-5 text-center">
            <div className="tabular text-2xl font-bold text-text1">{num}</div>
            <div className="text-[11px] uppercase tracking-wider text-text3 mt-1.5 font-semibold">{label}</div>
          </div>
        ))}
      </div>

      <div className="flex items-center gap-3 mb-10 px-1">
        <div className="flex-1 bg-bg3 rounded-full h-1.5 overflow-hidden">
          <div className="bg-accent h-full rounded-full transition-all duration-700" style={{ width: `${pct}%` }} />
        </div>
        <span className="tabular text-xs text-text2 font-semibold">{knownCount}/{VOCAB.length}</span>
      </div>

      <div className="space-y-8">
        {GROUPS.map(group => (
          <section key={group.label}>
            <h2 className="text-[11px] uppercase tracking-[0.2em] text-text3 mb-3 font-semibold px-1">{group.label}</h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
              {group.items.map(f => (
                <Link key={f.to} to={f.to}
                  className="group relative flex items-center gap-3.5 bg-bg2 border border-border1 rounded-xl p-4 hover:border-border2 hover:bg-bg3 transition-all">
                  <div className="w-10 h-10 rounded-lg bg-bg3 group-hover:bg-bg border border-border1 grid place-items-center text-lg shrink-0 transition-colors">{f.icon}</div>
                  <div className="min-w-0 flex-1">
                    <div className="font-semibold text-sm flex items-center gap-2">
                      {f.title}
                      {f.hot && <span className="w-1.5 h-1.5 rounded-full bg-accent shrink-0" />}
                    </div>
                    {f.sub && <div className="text-xs text-text2 mt-0.5 truncate">{f.sub}</div>}
                  </div>
                  <span className="text-text3 group-hover:text-text2 transition-colors">→</span>
                </Link>
              ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  )
}
