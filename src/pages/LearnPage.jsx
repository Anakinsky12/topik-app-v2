import { useMemo, useState, useRef, useEffect } from 'react'
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

const LEVEL_STYLE = {
  '1-2': 'bg-green/12 text-green',
  '3-4': 'bg-yellow/12 text-yellow',
  '5-6': 'bg-accent/15 text-accent',
}

export default function LearnPage() {
  const { progress, setStatus } = useWordProgress()
  const [filter, setFilter] = useState('all')
  const [deck, setDeck] = useState(() => shuffle(VOCAB))
  const [idx, setIdx] = useState(0)
  const [revealed, setRevealed] = useState(false)
  const [started, setStarted] = useState(false)
  const touchStart = useRef(null)

  const filteredDeck = useMemo(() => {
    if (filter === '1-2' || filter === '3-4' || filter === '5-6') return deck.filter(w => w.l === filter)
    if (filter === 'unlearned') return deck.filter(w => progress[w.id] !== 'known')
    return deck
  }, [deck, filter]) // eslint-disable-line react-hooks/exhaustive-deps

  const card = filteredDeck[idx]
  const total = filteredDeck.length
  const done = idx >= total

  const next = () => { setRevealed(false); setIdx(i => i + 1) }
  const prev = () => { setRevealed(false); setIdx(i => Math.max(0, i - 1)) }

  const markKnown = () => {
    if (card) setStatus(card.id, 'known')
    next()
  }
  const markUnknown = () => {
    if (card) setStatus(card.id, 'unknown')
    next()
  }

  const restart = () => {
    setDeck(shuffle(VOCAB)); setIdx(0); setRevealed(false)
  }

  // Klaviatura: bo'shliq = ochish, ←→ = harakat, ↑/↓ = bildim/bilmadim
  useEffect(() => {
    if (!started) return
    const onKey = (e) => {
      if (e.code === 'Space') { e.preventDefault(); setRevealed(r => !r) }
      else if (e.code === 'ArrowRight') next()
      else if (e.code === 'ArrowLeft') prev()
      else if (e.code === 'ArrowUp') markKnown()
      else if (e.code === 'ArrowDown') markUnknown()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }) // eslint-disable-line react-hooks/exhaustive-deps

  // Touch swipe (telefon): yuqoriga = keyingisi, pastga = oldingisi
  const onTouchStart = (e) => { touchStart.current = e.touches[0].clientY }
  const onTouchEnd = (e) => {
    if (touchStart.current == null) return
    const dy = e.changedTouches[0].clientY - touchStart.current
    if (Math.abs(dy) > 60) {
      if (dy < 0) next()    // yuqoriga surdi → keyingisi
      else prev()           // pastga surdi → oldingisi
    }
    touchStart.current = null
  }

  // Boshlang'ich ekran
  if (!started) {
    return (
      <div className="max-w-2xl mx-auto px-5 py-8 fade-up">
        <div className="mb-6">
          <div className="text-[11px] uppercase tracking-[0.2em] text-text3 mb-2 font-semibold">Mashq</div>
          <h1 className="text-3xl font-bold tracking-tight">Yodlash</h1>
          <p className="text-text2 text-sm mt-1.5">So'zlarni bittalab ko'rib, yuqoriga surib yodlang</p>
        </div>

        <div className="flex flex-wrap gap-1.5 mb-6">
          {FILTERS.map(([key, label]) => (
            <button key={key}
              onClick={() => setFilter(key)}
              className={`px-3 py-1.5 rounded-md text-[13px] font-medium border transition-colors ${
                filter === key ? 'bg-accent text-white border-accent' : 'bg-bg2 text-text2 border-border1 hover:border-border2 hover:text-text1'
              }`}>{label}</button>
          ))}
        </div>

        <div className="bg-bg2 border border-border1 rounded-2xl p-6 text-center">
          <div className="tabular text-3xl font-bold text-accent">{filteredDeck.length}</div>
          <div className="text-text2 text-sm mt-1 mb-5">ta so'z tayyor</div>
          <button onClick={() => { setIdx(0); setRevealed(false); setStarted(true) }}
            className="bg-accent text-white px-7 py-3 rounded-xl font-semibold text-sm hover:bg-accent2 transition-colors">
            Boshlash
          </button>
        </div>

        <div className="text-xs text-text3 mt-5 space-y-1 leading-relaxed">
          <p>• So'zni bosing yoki <b>bo'shliq</b> tugmasi — ma'noni ko'ring</p>
          <p>• <b>Yuqoriga suring</b> yoki o'ng strelka — keyingisi</p>
          <p>• <b>Bildim / Bilmadim</b> — so'z holatini saqlaydi</p>
        </div>
      </div>
    )
  }

  // Tugadi ekrani
  if (done || !card) {
    return (
      <div className="max-w-2xl mx-auto px-5 py-8 fade-up">
        <div className="bg-bg2 border border-border1 rounded-2xl p-10 text-center">
          <div className="tabular text-4xl font-bold text-accent mb-2">{total}</div>
          <h2 className="text-lg font-bold mb-1">So'zlar tugadi</h2>
          <p className="text-text2 text-sm mb-6">Hammasini ko'rib chiqdingiz</p>
          <div className="flex gap-2.5 justify-center">
            <button onClick={() => { restart() }}
              className="bg-accent text-white px-6 py-2.5 rounded-lg font-semibold text-sm hover:bg-accent2 transition-colors">
              Qayta boshlash
            </button>
            <button onClick={() => setStarted(false)}
              className="border border-border1 text-text2 px-6 py-2.5 rounded-lg text-sm hover:text-text1 transition-colors">
              Filtr o'zgartirish
            </button>
          </div>
        </div>
      </div>
    )
  }

  const learned = progress[card.id] === 'known'

  return (
    <div className="max-w-2xl mx-auto px-5 py-5 fade-up select-none"
      onTouchStart={onTouchStart} onTouchEnd={onTouchEnd}>
      {/* Yuqori panel: progress + chiqish */}
      <div className="flex items-center gap-3 mb-5">
        <button onClick={() => setStarted(false)}
          className="text-text3 hover:text-text1 text-sm transition-colors">✕</button>
        <div className="flex-1 bg-bg3 rounded-full h-1.5 overflow-hidden">
          <div className="bg-accent h-full rounded-full transition-all duration-300"
            style={{ width: `${(idx / total) * 100}%` }} />
        </div>
        <span className="tabular text-xs text-text2 font-semibold whitespace-nowrap">{idx + 1} / {total}</span>
      </div>

      {/* So'z kartasi — katta, markazda */}
      <div
        onClick={() => setRevealed(r => !r)}
        className="bg-bg2 border border-border1 rounded-3xl min-h-[55vh] flex flex-col items-center justify-center p-8 text-center cursor-pointer relative">

        {/* Daraja belgisi */}
        <span className={`absolute top-5 right-5 tabular text-[11px] px-2 py-0.5 rounded font-bold ${LEVEL_STYLE[card.l] || 'bg-bg3 text-text2'}`}>{card.l}</span>
        {learned && <span className="absolute top-5 left-5 text-green text-xs font-semibold">✓ o'rganilgan</span>}

        {/* So'z */}
        <div className="text-5xl font-bold flex items-center gap-3 mb-3">
          {card.word}
          <SpeakButton text={card.word} size="lg" />
        </div>

        {!revealed ? (
          <div className="text-text3 text-sm mt-4">Bosing — ma'nosini ko'ring</div>
        ) : (
          <div className="fade-up mt-2">
            <div className="text-2xl text-accent font-bold mb-4">{card.m}</div>
            {card.e && (
              <div className="text-sm space-y-1 border-t border-border1 pt-4 max-w-sm">
                <div className="text-text1 flex items-center justify-center gap-1.5">
                  {card.e} <SpeakButton text={card.e} />
                </div>
                <div className="text-text2">{card.u}</div>
              </div>
            )}
            {card.c && <div className="text-[10px] uppercase tracking-wider text-text3 mt-4 font-semibold">{card.c}</div>}
          </div>
        )}
      </div>

      {/* Pastki tugmalar */}
      <div className="grid grid-cols-2 gap-2.5 mt-4">
        <button onClick={markUnknown}
          className="bg-bg2 border border-red/40 text-red px-6 py-3.5 rounded-xl font-semibold hover:bg-red/10 transition-colors">
          Bilmadim
        </button>
        <button onClick={markKnown}
          className="bg-bg2 border border-green/40 text-green px-6 py-3.5 rounded-xl font-semibold hover:bg-green/10 transition-colors">
          Bildim
        </button>
      </div>

      {/* Navigatsiya */}
      <div className="flex items-center justify-between mt-3">
        <button onClick={prev} disabled={idx === 0}
          className="text-text3 hover:text-text1 text-sm transition-colors disabled:opacity-30">← Oldingi</button>
        <button onClick={next}
          className="text-text3 hover:text-text1 text-sm transition-colors">Keyingi →</button>
      </div>
    </div>
  )
}
