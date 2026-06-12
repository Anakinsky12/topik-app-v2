import { useEffect, useState, useCallback } from 'react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../context/AuthContext'

// So'z progressi: cloud'dan o'qish + yozish
export function useWordProgress() {
  const { user } = useAuth()
  const [progress, setProgress] = useState({}) // { [word_id]: 'known' | 'unknown' }
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    if (!user) return
    supabase.from('word_progress').select('word_id,status').eq('user_id', user.id)
      .then(({ data }) => {
        const map = {}
        for (const row of data ?? []) map[row.word_id] = row.status
        setProgress(map)
        setLoaded(true)
      })
  }, [user])

  const setStatus = useCallback(async (wordId, status) => {
    setProgress(p => ({ ...p, [wordId]: status }))
    await supabase.from('word_progress').upsert({
      user_id: user.id,
      word_id: wordId,
      status,
      updated_at: new Date().toISOString(),
    })
  }, [user])

  const toggleLearned = useCallback((wordId) => {
    const next = progress[wordId] === 'known' ? 'unknown' : 'known'
    return setStatus(wordId, next)
  }, [progress, setStatus])

  const knownCount = Object.values(progress).filter(s => s === 'known').length

  return { progress, loaded, setStatus, toggleLearned, knownCount }
}
