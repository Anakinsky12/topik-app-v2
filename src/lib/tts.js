// Koreyscha matnni ovozda o'qish — brauzer TTS (bepul)
let koVoice = null

function pickKoreanVoice() {
  if (koVoice) return koVoice
  const voices = window.speechSynthesis?.getVoices() ?? []
  koVoice = voices.find(v => v.lang === 'ko-KR') || voices.find(v => v.lang?.startsWith('ko')) || null
  return koVoice
}

// Ovozlar asinxron yuklanadi
if (typeof window !== 'undefined' && window.speechSynthesis) {
  window.speechSynthesis.onvoiceschanged = () => { koVoice = null; pickKoreanVoice() }
}

export function speakKorean(text, rate = 0.9) {
  if (!window.speechSynthesis) return
  window.speechSynthesis.cancel()
  const u = new SpeechSynthesisUtterance(text)
  u.lang = 'ko-KR'
  u.rate = rate
  const v = pickKoreanVoice()
  if (v) u.voice = v
  window.speechSynthesis.speak(u)
}

export const ttsSupported = typeof window !== 'undefined' && !!window.speechSynthesis
