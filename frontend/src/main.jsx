import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { ThemeProvider } from './context/ThemeContext'
import { AuthProvider } from './context/AuthContext'
import { SavedJobsProvider } from './context/SavedJobsContext'
import { NotificationProvider } from './context/NotificationContext'
import { CompareProvider } from './context/CompareContext'
import './index.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <ThemeProvider>
        <AuthProvider>
          <SavedJobsProvider>
            <NotificationProvider>
              <CompareProvider>
                <App />
              </CompareProvider>
            </NotificationProvider>
          </SavedJobsProvider>
        </AuthProvider>
      </ThemeProvider>
    </BrowserRouter>
  </StrictMode>,
)
