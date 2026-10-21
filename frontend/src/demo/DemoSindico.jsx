import { useCallback, useState } from 'react'
import { useNavigate } from 'react-router'
import PainelEquipe from '../components/PainelEquipe.jsx'
import Aviso from '../components/Aviso.jsx'
import CartaoCadastro from '../components/CartaoCadastro.jsx'
import { IconeCheck } from '../components/icones.jsx'
import FaixaDemo from './FaixaDemo.jsx'
import { CADASTROS_INICIAIS, CONDOMINIO, rotuloUnidade } from './dados.js'

export default function DemoSindico() {
  const navegar = useNavigate()
  const [cadastros, setCadastros] = useState(CADASTROS_INICIAIS)
  const [aviso, setAviso] = useState(null)
  const fecharAviso = useCallback(() => setAviso(null), [])

  function decidir(cadastro, aprovado) {
    if (!aprovado && !window.confirm(`Recusar o cadastro de ${cadastro.nome}?`)) return
    setCadastros(cadastros.filter((c) => c.id !== cadastro.id))
    setAviso(`${cadastro.nome}: cadastro ${aprovado ? 'aprovado' : 'recusado'}`)
  }

  return (
    <>
      <FaixaDemo />
      <PainelEquipe titulo="Cadastros de moradores" usuario="Síndico" condominio={CONDOMINIO} onSair={() => navegar('/demo')}>
        {cadastros.length ? (
          <section className="cartao cartao-lista">
            <p className="lista-titulo">{cadastros.length} aguardando aprovação</p>
            <ul className="lista">
              {cadastros.map((c) => (
                <CartaoCadastro
                  key={c.id}
                  cadastro={c}
                  rotulo={rotuloUnidade(c.unidadeId)}
                  onAprovar={() => decidir(c, true)}
                  onRecusar={() => decidir(c, false)}
                />
              ))}
            </ul>
          </section>
        ) : (
          <section className="cartao vazio">
            <div className="vazio-icone"><IconeCheck tamanho={32} /></div>
            <h2>Tudo em dia</h2>
            <p>Nenhum cadastro aguardando aprovação.</p>
          </section>
        )}
      </PainelEquipe>
      <Aviso texto={aviso} onFechar={fecharAviso} />
    </>
  )
}
