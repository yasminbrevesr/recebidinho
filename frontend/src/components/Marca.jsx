const logo = `${import.meta.env.BASE_URL}favicon.svg`

export default function Marca({ tamanho = 40 }) {
  return (
    <div className="marca">
      <img src={logo} width={tamanho} height={tamanho} alt="" />
      <span>Recebidinho</span>
    </div>
  )
}
