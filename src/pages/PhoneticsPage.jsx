import { PHONETICS } from '../data/phonetics'
import { SpeakButton } from '../components/Common'

export default function PhoneticsPage() {
  return (
    <div className="max-w-3xl mx-auto px-5 py-8">
      <div className="text-[11px] uppercase tracking-[0.2em] text-text3 mb-2 font-semibold">Materiallar</div>
      <h1 className="text-3xl font-bold tracking-tight mb-1">Talaffuz qoidalari</h1>
      <p className="text-text2 text-sm mb-5">Koreys fonetik qoidalari — yozilishi va o'qilishi farqi</p>

      {PHONETICS.rules.map((rule, i) => (
        <div key={i} className="bg-bg2 border border-border1 rounded-xl p-5 mb-4">
          <h3 className="font-bold text-accent mb-2">{rule.title}</h3>
          <p className="text-sm text-text2 mb-4 leading-relaxed">{rule.desc}</p>
          <div className="grid sm:grid-cols-2 gap-2">
            {rule.examples.map((ex, j) => (
              <div key={j} className="bg-bg3 rounded-lg p-3 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="font-semibold">{ex.w}</span>
                  <span className="text-text2">→</span>
                  <span className="text-green font-semibold">[{ex.s}]</span>
                </div>
                <SpeakButton text={ex.w} />
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}
