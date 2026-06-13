import { useState } from 'react'
import { GICHUL_TESTS } from '../data/gichul'

export default function GichulPage() {
  const [test, setTest] = useState(null)
  const [answers, setAnswers] = useState({})
  const [checked, setChecked] = useState(false)

  const open = (t) => { setTest(t); setAnswers({}); setChecked(false) }

  if (test) {
    const allQs = test.sections.flatMap(s => s.questions.map(q => ({ ...q, _section: s.title })))
    const right = allQs.filter(q => answers[q.id] === q.ans).length

    return (
      <div className="max-w-3xl mx-auto p-5">
        <button onClick={() => setTest(null)} className="text-text2 text-sm hover:text-text1 mb-4">← Orqaga</button>
        <h1 className="text-xl font-bold mb-1">{test.title}</h1>
        <p className="text-text2 text-sm mb-5">{test.year}-yil · {test.session}</p>

        {test.sections.map((sec, si) => (
          <div key={si} className="mb-6">
            <h2 className="font-bold text-accent mb-3 sticky top-14 bg-bg py-2">{sec.title}</h2>
            {sec.questions.map(q => {
              const ua = answers[q.id]
              return (
                <div key={q.id} className="bg-bg2 border border-border1 rounded-xl p-4 mb-3">
                  <div className="text-[15px] mb-3 whitespace-pre-line">{q.id}. {q.q}</div>
                  <div className="grid gap-2">
                    {q.opts.map((opt, oi) => {
                      let cls = 'border-border1 bg-bg3 hover:border-accent'
                      if (checked) {
                        if (oi === q.ans) cls = 'border-green bg-green/12 text-green'
                        else if (ua === oi) cls = 'border-red bg-red/12 text-red'
                      } else if (ua === oi) cls = 'border-accent bg-accent/15 text-accent'
                      return (
                        <button key={oi} disabled={checked}
                          onClick={() => setAnswers(a => ({ ...a, [q.id]: oi }))}
                          className={`text-left px-4 py-2.5 rounded-lg border text-sm transition-colors ${cls}`}>
                          {['①', '②', '③', '④'][oi]} {opt}
                        </button>
                      )
                    })}
                  </div>
                  {checked && q.exp && (
                    <div className="mt-3 bg-bg3 border-l-2 border-accent rounded p-3 text-sm text-text2">
                      💡 {q.exp}
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        ))}

        {!checked ? (
          <button onClick={() => { setChecked(true); window.scrollTo(0, 0) }}
            className="w-full bg-accent text-white rounded-lg py-3 font-semibold sticky bottom-4">
            Javoblarni tekshirish ({Object.keys(answers).length}/{allQs.length})
          </button>
        ) : (
          <div className="bg-bg2 border border-border1 rounded-xl p-5 text-center sticky bottom-4">
            <div className="text-3xl font-bold text-accent">{right} / {allQs.length}</div>
            <div className="text-text2 text-sm mt-1">{Math.round(right / allQs.length * 100)}% to'g'ri</div>
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="max-w-3xl mx-auto p-5">
      <h1 className="text-2xl font-bold mb-1">🎯 기출문제 (Real imtihonlar)</h1>
      <p className="text-text2 text-sm mb-5">Haqiqiy o'tgan TOPIK imtihon savollari — izohlar bilan</p>
      <div className="grid gap-3">
        {GICHUL_TESTS.map(t => {
          const qCount = t.sections.reduce((s, sec) => s + sec.questions.length, 0)
          return (
            <button key={t.id} onClick={() => open(t)}
              className="text-left bg-bg2 border border-border1 rounded-xl p-5 hover:border-accent hover:-translate-y-0.5 transition-all">
              <div className="font-semibold">{t.title}</div>
              <div className="flex gap-2 mt-2 flex-wrap">
                <span className="text-[11px] px-2.5 py-1 rounded-full bg-accent/15 text-accent font-semibold">{t.year}-yil</span>
                <span className="text-[11px] px-2.5 py-1 rounded-full bg-bg3 text-text2">{qCount} savol</span>
                <span className="text-[11px] px-2.5 py-1 rounded-full bg-green/15 text-green">izohli</span>
              </div>
            </button>
          )
        })}
      </div>
    </div>
  )
}
