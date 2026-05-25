import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from './context/AuthContext'
import Layout from './components/Layout'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import Scan from './pages/Scan'
import Patients from './pages/Patients'
import Profile from './pages/Profile'

function ProtectedRoute({ children }) {
  const { doctor } = useAuth()
  return doctor ? children : <Navigate to="/login" />
}

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/" element={
        <ProtectedRoute>
          <Layout />
        </ProtectedRoute>
      }>
        <Route index element={<Navigate to="/dashboard" />} />
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="scan" element={<Scan />} />
        <Route path="patients" element={<Patients />} />
        <Route path="profile" element={<Profile />} />
      </Route>
    </Routes>
  )
}