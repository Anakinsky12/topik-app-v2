import { useMemo, useState } from 'react'
import { VOCAB } from '../data/vocab'
import { useWordProgress } from '../lib/useWordProgress'
import { SpeakButton } from '../components/Common'

const PER_PAGE = 30
const FILTERS = [
  ['all', 'Hammasi'],
  ['1-2', '1-2 daraja'],
  ['3-4', '3-4 daraja'],
  ['5-6', '5-6 daraja'],
  ['learned', "✅ O'rganildi"],
  ['rest', '🔖 Qolgan'],
]

export default function VocabPage() {
  const { progress, toggleLearned, knownCount } = useWordProgress()
  const [filter, setFilter] = useState('all')
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)

  const filtered = useMemo(() => {
    let list = VOCAB
    if (filter === '1-2' || filter === '3-4' || filter === '5-6') list = list.filter(w => w.l === filter)
    if (filter === 'learned') list = list.filter(w => progress[w.id] === 'known')
    if (filter === 'rest') list = list.filter(w => progress[w.id] !== 'known')
    if (search.trim()) {
      const q = search.toLowerCase()
      list = list.filter(w =>
        w.word.includes(q) || w.m.toLowerCase().includes(q) || (w.c ?? '').includes(q))
    }
    return list
  }, [filter, search, progress])

  const pages = Math.max(1, Math.ceil(filtered.length / PER_PAGE))
  const cur = Math.min(page, pages)
  const slice = filtered.slice((cur - 1) * PER_PAGE, cur * PER_PAGE)

  return (
    <div className="max-w-5xl mx-auto p-5">
      <h1 className="text-2xl font-bold mb-1">📖 Lug'at ({VOCAB.length})</h1>
      <p className="text-text2 text-sm mb-4">O'rganilgan: {knownCount} / {VOCAB.length}</p>

      <div className="flex flex-wrap gap-2 mb-4 items-center">
        <input
          value={search}
          onChange={e => { setSearch(e.target.value); setPage(1) }}
          placeholder="Qidirish (so'z, ma'no, kategoriya)..."
          className="flex-1 min-w-52 bg-bg2 border border-border1 rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-accent"
        />
        {FILTERS.map(([key, label]) => (
          <button key={key}
            onClick={() => { setFilter(key); setPage(1) }}
            className={`px-3.5 py-2 rounded-lg text-sm border transition-colors ${
              filter === key
                ? 'bg-accent text-white border-accent'
                : 'bg-bg2 text-text2 border-border1 hover:border-accent'
            }`}>
            {label}
          </button>
        ))}
      </div>

      {slice.length === 0 ? (
        <div className="text-center py-16 text-text2">
          <div className="text-4xl mb-3">🔍</div>
          Hech narsa topilmadi
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {slice.map(w => {
            const learned = progress[w.id] === 'known'
            return (
              <div key={w.id}
                className={`relative bg-bg2 border rounded-xl p-4 transition-all hover:-translate-y-0.5 ${
                  learned ? 'border-green bg-green/5' : 'border-border1 hover:border-accent'
                }`}>
                <button
                  onClick={() => toggleLearned(w.id)}
                  className="absolute top-3 right-3 text-lg hover:scale-125 transition-transform"
                  title={learned ? "O'rganilganlardan olib tashlash" : "O'rganildi deb belgilash"}>
                  {learned ? '✅' : '⬜'}
                </button>
                <div className="pr-8">
                  <span className="text-lg font-bold">{w.word}</span> <SpeakButton text={w.word} />
                  <span className={`ml-2 text-[11px] px-2 py-0.5 rounded-full font-semibold ${
                    w.l === '1-2' ? 'bg-green-500/15 text-green-400' :
                    w.l === '3-4' ? 'bg-yellow/15 text-yellow' : 'bg-accent/15 text-accent'
                  }`}>{w.l}</span>
                </div>
                <div className="text-text2 text-sm mt-1">{w.m}</div>
                {w.e && (
                  <div className="text-[13px] mt-2 pt-2 border-t border-border1">
                    <div>{w.e}</div>
                    <div className="text-text2">{w.u}</div>
                  </div>
                )}
                {w.c && <div className="text-[11px] text-text2 mt-1.5">🏷 {w.c}</div>}
              </div>
            )
          })}
        </div>
      )}

      {pages > 1 && (
        <div className="flex flex-wrap gap-2 justify-center mt-5">
          {Array.from({ length: pages }, (_, i) => i + 1)
            .filter(p => p === 1 || p === pages || Math.abs(p - cur) <= 2)
            .map((p, idx, arr) => (
              <span key={p} className="flex items-center gap-2">
                {idx > 0 && arr[idx - 1] !== p - 1 && <span className="text-text2">…</span>}
                <button onClick={() => setPage(p)}
                  className={`px-3.5 py-1.5 rounded-md text-sm border ${
                    p === cur ? 'bg-accent text-white border-accent' : 'bg-bg2 text-text2 border-border1 hover:border-accent'
                  }`}>{p}</button>
              </span>
            ))}
        </div>
      )}
    </div>
  )
}
