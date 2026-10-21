import { useAuth } from '../lib/auth.jsx'
import Marca from './Marca.jsx'

// Moldura das telas da equipe: cabeçalho com usuário, condomínio e "Sair".
// Por padrão usa quem está logado; a demonstração passa os dados por props.
export default function PainelEquipe({ titulo, usuario, condominio, onSair, children }) {
  const auth = useAuth()
  const nome = usuario ?? auth.membro?.nome
  const nomeCondominio = condominio ?? auth.membro?.condominios?.nome

  return (
    <div className="painel">
      <header className="topo">
        <div className="topo-conteudo">
          <Marca tamanho={32} />
          <div className="topo-usuario">
            <div className="topo-textos">
              <strong>{nome}</strong>
              <span>{nomeCondominio}</span>
            </div>
            <button type="button" className="botao botao-claro" onClick={onSair ?? auth.sair}>
              Sair
            </button>
          </div>
        </div>
      </header>
      <main className="painel-conteudo">
        {titulo && <h1 className="titulo-pagina">{titulo}</h1>}
        {children}
      </main>
    </div>
  )
}
