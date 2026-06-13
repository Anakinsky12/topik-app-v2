import { useMemo, useState } from 'react'
import { GRAMMAR } from '../data/grammar'

export default function GrammarPage() {
  const [filter, setFilter] = useState('all')
  const [search, setSearch] = useState('')

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
    <div className="max-w-5xl mx-auto p-5">
      <h1 className="text-2xl font-bold mb-4">📝 Grammatika ({GRAMMAR.length} ta pattern)</h1>

      <div className="flex flex-wrap gap-2 mb-4 items-center">
        <input
          value={search} onChange={e => setSearch(e.target.value)}
          placeholder="Pattern yoki ma'no qidirish..."
          className="flex-1 min-w-52 bg-bg2 border border-border1 rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-accent"
        />
        {[['all', 'Hammasi'], ['3-4', '3-4 daraja'], ['5-6', '5-6 daraja']].map(([key, label]) => (
          <button key={key} onClick={() => setFilter(key)}
            className={`px-3.5 py-2 rounded-lg text-sm border ${
              filter === key ? 'bg-accent text-white border-accent' : 'bg-bg2 text-text2 border-border1 hover:border-accent'
            }`}>{label}</button>
        ))}
      </div>

      <div className="grid md:grid-cols-2 gap-3">
        {filtered.map(g => (
          <div key={g.id} className="bg-bg2 border border-border1 rounded-xl p-4 hover:border-accent transition-colors">
            <div className="text-accent font-bold">{g.pattern}</div>
            <span className={`inline-block mt-1 mb-2 text-[11px] px-2 py-0.5 rounded-full font-semibold ${
              g.level === '3-4' ? 'bg-yellow/15 text-yellow' : 'bg-accent/15 text-accent'
            }`}>{g.level}</span>
            <div className="text-sm mb-2">{g.meaning}</div>
            <div className="text-[13px] border-t border-border1 pt-2">
              <div>{g.ex}</div>
              <div className="text-text2">{g.exUz}</div>
            </div>
            {g.usage && <div className="text-xs text-accent2 italic mt-2">{g.usage}</div>}
          </div>
        ))}
      </div>
    </div>
  )
}
