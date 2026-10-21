const hora = (d) => d.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
const dia = (d) => d.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' })

// "há 12 min", "há 3 h", "ontem às 18:40", "15/10 às 10:00"
export function tempoDesde(data, agora = new Date()) {
  const min = Math.floor((agora - data) / 60_000)
  if (min < 1) return 'agora'
  if (min < 60) return `há ${min} min`
  const ontem = new Date(agora)
  ontem.setDate(ontem.getDate() - 1)
  if (data.toDateString() === agora.toDateString()) return `há ${Math.floor(min / 60)} h`
  if (data.toDateString() === ontem.toDateString()) return `ontem às ${hora(data)}`
  return `${dia(data)} às ${hora(data)}`
}

export const dataHora = (d) => `${d.toLocaleDateString('pt-BR')} ${hora(d)}`

// Data no formato do <input type="date"> (AAAA-MM-DD), no fuso do aparelho.
export const paraInputData = (d) =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
