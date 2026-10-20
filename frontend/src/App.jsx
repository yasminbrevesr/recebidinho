import { Navigate, Route, Routes } from 'react-router'
import Inicio from './pages/Inicio.jsx'
import Cadastro from './pages/Cadastro.jsx'
import Morador from './pages/Morador.jsx'
import Portaria from './pages/Portaria.jsx'
import Sindico from './pages/Sindico.jsx'
import Login from './pages/Login.jsx'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Inicio />} />
      <Route path="/cadastro" element={<Cadastro />} />
      <Route path="/morador" element={<Morador />} />
      <Route path="/portaria" element={<Portaria />} />
      <Route path="/sindico" element={<Sindico />} />
      <Route path="/login" element={<Login />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
