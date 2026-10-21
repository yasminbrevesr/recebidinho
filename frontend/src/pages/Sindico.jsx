import PainelEquipe from '../components/PainelEquipe.jsx'
import EmBreve from '../components/EmBreve.jsx'
import { IconePrancheta } from '../components/icones.jsx'

export default function Sindico() {
  return (
    <PainelEquipe titulo="Cadastros de moradores">
      <EmBreve
        icone={<IconePrancheta tamanho={32} />}
        titulo="Aprovação de cadastros em breve"
        texto="Aqui o síndico vai aprovar ou recusar os cadastros feitos pelos moradores."
      />
    </PainelEquipe>
  )
}
