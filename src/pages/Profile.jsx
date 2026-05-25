import { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { useToast } from '../context/ToastContext'

const ACTIVITY = [
  { label: 'Total scans',    value: 284, color: 'text-sky-600',   bg: 'bg-sky-50'   },
  { label: 'Positive cases', value: 41,  color: 'text-red-600',   bg: 'bg-red-50'   },
  { label: 'Negative cases', value: 235, color: 'text-green-700', bg: 'bg-green-50' },
  { label: 'Pending review', value: 8,   color: 'text-amber-600', bg: 'bg-amber-50' },
]

export default function Profile() {
  const { doctor, login } = useAuth()
  const { addToast }      = useToast()

  const [info, setInfo] = useState({
    name:           doctor?.name  || '',
    email:          doctor?.email || '',
    phone:          '0791234567',
    specialization: 'Radiology',
    hospital:       'King Hussein Medical Center',
  })

  const [editing, setEditing] = useState(false)

  const [passwords, setPasswords] = useState({
    current: '', next: '', confirm: '',
  })
  const [passError, setPassError] = useState('')

  const handleSaveInfo = () => {
    if (!info.name || !info.email) return
    login({ ...doctor, name: info.name, email: info.email })
    setEditing(false)
    addToast('Profile updated successfully', 'success')
  }

  const handleChangePassword = () => {
    setPassError('')
    if (!passwords.current || !passwords.next || !passwords.confirm) {
      setPassError('Please fill in all password fields')
      return
    }
    if (passwords.next.length < 4) {
      setPassError('New password must be at least 4 characters')
      return
    }
    if (passwords.next !== passwords.confirm) {
      setPassError('Passwords do not match')
      return
    }
    setPasswords({ current: '', next: '', confirm: '' })
    addToast('Password changed successfully', 'success')
  }

  const initials = info.name
    .split(' ')
    .map(n => n[0])
    .join('')
    .slice(0, 2)
    .toUpperCase()

  return (
    <div className="p-6 max-w-2xl mx-auto space-y-5">

      <div>
        <h1 className="text-lg font-medium text-gray-800">My Profile</h1>
        <p className="text-xs text-gray-400 mt-0.5">Manage your account information</p>
      </div>

      {/* Avatar Card */}
      <div className="bg-white border border-gray-100 rounded-xl p-6">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-sky-50 flex items-center
                          justify-center text-sky-700 text-xl font-medium flex-shrink-0">
            {initials}
          </div>
          <div>
            <p className="text-base font-medium text-gray-800">{info.name}</p>
            <p className="text-sm text-gray-400">{info.specialization}</p>
            <p className="text-xs text-gray-300 mt-0.5">{info.hospital}</p>
          </div>
        </div>
      </div>

      {/* Personal Info */}
      <div className="bg-white border border-gray-100 rounded-xl p-5 space-y-4">
        <div className="flex items-center justify-between">
          <p className="text-sm font-medium text-gray-700">Personal information</p>
          {!editing ? (
            <button
              onClick={() => setEditing(true)}
              className="text-xs text-sky-500 hover:text-sky-600 px-3 py-1.5
                         rounded-lg border border-sky-200 hover:bg-sky-50 transition-colors"
            >
              Edit
            </button>
          ) : (
            <div className="flex gap-2">
              <button
                onClick={() => setEditing(false)}
                className="text-xs text-gray-400 hover:text-gray-600 px-3 py-1.5
                           rounded-lg border border-gray-200 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveInfo}
                className="text-xs text-white bg-sky-500 hover:bg-sky-600
                           px-3 py-1.5 rounded-lg transition-colors"
              >
                Save
              </button>
            </div>
          )}
        </div>

        <div className="grid grid-cols-2 gap-4">
          {[
            { label: 'Full name',      key: 'name',           type: 'text'  },
            { label: 'Email address',  key: 'email',          type: 'email' },
            { label: 'Phone number',   key: 'phone',          type: 'tel'   },
            { label: 'Specialization', key: 'specialization', type: 'text'  },
            { label: 'Hospital',       key: 'hospital',       type: 'text'  },
          ].map(field => (
            <div key={field.key}
              className={field.key === 'hospital' ? 'col-span-2' : ''}>
              <label className="block text-xs text-gray-400 mb-1.5">{field.label}</label>
              {editing ? (
                <input
                  type={field.type}
                  value={info[field.key]}
                  onChange={e => setInfo({ ...info, [field.key]: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm
                             focus:outline-none focus:border-sky-400 focus:ring-2
                             focus:ring-sky-100 transition-all"
                />
              ) : (
                <p className="text-sm text-gray-700 px-3 py-2 bg-gray-50
                              rounded-lg border border-gray-100">
                  {info[field.key]}
                </p>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Change Password */}
      <div className="bg-white border border-gray-100 rounded-xl p-5 space-y-4">
        <p className="text-sm font-medium text-gray-700">Change password</p>

        {passError && (
          <div className="bg-red-50 border border-red-100 text-red-500
                          text-xs rounded-lg px-3 py-2.5">
            {passError}
          </div>
        )}

        <div className="space-y-3">
          {[
            { label: 'Current password', key: 'current' },
            { label: 'New password',     key: 'next'    },
            { label: 'Confirm password', key: 'confirm' },
          ].map(field => (
            <div key={field.key}>
              <label className="block text-xs text-gray-400 mb-1.5">{field.label}</label>
              <input
                type="password"
                value={passwords[field.key]}
                onChange={e => setPasswords({ ...passwords, [field.key]: e.target.value })}
                placeholder="••••••••"
                className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm
                           focus:outline-none focus:border-sky-400 focus:ring-2
                           focus:ring-sky-100 placeholder:text-gray-300 transition-all"
              />
            </div>
          ))}
        </div>

        <button
          onClick={handleChangePassword}
          className="w-full py-2.5 rounded-lg bg-sky-500 hover:bg-sky-600
                     text-white text-sm font-medium transition-colors"
        >
          Update password
        </button>
      </div>

      {/* Activity */}
      <div className="bg-white border border-gray-100 rounded-xl p-5">
        <p className="text-sm font-medium text-gray-700 mb-4">Activity summary</p>
        <div className="grid grid-cols-4 gap-3">
          {ACTIVITY.map(a => (
            <div key={a.label} className={`${a.bg} rounded-xl p-4 text-center`}>
              <p className={`text-2xl font-medium ${a.color}`}>{a.value}</p>
              <p className="text-xs text-gray-400 mt-0.5">{a.label}</p>
            </div>
          ))}
        </div>
      </div>

    </div>
  )
}