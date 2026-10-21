import { useAuth } from '../lib/auth.jsx'
import Marca from './Marca.jsx'

// Moldura das telas da equipe: cabeçalho com condomínio, usuário e "Sair".
export default function PainelEquipe({ titulo, children }) {
  const { membro, sair } = useAuth()

  return (
    <div className="painel">
      <header className="topo">
        <div className="topo-conteudo">
          <Marca tamanho={32} />
          <div className="topo-usuario">
            <div className="topo-textos">
              <strong>{membro.nome}</strong>
              <span>{membro.condominios?.nome}</span>
            </div>
            <button type="button" className="botao botao-claro" onClick={sair}>
              Sair
            </button>
          </div>
        </div>
      </header>
      <main className="painel-conteudo">
        <h1 className="titulo-pagina">{titulo}</h1>
        {children}
      </main>
    </div>
  )
}
