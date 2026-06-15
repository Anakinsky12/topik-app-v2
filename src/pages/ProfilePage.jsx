import { useEffect, useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { useLang } from '../context/LanguageContext'
import { supabase } from '../lib/supabase'
import { VOCAB } from '../data/vocab'
import { useWordProgress } from '../lib/useWordProgress'
import { useSRS } from '../lib/useSRS'

export default function ProfilePage() {
  const { user, signOut } = useAuth()
  const { t } = useLang()
  const { knownCount } = useWordProgress()
  const { masteredCount, dueCount } = useSRS()
  const [profile, setProfile] = useState({ display_name: '', target_level: 5, exam_date: '', daily_words: 20 })
  const [saving, setSaving] = useState(false)
  const [msg, setMsg] = useState('')
  const [editing, setEditing] = useState(false)

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
    if (error) { setMsg(`Xato: ${error.message}`) }
    else { setMsg(t('saved')); setEditing(false); setTimeout(() => setMsg(''), 2000) }
  }

  const set = (k) => (e) => setProfile(p => ({ ...p, [k]: e.target.value }))

  const name = profile.display_name || user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'Foydalanuvchi'
  const initial = name.charAt(0).toUpperCase()
  const pct = Math.round(knownCount / VOCAB.length * 100)

  // Imtihongacha necha kun
  let daysLeft = null
  if (profile.exam_date) {
    const diff = Math.ceil((new Date(profile.exam_date) - new Date()) / (1000 * 60 * 60 * 24))
    daysLeft = diff
  }

  return (
    <div className="max-w-xl mx-auto px-5 py-8 fade-up">
      {/* Avatar + ism */}
      <div className="flex items-center gap-4 mb-7">
        <div className="w-16 h-16 rounded-2xl bg-accent2 grid place-items-center text-2xl font-bold text-white shrink-0">
          {initial}
        </div>
        <div className="min-w-0">
          <h1 className="text-2xl font-bold tracking-tight truncate">{name}</h1>
          <p className="text-text2 text-sm truncate">{user?.email}</p>
        </div>
      </div>

      {/* Maqsad bayrog'i */}
      <div className="flex items-center gap-3 mb-4">
        <div className="flex-1 bg-bg2 border border-border1 rounded-xl px-4 py-3">
          <div className="text-[11px] uppercase tracking-wider text-text3 font-semibold">Maqsad</div>
          <div className="tabular text-xl font-bold text-accent mt-0.5">{profile.target_level}급</div>
        </div>
        {daysLeft !== null && (
          <div className="flex-1 bg-bg2 border border-border1 rounded-xl px-4 py-3">
            <div className="text-[11px] uppercase tracking-wider text-text3 font-semibold">Imtihongacha</div>
            <div className={`tabular text-xl font-bold mt-0.5 ${daysLeft < 0 ? 'text-text2' : daysLeft <= 30 ? 'text-red' : 'text-text1'}`}>
              {daysLeft < 0 ? t('examPassed') : `${daysLeft} ${t('days')}`}
            </div>
          </div>
        )}
      </div>

      {/* Statistika */}
      <div className="grid grid-cols-3 gap-px bg-border1 rounded-2xl overflow-hidden mb-3">
        {[
          [knownCount, t('learned')],
          [masteredCount, t('mastered')],
          [`${pct}%`, t('progress')],
        ].map(([num, label]) => (
          <div key={label} className="bg-bg2 px-4 py-4 text-center">
            <div className="tabular text-xl font-bold">{num}</div>
            <div className="text-[10px] uppercase tracking-wider text-text3 mt-1 font-semibold">{label}</div>
          </div>
        ))}
      </div>

      {/* Progress chizig'i */}
      <div className="flex items-center gap-3 mb-7 px-1">
        <div className="flex-1 bg-bg3 rounded-full h-1.5 overflow-hidden">
          <div className="bg-accent h-full rounded-full transition-all duration-700" style={{ width: `${pct}%` }} />
        </div>
        <span className="tabular text-xs text-text2 font-semibold">{knownCount}/{VOCAB.length}</span>
      </div>

      {/* Sozlamalar */}
      <div className="bg-bg2 border border-border1 rounded-2xl overflow-hidden">
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-border1">
          <h2 className="text-[11px] uppercase tracking-[0.2em] text-text3 font-semibold">Sozlamalar</h2>
          {!editing && (
            <button onClick={() => setEditing(true)} className="text-xs text-accent font-semibold hover:underline">Tahrirlash</button>
          )}
        </div>

        {!editing ? (
          <div className="divide-y divide-border1">
            <Row label={t('name')} value={profile.display_name || '—'} />
            <Row label={t('targetLevel')} value={`${profile.target_level}급`} />
            <Row label={t('examDate')} value={profile.exam_date || t('notSet')} />
            <Row label={t('dailyWords')} value={profile.daily_words} />
          </div>
        ) : (
          <div className="p-5 space-y-4">
            <Field label={t('name')}>
              <input value={profile.display_name} onChange={set('display_name')} placeholder={t('name')}
                className="w-full bg-bg3 border border-border1 rounded-lg px-3.5 py-2.5 text-sm focus:outline-none focus:border-accent" />
            </Field>
            <Field label={t('targetLevel')}>
              <select value={profile.target_level} onChange={set('target_level')}
                className="w-full bg-bg3 border border-border1 rounded-lg px-3.5 py-2.5 text-sm focus:outline-none focus:border-accent">
                {[3, 4, 5, 6].map(l => <option key={l} value={l}>{l}급</option>)}
              </select>
            </Field>
            <Field label={t('examDate')}>
              <input type="date" value={profile.exam_date} onChange={set('exam_date')}
                className="w-full bg-bg3 border border-border1 rounded-lg px-3.5 py-2.5 text-sm focus:outline-none focus:border-accent" />
            </Field>
            <Field label={t('dailyWords')}>
              <input type="number" min="5" max="100" value={profile.daily_words} onChange={set('daily_words')}
                className="w-full bg-bg3 border border-border1 rounded-lg px-3.5 py-2.5 text-sm focus:outline-none focus:border-accent" />
            </Field>
            <div className="flex gap-2.5 pt-1">
              <button onClick={save} disabled={saving}
                className="flex-1 bg-accent text-white rounded-lg py-2.5 text-sm font-bold hover:bg-accent2 transition-colors disabled:opacity-50">
                {saving ? t('saving') : t('save')}
              </button>
              <button onClick={() => setEditing(false)}
                className="px-5 border border-border1 rounded-lg text-sm text-text2 hover:text-text1 transition-colors">
                Bekor
              </button>
            </div>
          </div>
        )}
      </div>

      {msg && <p className="text-sm text-green text-center mt-3">{msg}</p>}

      {/* Chiqish */}
      <button onClick={signOut}
        className="w-full mt-4 border border-border1 rounded-xl py-3 text-sm text-text2 hover:border-red/50 hover:text-red transition-colors">
        Hisobdan chiqish
      </button>
    </div>
  )
}

function Row({ label, value }) {
  return (
    <div className="flex justify-between items-center px-5 py-3.5">
      <span className="text-sm text-text2">{label}</span>
      <span className="text-sm font-medium">{value}</span>
    </div>
  )
}

function Field({ label, children }) {
  return (
    <label className="block">
      <span className="text-[13px] text-text2 mb-1.5 block">{label}</span>
      {children}
    </label>
  )
}
