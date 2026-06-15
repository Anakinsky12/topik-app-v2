import { useMemo, useState } from 'react'
import { GRAMMAR } from '../data/grammar'
import { SpeakButton } from '../components/Common'

const LEVEL_STYLE = {
  '3-4': 'bg-yellow/12 text-yellow',
  '5-6': 'bg-accent/15 text-accent',
}

function GrammarCard({ g }) {
  const [open, setOpen] = useState(false)
  return (
    <div className="bg-bg2 border border-border1 rounded-xl overflow-hidden hover:border-border2 transition-colors">
      <button onClick={() => setOpen(o => !o)} className="w-full text-left p-4">
        <div className="flex items-center gap-2 mb-1.5">
          <span className="text-accent font-bold text-[15px]">{g.pattern}</span>
          <span className={`tabular text-[10px] px-1.5 py-0.5 rounded font-bold ${LEVEL_STYLE[g.level] || 'bg-bg3 text-text2'}`}>{g.level}</span>
          <span className={`ml-auto text-text3 text-xs transition-transform ${open ? 'rotate-180' : ''}`}>▾</span>
        </div>
        <div className="text-sm font-medium">{g.meaning}</div>
      </button>

      {open && (
        <div className="px-4 pb-4 fade-up">
          {g.note && (
            <div className="text-[13px] text-text2 leading-relaxed bg-bg3/50 rounded-lg p-3 mb-3 border border-border1">
              {g.note}
            </div>
          )}
          <div className="space-y-2.5">
            {g.examples?.map((ex, i) => (
              <div key={i} className="flex gap-2.5">
                <span className="tabular text-[10px] text-text3 font-bold mt-1 shrink-0">{i + 1}</span>
                <div className="min-w-0">
                  <div className="text-sm text-text1 flex items-center gap-1.5">
                    {ex.k} <SpeakButton text={ex.k} />
                  </div>
                  <div className="text-[13px] text-text2">{ex.u}</div>
                </div>
              </div>
            ))}
          </div>
          {g.usage && (
            <div className="text-[11px] text-text3 mt-3 pt-3 border-t border-border1 font-mono">
              {g.usage}
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default function GrammarPage() {
  const [filter, setFilter] = useState('all')
  const [search, setSearch] = useState('')

  const FILTERS = [['all', 'Hammasi'], ['3-4', '3-4급'], ['5-6', '5-6급']]

  const filtered = useMemo(() => {
    let list = GRAMMAR
    if (filter !== 'all') list = list.filter(g => g.level === filter)
    if (search.trim()) {
      const q = search.toLowerCase()
      list = list.filter(g => g.pattern.includes(q) || g.meaning.toLowerCase().includes(q))
    }
    return list
  }, [filter, search])

  return (
    <div className="max-w-3xl mx-auto px-5 py-8 fade-up">
      <div className="mb-6">
        <div className="text-[11px] uppercase tracking-[0.2em] text-text3 mb-2 font-semibold">{'Grammatika'}</div>
        <div className="flex items-baseline gap-3">
          <h1 className="text-3xl font-bold tracking-tight">{'Pattern'}</h1>
          <span className="tabular text-text2 text-sm">{GRAMMAR.length}</span>
        </div>
        <p className="text-text2 text-sm mt-1.5">{"Har bir patternni bosib, batafsil izoh va misollarni ko\'ring"}</p>
      </div>

      <div className="sticky top-14 z-30 -mx-5 px-5 py-3 bg-bg/85 backdrop-blur-xl border-b border-border1 mb-5">
        <input
          value={search} onChange={e => setSearch(e.target.value)}
          placeholder={"Pattern yoki ma'no qidiring…"}
          className="w-full bg-bg2 border border-border1 rounded-lg px-4 py-2.5 text-sm mb-2.5 focus:outline-none focus:border-accent transition-colors placeholder:text-text3"
        />
        <div className="flex flex-wrap gap-1.5">
          {FILTERS.map(([key, label]) => (
            <button key={key} onClick={() => setFilter(key)}
              className={`px-3 py-1.5 rounded-md text-[13px] font-medium border transition-colors ${
                filter === key ? 'bg-accent text-white border-accent' : 'bg-bg2 text-text2 border-border1 hover:border-border2 hover:text-text1'
              }`}>{label}</button>
          ))}
        </div>
      </div>

      <div className="space-y-2.5">
        {filtered.map(g => <GrammarCard key={g.id} g={g} />)}
      </div>
    </div>
  )
}
