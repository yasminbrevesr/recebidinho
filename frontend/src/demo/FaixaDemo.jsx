import { Link } from 'react-router'

export default function FaixaDemo() {
  return (
    <div className="faixa-demo">
      Demonstração · dados fictícios, nada é salvo
      <Link to="/demo">Trocar perfil</Link>
    </div>
  )
}
