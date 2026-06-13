import { useEffect, useState, useCallback } from 'react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../context/AuthContext'

// SRS oraliqlari (kun) — Leitner tizimi
// level 0 → 0 kun (bugun), 1 → 1, 2 → 3, 3 → 7, 4 → 14, 5 → 30, 6+ → 60
const INTERVALS = [0, 1, 3, 7, 14, 30, 60]

function nextInterval(level) {
  return INTERVALS[Math.min(level, INTERVALS.length - 1)]
}

export function useSRS() {
  const { user } = useAuth()
  const [rows, setRows] = useState({}) // { word_id: {status, srs_level, next_review} }
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    if (!user) return
    supabase.from('word_progress')
      .select('word_id,status,srs_level,next_review')
      .eq('user_id', user.id)
      .then(({ data }) => {
        const map = {}
        for (const r of data ?? []) map[r.word_id] = r
        setRows(map)
        setLoaded(true)
      })
  }, [user])

  // Javob: to'g'ri (again=false) yoki noto'g'ri (again=true)
  const review = useCallback(async (wordId, correct) => {
    const cur = rows[wordId] ?? { srs_level: 0 }
    const newLevel = correct ? (cur.srs_level ?? 0) + 1 : 0
    const days = nextInterval(newLevel)
    const next = new Date(Date.now() + days * 864e5).toISOString()
    const status = newLevel >= 4 ? 'known' : 'review'

    const updated = { word_id: wordId, status, srs_level: newLevel, next_review: next }
    setRows(p => ({ ...p, [wordId]: updated }))

    await supabase.from('word_progress').upsert({
      user_id: user.id,
      ...updated,
      updated_at: new Date().toISOString(),
    })
  }, [rows, user])

  // Bugun takrorlash kerak bo'lgan so'z id'lari
  const dueIds = useCallback(() => {
    const now = Date.now()
    return Object.values(rows)
      .filter(r => r.next_review && new Date(r.next_review).getTime() <= now && r.status !== 'known')
      .map(r => r.word_id)
  }, [rows])

  const dueCount = Object.values(rows).filter(
    r => r.next_review && new Date(r.next_review).getTime() <= Date.now() && r.status !== 'known'
  ).length

  const masteredCount = Object.values(rows).filter(r => r.status === 'known').length

  return { rows, loaded, review, dueIds, dueCount, masteredCount }
}
