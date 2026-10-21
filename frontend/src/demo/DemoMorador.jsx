import Marca from '../components/Marca.jsx'
import FotoEncomenda from '../components/FotoEncomenda.jsx'
import { tempoDesde, dataHora } from '../lib/formato.js'
import FaixaDemo from './FaixaDemo.jsx'
import { CONDOMINIO, ENCOMENDAS_MORADOR, MORADOR, rotuloUnidade } from './dados.js'

export default function DemoMorador() {
  const aguardando = ENCOMENDAS_MORADOR.filter((e) => e.status === 'aguardando')
  const retiradas = ENCOMENDAS_MORADOR.filter((e) => e.status === 'retirada')

  return (
    <>
      <FaixaDemo />
      <div className="tela-simples tela-morador">
        <Marca />
        <div className="saudacao">
          <h1>Olá, {MORADOR.nome.split(' ')[0]}</h1>
          <p className="suave">{rotuloUnidade(MORADOR.unidadeId)} · {CONDOMINIO}</p>
        </div>

        {aguardando.map((e) => (
          <section key={e.id} className="cartao encomenda-morador">
            <span className="selo selo-novo">Aguardando retirada</span>
            <FotoEncomenda src={e.foto} cor={e.cor} tamanho={160} />
            <p>
              <strong>{e.transportadora}</strong> · chegou {tempoDesde(e.registradaEm)}
            </p>
            <div className="codigo-retirada">
              <span>Código de retirada</span>
              <strong>{e.codigo}</strong>
            </div>
            <p className="suave dica">
              Mostre este código na portaria. Outra pessoa pode retirar por você informando o código.
            </p>
          </section>
        ))}

        <section className="cartao cartao-lista">
          <p className="lista-titulo">Já retiradas</p>
          <ul className="lista">
            {retiradas.map((e) => (
              <li key={e.id} className="item-encomenda">
                <FotoEncomenda cor={e.cor} tamanho={48} />
                <div className="item-textos">
                  <strong>{e.transportadora}</strong>
                  <span className="item-tempo">Retirada em {dataHora(e.retiradaEm)} por {e.retiradaPor}</span>
                </div>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </>
  )
}
