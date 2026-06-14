import { useEffect, useState } from 'react'
import { speakKorean, ttsSupported } from '../lib/tts'

// 🔊 Koreyscha ovoz tugmasi
export function SpeakButton({ text, size = 'sm', className = '' }) {
  if (!ttsSupported || !text) return null
  const px = size === 'lg' ? 'text-xl' : 'text-base'
  return (
    <button
      onClick={(e) => { e.stopPropagation(); speakKorean(text) }}
      className={`${px} hover:scale-125 transition-transform opacity-70 hover:opacity-100 ${className}`}
      title="Tinglash"
      type="button"
    >🔊</button>
  )
}

const WEEKDAYS_UZ = ['Yakshanba', 'Dushanba', 'Seshanba', 'Chorshanba', 'Payshanba', 'Juma', 'Shanba']
const WEEKDAYS_KO = ['일', '월', '화', '수', '목', '금', '토']

// 🕐 Real vaqt soati (fonda ishlaydi)
export function LiveClock() {
  const [now, setNow] = useState(new Date())
  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 1000)
    return () => clearInterval(t)
  }, [])

  const time = now.toLocaleTimeString('uz', { hour: '2-digit', minute: '2-digit', second: '2-digit' })
  const dateStr = `${now.getFullYear()}.${String(now.getMonth() + 1).padStart(2, '0')}.${String(now.getDate()).padStart(2, '0')}`
  const wd = now.getDay()

  return (
    <div className="text-right leading-tight">
      <div className="text-sm font-bold tabular text-accent">{time}</div>
      <div className="text-[10px] text-text2">
        {dateStr} ({WEEKDAYS_KO[wd]}) · {WEEKDAYS_UZ[wd]}
      </div>
    </div>
  )
}
