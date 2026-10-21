import { IconePacote } from './icones.jsx'

// Foto da encomenda; sem foto, mostra um quadro colorido com ícone.
export default function FotoEncomenda({ src, cor = '#94a3b8', tamanho = 64 }) {
  if (src) return <img className="foto" src={src} alt="Foto da encomenda" width={tamanho} height={tamanho} />
  return (
    <div className="foto foto-vazia" style={{ width: tamanho, height: tamanho, color: cor, background: `${cor}1f` }}>
      <IconePacote tamanho={Math.round(tamanho * 0.45)} />
    </div>
  )
}
