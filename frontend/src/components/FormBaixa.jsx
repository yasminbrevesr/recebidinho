import { useState } from 'react'
import FotoEncomenda from './FotoEncomenda.jsx'
import { IconeCheck } from './icones.jsx'

// Baixa em duas etapas: 1) código mostra qual é a encomenda;
// 2) nome de quem retirou + porteiro confirmam a retirada.
// onBuscar(codigo) -> { encomenda } ou { erro }; onConfirmar(dados) -> void.
export default function FormBaixa({ rotuloDe, porteiros, porteiroInicial, onBuscar, onConfirmar }) {
  const [codigo, setCodigo] = useState('')
  const [encomenda, setEncomenda] = useState(null)
  const [retiradaPor, setRetiradaPor] = useState('')
  const [porteiro, setPorteiro] = useState(porteiroInicial ?? '')
  const [erro, setErro] = useState(null)
  const [concluida, setConcluida] = useState(null)

  async function buscar(evento) {
    evento.preventDefault()
    const r = await onBuscar(codigo)
    if (r.erro) {
      setErro(r.erro)
      setCodigo('')
    } else {
      setErro(null)
      setEncomenda(r.encomenda)
    }
  }

  async function confirmar(evento) {
    evento.preventDefault()
    await onConfirmar({ encomenda, retiradaPor: retiradaPor.trim(), porteiro })
    setConcluida({ encomenda, retiradaPor: retiradaPor.trim() })
  }

  function recomecar() {
    setCodigo('')
    setEncomenda(null)
    setRetiradaPor('')
    setConcluida(null)
  }

  if (concluida) {
    return (
      <section className="cartao sucesso">
        <div className="sucesso-icone"><IconeCheck tamanho={32} /></div>
        <h2>Retirada registrada</h2>
        <p className="suave">
          {rotuloDe(concluida.encomenda.unidadeId)} · retirada por {concluida.retiradaPor}
        </p>
        <p className="sucesso-aviso">O morador foi avisado da retirada.</p>
        <button type="button" className="botao botao-principal" onClick={recomecar}>
          Dar outra baixa
        </button>
      </section>
    )
  }

  if (encomenda) {
    return (
      <form className="cartao formulario" onSubmit={confirmar}>
        <div className="encomenda-achada">
          <FotoEncomenda src={encomenda.foto} cor={encomenda.cor} tamanho={72} />
          <div>
            <strong>{rotuloDe(encomenda.unidadeId)}</strong>
            <span>{encomenda.transportadora || 'Transportadora não informada'}</span>
          </div>
        </div>

        <label className="campo">
          <span>Quem está retirando?</span>
          <input
            value={retiradaPor}
            onChange={(e) => setRetiradaPor(e.target.value)}
            placeholder="Nome completo"
            required
            autoFocus
          />
        </label>

        <label className="campo">
          <span>Porteiro</span>
          <select value={porteiro} onChange={(e) => setPorteiro(e.target.value)} required>
            <option value="" disabled>Escolha seu nome</option>
            {porteiros.map((p) => (
              <option key={p}>{p}</option>
            ))}
          </select>
        </label>

        <button type="submit" className="botao botao-principal" disabled={!retiradaPor.trim() || !porteiro}>
          Confirmar retirada
        </button>
        <button type="button" className="botao botao-secundario" onClick={recomecar}>
          Cancelar
        </button>
      </form>
    )
  }

  return (
    <form className="cartao formulario" onSubmit={buscar}>
      <label className="campo">
        <span>Código de retirada</span>
        <input
          className="entrada-codigo"
          value={codigo}
          onChange={(e) => setCodigo(e.target.value.replace(/\D/g, '').slice(0, 4))}
          inputMode="numeric"
          autoComplete="off"
          placeholder="0000"
          aria-describedby="dica-codigo"
          autoFocus
        />
      </label>
      <p id="dica-codigo" className="suave dica">
        Peça o código de 4 dígitos que o morador recebeu no celular.
      </p>
      {erro && (
        <div className="alerta alerta-erro" role="alert">
          {erro}
        </div>
      )}
      <button type="submit" className="botao botao-principal" disabled={codigo.length !== 4}>
        Buscar encomenda
      </button>
    </form>
  )
}
