import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { initApiMockFallback } from './services/apiMockFallback'

// Initialize fallback for Vercel/cloud deployments
initApiMockFallback();

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
