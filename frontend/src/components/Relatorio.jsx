import { useState } from 'react'
import { IconeDownload } from './icones.jsx'
import { dataHora, paraInputData } from '../lib/formato.js'

// Retiradas por período, com exportação em CSV (abre no Excel).
export default function Relatorio({ retiradas, rotuloDe, nomeArquivo = 'retiradas' }) {
  const hoje = new Date()
  const semanaPassada = new Date(hoje)
  semanaPassada.setDate(hoje.getDate() - 7)
  const [de, setDe] = useState(paraInputData(semanaPassada))
  const [ate, setAte] = useState(paraInputData(hoje))

  const inicio = new Date(`${de}T00:00:00`)
  const fim = new Date(`${ate}T23:59:59`)
  const linhas = retiradas
    .filter((r) => r.retiradaEm >= inicio && r.retiradaEm <= fim)
    .sort((a, b) => b.retiradaEm - a.retiradaEm)

  function exportar() {
    const cabecalho = ['Data', 'Apartamento', 'Transportadora', 'Retirada por', 'Porteiro']
    const campos = linhas.map((r) => [dataHora(r.retiradaEm), rotuloDe(r.unidadeId), r.transportadora ?? '', r.retiradaPor, r.porteiro])
    const csv = [cabecalho, ...campos]
      .map((l) => l.map((c) => `"${String(c).replaceAll('"', '""')}"`).join(';'))
      .join('\r\n')
    // BOM + ";" para o Excel em português abrir com acentos e colunas certas.
    const blob = new Blob(['﻿' + csv], { type: 'text/csv;charset=utf-8' })
    const link = document.createElement('a')
    link.href = URL.createObjectURL(blob)
    link.download = `${nomeArquivo}-${de}-a-${ate}.csv`
    link.click()
    URL.revokeObjectURL(link.href)
  }

  return (
    <section className="cartao">
      <div className="filtro-periodo">
        <label className="campo">
          <span>De</span>
          <input type="date" value={de} max={ate} onChange={(e) => setDe(e.target.value)} />
        </label>
        <label className="campo">
          <span>Até</span>
          <input type="date" value={ate} min={de} onChange={(e) => setAte(e.target.value)} />
        </label>
      </div>

      <div className="relatorio-resumo">
        <span>
          <strong>{linhas.length}</strong> {linhas.length === 1 ? 'retirada' : 'retiradas'} no período
        </span>
        <button type="button" className="botao botao-secundario botao-pequeno" onClick={exportar} disabled={!linhas.length}>
          <IconeDownload tamanho={18} /> Exportar CSV
        </button>
      </div>

      <ul className="lista lista-relatorio">
        {linhas.map((r) => (
          <li key={r.id}>
            <div>
              <strong>{rotuloDe(r.unidadeId)}</strong>
              <span>{dataHora(r.retiradaEm)}</span>
            </div>
            <div>
              <span>Retirada por <b>{r.retiradaPor}</b></span>
              <span>Porteiro: {r.porteiro}</span>
            </div>
          </li>
        ))}
      </ul>
    </section>
  )
}
