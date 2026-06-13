import { useState } from 'react'
import { DIALOGS } from '../data/dialogs'
import { SpeakButton } from '../components/Common'

export default function DialogsPage() {
  const [active, setActive] = useState(null)

  if (active) {
    const d = active
    return (
      <div className="max-w-3xl mx-auto p-5">
        <button onClick={() => setActive(null)} className="text-text2 text-sm hover:text-text1 mb-4">← Orqaga</button>
        <div className="flex items-center gap-3 mb-1">
          <span className="text-3xl">{d.icon}</span>
          <div>
            <h1 className="text-2xl font-bold">{d.title} <span className="text-text2 text-lg">{d.titleKor}</span></h1>
            <span className={`text-[11px] px-2 py-0.5 rounded-full font-semibold ${d.level === '3-4' ? 'bg-yellow/15 text-yellow' : 'bg-accent/15 text-accent'}`}>{d.level}</span>
          </div>
        </div>
        <p className="text-text2 text-sm mb-5">{d.situation}</p>

        {/* Suhbat */}
        {d.dialogs?.map((conv, ci) => (
          <div key={ci} className="bg-bg2 border border-border1 rounded-xl p-4 mb-5">
            <h3 className="font-semibold mb-3 text-accent">💬 Suhbat</h3>
            {conv.lines.map((line, li) => (
              <div key={li} className="mb-3 pb-3 border-b border-border1 last:border-0">
                <div className="text-xs text-text2 mb-1">{line.who}</div>
                <div className="text-[15px] flex items-start gap-2">
                  <span>{line.text}</span>
                  <SpeakButton text={line.text} />
                </div>
                <div className="text-sm text-text2 mt-0.5">{line.uz}</div>
              </div>
            ))}
          </div>
        ))}

        {/* Lug'at */}
        <div className="bg-bg2 border border-border1 rounded-xl p-4 mb-5">
          <h3 className="font-semibold mb-3">📖 Lug'at</h3>
          <div className="grid sm:grid-cols-2 gap-2">
            {d.vocab.map((v, i) => (
              <div key={i} className="bg-bg3 rounded-lg p-2.5">
                <div className="flex items-center gap-2">
                  <span className="font-semibold">{v.kor}</span>
                  <SpeakButton text={v.kor} />
                </div>
                <div className="text-sm text-text2">{v.uz}</div>
                {v.ex && <div className="text-xs text-text2 mt-1">{v.ex}</div>}
              </div>
            ))}
          </div>
        </div>

        {/* Iboralar */}
        <div className="bg-bg2 border border-border1 rounded-xl p-4 mb-5">
          <h3 className="font-semibold mb-3">🗣 Foydali iboralar</h3>
          {d.phrases.map((p, i) => (
            <div key={i} className="flex items-start gap-2 py-2 border-b border-border1 last:border-0">
              <SpeakButton text={p.kor} />
              <div>
                <div className="text-[15px]">{p.kor}</div>
                <div className="text-sm text-text2">{p.uz}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Grammatika */}
        {d.grammar?.length > 0 && (
          <div className="bg-bg2 border border-border1 rounded-xl p-4">
            <h3 className="font-semibold mb-3">📝 Grammatika</h3>
            {d.grammar.map((g, i) => (
              <div key={i} className="py-2 border-b border-border1 last:border-0">
                <div className="text-accent font-semibold">{g.pattern}</div>
                <div className="text-sm">{g.meaning}</div>
                <div className="text-sm text-text2 mt-0.5">{g.ex}</div>
              </div>
            ))}
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="max-w-3xl mx-auto p-5">
      <h1 className="text-2xl font-bold mb-1">💬 Dialoglar ({DIALOGS.length})</h1>
      <p className="text-text2 text-sm mb-5">Hayotiy vaziyatlar bo'yicha suhbatlar — audio bilan</p>
      <div className="grid sm:grid-cols-2 gap-3">
        {DIALOGS.map(d => (
          <button key={d.id} onClick={() => setActive(d)}
            className="text-left bg-bg2 border border-border1 rounded-xl p-4 hover:border-accent hover:-translate-y-0.5 transition-all">
            <div className="text-2xl mb-1">{d.icon}</div>
            <div className="font-semibold">{d.title} <span className="text-text2 text-sm">{d.titleKor}</span></div>
            <div className="text-xs text-text2 mt-1">{d.situation}</div>
          </button>
        ))}
      </div>
    </div>
  )
}
