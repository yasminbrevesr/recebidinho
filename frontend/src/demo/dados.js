// Dados fictícios do modo demonstração. Nada aqui vai para o banco.

export const CONDOMINIO = 'Condomínio Solar Gomes'

// 2 blocos x 11 andares x 4 apartamentos (a quantidade real virá do CSV).
export const UNIDADES = ['A', 'B'].flatMap((bloco) =>
  Array.from({ length: 11 }, (_, i) => i + 1).flatMap((andar) =>
    [1, 2, 3, 4].map((final) => ({ id: `${bloco}-${andar}0${final}`, bloco, numero: `${andar}0${final}` })),
  ),
)

// Apartamentos sem celular com aviso ativo ("sem aviso" na portaria).
export const SEM_AVISO = new Set(['A-302', 'B-904', 'B-1101'])

// Celulares com aviso ativo por apartamento (para a mensagem após registrar).
export const celularesDe = (unidadeId) => (SEM_AVISO.has(unidadeId) ? 0 : unidadeId.endsWith('1') ? 2 : 1)

export const PORTEIROS = ['João Pereira', 'Carlos Souza', 'Ana Lima']

export const TRANSPORTADORAS = ['Correios', 'Mercado Livre', 'Amazon', 'Shopee', 'Jadlog', 'Loggi', 'iFood', 'Outra']

const minutosAtras = (min) => new Date(Date.now() - min * 60_000)

export const ENCOMENDAS_INICIAIS = [
  { id: 1, unidadeId: 'A-104', transportadora: 'Mercado Livre', rastreio: 'MLB2938471', codigo: '4821', porteiro: 'João Pereira', registradaEm: minutosAtras(12), cor: '#f59e0b' },
  { id: 2, unidadeId: 'B-702', transportadora: 'Correios', rastreio: 'QB123456789BR', codigo: '1937', porteiro: 'João Pereira', registradaEm: minutosAtras(48), cor: '#3b82f6' },
  { id: 3, unidadeId: 'A-302', transportadora: 'Shopee', rastreio: '', codigo: '7065', porteiro: 'Carlos Souza', registradaEm: minutosAtras(135), cor: '#ef4444' },
  { id: 4, unidadeId: 'B-1103', transportadora: 'Amazon', rastreio: 'TBA30219', codigo: '5512', porteiro: 'Carlos Souza', registradaEm: minutosAtras(60 * 20), cor: '#8b5cf6' },
  { id: 5, unidadeId: 'A-901', transportadora: 'Correios', rastreio: '', codigo: '3380', porteiro: 'Ana Lima', registradaEm: minutosAtras(60 * 27), cor: '#10b981' },
].map((e) => ({ ...e, status: 'aguardando' }))

const diasAtras = (d, hora) => {
  const data = new Date()
  data.setDate(data.getDate() - d)
  data.setHours(hora, (d * 17) % 60, 0, 0)
  return data
}

export const RETIRADAS_INICIAIS = [
  { id: 101, unidadeId: 'A-201', transportadora: 'Correios', retiradaEm: diasAtras(0, 9), retiradaPor: 'Marcos (morador)', porteiro: 'João Pereira' },
  { id: 102, unidadeId: 'B-403', transportadora: 'Amazon', retiradaEm: diasAtras(1, 19), retiradaPor: 'Fernanda Alves', porteiro: 'Ana Lima' },
  { id: 103, unidadeId: 'A-1002', transportadora: 'Mercado Livre', retiradaEm: diasAtras(1, 14), retiradaPor: 'Diarista Rosa (a pedido do morador)', porteiro: 'Carlos Souza' },
  { id: 104, unidadeId: 'B-104', transportadora: 'Shopee', retiradaEm: diasAtras(2, 11), retiradaPor: 'Paulo Henrique', porteiro: 'João Pereira' },
  { id: 105, unidadeId: 'A-603', transportadora: 'Loggi', retiradaEm: diasAtras(3, 18), retiradaPor: 'Juliana Costa', porteiro: 'Ana Lima' },
  { id: 106, unidadeId: 'B-801', transportadora: 'Correios', retiradaEm: diasAtras(5, 10), retiradaPor: 'Roberto (filho)', porteiro: 'Carlos Souza' },
  { id: 107, unidadeId: 'A-1104', transportadora: 'Amazon', retiradaEm: diasAtras(6, 16), retiradaPor: 'Camila Rocha', porteiro: 'João Pereira' },
]

export const CADASTROS_INICIAIS = [
  { id: 1, nome: 'Patrícia Mendes', unidadeId: 'A-302', telefone: '(11) 98765-4321', criadoEm: minutosAtras(30) },
  { id: 2, nome: 'Ricardo Gomes', unidadeId: 'B-904', telefone: '(11) 99123-4567', criadoEm: minutosAtras(60 * 5) },
  { id: 3, nome: 'Luciana Prado', unidadeId: 'B-1101', telefone: '(11) 97654-0011', criadoEm: minutosAtras(60 * 26) },
]

// Encomendas que o morador do A-104 vê no celular.
export const MORADOR = { nome: 'Beatriz Santos', unidadeId: 'A-104' }
export const ENCOMENDAS_MORADOR = [
  { ...ENCOMENDAS_INICIAIS[0] },
  { id: 90, unidadeId: 'A-104', transportadora: 'Correios', codigo: '2290', status: 'retirada', registradaEm: diasAtras(2, 10), retiradaEm: diasAtras(2, 19), retiradaPor: 'Beatriz Santos', cor: '#3b82f6' },
]

export const rotuloUnidade = (id) => {
  const [bloco, numero] = id.split('-')
  return `Bloco ${bloco} · Apto ${numero}`
}
