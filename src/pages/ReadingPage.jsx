import { useState } from 'react'
import { READING_PASSAGES } from '../data/reading'
import { SpeakButton } from '../components/Common'

export default function ReadingPage() {
  const [active, setActive] = useState(null)
  const [answers, setAnswers] = useState({})
  const [checked, setChecked] = useState(false)

  const open = (p) => { setActive(p); setAnswers({}); setChecked(false) }

  if (active) {
    const p = active
    const right = p.questions.filter((q, i) => answers[i] === q.ans).length
    return (
      <div className="max-w-3xl mx-auto px-5 py-8">
        <button onClick={() => setActive(null)} className="text-text2 text-sm hover:text-text1 mb-4">← Orqaga</button>
        <div className="flex items-center gap-2 mb-1">
          <h1 className="text-xl font-bold">{p.title}</h1>
          <span className={`text-[11px] px-2 py-0.5 rounded-full font-semibold ${p.level === '3-4' ? 'bg-yellow/15 text-yellow' : 'bg-accent/15 text-accent'}`}>{p.level}</span>
        </div>

        <div className="bg-bg2 border border-border1 rounded-xl p-5 mb-5 mt-3">
          <div className="flex justify-end mb-2"><SpeakButton text={p.passage} size="lg" /></div>
          <p className="text-[15px] leading-loose whitespace-pre-line">{p.passage}</p>
        </div>

        <h3 className="font-semibold mb-3">❓ Savollar</h3>
        {p.questions.map((q, qi) => (
          <div key={qi} className="bg-bg2 border border-border1 rounded-xl p-4 mb-3">
            <div className="text-[15px] mb-3">{qi + 1}. {q.q}</div>
            <div className="grid gap-2">
              {q.opts.map((opt, oi) => {
                let cls = 'border-border1 bg-bg3 hover:border-accent'
                if (checked) {
                  if (oi === q.ans) cls = 'border-green bg-green/12 text-green'
                  else if (answers[qi] === oi) cls = 'border-red bg-red/12 text-red'
                } else if (answers[qi] === oi) cls = 'border-accent bg-accent/15 text-accent'
                return (
                  <button key={oi} disabled={checked}
                    onClick={() => setAnswers(a => ({ ...a, [qi]: oi }))}
                    className={`text-left px-4 py-2.5 rounded-lg border text-sm transition-colors ${cls}`}>
                    {['①', '②', '③', '④'][oi]} {opt}
                  </button>
                )
              })}
            </div>
          </div>
        ))}

        {!checked ? (
          <button onClick={() => setChecked(true)}
            disabled={Object.keys(answers).length < p.questions.length}
            className="w-full bg-accent text-white rounded-lg py-3 font-semibold disabled:opacity-50">
            Tekshirish
          </button>
        ) : (
          <div className="bg-bg2 border border-border1 rounded-xl p-5 text-center">
            <div className="text-3xl font-bold text-accent">{right} / {p.questions.length}</div>
            <div className="text-text2 text-sm mt-1">{Math.round(right / p.questions.length * 100)}% to'g'ri</div>
            <button onClick={() => { setChecked(false); setAnswers({}) }}
              className="mt-3 text-sm text-accent">🔄 Qayta urinish</button>
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="max-w-3xl mx-auto px-5 py-8">
      <h1 className="text-2xl font-bold mb-1">📖 O'qish mashqi ({READING_PASSAGES.length})</h1>
      <p className="text-text2 text-sm mb-5">Matnni o'qing, savollarga javob bering</p>
      <div className="grid sm:grid-cols-2 gap-3">
        {READING_PASSAGES.map(p => (
          <button key={p.id} onClick={() => open(p)}
            className="text-left bg-bg2 border border-border1 rounded-xl p-4 hover:border-accent hover:-translate-y-0.5 transition-all">
            <div className="font-semibold">{p.title}</div>
            <div className="flex gap-2 mt-2">
              <span className={`text-[11px] px-2 py-0.5 rounded-full font-semibold ${p.level === '3-4' ? 'bg-yellow/15 text-yellow' : 'bg-accent/15 text-accent'}`}>{p.level}</span>
              <span className="text-[11px] px-2 py-0.5 rounded-full bg-bg3 text-text2">{p.questions.length} savol</span>
            </div>
          </button>
        ))}
      </div>
    </div>
  )
}
