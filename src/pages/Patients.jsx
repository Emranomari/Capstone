import { useState, useMemo } from 'react'
import { usePatients } from '../context/PationtsContext'
const FILTERS = ['All', 'Positive', 'Negative', 'Pending']

const resultStyle = {
  Positive: 'bg-red-50 text-red-600',
  Negative: 'bg-green-50 text-green-700',
  Pending:  'bg-amber-50 text-amber-600',
}

const avatarColors = [
  'bg-sky-50 text-sky-700',
  'bg-green-50 text-green-700',
  'bg-purple-50 text-purple-700',
  'bg-amber-50 text-amber-700',
]

export default function Patients() {
  const { patients } = usePatients()
  const [search,   setSearch]   = useState('')
  const [filter,   setFilter]   = useState('All')
  const [selected, setSelected] = useState(null)

  const filtered = useMemo(() => {
    return patients.filter(p => {
      const matchSearch = p.name.toLowerCase().includes(search.toLowerCase()) ||
                          p.phone.includes(search)
      const matchFilter = filter === 'All' || p.result === filter
      return matchSearch && matchFilter
    })
  }, [search, filter, patients])

  const stats = useMemo(() => ({
    total:    patients.length,
    positive: patients.filter(p => p.result === 'Positive').length,
    negative: patients.filter(p => p.result === 'Negative').length,
    pending:  patients.filter(p => p.result === 'Pending').length,
  }), [patients])

  return (
    <div className="p-6 space-y-5">

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-lg font-medium text-gray-800">Patients</h1>
          <p className="text-xs text-gray-400 mt-0.5">{patients.length} total records</p>
        </div>
      </div>

      <div className="grid grid-cols-4 gap-3">
        {[
          { label: 'Total',    value: stats.total,    color: 'text-gray-700',  bg: 'bg-gray-50'  },
          { label: 'Positive', value: stats.positive, color: 'text-red-600',   bg: 'bg-red-50'   },
          { label: 'Negative', value: stats.negative, color: 'text-green-700', bg: 'bg-green-50' },
          { label: 'Pending',  value: stats.pending,  color: 'text-amber-600', bg: 'bg-amber-50' },
        ].map(s => (
          <div key={s.label}
            className="bg-white border border-gray-100 rounded-xl p-4 text-center">
            <p className={`text-2xl font-medium ${s.color}`}>{s.value}</p>
            <p className="text-xs text-gray-400 mt-0.5">{s.label}</p>
          </div>
        ))}
      </div>

      <div className="flex items-center gap-3">
        <input
          type="text"
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search by name or phone..."
          className="flex-1 px-3 py-2 rounded-lg border border-gray-200 text-sm
                     focus:outline-none focus:border-sky-400 focus:ring-2
                     focus:ring-sky-100 placeholder:text-gray-300 transition-all"
        />
        <div className="flex gap-1.5">
          {FILTERS.map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3 py-2 rounded-lg text-xs font-medium transition-all
                ${filter === f
                  ? 'bg-sky-500 text-white'
                  : 'bg-white border border-gray-200 text-gray-500 hover:border-sky-300'
                }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-white border border-gray-100 rounded-xl overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-100 bg-gray-50">
              <th className="text-left text-xs text-gray-400 font-medium px-4 py-3">Patient</th>
              <th className="text-left text-xs text-gray-400 font-medium px-4 py-3">Age</th>
              <th className="text-left text-xs text-gray-400 font-medium px-4 py-3">Phone</th>
              <th className="text-left text-xs text-gray-400 font-medium px-4 py-3">Side</th>
              <th className="text-left text-xs text-gray-400 font-medium px-4 py-3">Date</th>
              <th className="text-left text-xs text-gray-400 font-medium px-4 py-3">Result</th>
              <th className="text-left text-xs text-gray-400 font-medium px-4 py-3">Confidence</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={7} className="text-center py-10 text-sm text-gray-300">
                  No patients found
                </td>
              </tr>
            ) : (
              filtered.map((p, i) => (
                <tr
                  key={p.id}
                  onClick={() => setSelected(p)}
                  className="border-b border-gray-50 last:border-0 hover:bg-sky-50
                             cursor-pointer transition-colors"
                >
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2.5">
                      <div className={`w-7 h-7 rounded-full flex items-center justify-center
                                      text-xs font-medium flex-shrink-0
                                      ${avatarColors[i % avatarColors.length]}`}>
                        {p.name.split(' ').map(n => n[0]).join('')}
                      </div>
                      <span className="text-sm text-gray-700 font-medium">{p.name}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-500">{p.age}</td>
                  <td className="px-4 py-3 text-sm text-gray-500">{p.phone}</td>
                  <td className="px-4 py-3 text-sm text-gray-500">{p.side === 'L' ? 'Left' : 'Right'}</td>
                  <td className="px-4 py-3 text-sm text-gray-500">{p.date}</td>
                  <td className="px-4 py-3">
                    <span className={`text-xs px-2.5 py-1 rounded-full font-medium
                                     ${resultStyle[p.result]}`}>
                      {p.result}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-500">
                    {p.confidence ? `${p.confidence}%` : '—'}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {selected && (
        <div
          className="fixed inset-0 bg-black bg-opacity-30 flex items-center
                     justify-center z-50 p-4"
          onClick={() => setSelected(null)}
        >
          <div
            className="bg-white rounded-2xl border border-gray-100 p-6 w-full
                       max-w-sm space-y-4"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-gray-700">Patient details</p>
              <button
                onClick={() => setSelected(null)}
                className="text-gray-300 hover:text-gray-500 text-lg leading-none"
              >
                ✕
              </button>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-sky-50 flex items-center
                              justify-center text-sky-700 font-medium">
                {selected.name.split(' ').map(n => n[0]).join('')}
              </div>
              <div>
                <p className="font-medium text-gray-800">{selected.name}</p>
                <p className="text-xs text-gray-400">{selected.age} years old</p>
              </div>
            </div>

            <div className="space-y-2 border-t border-gray-100 pt-4">
              {[
                { label: 'Phone',       value: selected.phone },
                { label: 'Scan date',   value: selected.date },
                { label: 'Breast side', value: selected.side === 'L' ? 'Left' : 'Right' },
                { label: 'Confidence',  value: selected.confidence ? `${selected.confidence}%` : '—' },
              ].map(row => (
                <div key={row.label} className="flex justify-between">
                  <span className="text-xs text-gray-400">{row.label}</span>
                  <span className="text-xs text-gray-700 font-medium">{row.value}</span>
                </div>
              ))}
            </div>

            <div className={`rounded-xl p-3 text-center ${resultStyle[selected.result]}`}>
              <p className="text-sm font-medium">{selected.result}</p>
            </div>
          </div>
        </div>
      )}

    </div>
  )
}