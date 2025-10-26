import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { EscalonadorProvider } from './context/EscalonadorContext/index.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <EscalonadorProvider>
      <App />
    </EscalonadorProvider>
  </StrictMode>
)
