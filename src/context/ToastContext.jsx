import { createContext, useContext, useState, useCallback } from 'react'

const ToastContext = createContext(null)

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([])

  const addToast = useCallback((message, type = 'success') => {
    const id = Date.now()
    setToasts(prev => [...prev, { id, message, type }])
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id))
    }, 3000)
  }, [])

  const removeToast = useCallback((id) => {
    setToasts(prev => prev.filter(t => t.id !== id))
  }, [])

  return (
    <ToastContext.Provider value={{ addToast }}>
      {children}

      <div className="fixed top-5 right-5 z-50 flex flex-col gap-2 pointer-events-none">
        {toasts.map(toast => (
          <div
            key={toast.id}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl shadow-lg
                        border text-sm pointer-events-auto animate-slide-in
                        min-w-64 max-w-80 bg-white
                        ${toast.type === 'success' ? 'border-green-100'
                          : toast.type === 'error'  ? 'border-red-100'
                          : 'border-sky-100'}`}
          >
            <span className={`text-base flex-shrink-0
              ${toast.type === 'success' ? 'text-green-500'
                : toast.type === 'error' ? 'text-red-400'
                : 'text-sky-400'}`}>
              {toast.type === 'success' ? '✓' : toast.type === 'error' ? '⚠' : 'ℹ'}
            </span>
            <p className="flex-1 text-gray-700 text-xs">{toast.message}</p>
            <button
              onClick={() => removeToast(toast.id)}
              className="text-gray-300 hover:text-gray-500 transition-colors leading-none"
            >
              ✕
            </button>
          </div>
        ))}
      </div>

    </ToastContext.Provider>
  )
}

export function useToast() {
  return useContext(ToastContext)
}