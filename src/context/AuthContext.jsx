import { createContext, useContext, useState } from 'react'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [doctor, setDoctor] = useState(
    JSON.parse(localStorage.getItem('doctor')) || null
  )

  const login = (doctorData) => {
    localStorage.setItem('doctor', JSON.stringify(doctorData))
    setDoctor(doctorData)
  }

  const logout = () => {
    localStorage.removeItem('doctor')
    setDoctor(null)
  }

  return (
    <AuthContext.Provider value={{ doctor, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}