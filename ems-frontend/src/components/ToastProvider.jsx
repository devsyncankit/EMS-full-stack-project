import React, { createContext, useContext, useMemo, useState } from 'react'

const ToastContext = createContext(null)

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([])

  const showToast = (message, type = 'success', title = '') => {
    const id = `${Date.now()}-${Math.random().toString(36).slice(2)}`
    setToasts((current) => [...current, { id, message, type, title }])

    window.setTimeout(() => {
      setToasts((current) => current.filter((toast) => toast.id !== id))
    }, 5000)
  }

  const removeToast = (id) => {
    setToasts((current) => current.filter((toast) => toast.id !== id))
  }

  const value = useMemo(() => ({ showToast }), [])

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div style={{ position: 'fixed', top: '1rem', right: '1rem', zIndex: 1080, minWidth: '280px' }}>
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`toast show align-items-center text-bg-${toast.type} border-0 mb-2`}
            role='alert'
            aria-live='assertive'
            aria-atomic='true'
          >
            <div className='d-flex'>
              <div className='toast-body'>
                {toast.title && <strong className='me-2'>{toast.title}</strong>}
                {toast.message}
              </div>
              <button type='button' className='btn-close btn-close-white me-2 m-auto' aria-label='Close' onClick={() => removeToast(toast.id)} />
            </div>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  )
}

export const useToast = () => {
  const context = useContext(ToastContext)
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider')
  }
  return context.showToast
}
