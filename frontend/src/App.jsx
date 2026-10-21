import { Navigate, Route, Routes } from 'react-router'
import { AuthProvider, SomenteEquipe } from './lib/auth.jsx'
import Inicio from './pages/Inicio.jsx'
import Cadastro from './pages/Cadastro.jsx'
import Morador from './pages/Morador.jsx'
import Portaria from './pages/Portaria.jsx'
import Sindico from './pages/Sindico.jsx'
import Login from './pages/Login.jsx'
import DemoInicio from './demo/DemoInicio.jsx'
import DemoPortaria from './demo/DemoPortaria.jsx'
import DemoSindico from './demo/DemoSindico.jsx'
import DemoMorador from './demo/DemoMorador.jsx'

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
        {/* Demonstração com dados fictícios (não usa o banco) */}
        <Route path="/demo" element={<DemoInicio />} />
        <Route path="/demo/portaria" element={<DemoPortaria />} />
        <Route path="/demo/sindico" element={<DemoSindico />} />
        <Route path="/demo/morador" element={<DemoMorador />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AuthProvider>
  )
}
