import { createContext, useContext, useEffect, useState } from 'react'
import { Navigate } from 'react-router'
import { supabase } from './supabase.js'

// Login da equipe (portaria e síndico) com e-mail e senha do Supabase Auth.
// O cadastro na tabela "equipe" diz o papel e o condomínio de quem entrou.

const AuthContexto = createContext(null)

export const painelDe = (membro) => (membro.papel === 'sindico' ? '/sindico' : '/portaria')

async function buscarMembro(usuarioId) {
  const { data, error } = await supabase
    .from('equipe')
    .select('id, nome, papel, ativo, condominio_id, condominios(nome)')
    .eq('id', usuarioId)
    .maybeSingle()
  if (error) throw error
  return data
}

function mensagemDeErro(erro) {
  if (erro?.code === 'invalid_credentials') return 'E-mail ou senha incorretos.'
  if (erro?.code === 'email_not_confirmed') return 'Este e-mail ainda não foi confirmado. Fale com o síndico.'
  if (erro?.status === 429) return 'Muitas tentativas. Aguarde alguns minutos e tente de novo.'
  if (erro?.name === 'AuthRetryableFetchError' || erro instanceof TypeError) {
    return 'Sem conexão com o servidor. Verifique a internet e tente de novo.'
  }
  return 'Não foi possível entrar. Tente de novo.'
}

export function AuthProvider({ children }) {
  const [estado, setEstado] = useState({ carregando: true, membro: null })

  useEffect(() => {
    if (!supabase) {
      setEstado({ carregando: false, membro: null })
      return
    }
    let montado = true

    // Sessão salva no aparelho: o celular da portaria continua logado.
    supabase.auth.getSession().then(async ({ data }) => {
      let membro = null
      if (data.session) {
        try {
          membro = await buscarMembro(data.session.user.id)
        } catch {
          membro = null
        }
      }
      if (montado) setEstado({ carregando: false, membro: membro?.ativo ? membro : null })
    })

    // Sessão encerrada (ex.: token expirado ou "Sair" em outra aba).
    const { data } = supabase.auth.onAuthStateChange((evento) => {
      if (evento === 'SIGNED_OUT' && montado) setEstado({ carregando: false, membro: null })
    })

    return () => {
      montado = false
      data.subscription.unsubscribe()
    }
  }, [])

  // Devolve null se deu certo, ou a mensagem de erro para mostrar na tela.
  async function entrar(email, senha) {
    if (!supabase) return 'O app está sem a configuração do Supabase.'

    const { data, error } = await supabase.auth.signInWithPassword({ email: email.trim(), password: senha })
    if (error) return mensagemDeErro(error)

    let membro
    try {
      membro = await buscarMembro(data.user.id)
    } catch (erro) {
      await supabase.auth.signOut()
      return mensagemDeErro(erro)
    }
    if (!membro || !membro.ativo) {
      await supabase.auth.signOut()
      return membro ? 'Este acesso está desativado. Fale com o síndico.' : 'Este login não tem acesso ao sistema.'
    }

    setEstado({ carregando: false, membro })
    return null
  }

  async function sair() {
    await supabase?.auth.signOut()
    setEstado({ carregando: false, membro: null })
  }

  return <AuthContexto.Provider value={{ ...estado, entrar, sair }}>{children}</AuthContexto.Provider>
}

export const useAuth = () => useContext(AuthContexto)

// Protege as telas da equipe: sem login vai para /login;
// com papel diferente vai para o painel do próprio papel.
export function SomenteEquipe({ papeis, children }) {
  const { carregando, membro } = useAuth()
  if (carregando) return <Carregando />
  if (!membro) return <Navigate to="/login" replace />
  if (!papeis.includes(membro.papel)) return <Navigate to={painelDe(membro)} replace />
  return children
}

export function Carregando() {
  return (
    <div className="tela-carregando" role="status" aria-label="Carregando">
      <span className="spinner" />
    </div>
  )
}
