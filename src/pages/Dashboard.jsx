import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useLang } from '../context/LanguageContext'
import { VOCAB } from '../data/vocab'
import { useWordProgress } from '../lib/useWordProgress'
import { useSRS } from '../lib/useSRS'

export default function Dashboard() {
  const { user } = useAuth()
  const { t } = useLang()
  const { knownCount } = useWordProgress()
  const { dueCount, masteredCount } = useSRS()
  const name = user?.user_metadata?.full_name || user?.email?.split('@')[0] || ''
  const pct = Math.round(knownCount / VOCAB.length * 100)

  const GROUPS = [
    { label: t('groupPractice'), items: [
      { to: '/srs', icon: '🧠', title: t('srs'), sub: t('srsHint'), hot: true },
      { to: '/vocab', icon: '📖', title: t('vocab'), sub: t('vocabSub') },
      { to: '/flashcard', icon: '🃏', title: t('flashcard'), sub: 'Bildim / Bilmadim' },
    ]},
    { label: t('groupMaterials'), items: [
      { to: '/grammar', icon: '📝', title: t('grammar'), sub: t('grammarSub') },
      { to: '/dialogs', icon: '💬', title: t('dialogs'), sub: '' },
      { to: '/phonetics', icon: '🔤', title: t('phonetics'), sub: '' },
    ]},
    { label: t('groupExam'), items: [
      { to: '/reading', icon: '📑', title: t('reading'), sub: '' },
      { to: '/mock-test', icon: '⏱️', title: t('mockTest'), sub: '' },
      { to: '/gichul', icon: '🎯', title: t('gichul'), sub: '' },
      { to: '/ai-writing', icon: '✍️', title: t('aiWriting'), sub: '', hot: true },
    ]},
    { label: t('groupTrack'), items: [
      { to: '/stats', icon: '📈', title: t('stats'), sub: '' },
      { to: '/achievements', icon: '🏆', title: t('achievements'), sub: '' },
      { to: '/plan', icon: '📅', title: t('plan'), sub: '' },
    ]},
  ]

  return (
    <div className="max-w-5xl mx-auto px-5 py-8 fade-up">
      <div className="mb-8">
        <div className="text-[11px] uppercase tracking-[0.2em] text-text3 mb-2 font-semibold">TOPIK II · 한국어</div>
        <h1 className="text-3xl font-bold tracking-tight">{t('greeting')}, {name}</h1>
        <p className="text-text2 text-sm mt-1.5">{t('dashSub')}</p>
      </div>

      {dueCount > 0 && (
        <Link to="/srs"
          className="group flex items-center justify-between bg-accent2/10 border border-accent/30 rounded-2xl px-5 py-4 mb-8 hover:bg-accent2/15 transition-colors">
          <div className="flex items-center gap-4">
            <div className="w-11 h-11 rounded-xl bg-accent/15 grid place-items-center text-xl shrink-0">🧠</div>
            <div>
              <div className="font-semibold text-[15px]"><span className="tabular text-accent">{dueCount}</span> {t('srsDue')}</div>
              <div className="text-xs text-text2 mt-0.5">{t('srsHint')}</div>
            </div>
          </div>
          <span className="text-text3 group-hover:text-accent group-hover:translate-x-0.5 transition-all text-lg">→</span>
        </Link>
      )}

      <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-border1 rounded-2xl overflow-hidden mb-3">
        {[
          [VOCAB.length, t('totalWords')],
          [knownCount, t('learned')],
          [masteredCount, t('mastered')],
          [`${pct}%`, t('progress')],
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
