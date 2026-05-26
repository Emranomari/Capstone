import { createContext, useContext, useState, useEffect } from 'react'

const PatientsContext = createContext(null)

// نقرأ البيانات من localStorage لما يفتح التطبيق
const loadPatients = () => {
  try {
    const saved = localStorage.getItem('beacon_patients')
    return saved ? JSON.parse(saved) : []
  } catch {
    return []
  }
}

export function PatientsProvider({ children }) {
  const [patients, setPatients] = useState(loadPatients)

  // كل ما تتغير البيانات نحفظها في localStorage
  useEffect(() => {
    localStorage.setItem('beacon_patients', JSON.stringify(patients))
  }, [patients])

  const addPatient = (patientData) => {
    const newPatient = {
      id: Date.now(),
      ...patientData,
    }
    setPatients(prev => [newPatient, ...prev])
  }

  const clearPatients = () => {
    setPatients([])
    localStorage.removeItem('beacon_patients')
  }

  return (
    <PatientsContext.Provider value={{ patients, addPatient, clearPatients }}>
      {children}
    </PatientsContext.Provider>
  )
}

export function usePatients() {
  return useContext(PatientsContext)
}