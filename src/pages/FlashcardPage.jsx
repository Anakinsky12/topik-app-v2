import { useMemo, useState } from 'react'
import { VOCAB } from '../data/vocab'
import { useWordProgress } from '../lib/useWordProgress'
import { SpeakButton } from '../components/Common'

const FILTERS = [
  ['all', 'Hammasi'],
  ['1-2', '1-2급'],
  ['3-4', '3-4급'],
  ['5-6', '5-6급'],
  ['unlearned', "O'rganilmagan"],
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
    if (filter === '1-2' || filter === '3-4' || filter === '5-6') return deck.filter(w => w.l === filter)
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
    <div className="max-w-2xl mx-auto px-5 py-8 fade-up">
      <div className="mb-6">
        <div className="text-[11px] uppercase tracking-[0.2em] text-text3 mb-2 font-semibold">Flashcard</div>
        <h1 className="text-3xl font-bold tracking-tight">Kartochka mashqi</h1>
      </div>

      <div className="flex flex-wrap gap-1.5 mb-6">
        {FILTERS.map(([key, label]) => (
          <button key={key}
            onClick={() => { setFilter(key); setIdx(0); setFlipped(false) }}
            className={`px-3 py-1.5 rounded-md text-[13px] font-medium border transition-colors ${
              filter === key ? 'bg-accent text-white border-accent' : 'bg-bg2 text-text2 border-border1 hover:border-border2 hover:text-text1'
            }`}>{label}</button>
        ))}
      </div>

      {done || !card ? (
        <div className="text-center py-16 bg-bg2 border border-border1 rounded-2xl">
          <div className="tabular text-4xl font-bold text-accent mb-2">{session.know}/{session.know + session.dont}</div>
          <h2 className="text-lg font-bold mb-1">Mashq tugadi</h2>
          <p className="text-text2 text-sm mb-6">
            Bildim: <span className="text-green font-semibold">{session.know}</span>
            <span className="mx-2 text-text3">·</span>
            Bilmadim: <span className="text-red font-semibold">{session.dont}</span>
          </p>
          <button onClick={restart}
            className="bg-accent text-white px-6 py-2.5 rounded-lg font-semibold text-sm hover:bg-accent2 transition-colors">
            Qayta boshlash
          </button>
        </div>
      ) : (
        <>
          {/* Progress */}
          <div className="flex items-center gap-3 mb-5">
            <div className="flex-1 bg-bg3 rounded-full h-1.5 overflow-hidden">
              <div className="bg-accent h-full rounded-full transition-all duration-300"
                style={{ width: `${(idx / filteredDeck.length) * 100}%` }} />
            </div>
            <span className="tabular text-xs text-text2 font-semibold whitespace-nowrap">{idx + 1} / {filteredDeck.length}</span>
          </div>

          {/* Karta */}
          <div className="w-full h-64 [perspective:1000px] cursor-pointer mb-6"
            onClick={() => setFlipped(f => !f)}>
            <div className={`relative w-full h-full transition-transform duration-500 [transform-style:preserve-3d] ${
              flipped ? '[transform:rotateY(180deg)]' : ''
            }`}>
              <div className="absolute inset-0 [backface-visibility:hidden] bg-bg2 border border-border1 rounded-2xl flex flex-col items-center justify-center p-6 text-center">
                <div className="text-4xl font-bold flex items-center gap-2">{card.word} <SpeakButton text={card.word} size="lg" /></div>
                <div className="text-xs text-text3 mt-4">Bosing — ma'nosini ko'ring</div>
              </div>
              <div className="absolute inset-0 [backface-visibility:hidden] [transform:rotateY(180deg)] bg-bg2 border border-accent/40 rounded-2xl flex flex-col items-center justify-center p-6 text-center">
                <div className="text-2xl text-accent font-bold mb-3">{card.m}</div>
                {card.e && (
                  <div className="text-sm space-y-0.5">
                    <div className="text-text1">{card.e}</div>
                    <div className="text-text2">{card.u}</div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Tugmalar */}
          <div className="grid grid-cols-2 gap-2.5">
            <button onClick={() => answer(false)}
              className="bg-bg2 border border-red/40 text-red px-6 py-3.5 rounded-xl font-semibold hover:bg-red/10 transition-colors">
              Bilmadim
            </button>
            <button onClick={() => answer(true)}
              className="bg-bg2 border border-green/40 text-green px-6 py-3.5 rounded-xl font-semibold hover:bg-green/10 transition-colors">
              Bildim
            </button>
          </div>
          <button onClick={restart}
            className="w-full mt-2.5 text-text3 hover:text-text2 text-sm py-2 transition-colors">
            Aralashtirib qayta boshlash
          </button>
        </>
      )}
    </div>
  )
}
