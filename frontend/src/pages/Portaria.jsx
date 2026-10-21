import PainelEquipe from '../components/PainelEquipe.jsx'
import EmBreve from '../components/EmBreve.jsx'
import { IconePacote } from '../components/icones.jsx'

export default function Portaria() {
  return (
    <PainelEquipe titulo="Encomendas">
      <EmBreve
        icone={<IconePacote tamanho={32} />}
        titulo="Registro de encomendas em breve"
        texto="Aqui a portaria vai registrar as encomendas que chegarem e dar baixa nas retiradas."
      />
    </PainelEquipe>
  )
}
