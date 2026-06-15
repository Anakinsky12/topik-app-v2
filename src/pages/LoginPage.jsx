import { useState } from 'react'
import { useNavigate, Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function LoginPage() {
  const { user, signInEmail, signUpEmail, signInGoogle } = useAuth()
  const navigate = useNavigate()
  const [mode, setMode] = useState('login') // 'login' | 'signup'
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [info, setInfo] = useState('')
  const [busy, setBusy] = useState(false)

  if (user) return <Navigate to="/" replace />

  const handleSubmit = async () => {
    setError(''); setInfo(''); setBusy(true)
    try {
      if (mode === 'login') {
        const { error } = await signInEmail(email, password)
        if (error) throw error
        navigate('/')
      } else {
        const { error } = await signUpEmail(email, password)
        if (error) throw error
        setInfo("Email'ingizga tasdiqlash xati yuborildi. Pochtangizni tekshiring.")
      }
    } catch (e) {
      setError(e.message === 'Invalid login credentials'
        ? "Email yoki parol noto'g'ri"
        : e.message)
    } finally {
      setBusy(false)
    }
  }

  const handleGoogle = async () => {
    setError('')
    const { error } = await signInGoogle()
    if (error) setError(error.message)
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-5">
      <div className="w-full max-w-md bg-bg2 border border-border1 rounded-2xl p-8">
        <div className="text-center mb-7">
          <div className="text-[11px] uppercase tracking-[0.2em] text-text3 mb-2 font-semibold">한국어 · O'zbek</div>
          <h1 className="text-2xl font-bold tracking-tight">TOPIK II Trener</h1>
          <p className="text-text2 text-sm mt-1.5">
            {mode === 'login' ? 'Hisobingizga kiring' : "Yangi hisob yarating"}
          </p>
        </div>

        <button
          onClick={handleGoogle}
          className="w-full flex items-center justify-center gap-3 bg-bg3 border border-border1 rounded-lg py-3 text-sm font-semibold hover:border-accent transition-colors"
        >
          <svg width="18" height="18" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.27-4.74 3.27-8.1z"/>
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
            <path fill="#FBBC05" d="M5.84 14.1c-.22-.66-.35-1.36-.35-2.1s.13-1.44.35-2.1V7.06H2.18A10.96 10.96 0 0 0 1 12c0 1.78.43 3.45 1.18 4.94l3.66-2.84z"/>
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
          </svg>
          Google bilan kirish
        </button>

        <div className="flex items-center gap-3 my-5">
          <div className="flex-1 h-px bg-border1" />
          <span className="text-text2 text-xs">yoki</span>
          <div className="flex-1 h-px bg-border1" />
        </div>

        <div className="space-y-3">
          <input
            type="email" value={email} onChange={e => setEmail(e.target.value)}
            placeholder="Email"
            className="w-full bg-bg3 border border-border1 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-accent"
          />
          <input
            type="password" value={password} onChange={e => setPassword(e.target.value)}
            placeholder="Parol (kamida 6 belgi)"
            onKeyDown={e => e.key === 'Enter' && handleSubmit()}
            className="w-full bg-bg3 border border-border1 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-accent"
          />
        </div>

        {error && <p className="text-red text-sm mt-3">{error}</p>}
        {info && <p className="text-green text-sm mt-3">{info}</p>}

        <button
          onClick={handleSubmit} disabled={busy || !email || password.length < 6}
          className="w-full mt-5 bg-gradient-to-r from-accent to-accent2 text-white rounded-lg py-3 text-sm font-bold disabled:opacity-50 hover:-translate-y-0.5 transition-transform"
        >
          {busy ? 'Kutilmoqda...' : mode === 'login' ? 'Kirish' : "Ro'yxatdan o'tish"}
        </button>

        <button
          onClick={() => { setMode(mode === 'login' ? 'signup' : 'login'); setError(''); setInfo('') }}
          className="w-full mt-4 text-text2 text-sm hover:text-text1 transition-colors"
        >
          {mode === 'login' ? "Hisob yo'qmi? Ro'yxatdan o'ting" : 'Hisobingiz bormi? Kiring'}
        </button>
      </div>
    </div>
  )
}
