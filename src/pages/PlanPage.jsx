import { useEffect, useMemo, useState } from 'react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../context/AuthContext'

const today = () => new Date().toISOString().slice(0, 10)

const TASKS = [
  { id: 'vocab', title: "So'z o'rganish", sub: 'Flashcard yoki lug\'at sahifasida', xp: 30 },
  { id: 'grammar', title: 'Grammatika takrorlash', sub: '5 ta pattern ko\'rib chiqing', xp: 20 },
  { id: 'test', title: 'Mini test', sub: 'Mock test yoki quiz', xp: 30 },
  { id: 'writing', title: 'Yozuv mashqi', sub: '51/52-savol shablonini o\'qing', xp: 20 },
]

export default function PlanPage() {
  const { user } = useAuth()
  const [examDate, setExamDate] = useState('')
  const [doneTasks, setDoneTasks] = useState([])
  const [activity, setActivity] = useState([]) // last 21 days

  useEffect(() => {
    if (!user) return
    supabase.from('profiles').select('exam_date').eq('id', user.id).single()
      .then(({ data }) => data?.exam_date && setExamDate(data.exam_date))
    const since = new Date(Date.now() - 21 * 864e5).toISOString().slice(0, 10)
    supabase.from('daily_activity').select('*').eq('user_id', user.id).gte('day', since)
      .then(({ data }) => {
        setActivity(data ?? [])
        const t = (data ?? []).find(d => d.day === today())
        if (t?.tasks_done) setDoneTasks(TASKS.slice(0, t.tasks_done).map(x => x.id))
      })
  }, [user])

  const saveExamDate = async (date) => {
    setExamDate(date)
    await supabase.from('profiles').upsert({ id: user.id, exam_date: date || null })
  }

  const toggleTask = async (taskId) => {
    const next = doneTasks.includes(taskId)
      ? doneTasks.filter(t => t !== taskId)
      : [...doneTasks, taskId]
    setDoneTasks(next)
    const xp = TASKS.filter(t => next.includes(t.id)).reduce((s, t) => s + t.xp, 0)
    await supabase.from('daily_activity').upsert({
      user_id: user.id, day: today(), tasks_done: next.length, xp,
    })
  }

  const daysLeft = useMemo(() => {
    if (!examDate) return null
    return Math.ceil((new Date(examDate) - new Date()) / 864e5)
  }, [examDate])

  const streak = useMemo(() => {
    const days = new Set(activity.filter(a => a.tasks_done > 0).map(a => a.day))
    let s = 0
    for (let i = 0; ; i++) {
      const d = new Date(Date.now() - i * 864e5).toISOString().slice(0, 10)
      if (days.has(d)) s++
      else if (i === 0) continue // bugun hali boshlanmagan bo'lishi mumkin
      else break
    }
    return s
  }, [activity])

  const xpToday = TASKS.filter(t => doneTasks.includes(t.id)).reduce((s, t) => s + t.xp, 0)

  const last21 = Array.from({ length: 21 }, (_, i) => {
    const d = new Date(Date.now() - (20 - i) * 864e5).toISOString().slice(0, 10)
    return { day: d, active: activity.some(a => a.day === d && a.tasks_done > 0), isToday: d === today() }
  })

  return (
    <div className="max-w-3xl mx-auto p-5">
      <h1 className="text-2xl font-bold mb-5">📅 Kunlik Reja</h1>

      <div className="grid grid-cols-3 gap-3 mb-5">
        <div className="bg-bg2 border border-yellow/50 rounded-xl p-4 text-center">
          <div className="text-3xl font-bold text-yellow">{streak}</div>
          <div className="text-xs text-text2 mt-1">kun streak 🔥</div>
        </div>
        <div className="bg-bg2 border border-border1 rounded-xl p-4 text-center">
          <div className="text-3xl font-bold text-accent">{daysLeft ?? '—'}</div>
          <div className="text-xs text-text2 mt-1">kun qoldi</div>
        </div>
        <div className="bg-bg2 border border-border1 rounded-xl p-4 text-center">
          <div className="text-3xl font-bold text-green">{xpToday}</div>
          <div className="text-xs text-text2 mt-1">XP bugun</div>
        </div>
      </div>

      <div className="bg-bg2 border border-border1 rounded-xl p-5 mb-5">
        <label className="text-sm text-text2">🎯 Imtihon sanasi</label>
        <input type="date" value={examDate} onChange={e => saveExamDate(e.target.value)}
          className="mt-2 block bg-bg3 border border-border1 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-accent" />
      </div>

      <div className="bg-bg2 border border-border1 rounded-xl p-5 mb-5">
        <h2 className="font-semibold mb-3">📆 So'nggi 21 kun
          <span className="text-text2 text-sm font-normal ml-2">
            {last21.filter(d => d.active).length} aktiv kun
          </span>
        </h2>
        <div className="grid grid-cols-7 gap-1.5">
          {last21.map(d => (
            <div key={d.day} title={d.day}
              className={`aspect-square rounded-md flex items-center justify-center text-[10px] font-semibold ${
                d.active ? 'bg-green text-[#0f1c16]' : 'bg-bg3 text-text2'
              } ${d.isToday ? 'ring-2 ring-accent' : ''}`}>
              {Number(d.day.slice(8))}
            </div>
          ))}
        </div>
      </div>

      <h2 className="font-semibold mb-3">📋 Bugungi vazifalar</h2>
      <div className="grid gap-2.5">
        {TASKS.map(t => {
          const done = doneTasks.includes(t.id)
          return (
            <button key={t.id} onClick={() => toggleTask(t.id)}
              className={`flex items-center gap-3.5 text-left bg-bg2 border rounded-xl p-4 transition-colors ${
                done ? 'border-green bg-green/5' : 'border-border1 hover:border-accent'
              }`}>
              <span className={`w-6 h-6 rounded-full border-2 flex items-center justify-center text-xs flex-shrink-0 ${
                done ? 'bg-green border-green text-white' : 'border-border1'
              }`}>{done && '✓'}</span>
              <span className="flex-1">
                <span className="block text-sm font-semibold">{t.title}</span>
                <span className="block text-xs text-text2 mt-0.5">{t.sub}</span>
              </span>
              <span className="text-xs text-accent font-bold">+{t.xp} XP</span>
            </button>
          )
        })}
      </div>
    </div>
  )
}
