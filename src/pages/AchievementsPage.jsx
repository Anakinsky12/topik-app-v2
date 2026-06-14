import { useEffect, useState } from 'react'
import { ACHIEVEMENTS } from '../data/achievements'
import { VOCAB } from '../data/vocab'
import { useWordProgress } from '../lib/useWordProgress'
import { supabase } from '../lib/supabase'
import { useAuth } from '../context/AuthContext'

export default function AchievementsPage() {
  const { user } = useAuth()
  const { progress, knownCount } = useWordProgress()
  const [tests, setTests] = useState([])
  const [examSet, setExamSet] = useState(false)

  useEffect(() => {
    if (!user) return
    supabase.from('test_history').select('score,total').eq('user_id', user.id)
      .then(({ data }) => setTests(data ?? []))
    supabase.from('profiles').select('exam_date').eq('id', user.id).single()
      .then(({ data }) => setExamSet(!!data?.exam_date))
  }, [user])

  // O'rganilgan darajalar
  const levels = new Set(VOCAB.filter(w => progress[w.id] === 'known').map(w => w.l))
  const bestTest = tests.length ? Math.max(...tests.map(t => t.score / t.total)) : 0

  // Yutuq ochilganmi tekshirish
  const isUnlocked = (id) => {
    if (id === 'first_word') return knownCount >= 1
    if (id === 'words_50') return knownCount >= 50
    if (id === 'words_100') return knownCount >= 100
    if (id === 'words_200') return knownCount >= 200
    if (id === 'words_300') return knownCount >= 300
    if (id === 'words_500') return knownCount >= 500
    if (id === 'words_1000') return knownCount >= 1000
    if (id === 'mock_first') return tests.length >= 1
    if (id === 'mock_pass') return bestTest >= 0.6
    if (id === 'mock_80') return bestTest >= 0.8
    if (id === 'all_levels') return levels.has('3-4') && levels.has('5-6')
    if (id === 'plan_setup') return examSet
    return false // streak, quiz, srs — keyinroq ulaymiz
  }

  const unlocked = ACHIEVEMENTS.filter(a => isUnlocked(a.id)).length

  return (
    <div className="max-w-3xl mx-auto px-5 py-8">
      <h1 className="text-3xl font-bold tracking-tight mb-1">🏆 Yutuqlar</h1>
      <p className="text-text2 text-sm mb-5">{unlocked} / {ACHIEVEMENTS.length} ochildi</p>

      <div className="bg-bg3 rounded-full h-2 overflow-hidden mb-6">
        <div className="bg-gradient-to-r from-yellow to-accent h-full transition-all"
          style={{ width: `${unlocked / ACHIEVEMENTS.length * 100}%` }} />
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {ACHIEVEMENTS.map(a => {
          const on = isUnlocked(a.id)
          return (
            <div key={a.id}
              className={`rounded-xl p-4 text-center border transition-all ${
                on ? 'bg-bg2 border-yellow/50' : 'bg-bg2/50 border-border1 opacity-50'
              }`}>
              <div className={`text-3xl mb-2 ${on ? '' : 'grayscale'}`}>{a.icon}</div>
              <div className="font-semibold text-sm">{a.name}</div>
              <div className="text-[11px] text-text2 mt-1">{a.desc}</div>
              {on && <div className="text-[10px] text-yellow mt-2 font-semibold">✓ OCHILDI</div>}
            </div>
          )
        })}
      </div>
    </div>
  )
}
