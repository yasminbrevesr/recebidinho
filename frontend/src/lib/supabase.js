import { createClient } from '@supabase/supabase-js'

// Valores vêm das variáveis de ambiente (arquivo .env.local ou painel da Vercel).
// A "publishable key" é a substituta da antiga "anon key": pública, protegida pelo RLS.
const url = import.meta.env.VITE_SUPABASE_URL
const chave = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY

export const supabaseConfigurado = Boolean(url && chave)

// Usado pela equipe (portaria/síndico), que faz login.
// Moradores não fazem login: tudo deles passa pelas Edge Functions.
export const supabase = supabaseConfigurado ? createClient(url, chave) : null
