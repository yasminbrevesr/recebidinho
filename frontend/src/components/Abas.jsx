// Abas no topo da tela. itens: [{ id, rotulo, contador? }]
export default function Abas({ itens, ativa, onTrocar }) {
  return (
    <nav className="abas" role="tablist">
      {itens.map((item) => (
        <button
          key={item.id}
          type="button"
          role="tab"
          aria-selected={ativa === item.id}
          className={ativa === item.id ? 'aba aba-ativa' : 'aba'}
          onClick={() => onTrocar(item.id)}
        >
          {item.rotulo}
          {item.contador > 0 && <span className="aba-contador">{item.contador}</span>}
        </button>
      ))}
    </nav>
  )
}
