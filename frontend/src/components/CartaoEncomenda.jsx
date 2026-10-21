import FotoEncomenda from './FotoEncomenda.jsx'
import { IconeSinoCortado } from './icones.jsx'
import { tempoDesde } from '../lib/formato.js'

// Uma encomenda aguardando retirada, na lista da portaria.
export default function CartaoEncomenda({ encomenda, rotulo, semAviso }) {
  return (
    <li className="item-encomenda">
      <FotoEncomenda src={encomenda.foto} cor={encomenda.cor} tamanho={56} />
      <div className="item-textos">
        <strong>{rotulo}</strong>
        <span>
          {encomenda.transportadora}
          {encomenda.rastreio && ` · ${encomenda.rastreio}`}
        </span>
        <span className="item-tempo">Chegou {tempoDesde(encomenda.registradaEm)} · {encomenda.porteiro}</span>
        {semAviso && (
          <span className="selo selo-alerta" title="O apartamento não tem celular com aviso ativo">
            <IconeSinoCortado tamanho={14} /> sem aviso
          </span>
        )}
      </div>
    </li>
  )
}
