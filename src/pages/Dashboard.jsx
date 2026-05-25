import { useMemo } from 'react'
import { useAuth } from '../context/AuthContext'
import { usePatients } from '../context/PationtsContext'
import { useNavigate } from 'react-router-dom'

export default function Dashboard() {
  const { doctor }    = useAuth()
  const { patients }  = usePatients()
  const navigate      = useNavigate()

  const today = new Date().toISOString().split('T')[0]

  const stats = useMemo(() => [
    {
      label: 'Total patients',
      value: patients.length.toString(),
      change: `+${patients.filter(p => {
        const d = new Date(p.date)
        const now = new Date()
        return d.getMonth() === now.getMonth()
      }).length} this month`,
      changeColor: 'text-green-600',
      bg: 'bg-sky-50', iconColor: 'text-sky-500', icon: '♡',
    },
    {
      label: 'Scans today',
      value: patients.filter(p => p.date === today).length.toString(),
      change: `${patients.filter(p => p.result === 'Pending').length} pending review`,
      changeColor: 'text-amber-500',
      bg: 'bg-green-50', iconColor: 'text-green-500', icon: '⊕',
    },
    {
      label: 'Positive cases',
      value: patients.filter(p => p.result === 'Positive').length.toString(),
      change: `${patients.length > 0
        ? ((patients.filter(p => p.result === 'Positive').length / patients.length) * 100).toFixed(1)
        : 0}% rate`,
      changeColor: 'text-red-500',
      bg: 'bg-red-50', iconColor: 'text-red-400', icon: '!',
    },
    {
      label: 'Model accuracy',
      value: '94%',
      change: 'UNet v2.1',
      changeColor: 'text-sky-500',
      bg: 'bg-amber-50', iconColor: 'text-amber-500', icon: '◈',
    },
  ], [patients, today])

  const recentPatients = useMemo(() =>
    patients.slice(0, 5).map((p, i) => ({
      ...p,
      initials: p.name.split(' ').map(n => n[0]).join(''),
      resultStyle: p.result === 'Positive'
        ? 'bg-red-50 text-red-600'
        : p.result === 'Negative'
        ? 'bg-green-50 text-green-700'
        : 'bg-amber-50 text-amber-600',
      avatarStyle: [
        'bg-sky-50 text-sky-700',
        'bg-green-50 text-green-700',
        'bg-purple-50 text-purple-700',
        'bg-amber-50 text-amber-700',
      ][i % 4],
    }))
  , [patients])

  const bars = [
    { day: 'Mon', height: 45 },
    { day: 'Tue', height: 70 },
    { day: 'Wed', height: 55 },
    { day: 'Thu', height: 85 },
    { day: 'Fri', height: 60 },
    { day: 'Sat', height: 30 },
    { day: 'Sun', height: 72 },
  ]

  return (
    <div className="p-6 space-y-6">

      {/* Top bar */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-lg font-medium text-gray-800">
            Good morning, {doctor?.name} 👋
          </h1>
          <p className="text-xs text-gray-400 mt-0.5">
            {new Date().toLocaleDateString('en-US', {
              weekday: 'long', year: 'numeric',
              month: 'long', day: 'numeric'
            })}
          </p>
        </div>
        <button
          onClick={() => navigate('/scan')}
          className="flex items-center gap-2 bg-sky-500 hover:bg-sky-600 text-white
                     text-sm font-medium px-4 py-2 rounded-lg transition-colors"
        >
          + New Scan
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4">
        {stats.map(s => (
          <div key={s.label} className="bg-white border border-gray-100 rounded-xl p-4">
            <div className={`w-8 h-8 ${s.bg} rounded-lg flex items-center justify-center
                            ${s.iconColor} text-sm mb-3`}>
              {s.icon}
            </div>
            <p className="text-xs text-gray-400 mb-1">{s.label}</p>
            <p className="text-2xl font-medium text-gray-800">{s.value}</p>
            <p className={`text-xs mt-1 ${s.changeColor}`}>{s.change}</p>
          </div>
        ))}
      </div>

      {/* Chart + Breakdown */}
      <div className="grid grid-cols-3 gap-4">

        <div className="col-span-2 bg-white border border-gray-100 rounded-xl p-5">
          <p className="text-sm font-medium text-gray-700 mb-4">Scans this week</p>
          <div className="flex items-end gap-3 h-28">
            {bars.map(b => (
              <div key={b.day} className="flex-1 flex flex-col items-center gap-1">
                <div
                  className="w-full bg-sky-400 rounded-t-md transition-all"
                  style={{ height: b.height, opacity: b.height / 100 + 0.2 }}
                />
                <span className="text-xs text-gray-400">{b.day}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white border border-gray-100 rounded-xl p-5">
          <p className="text-sm font-medium text-gray-700 mb-4">Result breakdown</p>
          <div className="space-y-3">
            {[
              { label: 'Negative', pct: patients.length > 0 ? Math.round(patients.filter(p => p.result === 'Negative').length / patients.length * 100) : 0, color: 'bg-sky-400' },
              { label: 'Positive', pct: patients.length > 0 ? Math.round(patients.filter(p => p.result === 'Positive').length / patients.length * 100) : 0, color: 'bg-red-400' },
              { label: 'Pending',  pct: patients.length > 0 ? Math.round(patients.filter(p => p.result === 'Pending').length  / patients.length * 100) : 0, color: 'bg-amber-400' },
            ].map(b => (
              <div key={b.label}>
                <div className="flex justify-between text-xs text-gray-500 mb-1">
                  <span>{b.label}</span><span>{b.pct}%</span>
                </div>
                <div className="h-2 bg-gray-100 rounded-full">
                  <div className={`h-2 ${b.color} rounded-full transition-all`}
                    style={{ width: `${b.pct}%` }} />
                </div>
              </div>
            ))}
          </div>
          <div className="mt-4 pt-4 border-t border-gray-100 text-center">
            <p className="text-2xl font-medium text-gray-800">{patients.length}</p>
            <p className="text-xs text-gray-400">total patients</p>
          </div>
        </div>
      </div>

      {/* Recent scans */}
      <div className="bg-white border border-gray-100 rounded-xl p-5">
        <div className="flex items-center justify-between mb-4">
          <p className="text-sm font-medium text-gray-700">Recent scans</p>
          <button
            onClick={() => navigate('/patients')}
            className="text-xs text-sky-500 hover:text-sky-600"
          >
            View all →
          </button>
        </div>

        {recentPatients.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-sm text-gray-300">No scans yet</p>
          </div>
        ) : (
          <div>
            {recentPatients.map((p, i) => (
              <div key={p.id}
                className="flex items-center gap-3 py-3 border-b border-gray-50 last:border-0">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center
                                text-xs font-medium flex-shrink-0 ${p.avatarStyle}`}>
                  {p.initials}
                </div>
                <p className="text-sm font-medium text-gray-700 flex-1">{p.name}</p>
                <p className="text-xs text-gray-400">{p.age} yrs</p>
                <p className="text-xs text-gray-400 w-5 text-center">{p.side}</p>
                <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${p.resultStyle}`}>
                  {p.result}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  )
}