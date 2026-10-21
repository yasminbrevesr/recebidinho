import { useState } from 'react'
import { Link, Navigate } from 'react-router'
import { Carregando, painelDe, useAuth } from '../lib/auth.jsx'
import { supabaseConfigurado } from '../lib/supabase.js'
import Marca from '../components/Marca.jsx'
import { IconeOlho, IconeOlhoFechado } from '../components/icones.jsx'

export default function Login() {
  const { carregando, membro, entrar } = useAuth()
  const [email, setEmail] = useState('')
  const [senha, setSenha] = useState('')
  const [verSenha, setVerSenha] = useState(false)
  const [enviando, setEnviando] = useState(false)
  const [erro, setErro] = useState(null)

  if (carregando) return <Carregando />
  if (membro) return <Navigate to={painelDe(membro)} replace />

  async function enviar(evento) {
    evento.preventDefault()
    setEnviando(true)
    setErro(null)
    // Se der certo, o login atualiza a sessão e esta tela leva ao painel.
    const mensagem = await entrar(email, senha)
    setEnviando(false)
    setErro(mensagem)
  }

  return (
    <div className="tela-login">
      <div className="login-topo">
        <Marca tamanho={56} />
        <p>Encomendas da portaria</p>
      </div>

      <form className="cartao login-cartao" onSubmit={enviar} noValidate>
        <h1>Entrar</h1>
        <p className="suave">Acesso da portaria e do síndico.</p>

        {!supabaseConfigurado && (
          <div className="alerta alerta-erro" role="alert">
            O app está sem a configuração do Supabase. Avise o responsável pelo sistema.
          </div>
        )}

        <label className="campo">
          <span>E-mail</span>
          <input
            type="email"
            inputMode="email"
            autoComplete="username"
            autoCapitalize="none"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="portaria@condominio.com.br"
          />
        </label>

        <label className="campo">
          <span>Senha</span>
          <div className="campo-senha">
            <input
              type={verSenha ? 'text' : 'password'}
              autoComplete="current-password"
              required
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
            />
            <button
              type="button"
              className="botao-icone"
              onClick={() => setVerSenha(!verSenha)}
              aria-label={verSenha ? 'Esconder senha' : 'Mostrar senha'}
            >
              {verSenha ? <IconeOlhoFechado tamanho={20} /> : <IconeOlho tamanho={20} />}
            </button>
          </div>
        </label>

        {erro && (
          <div className="alerta alerta-erro" role="alert">
            {erro}
          </div>
        )}

        <button type="submit" className="botao botao-principal" disabled={enviando || !email || !senha}>
          {enviando ? 'Entrando…' : 'Entrar'}
        </button>

        <p className="login-rodape">Esqueceu a senha? Fale com o síndico.</p>
      </form>

      <Link to="/demo" className="link-demo">
        Ver demonstração com dados fictícios
      </Link>
    </div>
  )
}
