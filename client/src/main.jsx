import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
// Purge any stale web caches on startup for maximum speed & smooth mobile operation
if (typeof window !== 'undefined' && 'caches' in window) {
  caches.keys().then((names) => {
    names.forEach((name) => caches.delete(name));
  }).catch(() => {});
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
