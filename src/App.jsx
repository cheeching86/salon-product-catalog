import { useEffect, useState } from 'react'
import { seedIfEmpty } from './db/db'
import CustomerCatalog from './pages/CustomerCatalog'
import AdminLayout from './pages/admin/AdminLayout'

export default function App() {
  const [ready, setReady] = useState(false)
  const [view, setView] = useState('customer')

  useEffect(() => {
    seedIfEmpty()
      .catch((err) => console.error('Failed to seed catalog data', err))
      .finally(() => setReady(true))
  }, [])

  if (!ready) {
    return (
      <div
        style={{
          minHeight: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'var(--color-paper)',
          color: 'var(--color-ink-soft)',
          fontFamily: 'var(--font-body)'
        }}
      >
        Loading catalog…
      </div>
    )
  }

  return (
    <div className="app-shell">
      {view === 'customer' ? (
        <CustomerCatalog onOpenAdmin={() => setView('admin')} />
      ) : (
        <AdminLayout onBackToCatalog={() => setView('customer')} />
      )}
    </div>
  )
}
