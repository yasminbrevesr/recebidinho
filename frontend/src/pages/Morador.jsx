import Marca from '../components/Marca.jsx'
import EmBreve from '../components/EmBreve.jsx'
import { IconePacote } from '../components/icones.jsx'

export default function Morador() {
  return (
    <div className="tela-simples">
      <Marca />
      <EmBreve
        icone={<IconePacote tamanho={32} />}
        titulo="Suas encomendas"
        texto="Em breve você verá aqui as encomendas que chegaram, com foto e código de retirada."
      />
    </div>
  )
}
