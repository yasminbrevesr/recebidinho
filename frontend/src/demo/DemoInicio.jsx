import { Link } from 'react-router'
import Marca from '../components/Marca.jsx'
import { IconePacote, IconePrancheta, IconeSino } from '../components/icones.jsx'

const perfis = [
  { para: '/demo/portaria', icone: <IconePacote />, titulo: 'Portaria', texto: 'Registrar encomenda, dar baixa, pendentes e relatório.' },
  { para: '/demo/sindico', icone: <IconePrancheta />, titulo: 'Síndico', texto: 'Aprovar ou recusar cadastros de moradores.' },
  { para: '/demo/morador', icone: <IconeSino />, titulo: 'Morador', texto: 'Encomenda que chegou, com foto e código de retirada.' },
]

export default function DemoInicio() {
  return (
    <div className="tela-simples">
      <Marca />
      <div className="demo-intro">
        <h1>Demonstração</h1>
        <p className="suave">Veja como cada tela vai funcionar, com dados fictícios. Nada é salvo.</p>
      </div>
      <ul className="lista-perfis">
        {perfis.map((p) => (
          <li key={p.para}>
            <Link to={p.para} className="cartao perfil">
              <span className="vazio-icone">{p.icone}</span>
              <span>
                <strong>{p.titulo}</strong>
                <span className="suave">{p.texto}</span>
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}
