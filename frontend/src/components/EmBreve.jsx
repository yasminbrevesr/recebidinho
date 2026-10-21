// Aviso de tela ainda não construída.
export default function EmBreve({ icone, titulo, texto }) {
  return (
    <section className="cartao vazio">
      <div className="vazio-icone" aria-hidden="true">{icone}</div>
      <h2>{titulo}</h2>
      <p>{texto}</p>
    </section>
  )
}
