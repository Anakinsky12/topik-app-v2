import { useEffect, useMemo, useState } from 'react'
import { VOCAB } from '../data/vocab'
import { useWordProgress } from '../lib/useWordProgress'
import { supabase } from '../lib/supabase'
import { useAuth } from '../context/AuthContext'

function Bar({ label, value, total, color = 'from-accent to-accent2' }) {
  const pct = total ? Math.round(value / total * 100) : 0
  return (
    <div className="mb-3">
      <div className="flex justify-between text-sm mb-1">
        <span>{label}</span>
        <span className="text-text2">{value} / {total} ({pct}%)</span>
      </div>
      <div className="bg-bg3 rounded-full h-2 overflow-hidden">
        <div className={`bg-gradient-to-r ${color} h-full transition-all`} style={{ width: `${pct}%` }} />
      </div>
    </div>
  )
}

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
    const lv = { '3-4': { total: 0, known: 0 }, '5-6': { total: 0, known: 0 } }
    for (const w of VOCAB) {
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

  return (
    <div className="max-w-3xl mx-auto p-5">
      <h1 className="text-2xl font-bold mb-5">📈 Statistika</h1>

      <div className="bg-bg2 border border-border1 rounded-xl p-5 mb-5 text-center">
        <div className="text-sm text-text2 mb-1">🎯 Lug'at bo'yicha tayyorgarlik</div>
        <div className="text-4xl font-bold text-accent">{readiness}%</div>
        <div className="text-xs text-text2 mt-1">{knownCount} / {VOCAB.length} so'z o'rganildi</div>
      </div>

      <div className="bg-bg2 border border-border1 rounded-xl p-5 mb-5">
        <h2 className="font-semibold mb-4">📊 Daraja bo'yicha</h2>
        <Bar label="3-4 daraja" value={byLevel['3-4'].known} total={byLevel['3-4'].total} color="from-yellow to-yellow" />
        <Bar label="5-6 daraja" value={byLevel['5-6'].known} total={byLevel['5-6'].total} />
      </div>

      <div className="bg-bg2 border border-border1 rounded-xl p-5 mb-5">
        <h2 className="font-semibold mb-4">📖 Kategoriyalar bo'yicha</h2>
        {byCat.map(([cat, v]) => (
          <Bar key={cat} label={cat} value={v.known} total={v.total} />
        ))}
      </div>

      <div className="bg-bg2 border border-border1 rounded-xl p-5">
        <h2 className="font-semibold mb-4">🏆 Mock Test tarixi</h2>
        {tests.length === 0 ? (
          <p className="text-text2 text-sm">Hali test topshirmadingiz.</p>
        ) : tests.map(t => (
          <div key={t.id} className="flex justify-between items-center py-2 border-b border-border1 last:border-0 text-sm">
            <span className="text-text2">{new Date(t.taken_at).toLocaleDateString('uz')}</span>
            <span className="font-semibold">
              {t.score} / {t.total}
              <span className={`ml-2 ${t.score / t.total >= 0.6 ? 'text-green' : 'text-red'}`}>
                ({Math.round(t.score / t.total * 100)}%)
              </span>
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}
