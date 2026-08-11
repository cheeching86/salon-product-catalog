import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './styles/global.css'
import './styles/admin.css'
import { registerSW } from 'virtual:pwa-register'

// autoUpdate: the new service worker activates itself; we just need to
// reload once so the freshly-cached assets are actually used. IndexedDB
// data is completely untouched by this — it lives outside the SW cache.
registerSW({ immediate: true })

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)
