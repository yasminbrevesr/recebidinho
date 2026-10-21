import { useRef, useState } from 'react'
import FotoEncomenda from './FotoEncomenda.jsx'
import { IconeBusca, IconeCamera, IconeCheck, IconeSinoCortado } from './icones.jsx'

// Registro de encomenda: apartamento, foto, transportadora, rastreio e porteiro.
// onRegistrar(dados) deve devolver { codigo, celulares }.
export default function FormRegistrar({ unidades, rotuloDe, porteiros, transportadoras, porteiroInicial, onRegistrar }) {
  const [busca, setBusca] = useState('')
  const [unidadeId, setUnidadeId] = useState(null)
  const [foto, setFoto] = useState(null)
  const [transportadora, setTransportadora] = useState('')
  const [rastreio, setRastreio] = useState('')
  const [porteiro, setPorteiro] = useState(porteiroInicial ?? '')
  const [resultado, setResultado] = useState(null)
  const entradaFoto = useRef(null)

  const termo = busca.trim().toUpperCase().replace(/\s|-/g, '')
  const sugestoes = termo
    ? unidades.filter((u) => u.numero.startsWith(termo) || `${u.bloco}${u.numero}`.startsWith(termo)).slice(0, 8)
    : []

  function escolherFoto(evento) {
    const arquivo = evento.target.files?.[0]
    if (arquivo) setFoto(URL.createObjectURL(arquivo))
  }

  async function registrar(evento) {
    evento.preventDefault()
    const r = await onRegistrar({ unidadeId, foto, transportadora, rastreio: rastreio.trim(), porteiro })
    setResultado({ ...r, unidadeId })
  }

  function novaEncomenda() {
    setResultado(null)
    setBusca('')
    setUnidadeId(null)
    setFoto(null)
    setTransportadora('')
    setRastreio('')
  }

  if (resultado) {
    return (
      <section className="cartao sucesso">
        <div className="sucesso-icone"><IconeCheck tamanho={32} /></div>
        <h2>Encomenda registrada</h2>
        <p className="suave">{rotuloDe(resultado.unidadeId)}</p>
        <div className="codigo-retirada">
          <span>Código de retirada</span>
          <strong>{resultado.codigo}</strong>
        </div>
        {resultado.celulares > 0 ? (
          <p className="sucesso-aviso">
            Aviso enviado para {resultado.celulares} {resultado.celulares === 1 ? 'celular' : 'celulares'} do apartamento.
          </p>
        ) : (
          <div className="alerta alerta-atencao">
            <IconeSinoCortado tamanho={18} /> Apartamento <strong>sem aviso</strong>: nenhum celular cadastrado. Avise o
            morador pelo interfone e informe o código.
          </div>
        )}
        <button type="button" className="botao botao-principal" onClick={novaEncomenda}>
          Registrar outra
        </button>
      </section>
    )
  }

  return (
    <form className="cartao formulario" onSubmit={registrar}>
      <div className="campo">
        <span>Apartamento</span>
        {unidadeId ? (
          <div className="escolhido">
            <strong>{rotuloDe(unidadeId)}</strong>
            <button type="button" className="botao-link" onClick={() => setUnidadeId(null)}>
              Trocar
            </button>
          </div>
        ) : (
          <>
            <div className="campo-busca campo-busca-borda">
              <IconeBusca tamanho={20} />
              <input
                type="search"
                inputMode="numeric"
                placeholder="Digite o número (ex.: 104)"
                value={busca}
                onChange={(e) => setBusca(e.target.value)}
                aria-label="Buscar apartamento"
                autoFocus
              />
            </div>
            {sugestoes.length > 0 && (
              <div className="sugestoes">
                {sugestoes.map((u) => (
                  <button key={u.id} type="button" className="sugestao" onClick={() => setUnidadeId(u.id)}>
                    {rotuloDe(u.id)}
                  </button>
                ))}
              </div>
            )}
          </>
        )}
      </div>

      <div className="campo">
        <span>Foto</span>
        <button type="button" className="foto-botao" onClick={() => entradaFoto.current.click()}>
          {foto ? <FotoEncomenda src={foto} tamanho={72} /> : <IconeCamera tamanho={28} />}
          <span>{foto ? 'Tirar outra foto' : 'Tirar foto da encomenda'}</span>
        </button>
        <input ref={entradaFoto} type="file" accept="image/*" capture="environment" hidden onChange={escolherFoto} />
      </div>

      <label className="campo">
        <span>Transportadora <em>(opcional)</em></span>
        <select value={transportadora} onChange={(e) => setTransportadora(e.target.value)}>
          <option value="">Não informar</option>
          {transportadoras.map((t) => (
            <option key={t}>{t}</option>
          ))}
        </select>
      </label>

      <label className="campo">
        <span>Código de rastreio <em>(opcional)</em></span>
        <input value={rastreio} onChange={(e) => setRastreio(e.target.value)} autoCapitalize="characters" />
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

      <button type="submit" className="botao botao-principal" disabled={!unidadeId || !porteiro}>
        Registrar encomenda
      </button>
    </form>
  )
}
