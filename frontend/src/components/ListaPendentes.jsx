import { useState } from 'react'
import CartaoEncomenda from './CartaoEncomenda.jsx'
import { IconeBusca, IconePacote } from './icones.jsx'

// Encomendas aguardando retirada, com busca por bloco/apartamento.
export default function ListaPendentes({ encomendas, rotuloDe, semAvisoDe }) {
  const [busca, setBusca] = useState('')
  const termo = busca.trim().toLowerCase()
  const filtradas = encomendas.filter((e) => !termo || rotuloDe(e.unidadeId).toLowerCase().includes(termo))

  if (encomendas.length === 0) {
    return (
      <section className="cartao vazio">
        <div className="vazio-icone"><IconePacote tamanho={32} /></div>
        <h2>Nenhuma encomenda aguardando</h2>
        <p>As encomendas registradas aparecem aqui até serem retiradas.</p>
      </section>
    )
  }

  return (
    <section className="cartao cartao-lista">
      <div className="campo-busca">
        <IconeBusca tamanho={20} />
        <input
          type="search"
          inputMode="numeric"
          placeholder="Buscar apartamento (ex.: 104)"
          value={busca}
          onChange={(e) => setBusca(e.target.value)}
          aria-label="Buscar apartamento"
        />
      </div>
      <ul className="lista">
        {filtradas.map((e) => (
          <CartaoEncomenda key={e.id} encomenda={e} rotulo={rotuloDe(e.unidadeId)} semAviso={semAvisoDe(e.unidadeId)} />
        ))}
      </ul>
      {filtradas.length === 0 && <p className="lista-vazia">Nenhuma encomenda para “{busca}”.</p>}
    </section>
  )
}
