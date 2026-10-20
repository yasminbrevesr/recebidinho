-- =====================================================================
-- Recebidinho - estrutura inicial
-- Tabelas, índices, permissões, RLS e bucket privado de fotos.
--
-- Como aplicar: cole este arquivo inteiro no SQL Editor do Supabase e
-- clique em Run (ou use `supabase db push`). Rode uma vez só.
--
-- Quem acessa o quê:
--   - Equipe (portaria/síndico, com login): só dados do próprio condomínio.
--   - Moradores (sem login): nenhum acesso direto; tudo passa pelas Edge
--     Functions, que usam a chave secreta (papel service_role).
-- =====================================================================

-- gen_random_bytes(), usada no token do morador. No Supabase a extensão
-- já vem instalada no schema "extensions"; aí este comando não faz nada.
create extension if not exists pgcrypto with schema extensions;


-- ---------------------------------------------------------------------
-- Tabelas
-- As FKs compostas (..._id, condominio_id) garantem que um registro só
-- aponte para outro do MESMO condomínio.
-- ---------------------------------------------------------------------

create table public.condominios (
  id uuid primary key default gen_random_uuid(),
  nome text not null check (btrim(nome) <> ''),
  criado_em timestamptz not null default now()
);

create table public.unidades (
  id uuid primary key default gen_random_uuid(),
  condominio_id uuid not null references public.condominios (id),
  bloco text not null check (btrim(bloco) <> ''),
  numero text not null check (btrim(numero) <> ''),
  criado_em timestamptz not null default now(),
  unique (condominio_id, bloco, numero),
  unique (id, condominio_id)
);

-- Usuários com login (Supabase Auth). id = auth.users.id
create table public.equipe (
  id uuid primary key references auth.users (id) on delete cascade,
  condominio_id uuid not null references public.condominios (id),
  nome text not null check (btrim(nome) <> ''),
  papel text not null check (papel in ('portaria', 'sindico')),
  ativo boolean not null default true,
  criado_em timestamptz not null default now()
);

-- Nomes escolhidos no celular da portaria ao registrar e ao dar baixa.
create table public.porteiros (
  id uuid primary key default gen_random_uuid(),
  condominio_id uuid not null references public.condominios (id),
  nome text not null check (btrim(nome) <> ''),
  ativo boolean not null default true,
  criado_em timestamptz not null default now(),
  unique (id, condominio_id)
);

create table public.moradores (
  id uuid primary key default gen_random_uuid(),
  condominio_id uuid not null references public.condominios (id),
  unidade_id uuid not null,
  nome text not null check (btrim(nome) <> ''),
  telefone text not null check (btrim(telefone) <> ''),
  status text not null default 'pendente'
    check (status in ('pendente', 'aprovado', 'inativo')),
  -- Credencial do morador, salva no celular dele. Nunca exposta à equipe.
  token_acesso text not null unique
    default encode(extensions.gen_random_bytes(32), 'hex'),
  aceite_avisos_em timestamptz not null,
  criado_em timestamptz not null default now(),
  unique (id, condominio_id),
  foreign key (unidade_id, condominio_id)
    references public.unidades (id, condominio_id)
);

create table public.push_inscricoes (
  id uuid primary key default gen_random_uuid(),
  condominio_id uuid not null references public.condominios (id),
  morador_id uuid not null,
  endpoint text not null unique,
  p256dh text not null,
  auth text not null,
  ativo boolean not null default true,
  criado_em timestamptz not null default now(),
  unique (id, condominio_id),
  foreign key (morador_id, condominio_id)
    references public.moradores (id, condominio_id) on delete cascade
);

create table public.encomendas (
  id uuid primary key default gen_random_uuid(),
  condominio_id uuid not null references public.condominios (id),
  unidade_id uuid not null,
  -- Caminho no bucket "fotos-encomendas": <condominio_id>/<arquivo>.
  -- Fica nulo depois que a foto é apagada (30 dias após a retirada).
  foto_path text,
  transportadora text,
  rastreio text,
  codigo_retirada text not null check (codigo_retirada ~ '^[0-9]{4}$'),
  status text not null default 'aguardando'
    check (status in ('aguardando', 'retirada', 'cancelada')),
  registrada_por_porteiro uuid not null,
  registrada_em timestamptz not null default now(),
  baixa_por_porteiro uuid,
  retirada_em timestamptz,
  retirada_por_nome text,
  unique (id, condominio_id),
  foreign key (unidade_id, condominio_id)
    references public.unidades (id, condominio_id),
  foreign key (registrada_por_porteiro, condominio_id)
    references public.porteiros (id, condominio_id),
  foreign key (baixa_por_porteiro, condominio_id)
    references public.porteiros (id, condominio_id),
  -- Baixa exige data, porteiro e o nome de quem retirou.
  constraint encomendas_baixa_completa check (
    status <> 'retirada' or (
      retirada_em is not null
      and baixa_por_porteiro is not null
      and btrim(coalesce(retirada_por_nome, '')) <> ''
    )
  )
);

-- Um registro por encomenda + celular + tipo de aviso: é o que impede aviso
-- duplicado ao reprocessar. A Edge Function grava 'pendente' ANTES de enviar
-- (se a linha já existe, não envia de novo) e atualiza o status depois.
create table public.envios_log (
  id uuid primary key default gen_random_uuid(),
  condominio_id uuid not null references public.condominios (id),
  encomenda_id uuid not null,
  inscricao_id uuid not null,
  tipo text not null check (tipo in ('chegada', 'retirada')),
  status text not null default 'pendente'
    check (status in ('pendente', 'enviado', 'falhou', 'inscricao_expirada')),
  erro text,
  criado_em timestamptz not null default now(),
  atualizado_em timestamptz not null default now(),
  unique (encomenda_id, inscricao_id, tipo),
  foreign key (encomenda_id, condominio_id)
    references public.encomendas (id, condominio_id) on delete cascade,
  foreign key (inscricao_id, condominio_id)
    references public.push_inscricoes (id, condominio_id) on delete cascade
);

-- Códigos errados digitados na baixa, para limitar tentativas
-- (ex.: 10 em 10 minutos). Usada só pelas Edge Functions.
create table public.tentativas_baixa (
  id uuid primary key default gen_random_uuid(),
  condominio_id uuid not null references public.condominios (id),
  usuario_id uuid not null references public.equipe (id) on delete cascade,
  criada_em timestamptz not null default now()
);

comment on table public.condominios is 'Condomínios atendidos pelo sistema.';
comment on table public.unidades is 'Apartamentos (bloco + número). Importados via CSV.';
comment on table public.equipe is 'Logins da portaria e do síndico (id = auth.users.id).';
comment on table public.porteiros is 'Nomes dos porteiros escolhidos no celular da portaria.';
comment on table public.moradores is 'Cadastros de moradores; o síndico aprova ou recusa.';
comment on table public.push_inscricoes is 'Celulares dos moradores inscritos para receber push.';
comment on table public.encomendas is 'Encomendas registradas na portaria e suas baixas.';
comment on table public.envios_log is 'Um registro por aviso de push (evita duplicidade).';
comment on table public.tentativas_baixa is 'Códigos errados na baixa (limite de tentativas).';


-- ---------------------------------------------------------------------
-- Índices (além dos criados pelas restrições unique)
-- ---------------------------------------------------------------------

-- Código de retirada único entre as encomendas pendentes do condomínio.
create unique index encomendas_codigo_pendente_unico
  on public.encomendas (condominio_id, codigo_retirada)
  where status = 'aguardando';

create index encomendas_lista_idx on public.encomendas (condominio_id, status, registrada_em);
create index encomendas_relatorio_idx on public.encomendas (condominio_id, retirada_em) where status = 'retirada';
create index encomendas_unidade_idx on public.encomendas (unidade_id, status);
create index equipe_condominio_idx on public.equipe (condominio_id);
create index porteiros_condominio_idx on public.porteiros (condominio_id);
create index moradores_unidade_idx on public.moradores (unidade_id);
create index moradores_status_idx on public.moradores (condominio_id, status);
create index push_inscricoes_morador_idx on public.push_inscricoes (morador_id) where ativo;
create index envios_log_inscricao_idx on public.envios_log (inscricao_id);
create index tentativas_baixa_usuario_idx on public.tentativas_baixa (usuario_id, criada_em);


-- ---------------------------------------------------------------------
-- Funções usadas pelas regras de RLS
-- Ficam no schema "privado", que não é exposto pela API.
-- ---------------------------------------------------------------------

create schema if not exists privado;
grant usage on schema privado to authenticated;

-- Condomínio do usuário logado, se for da equipe e estiver ativo.
create function privado.condominio_da_equipe()
returns uuid
language sql
stable
security definer
set search_path = ''
as $$
  select e.condominio_id
  from public.equipe e
  where e.id = (select auth.uid()) and e.ativo
$$;

-- O usuário logado é síndico ativo?
create function privado.eh_sindico()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1
    from public.equipe e
    where e.id = (select auth.uid()) and e.ativo and e.papel = 'sindico'
  )
$$;

revoke all on function privado.condominio_da_equipe() from public;
revoke all on function privado.eh_sindico() from public;
grant execute on function privado.condominio_da_equipe() to authenticated;
grant execute on function privado.eh_sindico() to authenticated;


-- ---------------------------------------------------------------------
-- Permissões por tabela (o RLS abaixo decide QUAIS linhas)
-- anon (visitante sem login): nada.
-- authenticated (equipe): só o necessário para as telas.
-- service_role (Edge Functions): tudo.
-- ---------------------------------------------------------------------

revoke all on table
  public.condominios, public.unidades, public.equipe, public.porteiros,
  public.moradores, public.push_inscricoes, public.encomendas,
  public.envios_log, public.tentativas_baixa
from anon, authenticated;

grant all on table
  public.condominios, public.unidades, public.equipe, public.porteiros,
  public.moradores, public.push_inscricoes, public.encomendas,
  public.envios_log, public.tentativas_baixa
to service_role;

grant select on table
  public.condominios, public.unidades, public.equipe, public.porteiros,
  public.envios_log
to authenticated;

-- Registrar encomenda: direto pelo app. A baixa NÃO tem permissão de
-- update aqui: passa pela Edge Function, que confere o código e o limite
-- de tentativas.
grant select, insert on table public.encomendas to authenticated;

-- Moradores: a equipe não lê o token_acesso e só altera o status.
-- (Por isso, no app, selecione as colunas pelo nome em vez de "*".)
grant select (id, condominio_id, unidade_id, nome, telefone, status, aceite_avisos_em, criado_em)
  on table public.moradores to authenticated;
grant update (status) on table public.moradores to authenticated;

-- push_inscricoes e tentativas_baixa: sem acesso para a equipe.


-- ---------------------------------------------------------------------
-- RLS
-- ---------------------------------------------------------------------

alter table public.condominios enable row level security;
alter table public.unidades enable row level security;
alter table public.equipe enable row level security;
alter table public.porteiros enable row level security;
alter table public.moradores enable row level security;
alter table public.push_inscricoes enable row level security;
alter table public.encomendas enable row level security;
alter table public.envios_log enable row level security;
alter table public.tentativas_baixa enable row level security;

create policy "equipe ve o proprio condominio"
  on public.condominios for select to authenticated
  using (id = (select privado.condominio_da_equipe()));

create policy "equipe ve as unidades do condominio"
  on public.unidades for select to authenticated
  using (condominio_id = (select privado.condominio_da_equipe()));

-- O próprio usuário sempre vê o seu registro (o app sabe se está inativo).
create policy "equipe ve a equipe do condominio"
  on public.equipe for select to authenticated
  using (
    id = (select auth.uid())
    or condominio_id = (select privado.condominio_da_equipe())
  );

create policy "equipe ve os porteiros do condominio"
  on public.porteiros for select to authenticated
  using (condominio_id = (select privado.condominio_da_equipe()));

create policy "sindico ve os moradores do condominio"
  on public.moradores for select to authenticated
  using (
    condominio_id = (select privado.condominio_da_equipe())
    and (select privado.eh_sindico())
  );

create policy "sindico aprova ou recusa moradores"
  on public.moradores for update to authenticated
  using (
    condominio_id = (select privado.condominio_da_equipe())
    and (select privado.eh_sindico())
  )
  with check (
    condominio_id = (select privado.condominio_da_equipe())
    and (select privado.eh_sindico())
  );

create policy "equipe ve as encomendas do condominio"
  on public.encomendas for select to authenticated
  using (condominio_id = (select privado.condominio_da_equipe()));

-- Só registra como "aguardando"; a baixa é feita pela Edge Function.
create policy "equipe registra encomendas"
  on public.encomendas for insert to authenticated
  with check (
    condominio_id = (select privado.condominio_da_equipe())
    and status = 'aguardando'
    and baixa_por_porteiro is null
    and retirada_em is null
    and retirada_por_nome is null
  );

create policy "equipe ve os envios do condominio"
  on public.envios_log for select to authenticated
  using (condominio_id = (select privado.condominio_da_equipe()));

-- push_inscricoes e tentativas_baixa: RLS ligado e nenhuma regra
-- = ninguém acessa pela API, só as Edge Functions.


-- ---------------------------------------------------------------------
-- Storage: bucket privado de fotos
-- Caminho dos arquivos: <condominio_id>/<arquivo>.jpg
-- O morador vê a foto por URL assinada gerada pela Edge Function.
-- ---------------------------------------------------------------------

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('fotos-encomendas', 'fotos-encomendas', false, 1048576, array['image/jpeg', 'image/webp'])
on conflict (id) do nothing;

create policy "equipe envia fotos do condominio"
  on storage.objects for insert to authenticated
  with check (
    bucket_id = 'fotos-encomendas'
    and (storage.foldername(name))[1] = (select privado.condominio_da_equipe())::text
  );

create policy "equipe ve fotos do condominio"
  on storage.objects for select to authenticated
  using (
    bucket_id = 'fotos-encomendas'
    and (storage.foldername(name))[1] = (select privado.condominio_da_equipe())::text
  );
