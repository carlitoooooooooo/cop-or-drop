import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { AuthProvider } from './AuthContext'
import { ThemeProvider } from './ThemeContext'
import AuthScreen from './AuthScreen'
import App from './App.jsx'
import { useAuth } from './AuthContext'
import './index.css'

function Root() {
  const { user } = useAuth();
  return user ? <App /> : <AuthScreen />;
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthProvider>
      <ThemeProvider>
        <Root />
      </ThemeProvider>
    </AuthProvider>
  </StrictMode>
)
