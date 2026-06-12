import { BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom'
import { AuthProvider, useAuth } from './context/AuthContext'
import Navbar from './components/Navbar'
import LoginPage from './pages/LoginPage'
import Dashboard from './pages/Dashboard'
import ProfilePage from './pages/ProfilePage'
import VocabPage from './pages/VocabPage'
import FlashcardPage from './pages/FlashcardPage'
import GrammarPage from './pages/GrammarPage'
import MockTestPage from './pages/MockTestPage'
import StatsPage from './pages/StatsPage'
import PlanPage from './pages/PlanPage'

function Protected() {
  const { user, loading } = useAuth()
  if (loading) return (
    <div className="min-h-screen flex items-center justify-center text-text2">
      Yuklanmoqda...
    </div>
  )
  if (!user) return <Navigate to="/login" replace />
  return (
    <>
      <Navbar />
      <Outlet />
    </>
  )
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route element={<Protected />}>
            <Route path="/" element={<Dashboard />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/vocab" element={<VocabPage />} />
            <Route path="/flashcard" element={<FlashcardPage />} />
            <Route path="/grammar" element={<GrammarPage />} />
            <Route path="/mock-test" element={<MockTestPage />} />
            <Route path="/stats" element={<StatsPage />} />
            <Route path="/plan" element={<PlanPage />} />
          </Route>
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}
