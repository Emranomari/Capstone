import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Login() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({ email: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    // مؤقتاً بدون API — بنربطها لاحقاً مع Flask
    if (form.email === 'doctor@mammoscan.com' && form.password === '1234') {
      login({ name: 'Dr. Khalid', email: form.email, role: 'Radiologist' })
      navigate('/dashboard')
    } else {
      setError('Invalid email or password')
    }
    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-sky-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">

     {/* Logo */}
<div className="text-center mb-8">
  <div className="inline-flex items-center justify-center mb-4">
    <img
      src="/src/assets/logo.png"
      alt="Beacon"
      className="h-15 w-auto object-contain
                 rounded-lg border border-gray-200 p-1  "
    />
  </div>
  <p className="text-sm text-gray-400 mt-1">Breast Cancer Detection System</p>
</div>

        {/* Card */}
        <div className="bg-white rounded-2xl border border-gray-100 p-8">
          <h2 className="text-base font-medium text-gray-700 mb-6">Sign in to your account</h2>

          <form onSubmit={handleSubmit} className="space-y-4">

            {/* Email */}
            <div>
              <label className="block text-xs text-gray-500 mb-1.5">Email address</label>
              <input
                type="email"
                required
                placeholder="doctor@mammoscan.com"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="w-full px-3 py-2.5 rounded-lg border border-gray-200 text-sm
                           focus:outline-none focus:border-sky-400 focus:ring-2 focus:ring-sky-100
                           placeholder:text-gray-300 transition-all"
              />
            </div>

            {/* Password */}
            <div>
              <label className="block text-xs text-gray-500 mb-1.5">Password</label>
              <input
                type="password"
                required
                placeholder="••••••••"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                className="w-full px-3 py-2.5 rounded-lg border border-gray-200 text-sm
                           focus:outline-none focus:border-sky-400 focus:ring-2 focus:ring-sky-100
                           placeholder:text-gray-300 transition-all"
              />
            </div>

            {/* Error */}
            {error && (
              <div className="bg-red-50 border border-red-100 text-red-600 text-xs rounded-lg px-3 py-2.5">
                {error}
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-sky-500 hover:bg-sky-600 text-white font-medium
                         py-2.5 rounded-lg text-sm transition-colors disabled:opacity-60 mt-2"
            >
              {loading ? 'Signing in...' : 'Sign in'}
            </button>

          </form>
        </div>

        <p className="text-center text-xs text-gray-400 mt-6">
          MammoScan AI · For authorized medical staff only
        </p>
      </div>
    </div>
  )
}