import { useMemo, useState } from 'react'
import { VOCAB } from '../data/vocab'
import { useWordProgress } from '../lib/useWordProgress'

const FILTERS = [
  ['all', 'Hammasi'],
  ['3-4', '3-4 daraja'],
  ['5-6', '5-6 daraja'],
  ['unlearned', "🔖 O'rganilmagan"],
]

const shuffle = (arr) => {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

export default function FlashcardPage() {
  const { progress, setStatus } = useWordProgress()
  const [filter, setFilter] = useState('all')
  const [deck, setDeck] = useState(() => shuffle(VOCAB))
  const [idx, setIdx] = useState(0)
  const [flipped, setFlipped] = useState(false)
  const [session, setSession] = useState({ know: 0, dont: 0 })

  const filteredDeck = useMemo(() => {
    if (filter === '3-4' || filter === '5-6') return deck.filter(w => w.l === filter)
    if (filter === 'unlearned') return deck.filter(w => progress[w.id] !== 'known')
    return deck
  }, [deck, filter]) // eslint-disable-line react-hooks/exhaustive-deps

  const card = filteredDeck[idx]
  const done = idx >= filteredDeck.length

  const answer = (knows) => {
    setStatus(card.id, knows ? 'known' : 'unknown')
    setSession(s => knows ? { ...s, know: s.know + 1 } : { ...s, dont: s.dont + 1 })
    setFlipped(false)
    setTimeout(() => setIdx(i => i + 1), 150)
  }

  const restart = () => {
    setDeck(shuffle(VOCAB))
    setIdx(0); setFlipped(false); setSession({ know: 0, dont: 0 })
  }

  return (
    <div className="max-w-2xl mx-auto p-5 flex flex-col items-center">
      <h1 className="text-2xl font-bold mb-4">🃏 Flashcard mashqi</h1>

      <div className="flex flex-wrap gap-2 mb-5 justify-center">
        {FILTERS.map(([key, label]) => (
          <button key={key}
            onClick={() => { setFilter(key); setIdx(0); setFlipped(false) }}
            className={`px-3.5 py-2 rounded-lg text-sm border ${
              filter === key ? 'bg-accent text-white border-accent' : 'bg-bg2 text-text2 border-border1 hover:border-accent'
            }`}>{label}</button>
        ))}
      </div>

      {done || !card ? (
        <div className="text-center py-12">
          <div className="text-5xl mb-4">🎉</div>
          <h2 className="text-xl font-bold mb-2">Tugadi!</h2>
          <p className="text-text2 text-sm mb-5">
            ✅ Bildim: {session.know} · ❌ Bilmadim: {session.dont}
          </p>
          <button onClick={restart}
            className="bg-accent text-white px-7 py-3 rounded-lg font-semibold hover:-translate-y-0.5 transition-transform">
            🔁 Qayta boshlash
          </button>
        </div>
      ) : (
        <>
          <p className="text-text2 text-sm mb-4">
            {idx + 1} / {filteredDeck.length} · ✅ {session.know} · ❌ {session.dont}
          </p>

          <div className="w-full max-w-md h-60 [perspective:1000px] cursor-pointer mb-6"
            onClick={() => setFlipped(f => !f)}>
            <div className={`relative w-full h-full transition-transform duration-500 [transform-style:preserve-3d] ${
              flipped ? '[transform:rotateY(180deg)]' : ''
            }`}>
              <div className="absolute inset-0 [backface-visibility:hidden] bg-bg2 border border-border1 rounded-xl flex flex-col items-center justify-center p-6 text-center">
                <div className="text-4xl font-bold">{card.word}</div>
                <div className="text-xs text-text2 mt-3">👆 Bosing — ma'nosini ko'ring</div>
              </div>
              <div className="absolute inset-0 [backface-visibility:hidden] [transform:rotateY(180deg)] bg-bg3 border border-accent rounded-xl flex flex-col items-center justify-center p-6 text-center">
                <div className="text-xl text-accent font-semibold mb-2">{card.m}</div>
                {card.e && (
                  <div className="text-sm text-text2">
                    <div className="text-text1">{card.e}</div>
                    <div>{card.u}</div>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="flex gap-3 flex-wrap justify-center">
            <button onClick={() => answer(false)}
              className="bg-red text-[#1c0f0f] px-7 py-3 rounded-lg font-bold hover:-translate-y-0.5 transition-transform">
              ❌ Bilmadim
            </button>
            <button onClick={() => answer(true)}
              className="bg-green text-[#0f1c16] px-7 py-3 rounded-lg font-bold hover:-translate-y-0.5 transition-transform">
              ✅ Bildim
            </button>
            <button onClick={restart}
              className="bg-bg3 border border-border1 px-5 py-3 rounded-lg text-sm hover:border-accent">
              🔀 Aralashtir
            </button>
          </div>
        </>
      )}
    </div>
  )
}
