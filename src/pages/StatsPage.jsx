import { useEffect, useMemo, useState } from 'react'
import { VOCAB } from '../data/vocab'
import { useWordProgress } from '../lib/useWordProgress'
import { supabase } from '../lib/supabase'
import { useAuth } from '../context/AuthContext'

function Bar({ label, value, total, accent = 'bg-accent' }) {
  const pct = total ? Math.round(value / total * 100) : 0
  return (
    <div className="mb-3.5 last:mb-0">
      <div className="flex justify-between text-sm mb-1.5">
        <span className="font-medium">{label}</span>
        <span className="tabular text-text2">{value} / {total} <span className="text-text3">({pct}%)</span></span>
      </div>
      <div className="bg-bg3 rounded-full h-1.5 overflow-hidden">
        <div className={`${accent} h-full rounded-full transition-all duration-500`} style={{ width: `${pct}%` }} />
      </div>
    </div>
  )
}

const LEVEL_ACCENT = { '1-2': 'bg-green', '3-4': 'bg-yellow', '5-6': 'bg-accent' }

export default function StatsPage() {
  const { user } = useAuth()
  const { progress, knownCount } = useWordProgress()
  const [tests, setTests] = useState([])

  useEffect(() => {
    if (!user) return
    supabase.from('test_history').select('*').eq('user_id', user.id)
      .order('taken_at', { ascending: false }).limit(10)
      .then(({ data }) => setTests(data ?? []))
  }, [user])

  const byLevel = useMemo(() => {
    const lv = {
      '1-2': { total: 0, known: 0 },
      '3-4': { total: 0, known: 0 },
      '5-6': { total: 0, known: 0 },
    }
    for (const w of VOCAB) {
      if (!lv[w.l]) lv[w.l] = { total: 0, known: 0 }
      lv[w.l].total++
      if (progress[w.id] === 'known') lv[w.l].known++
    }
    return lv
  }, [progress])

  const byCat = useMemo(() => {
    const cats = {}
    for (const w of VOCAB) {
      const c = w.c || 'boshqa'
      cats[c] ??= { total: 0, known: 0 }
      cats[c].total++
      if (progress[w.id] === 'known') cats[c].known++
    }
    return Object.entries(cats).sort((a, b) => b[1].total - a[1].total).slice(0, 12)
  }, [progress])

  const readiness = Math.round(knownCount / VOCAB.length * 100)
  const masteredTests = tests.filter(t => t.score / t.total >= 0.6).length

  return (
    <div className="max-w-3xl mx-auto px-5 py-8 fade-up">
      <div className="mb-6">
        <div className="text-[11px] uppercase tracking-[0.2em] text-text3 mb-2 font-semibold">Kuzatuv</div>
        <h1 className="text-3xl font-bold tracking-tight">Statistika</h1>
      </div>

      {/* Tayyorgarlik — katta raqam */}
      <div className="bg-bg2 border border-border1 rounded-2xl p-6 mb-4 text-center">
        <div className="text-[11px] uppercase tracking-wider text-text3 mb-2 font-semibold">Lug'at tayyorgarligi</div>
        <div className="tabular text-5xl font-bold text-accent">{readiness}<span className="text-3xl text-text2">%</span></div>
        <div className="tabular text-xs text-text2 mt-2">{knownCount} / {VOCAB.length} so'z o'rganildi</div>
      </div>

      {/* Daraja */}
      <div className="bg-bg2 border border-border1 rounded-2xl p-5 mb-4">
        <h2 className="text-[11px] uppercase tracking-[0.2em] text-text3 mb-4 font-semibold">Daraja bo'yicha</h2>
        {Object.entries(byLevel).map(([lvl, v]) => (
          <Bar key={lvl} label={`${lvl}급`} value={v.known} total={v.total} accent={LEVEL_ACCENT[lvl] || 'bg-accent'} />
        ))}
      </div>

      {/* Kategoriyalar */}
      <div className="bg-bg2 border border-border1 rounded-2xl p-5 mb-4">
        <h2 className="text-[11px] uppercase tracking-[0.2em] text-text3 mb-4 font-semibold">Kategoriyalar bo'yicha</h2>
        {byCat.map(([cat, v]) => (
          <Bar key={cat} label={cat} value={v.known} total={v.total} />
        ))}
      </div>

      {/* Mock test tarixi */}
      <div className="bg-bg2 border border-border1 rounded-2xl p-5">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-[11px] uppercase tracking-[0.2em] text-text3 font-semibold">Mock test tarixi</h2>
          {tests.length > 0 && (
            <span className="tabular text-xs text-text2">{masteredTests}/{tests.length} o'tdi</span>
          )}
        </div>
        {tests.length === 0 ? (
          <p className="text-text2 text-sm">Hali test topshirmadingiz. Birinchi mock testdan boshlang.</p>
        ) : tests.map(t => (
          <div key={t.id} className="flex justify-between items-center py-2.5 border-b border-border1 last:border-0 text-sm">
            <span className="tabular text-text2">{new Date(t.taken_at).toLocaleDateString('uz')}</span>
            <span className="tabular font-semibold">
              {t.score} / {t.total}
              <span className={`ml-2 ${t.score / t.total >= 0.6 ? 'text-green' : 'text-red'}`}>
                {Math.round(t.score / t.total * 100)}%
              </span>
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}
