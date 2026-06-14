import { useState } from 'react'
import { WRITING } from '../data/writing'

const TOPICS = WRITING.filter(w => w.type === '53' || w.type === '54').slice(0, 6)
const FALLBACK_TOPICS = [
  { id: 'env', topic: '환경 보호', title: '환경 보호를 위해 우리가 할 수 있는 일' },
  { id: 'sns', topic: 'SNS', title: 'SNS 사용의 장점과 단점' },
  { id: 'edu', topic: '교육', title: '온라인 수업과 오프라인 수업 비교' },
]

export default function AIWritingPage() {
  const topics = TOPICS.length > 0 ? TOPICS : FALLBACK_TOPICS
  const [topic, setTopic] = useState(topics[0])
  const [text, setText] = useState('')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState(null)
  const [error, setError] = useState('')

  const charCount = text.replace(/\s/g, '').length

  const check = async () => {
    setLoading(true); setError(''); setResult(null)
    try {
      const prompt = `Siz TOPIK II 쓰기 (yozuv) imtihonini baholovchi tajribali ekspertsiz. Quyidagi koreyscha inshoni baholang.

Mavzu: ${topic.title}

Talaba yozgani:
"""
${text}
"""

Quyidagi JSON formatda javob bering (boshqa hech narsa yozmang, faqat JSON):
{
  "score": <0-100 oraliqdagi umumiy ball>,
  "grade": "<TOPIK darajasi taxmini: 3급/4급/5급/6급>",
  "criteria": {
    "content": <0-100 mazmun va vazifa bajarilishi>,
    "structure": <0-100 tuzilish va izchillik>,
    "grammar": <0-100 grammatika to'g'riligi>,
    "vocabulary": <0-100 lug'at boyligi>
  },
  "strengths": "<kuchli tomonlari, o'zbek tilida, 2-3 jumla>",
  "weaknesses": "<zaif tomonlari, o'zbek tilida, 2-3 jumla>",
  "corrections": [
    {"wrong": "<xato jumla yoki ibora>", "fixed": "<to'g'rilangan variant>", "why": "<sabab, o'zbekcha>"}
  ],
  "advice": "<keyingi qadam uchun maslahat, o'zbek tilida>"
}`

      const response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: 'claude-sonnet-4-6',
          max_tokens: 1500,
          messages: [{ role: 'user', content: prompt }],
        }),
      })
      const data = await response.json()
      const raw = data.content.map(b => b.text || '').join('').replace(/```json|```/g, '').trim()
      setResult(JSON.parse(raw))
    } catch (e) {
      setError("Tekshirishda xato yuz berdi. Internet aloqasini tekshiring yoki qaytadan urinib ko'ring.")
    } finally {
      setLoading(false)
    }
  }

  const scoreColor = (s) => s >= 80 ? 'text-green' : s >= 60 ? 'text-yellow' : 'text-red'

  return (
    <div className="max-w-2xl mx-auto px-5 py-8">
      <h1 className="text-3xl font-bold tracking-tight mb-1">✍️ AI Yozuv tekshiruvi</h1>
      <p className="text-text2 text-sm mb-5">Insho yozing — AI baholaydi, xatolarni tuzatadi, ball beradi</p>

      {/* Mavzu tanlash */}
      <div className="flex flex-wrap gap-2 mb-4">
        {topics.map(t => (
          <button key={t.id ?? t.title} onClick={() => { setTopic(t); setResult(null) }}
            className={`px-3.5 py-1.5 rounded-full text-sm border transition-colors ${
              (topic.id ?? topic.title) === (t.id ?? t.title)
                ? 'bg-accent text-white border-accent'
                : 'bg-bg2 text-text2 border-border1 hover:border-accent'}`}>
            {t.topic}
          </button>
        ))}
      </div>

      <div className="bg-bg2 border border-border1 rounded-xl p-4 mb-4">
        <div className="text-xs text-accent2 uppercase tracking-wide mb-1">Mavzu</div>
        <div className="font-semibold">{topic.title}</div>
      </div>

      <textarea
        value={text} onChange={e => setText(e.target.value)}
        placeholder="여기에 한국어로 작성하세요... (Bu yerga koreyscha yozing)"
        className="w-full bg-bg2 border border-border1 rounded-xl p-4 text-[15px] leading-loose min-h-56 resize-y focus:outline-none focus:border-accent"
      />
      <div className="flex justify-between items-center mt-2 mb-4 flex-wrap gap-2">
        <span className={`text-sm ${charCount >= 200 ? 'text-green' : 'text-text2'}`}>
          {charCount} belgi {charCount < 200 && '(kamida 200 tavsiya etiladi)'}
        </span>
        <button onClick={check} disabled={loading || charCount < 20}
          className="bg-gradient-to-r from-accent to-accent2 text-white px-6 py-2.5 rounded-lg font-bold text-sm disabled:opacity-50 hover:-translate-y-0.5 transition-transform">
          {loading ? '🤔 Tekshirilmoqda...' : '✨ AI bilan tekshirish'}
        </button>
      </div>

      {error && <div className="bg-red/10 border border-red/30 text-red rounded-lg p-3 text-sm mb-4">{error}</div>}

      {loading && (
        <div className="text-center py-10 text-text2">
          <div className="inline-flex gap-1.5">
            <span className="w-2 h-2 rounded-full bg-accent animate-bounce" />
            <span className="w-2 h-2 rounded-full bg-accent animate-bounce [animation-delay:.2s]" />
            <span className="w-2 h-2 rounded-full bg-accent animate-bounce [animation-delay:.4s]" />
          </div>
          <p className="mt-3 text-sm">AI inshoyingizni tahlil qilmoqda...</p>
        </div>
      )}

      {result && (
        <div className="space-y-4">
          {/* Umumiy ball */}
          <div className="bg-bg2 border border-border1 rounded-xl p-6 text-center">
            <div className={`text-5xl font-bold ${scoreColor(result.score)}`}>{result.score}</div>
            <div className="text-text2 text-sm">/ 100</div>
            <div className="inline-block mt-2 px-4 py-1 rounded-full bg-accent/15 text-accent font-semibold text-sm">
              {result.grade}
            </div>
          </div>

          {/* Kriteriyalar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {[
              ['Mazmun', result.criteria?.content],
              ['Tuzilish', result.criteria?.structure],
              ['Grammatika', result.criteria?.grammar],
              ['Lug\'at', result.criteria?.vocabulary],
            ].map(([label, val]) => (
              <div key={label} className="bg-bg3 rounded-lg p-3 text-center">
                <div className={`text-xl font-bold ${scoreColor(val ?? 0)}`}>{val ?? '—'}</div>
                <div className="text-[11px] text-text2 mt-0.5">{label}</div>
              </div>
            ))}
          </div>

          {result.strengths && (
            <div className="bg-bg2 border border-green/30 rounded-xl p-4">
              <div className="font-semibold text-green text-sm mb-1.5">✅ Kuchli tomonlar</div>
              <p className="text-sm text-text2 leading-relaxed">{result.strengths}</p>
            </div>
          )}

          {result.weaknesses && (
            <div className="bg-bg2 border border-yellow/30 rounded-xl p-4">
              <div className="font-semibold text-yellow text-sm mb-1.5">⚠️ Yaxshilash kerak</div>
              <p className="text-sm text-text2 leading-relaxed">{result.weaknesses}</p>
            </div>
          )}

          {result.corrections?.length > 0 && (
            <div className="bg-bg2 border border-border1 rounded-xl p-4">
              <div className="font-semibold text-sm mb-3">🔧 Xato tuzatishlar</div>
              {result.corrections.map((c, i) => (
                <div key={i} className="mb-3 pb-3 border-b border-border1 last:border-0">
                  <div className="text-sm text-red line-through">{c.wrong}</div>
                  <div className="text-sm text-green">{c.fixed}</div>
                  {c.why && <div className="text-xs text-text2 mt-1">💡 {c.why}</div>}
                </div>
              ))}
            </div>
          )}

          {result.advice && (
            <div className="bg-accent/10 border border-accent/30 rounded-xl p-4">
              <div className="font-semibold text-accent text-sm mb-1.5">🎯 Maslahat</div>
              <p className="text-sm text-text2 leading-relaxed">{result.advice}</p>
            </div>
          )}

          <button onClick={() => { setResult(null); setText('') }}
            className="w-full bg-bg2 border border-border1 rounded-lg py-3 text-sm hover:border-accent">
            Yangi insho yozish
          </button>
        </div>
      )}
    </div>
  )
}
