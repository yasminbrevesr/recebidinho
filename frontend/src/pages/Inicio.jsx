import { Link } from 'react-router'
import { supabaseConfigurado } from '../lib/supabase.js'

// Página provisória para navegar entre as telas enquanto o app é construído.
export default function Inicio() {
  return (
    <main className="pagina">
      <h1>Recebidinho</h1>
      <p className="suave">
        Supabase: {supabaseConfigurado ? 'configurado' : 'NÃO configurado (faltam as variáveis de ambiente)'}
      </p>
      <ul className="lista-links">
        <li><Link to="/cadastro">Cadastro do morador</Link></li>
        <li><Link to="/morador">Tela do morador</Link></li>
        <li><Link to="/login">Login da equipe</Link></li>
        <li><Link to="/portaria">Portaria</Link></li>
        <li><Link to="/sindico">Síndico</Link></li>
      </ul>
    </main>
  )
}
