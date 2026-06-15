import { useEffect, useState } from 'react'
import { MOCK_TESTS } from '../data/mockTests'
import { supabase } from '../lib/supabase'
import { useAuth } from '../context/AuthContext'

const fmt = (s) => `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`

const SEC_COLOR = {
  '어휘': 'bg-yellow/15 text-yellow',
  '문법': 'bg-accent/15 text-accent',
  '읽기': 'bg-green/15 text-green',
}

export default function MockTestPage() {
  const { user } = useAuth()
  const [test, setTest] = useState(null)
  const [current, setCurrent] = useState(0)
  const [answers, setAnswers] = useState({})
  const [timeLeft, setTimeLeft] = useState(0)
  const [finished, setFinished] = useState(false)

  useEffect(() => {
    if (!test || finished) return
    if (timeLeft <= 0) { finish(); return }
    const t = setTimeout(() => setTimeLeft(s => s - 1), 1000)
    return () => clearTimeout(t)
  }, [test, timeLeft, finished]) // eslint-disable-line react-hooks/exhaustive-deps

  const start = (t) => {
    setTest(t); setCurrent(0); setAnswers({}); setFinished(false)
    setTimeLeft((t.minutes ?? 30) * 60)
  }

  const finish = async () => {
    setFinished(true)
    const right = test.questions.filter((q, i) => answers[i] === q.ans).length
    if (user) {
      await supabase.from('test_history').insert({
        user_id: user.id, score: right, total: test.questions.length,
      })
    }
  }

  // === Test tanlash ===
  if (!test) return (
    <div className="max-w-3xl mx-auto px-5 py-8">
      <div className="text-[11px] uppercase tracking-[0.2em] text-text3 mb-2 font-semibold">Imtihon</div>
      <h1 className="text-3xl font-bold tracking-tight mb-1">Mock Test</h1>
      <p className="text-text2 text-sm mb-5">Real TOPIK II formatida vaqtli imtihon</p>
      {MOCK_TESTS.map(t => (
        <button key={t.id} onClick={() => start(t)}
          className="w-full text-left bg-bg2 border border-border1 rounded-xl p-5 mb-3 hover:border-accent hover:-translate-y-0.5 transition-all">
          <div className="font-bold">{t.title}</div>
          <div className="flex gap-2 mt-2 flex-wrap">
            <span className="text-xs px-2.5 py-1 rounded-full bg-accent/15 text-accent font-semibold">
              {t.questions.length} savol
            </span>
            <span className="text-xs px-2.5 py-1 rounded-full bg-yellow/15 text-yellow font-semibold">
              ⏱ {t.minutes ?? 30} daqiqa
            </span>
          </div>
        </button>
      ))}
    </div>
  )

  // === Natija ===
  if (finished) {
    const right = test.questions.filter((q, i) => answers[i] === q.ans).length
    const pct = Math.round(right / test.questions.length * 100)
    return (
      <div className="max-w-3xl mx-auto px-5 py-8">
        <h1 className="text-3xl font-bold tracking-tight mb-5">Test Natijalari</h1>
        <div className="grid grid-cols-3 gap-3 mb-6">
          <div className="bg-bg2 border border-border1 rounded-xl p-4 text-center">
            <div className="text-3xl font-bold text-green">{right}</div>
            <div className="text-xs text-text2 mt-1">To'g'ri</div>
          </div>
          <div className="bg-bg2 border border-border1 rounded-xl p-4 text-center">
            <div className="text-3xl font-bold text-red">{test.questions.length - right}</div>
            <div className="text-xs text-text2 mt-1">Xato</div>
          </div>
          <div className="bg-bg2 border border-border1 rounded-xl p-4 text-center">
            <div className="text-3xl font-bold text-accent">{pct}%</div>
            <div className="text-xs text-text2 mt-1">Natija</div>
          </div>
        </div>

        {test.questions.map((q, i) => {
          const userAns = answers[i]
          const ok = userAns === q.ans
          return (
            <div key={i} className="bg-bg2 border border-border1 rounded-xl p-4 mb-3">
              <div className="text-sm mb-2 whitespace-pre-line">{i + 1}. {q.q}</div>
              <div className={`text-sm ${ok ? 'text-green' : 'text-red'}`}>
                Sizning javob: {userAns != null ? q.opts[userAns] : '— (belgilanmagan)'} {ok ? '' : ''}
              </div>
              {!ok && <div className="text-sm text-green">To'g'ri javob: {q.opts[q.ans]}</div>}
            </div>
          )
        })}

        <button onClick={() => setTest(null)}
          className="bg-accent text-white px-6 py-3 rounded-lg font-semibold mt-2">
          Boshqa test
        </button>
      </div>
    )
  }

  // === Savol ===
  const q = test.questions[current]
  const isLast = current === test.questions.length - 1

  return (
    <div className="max-w-3xl mx-auto px-5 py-8">
      <div className="flex justify-between items-center mb-4 flex-wrap gap-2">
        <button onClick={() => setTest(null)} className="text-text2 text-sm hover:text-text1">← Chiqish</button>
        <div className="flex-1 mx-4 hidden sm:block">
          <div className="bg-bg3 rounded-full h-2 overflow-hidden">
            <div className="bg-gradient-to-r from-accent to-accent2 h-full transition-all"
              style={{ width: `${(current + 1) / test.questions.length * 100}%` }} />
          </div>
        </div>
        <span className={`px-3.5 py-1.5 rounded-lg border border-border1 bg-bg3 font-bold tabular-nums ${
          timeLeft < 60 ? 'text-red animate-pulse' : 'text-yellow'
        }`}>{fmt(timeLeft)}</span>
      </div>

      <div className="bg-bg2 border border-border1 rounded-xl p-5 mb-4">
        {q.section && (
          <span className={`inline-block text-[11px] px-2.5 py-0.5 rounded-full font-semibold mb-3 ${SEC_COLOR[q.section] ?? 'bg-bg3 text-text2'}`}>
            {q.section}
          </span>
        )}
        {q.passage && (
          <div className="bg-bg3 border-l-2 border-green rounded-lg p-3.5 text-sm text-text2 leading-relaxed mb-4 whitespace-pre-line">
            {q.passage}
          </div>
        )}
        <div className="text-[15px] leading-relaxed mb-4 whitespace-pre-line">
          {current + 1}. {q.q}
        </div>
        <div className="grid gap-2">
          {q.opts.map((opt, oi) => (
            <button key={oi}
              onClick={() => setAnswers(a => ({ ...a, [current]: oi }))}
              className={`text-left px-4 py-3 rounded-lg border text-sm transition-colors ${
                answers[current] === oi
                  ? 'border-accent bg-accent/15 text-accent'
                  : 'border-border1 bg-bg3 hover:border-accent'
              }`}>
              {['①', '②', '③', '④'][oi]} {opt}
            </button>
          ))}
        </div>
      </div>

      <div className="flex justify-between">
        <button onClick={() => setCurrent(c => Math.max(0, c - 1))} disabled={current === 0}
          className="px-5 py-2.5 rounded-lg border border-border1 text-sm text-text2 disabled:opacity-40 hover:border-accent">
          ← Oldingi
        </button>
        {isLast ? (
          <button onClick={finish}
            className="px-6 py-2.5 rounded-lg bg-green text-[#0f1c16] font-bold text-sm">
            Tugatish
          </button>
        ) : (
          <button onClick={() => setCurrent(c => c + 1)}
            className="px-5 py-2.5 rounded-lg bg-accent text-white text-sm font-semibold">
            Keyingi →
          </button>
        )}
      </div>
    </div>
  )
}
