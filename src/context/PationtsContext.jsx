import { createContext, useContext, useState } from 'react'

const PatientsContext = createContext(null)

export function PatientsProvider({ children }) {
  const [patients, setPatients] = useState([])

  const addPatient = (patientData) => {
    const newPatient = {
      id: Date.now(),
      ...patientData,
    }
    setPatients(prev => [newPatient, ...prev])
  }

  return (
    <PatientsContext.Provider value={{ patients, addPatient }}>
      {children}
    </PatientsContext.Provider>
  )
}

export function usePatients() {
  return useContext(PatientsContext)
}