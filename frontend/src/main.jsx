import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { BrowserRouter } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext.jsx'
import { CameraProvider } from './context/CameraContext.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>

    <BrowserRouter>
      <AuthProvider>
        <CameraProvider>
          <App />
        </CameraProvider>
      </AuthProvider>
    </BrowserRouter>

  </StrictMode>,
)
