import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Layout() {
  const { doctor, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  const navItems = [
    { to: '/dashboard', label: 'Dashboard', icon: '▦' },
    { to: '/scan',      label: 'New Scan',  icon: '⊕' },
    { to: '/patients',  label: 'Patients',  icon: '♡' },
    { to: '/profile',   label: 'My Profile', icon: '◉' },
  ]

  return (
    <div className="flex h-screen bg-gray-50">

      {/* Sidebar */}
      <aside className="w-52 bg-white border-r border-gray-100 flex flex-col flex-shrink-0">

        {/* Logo */}
<div className="p-4 border-b border-gray-100">
  <div className="flex items-center gap-2">
    <img
      src="/src/assets/logo.png"
      alt="Beacon"
      className="h-15 w-auto object-contain"
    />
  </div>
  <p className="text-gray-400 text-xs mt-1">Breast Cancer Detection</p>
</div>

        {/* Nav */}
        <nav className="flex-1 p-2 space-y-0.5">
          {navItems.map(item => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors
                 ${isActive
                   ? 'bg-sky-50 text-sky-700 font-medium'
                   : 'text-gray-500 hover:bg-gray-50 hover:text-gray-700'}`
              }
            >
              <span className="text-base">{item.icon}</span>
              {item.label}
            </NavLink>
          ))}
        </nav>

        {/* Doctor info */}
        <div className="p-3 border-t border-gray-100">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-8 h-8 rounded-full bg-sky-50 flex items-center justify-center
                            text-xs font-medium text-sky-700 flex-shrink-0">
              {doctor?.name?.split(' ').map(n => n[0]).join('').slice(0, 2)}
            </div>
            <div className="min-w-0">
              <p className="text-xs font-medium text-gray-700 truncate">{doctor?.name}</p>
              <p className="text-xs text-gray-400 truncate">{doctor?.role}</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="w-full text-xs text-gray-400 hover:text-red-500 transition-colors
                       py-1.5 rounded-lg hover:bg-red-50 text-center"
          >
            Sign out
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 overflow-y-auto">
        <Outlet />
      </main>

    </div>
  )
}