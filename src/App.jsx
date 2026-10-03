import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import { ThemeProvider } from './context/ThemeContext'
import { ToastProvider } from './context/ToastContext'
import { ProspectsProvider } from './context/ProspectsContext'
import { ProtectedRoute } from './components/layout/ProtectedRoute'
import { AppLayout } from './components/layout/AppLayout'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import Prospects from './pages/Prospects'
import FollowUps from './pages/FollowUps'
import Clients from './pages/Clients'

function App() {
  return (
    <ThemeProvider>
      <ToastProvider>
        <AuthProvider>
          <BrowserRouter>
            <Routes>
              <Route path="/login" element={<Login />} />

              <Route element={<ProtectedRoute />}>
                <Route
                  element={
                    <ProspectsProvider>
                      <AppLayout />
                    </ProspectsProvider>
                  }
                >
                  <Route path="/dashboard" element={<Dashboard />} />
                  <Route path="/prospects" element={<Prospects />} />
                  <Route path="/relances" element={<FollowUps />} />
                  <Route path="/clients" element={<Clients />} />
                </Route>
              </Route>

              <Route path="*" element={<Navigate to="/dashboard" replace />} />
            </Routes>
          </BrowserRouter>
        </AuthProvider>
      </ToastProvider>
    </ThemeProvider>
  )
}

export default App
