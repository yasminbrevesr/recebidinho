import { useEffect } from 'react'

// Mensagem rápida no rodapé da tela, some sozinha.
export default function Aviso({ texto, onFechar }) {
  useEffect(() => {
    if (!texto) return
    const t = setTimeout(onFechar, 3500)
    return () => clearTimeout(t)
  }, [texto, onFechar])

  if (!texto) return null
  return (
    <div className="aviso-rapido" role="status">
      {texto}
    </div>
  )
}
