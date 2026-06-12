import { useEffect, useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { supabase } from '../lib/supabase'

export default function ProfilePage() {
  const { user, signOut } = useAuth()
  const [profile, setProfile] = useState({ display_name: '', target_level: 5, exam_date: '', daily_words: 20 })
  const [saving, setSaving] = useState(false)
  const [msg, setMsg] = useState('')

  useEffect(() => {
    if (!user) return
    supabase.from('profiles').select('*').eq('id', user.id).single()
      .then(({ data }) => {
        if (data) setProfile({
          display_name: data.display_name ?? '',
          target_level: data.target_level ?? 5,
          exam_date: data.exam_date ?? '',
          daily_words: data.daily_words ?? 20,
        })
      })
  }, [user])

  const save = async () => {
    setSaving(true); setMsg('')
    const { error } = await supabase.from('profiles').upsert({
      id: user.id,
      display_name: profile.display_name,
      target_level: Number(profile.target_level),
      exam_date: profile.exam_date || null,
      daily_words: Number(profile.daily_words),
      updated_at: new Date().toISOString(),
    })
    setSaving(false)
    setMsg(error ? `Xato: ${error.message}` : '✅ Saqlandi')
  }

  const set = (k) => (e) => setProfile(p => ({ ...p, [k]: e.target.value }))

  return (
    <div className="max-w-xl mx-auto p-5">
      <h1 className="text-2xl font-bold mb-1">👤 Profil</h1>
      <p className="text-text2 text-sm mb-6">{user?.email}</p>

      <div className="bg-bg2 border border-border1 rounded-2xl p-6 space-y-5">
        <label className="block">
          <span className="text-sm text-text2">Ism</span>
          <input value={profile.display_name} onChange={set('display_name')}
            placeholder="Ismingiz"
            className="mt-1 w-full bg-bg3 border border-border1 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-accent" />
        </label>

        <label className="block">
          <span className="text-sm text-text2">Maqsad daraja</span>
          <select value={profile.target_level} onChange={set('target_level')}
            className="mt-1 w-full bg-bg3 border border-border1 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-accent">
            <option value={3}>3-daraja</option>
            <option value={4}>4-daraja</option>
            <option value={5}>5-daraja</option>
            <option value={6}>6-daraja</option>
          </select>
        </label>

        <label className="block">
          <span className="text-sm text-text2">Imtihon sanasi</span>
          <input type="date" value={profile.exam_date} onChange={set('exam_date')}
            className="mt-1 w-full bg-bg3 border border-border1 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-accent" />
        </label>

        <label className="block">
          <span className="text-sm text-text2">Kunlik so'z soni</span>
          <input type="number" min="5" max="100" value={profile.daily_words} onChange={set('daily_words')}
            className="mt-1 w-full bg-bg3 border border-border1 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-accent" />
        </label>

        {msg && <p className="text-sm text-green">{msg}</p>}

        <div className="flex gap-3 pt-1">
          <button onClick={save} disabled={saving}
            className="flex-1 bg-gradient-to-r from-accent to-accent2 text-white rounded-lg py-2.5 text-sm font-bold disabled:opacity-50">
            {saving ? 'Saqlanmoqda...' : 'Saqlash'}
          </button>
          <button onClick={signOut}
            className="px-5 border border-border1 rounded-lg text-sm text-text2 hover:border-red hover:text-red transition-colors">
            Chiqish
          </button>
        </div>
      </div>
    </div>
  )
}
