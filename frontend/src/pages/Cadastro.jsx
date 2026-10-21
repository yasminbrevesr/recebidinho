import Marca from '../components/Marca.jsx'
import EmBreve from '../components/EmBreve.jsx'
import { IconeSino } from '../components/icones.jsx'

export default function Cadastro() {
  return (
    <div className="tela-simples">
      <Marca />
      <EmBreve
        icone={<IconeSino tamanho={32} />}
        titulo="Cadastro de moradores em breve"
        texto="Por aqui você vai se cadastrar para receber no celular o aviso de que sua encomenda chegou."
      />
    </div>
  )
}
