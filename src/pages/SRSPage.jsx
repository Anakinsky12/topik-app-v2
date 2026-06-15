import { useMemo, useState } from 'react'
import { VOCAB } from '../data/vocab'
import { useSRS } from '../lib/useSRS'
import { SpeakButton } from '../components/Common'
import { speakKorean } from '../lib/tts'

const byId = Object.fromEntries(VOCAB.map(w => [w.id, w]))

export default function SRSPage() {
  const { loaded, review, dueIds, masteredCount } = useSRS()
  const [started, setStarted] = useState(false)
  const [queue, setQueue] = useState([])
  const [idx, setIdx] = useState(0)
  const [flipped, setFlipped] = useState(false)
  const [done, setDone] = useState({ correct: 0, wrong: 0 })

  // Yangi so'zlar (hali ko'rilmagan) — har kuni 15 ta qo'shamiz
  const newWords = useMemo(() => {
    const seen = new Set(dueIds())
    return VOCAB.filter(w => !seen.has(w.id)).slice(0, 0) // boshlanishida 0, due bilan to'ldiramiz
  }, []) // eslint-disable-line

  const start = (includeNew) => {
    const due = dueIds()
    let ids = [...due]
    if (includeNew) {
      const dueSet = new Set(due)
      const fresh = VOCAB.filter(w => !dueSet.has(w.id)).slice(0, 15).map(w => w.id)
      ids = [...ids, ...fresh]
    }
    if (ids.length === 0) ids = VOCAB.slice(0, 15).map(w => w.id)
    // aralashtirish
    for (let i = ids.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));[ids[i], ids[j]] = [ids[j], ids[i]]
    }
    setQueue(ids); setIdx(0); setFlipped(false); setDone({ correct: 0, wrong: 0 }); setStarted(true)
  }

  const answer = (correct) => {
    const wordId = queue[idx]
    review(wordId, correct)
    setDone(d => correct ? { ...d, correct: d.correct + 1 } : { ...d, wrong: d.wrong + 1 })
    setFlipped(false)
    setTimeout(() => setIdx(i => i + 1), 150)
  }

  if (!loaded) return <div className="p-10 text-center text-text2">Yuklanmoqda...</div>

  // === Boshlang'ich ekran ===
  if (!started) {
    const due = dueIds().length
    return (
      <div className="max-w-xl mx-auto px-5 py-8">
        <div className="text-[11px] uppercase tracking-[0.2em] text-text3 mb-2 font-semibold">Mashq</div>
        <h1 className="text-3xl font-bold tracking-tight mb-1">Aqlli takrorlash</h1>
        <p className="text-text2 text-sm mb-6">
          Ilmiy isbotlangan tizim: so'zni eslab qolish ehtimoli pasayganda aynan o'sha payt takrorlaysiz.
        </p>

        <div className="grid grid-cols-2 gap-3 mb-6">
          <div className="bg-bg2 border border-yellow/50 rounded-xl p-5 text-center">
            <div className="text-3xl font-bold text-yellow">{due}</div>
            <div className="text-xs text-text2 mt-1">Bugun takrorlash kerak</div>
          </div>
          <div className="bg-bg2 border border-green/50 rounded-xl p-5 text-center">
            <div className="text-3xl font-bold text-green">{masteredCount}</div>
            <div className="text-xs text-text2 mt-1">Mukammal o'zlashtirilgan</div>
          </div>
        </div>

        <button onClick={() => start(true)}
          className="w-full bg-gradient-to-r from-accent to-accent2 text-white rounded-xl py-4 font-bold mb-3 hover:-translate-y-0.5 transition-transform">
          Mashqni boshlash {due > 0 ? `(${due} takror + 15 yangi)` : '(15 yangi so\'z)'}
        </button>
        {due > 0 && (
          <button onClick={() => start(false)}
            className="w-full bg-bg2 border border-border1 rounded-xl py-3 text-sm hover:border-accent">
            Faqat takrorlash ({due} ta)
          </button>
        )}
        <p className="text-text2 text-xs mt-4 leading-relaxed">
          To'g'ri javob bersangiz, so'z keyingi safar uzoqroq vaqtdan keyin chiqadi
          (1 → 3 → 7 → 14 → 30 → 60 kun). Xato qilsangiz, qaytadan boshlanadi.
        </p>
      </div>
    )
  }

  // === Tugadi ===
  if (idx >= queue.length) {
    return (
      <div className="max-w-xl mx-auto px-5 py-8 text-center">
        
        <h2 className="text-xl font-bold mb-2">Mashq tugadi!</h2>
        <p className="text-text2 mb-6">{done.correct} to'g'ri · {done.wrong} xato</p>
        <button onClick={() => setStarted(false)}
          className="bg-accent text-white px-7 py-3 rounded-lg font-semibold">
          Bosh sahifaga
        </button>
      </div>
    )
  }

  // === Karta ===
  const word = byId[queue[idx]]
  if (!word) { setIdx(i => i + 1); return null }

  return (
    <div className="max-w-xl mx-auto px-5 py-8 flex flex-col items-center">
      <p className="text-text2 text-sm mb-4 self-stretch text-center">
        {idx + 1} / {queue.length} · {done.correct} · {done.wrong}
      </p>

      <div className="w-full max-w-md h-64 [perspective:1000px] cursor-pointer mb-6"
        onClick={() => { if (!flipped) speakKorean(word.word); setFlipped(f => !f) }}>
        <div className={`relative w-full h-full transition-transform duration-500 [transform-style:preserve-3d] ${flipped ? '[transform:rotateY(180deg)]' : ''}`}>
          <div className="absolute inset-0 [backface-visibility:hidden] bg-bg2 border border-border1 rounded-xl flex flex-col items-center justify-center p-6 text-center">
            <div className="text-4xl font-bold mb-2">{word.word} <SpeakButton text={word.word} size="lg" /></div>
            <div className="text-xs text-text2 mt-3">Ma'nosini ko'rish uchun bosing</div>
          </div>
          <div className="absolute inset-0 [backface-visibility:hidden] [transform:rotateY(180deg)] bg-bg3 border border-accent rounded-xl flex flex-col items-center justify-center p-6 text-center">
            <div className="text-xl text-accent font-semibold mb-2">{word.m}</div>
            {word.e && (
              <div className="text-sm text-text2">
                <div className="text-text1">{word.e} <SpeakButton text={word.e} /></div>
                <div>{word.u}</div>
              </div>
            )}
          </div>
        </div>
      </div>

      {flipped ? (
        <div className="flex gap-3 w-full max-w-md">
          <button onClick={() => answer(false)}
            className="flex-1 bg-red text-[#1c0f0f] py-3.5 rounded-lg font-bold hover:-translate-y-0.5 transition-transform">
            Bilmadim
          </button>
          <button onClick={() => answer(true)}
            className="flex-1 bg-green text-[#0f1c16] py-3.5 rounded-lg font-bold hover:-translate-y-0.5 transition-transform">
            Bildim
          </button>
        </div>
      ) : (
        <button onClick={() => { speakKorean(word.word); setFlipped(true) }}
          className="bg-accent text-white px-8 py-3 rounded-lg font-semibold">
          Javobni ko'rish
        </button>
      )}
    </div>
  )
}
