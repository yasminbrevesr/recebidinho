import { Navigate } from 'react-router'
import { Carregando, painelDe, useAuth } from '../lib/auth.jsx'

// Abre o painel de quem está logado; sem login, vai para a tela de login.
export default function Inicio() {
  const { carregando, membro } = useAuth()
  if (carregando) return <Carregando />
  return <Navigate to={membro ? painelDe(membro) : '/login'} replace />
}
