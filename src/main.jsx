import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import { PatientsProvider } from './context/PationtsContext.jsx'
import { ToastProvider } from './context/ToastContext'
import './index.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <PatientsProvider>
          <ToastProvider>
            <App />
          </ToastProvider>
        </PatientsProvider>
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>
)