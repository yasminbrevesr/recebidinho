import { tempoDesde } from '../lib/formato.js'

// Cadastro de morador aguardando aprovação do síndico.
export default function CartaoCadastro({ cadastro, rotulo, onAprovar, onRecusar }) {
  return (
    <li className="item-cadastro">
      <div className="avatar" aria-hidden="true">
        {cadastro.nome.split(' ').map((p) => p[0]).slice(0, 2).join('')}
      </div>
      <div className="item-textos">
        <strong>{cadastro.nome}</strong>
        <span>{rotulo}</span>
        <span className="item-tempo">{cadastro.telefone} · pediu {tempoDesde(cadastro.criadoEm)}</span>
      </div>
      <div className="item-acoes">
        <button type="button" className="botao botao-principal botao-pequeno" onClick={onAprovar}>
          Aprovar
        </button>
        <button type="button" className="botao botao-secundario botao-pequeno" onClick={onRecusar}>
          Recusar
        </button>
      </div>
    </li>
  )
}
