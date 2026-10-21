import { useCallback, useState } from 'react'
import { useNavigate } from 'react-router'
import PainelEquipe from '../components/PainelEquipe.jsx'
import Abas from '../components/Abas.jsx'
import Aviso from '../components/Aviso.jsx'
import ListaPendentes from '../components/ListaPendentes.jsx'
import FormRegistrar from '../components/FormRegistrar.jsx'
import FormBaixa from '../components/FormBaixa.jsx'
import Relatorio from '../components/Relatorio.jsx'
import FaixaDemo from './FaixaDemo.jsx'
import {
  CONDOMINIO, ENCOMENDAS_INICIAIS, PORTEIROS, RETIRADAS_INICIAIS, SEM_AVISO, TRANSPORTADORAS, UNIDADES,
  celularesDe, rotuloUnidade,
} from './dados.js'

const LIMITE_TENTATIVAS = 10

export default function DemoPortaria() {
  const navegar = useNavigate()
  const [aba, setAba] = useState('pendentes')
  const [pendentes, setPendentes] = useState(ENCOMENDAS_INICIAIS)
  const [retiradas, setRetiradas] = useState(RETIRADAS_INICIAIS)
  const [ultimoPorteiro, setUltimoPorteiro] = useState('')
  const [errosCodigo, setErrosCodigo] = useState(0)
  const [aviso, setAviso] = useState(null)
  const fecharAviso = useCallback(() => setAviso(null), [])

  function gerarCodigo() {
    const usados = new Set(pendentes.map((e) => e.codigo))
    let codigo
    do codigo = String(Math.floor(Math.random() * 10000)).padStart(4, '0')
    while (usados.has(codigo))
    return codigo
  }

  function registrar(dados) {
    const codigo = gerarCodigo()
    setPendentes([{ id: Date.now(), ...dados, codigo, status: 'aguardando', registradaEm: new Date(), cor: '#0f766e' }, ...pendentes])
    setUltimoPorteiro(dados.porteiro)
    return { codigo, celulares: celularesDe(dados.unidadeId) }
  }

  function buscarCodigo(codigo) {
    if (errosCodigo >= LIMITE_TENTATIVAS) {
      return { erro: 'Muitos códigos errados. Aguarde 10 minutos para tentar de novo.' }
    }
    const encomenda = pendentes.find((e) => e.codigo === codigo)
    if (!encomenda) {
      const restantes = LIMITE_TENTATIVAS - errosCodigo - 1
      setErrosCodigo(errosCodigo + 1)
      return { erro: `Código não encontrado. Confira com o morador. (${restantes} tentativas restantes)` }
    }
    setErrosCodigo(0)
    return { encomenda }
  }

  function confirmarBaixa({ encomenda, retiradaPor, porteiro }) {
    setPendentes(pendentes.filter((e) => e.id !== encomenda.id))
    setRetiradas([{ ...encomenda, retiradaEm: new Date(), retiradaPor, porteiro }, ...retiradas])
    setUltimoPorteiro(porteiro)
    setAviso('Retirada registrada')
  }

  return (
    <>
      <FaixaDemo />
      <PainelEquipe usuario="Portaria" condominio={CONDOMINIO} onSair={() => navegar('/demo')}>
        <Abas
          ativa={aba}
          onTrocar={setAba}
          itens={[
            { id: 'pendentes', rotulo: 'Pendentes', contador: pendentes.length },
            { id: 'registrar', rotulo: 'Registrar' },
            { id: 'baixa', rotulo: 'Baixa' },
            { id: 'relatorio', rotulo: 'Relatório' },
          ]}
        />
        {aba === 'pendentes' && (
          <ListaPendentes encomendas={pendentes} rotuloDe={rotuloUnidade} semAvisoDe={(id) => SEM_AVISO.has(id)} />
        )}
        {aba === 'registrar' && (
          <FormRegistrar
            unidades={UNIDADES}
            rotuloDe={rotuloUnidade}
            porteiros={PORTEIROS}
            transportadoras={TRANSPORTADORAS}
            porteiroInicial={ultimoPorteiro}
            onRegistrar={registrar}
          />
        )}
        {aba === 'baixa' && (
          <FormBaixa
            rotuloDe={rotuloUnidade}
            porteiros={PORTEIROS}
            porteiroInicial={ultimoPorteiro}
            onBuscar={buscarCodigo}
            onConfirmar={confirmarBaixa}
          />
        )}
        {aba === 'relatorio' && <Relatorio retiradas={retiradas} rotuloDe={rotuloUnidade} nomeArquivo="retiradas-demo" />}
        {aba === 'baixa' && (
          <p className="dica-demo">
            Para testar, use um dos códigos fictícios: {pendentes.slice(0, 3).map((e) => e.codigo).join(', ')}.
          </p>
        )}
      </PainelEquipe>
      <Aviso texto={aviso} onFechar={fecharAviso} />
    </>
  )
}
