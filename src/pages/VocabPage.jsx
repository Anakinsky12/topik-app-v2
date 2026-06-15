import { useMemo, useState } from 'react'
import { VOCAB } from '../data/vocab'
import { useWordProgress } from '../lib/useWordProgress'
import { SpeakButton } from '../components/Common'

const PER_PAGE = 30
const LEVEL_STYLE = {
  '1-2': 'bg-green/12 text-green',
  '3-4': 'bg-yellow/12 text-yellow',
  '5-6': 'bg-accent/15 text-accent',
}

export default function VocabPage() {
  const { progress, toggleLearned, knownCount } = useWordProgress()
  const [filter, setFilter] = useState('all')
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)

  const FILTERS = [
    ['all', 'Hammasi'],
    ['1-2', '1-2급'],
    ['3-4', '3-4급'],
    ['5-6', '5-6급'],
    ['learned', "O'rganildi"],
    ['rest', 'Qolgan'],
  ]

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
    <div className="max-w-5xl mx-auto px-5 py-8 fade-up">
      <div className="mb-6">
        <div className="text-[11px] uppercase tracking-[0.2em] text-text3 mb-2 font-semibold">{"Lug'at"}</div>
        <div className="flex items-baseline gap-3">
          <h1 className="text-3xl font-bold tracking-tight">{"So'zlar"}</h1>
          <span className="tabular text-text2 text-sm">
            <span className="text-accent font-semibold">{knownCount}</span> / {VOCAB.length}
          </span>
        </div>
      </div>

      <div className="sticky top-14 z-30 -mx-5 px-5 py-3 bg-bg/85 backdrop-blur-xl border-b border-border1 mb-5">
        <input
          value={search}
          onChange={e => { setSearch(e.target.value); setPage(1) }}
          placeholder={"So'z, ma'no yoki kategoriya qidiring…"}
          className="w-full bg-bg2 border border-border1 rounded-lg px-4 py-2.5 text-sm mb-2.5 focus:outline-none focus:border-accent transition-colors placeholder:text-text3"
        />
        <div className="flex flex-wrap gap-1.5">
          {FILTERS.map(([key, label]) => (
            <button key={key}
              onClick={() => { setFilter(key); setPage(1) }}
              className={`px-3 py-1.5 rounded-md text-[13px] font-medium border transition-colors ${
                filter === key
                  ? 'bg-accent text-white border-accent'
                  : 'bg-bg2 text-text2 border-border1 hover:border-border2 hover:text-text1'
              }`}>
              {label}
            </button>
          ))}
        </div>
      </div>

      {slice.length === 0 ? (
        <div className="text-center py-20 text-text2">
          <div className="text-3xl mb-3 opacity-40">⌕</div>
          <p className="font-medium">{'Hech narsa topilmadi'}</p>
          <p className="text-xs text-text3 mt-1">{"Boshqa so\'z yoki filtr bilan urinib ko\'ring"}</p>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
          {slice.map(w => {
            const learned = progress[w.id] === 'known'
            return (
              <div key={w.id}
                className={`group relative bg-bg2 border rounded-xl p-4 transition-colors ${
                  learned ? 'border-green/40' : 'border-border1 hover:border-border2'
                }`}>
                <button
                  onClick={() => toggleLearned(w.id)}
                  className={`absolute top-3.5 right-3.5 w-5 h-5 rounded-md border grid place-items-center text-[11px] transition-colors ${
                    learned ? 'bg-green border-green text-bg' : 'border-border2 text-transparent hover:border-accent'
                  }`}
                  title={"O'rganildi deb belgilash"}>
                  ✓
                </button>
                <div className="flex items-center gap-2 pr-7">
                  <span className="text-lg font-bold">{w.word}</span>
                  <SpeakButton text={w.word} />
                  <span className={`tabular text-[10px] px-1.5 py-0.5 rounded font-bold ${LEVEL_STYLE[w.l] || 'bg-bg3 text-text2'}`}>{w.l}</span>
                </div>
                <div className="text-text1 text-sm mt-1 font-medium">{w.m}</div>
                {w.e && (
                  <div className="text-[13px] mt-2.5 pt-2.5 border-t border-border1 space-y-0.5">
                    <div className="text-text1">{w.e}</div>
                    <div className="text-text2">{w.u}</div>
                  </div>
                )}
                {w.c && <div className="text-[10px] uppercase tracking-wider text-text3 mt-2 font-semibold">{w.c}</div>}
              </div>
            )
          })}
        </div>
      )}

      {pages > 1 && (
        <div className="flex flex-wrap gap-1.5 justify-center mt-6">
          {Array.from({ length: pages }, (_, i) => i + 1)
            .filter(p => p === 1 || p === pages || Math.abs(p - cur) <= 2)
            .map((p, idx, arr) => (
              <span key={p} className="flex items-center gap-1.5">
                {idx > 0 && arr[idx - 1] !== p - 1 && <span className="text-text3">…</span>}
                <button onClick={() => setPage(p)}
                  className={`tabular px-3 py-1.5 rounded-md text-sm border transition-colors ${
                    p === cur ? 'bg-accent text-white border-accent' : 'bg-bg2 text-text2 border-border1 hover:border-border2'
                  }`}>{p}</button>
              </span>
            ))}
        </div>
      )}
    </div>
  )
}
