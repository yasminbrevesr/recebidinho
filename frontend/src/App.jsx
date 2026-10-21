import { Navigate, Route, Routes } from 'react-router'
import { AuthProvider, SomenteEquipe } from './lib/auth.jsx'
import Inicio from './pages/Inicio.jsx'
import Cadastro from './pages/Cadastro.jsx'
import Morador from './pages/Morador.jsx'
import Portaria from './pages/Portaria.jsx'
import Sindico from './pages/Sindico.jsx'
import Login from './pages/Login.jsx'

export default function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/" element={<Inicio />} />
        <Route path="/cadastro" element={<Cadastro />} />
        <Route path="/morador" element={<Morador />} />
        <Route path="/login" element={<Login />} />
        <Route
          path="/portaria"
          element={
            <SomenteEquipe papeis={['portaria', 'sindico']}>
              <Portaria />
            </SomenteEquipe>
          }
        />
        <Route
          path="/sindico"
          element={
            <SomenteEquipe papeis={['sindico']}>
              <Sindico />
            </SomenteEquipe>
          }
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AuthProvider>
  )
}
