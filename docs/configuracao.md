# Passo a passo de configuração

Guia para colocar o Recebidinho no ar. Faça na ordem. Use contas e e-mail **do
condomínio**: ele será o dono das contas depois da entrega.

> Dica: crie um cofre de senhas (Bitwarden, 1Password ou o do navegador) para
> guardar a senha do banco e as chaves. Nunca mande chaves secretas por e-mail ou
> chat.

---

## 1. Criar o projeto no Supabase

1. Acesse <https://supabase.com> e clique em **Start your project**. Crie a conta
   com o e-mail do condomínio.
2. Crie uma **organização** (ex.: "Condomínio X") no plano **Free**.
3. Clique em **New project** e preencha:
   - **Name:** `recebidinho`
   - **Database Password:** clique em **Generate a password** e guarde no cofre de
     senhas. Ela não vai para o app; serve só para manutenção.
   - **Region:** `South America (São Paulo)`.
   - Se aparecer **Security options**, deixe o padrão (Data API ligada, schema
     `public`).
4. Clique em **Create new project** e aguarde uns 2 minutos.

## 2. Desligar o cadastro público de usuários

Só a equipe (portaria e síndico) tem login, e quem cria esses logins é o
administrador. Moradores não usam login.

1. No menu lateral: **Authentication** → **Sign In / Providers**.
2. Desligue **Allow new users to sign up** e clique em **Save**.

## 3. Rodar a migration (criar as tabelas)

1. No GitHub, abra o arquivo
   `supabase/migrations/20261020120000_estrutura_inicial.sql` e copie todo o
   conteúdo (botão **Copy raw file**).
2. No Supabase: menu lateral → **SQL Editor** → **New query**.
3. Cole o conteúdo e clique em **Run**.
   - Resultado esperado: `Success. No rows returned`.
   - Se aparecer um aviso sobre operações "destrutivas", pode confirmar: o
     arquivo só cria coisas (o aviso aparece por causa de trechos como
     `on delete cascade`).
   - Se der erro, **não rode de novo**: copie a mensagem e envie para o
     desenvolvedor.
4. Rode **uma vez só**. Mudanças futuras virão em novos arquivos de migration.

## 4. Conferir o banco

1. **Table Editor**: devem aparecer 9 tabelas: `condominios`, `unidades`,
   `equipe`, `porteiros`, `moradores`, `push_inscricoes`, `encomendas`,
   `envios_log`, `tentativas_baixa`. Nenhuma deve estar marcada como
   "Unrestricted" / "RLS disabled".
2. **Storage**: deve existir o bucket `fotos-encomendas`, **sem** a etiqueta
   "Public".
3. Opcional, no **SQL Editor**:

   ```sql
   select tablename, rowsecurity from pg_tables where schemaname = 'public' order by 1;
   ```

   Esperado: 9 linhas, todas com `rowsecurity = true`.

Avisos que podem aparecer em **Advisors** e são esperados:

- *RLS Enabled No Policy* em `push_inscricoes` e `tentativas_baixa`: proposital,
  só as Edge Functions acessam essas tabelas.
- *Table exposed via GraphQL to signed-in users*: os dados continuam protegidos
  pelo RLS. O app não usa GraphQL.
- *Unindexed foreign keys* / *Unused index*: sem impacto com o volume de um
  condomínio.

## 5. Gerar as chaves VAPID (para as notificações)

As chaves VAPID identificam o nosso sistema nos serviços de push do Google e da
Apple. Gere **uma vez só**: se trocar depois, todos os celulares precisam ativar
os avisos de novo.

1. Instale o **Node.js** (versão LTS) em <https://nodejs.org>, se ainda não tiver.
2. Abra o **Terminal** (Mac) ou o **PowerShell** (Windows) e rode:

   ```bash
   npx web-push generate-vapid-keys
   ```

   Se perguntar `Ok to proceed? (y)`, digite `y` e Enter.
3. Vão aparecer duas chaves:

   ```
   Public Key:
   BAbc...   (texto longo)

   Private Key:
   xyz...    (texto mais curto)
   ```

4. Guarde as duas no cofre de senhas. A **Private Key é secreta**: não coloque em
   código, e-mail ou chat.

## 6. Cadastrar os segredos no Supabase

1. No Supabase: menu lateral → **Edge Functions** → **Secrets**.
2. Adicione os três segredos (pode usar **Add another** para incluir vários) e
   clique em **Save**:

   | Key                 | Value                                         |
   | ------------------- | --------------------------------------------- |
   | `VAPID_PUBLIC_KEY`  | a Public Key do passo 5                       |
   | `VAPID_PRIVATE_KEY` | a Private Key do passo 5                      |
   | `VAPID_SUBJECT`     | `mailto:` + e-mail do condomínio, sem espaços (ex.: `mailto:portaria@condominio.com.br`) |

Não é preciso cadastrar a chave secreta do Supabase (a antiga *service role
key*): as Edge Functions já recebem essa chave automaticamente. Ela nunca deve
ir para o app nem para a Vercel.

## 7. Publicar o app na Vercel

1. Acesse <https://vercel.com> → **Sign Up** → **Continue with GitHub**, usando a
   conta do GitHub que tem acesso ao repositório `recebidinho`.
2. Clique em **Add New…** → **Project** e, na lista, clique em **Import** ao lado
   de `recebidinho`. (Se ele não aparecer, clique em **Adjust GitHub App
   Permissions** e libere o repositório.)
3. Na tela de configuração:
   - **Root Directory:** clique em **Edit** e escolha a pasta `frontend`.
   - **Framework Preset:** `Vite` (vem selecionado sozinho). Não mexa em Build
     Command nem Output Directory.
   - **Environment Variables:** adicione as duas variáveis abaixo.

     | Name                            | Value |
     | ------------------------------- | ----- |
     | `VITE_SUPABASE_URL`             | URL do projeto, ex.: `https://abcd1234.supabase.co` |
     | `VITE_SUPABASE_PUBLISHABLE_KEY` | a *Publishable key*, começa com `sb_publishable_` |

     Onde encontrar no Supabase: botão **Connect** no topo do projeto, ou
     **Project Settings** → **API Keys** (chave) e **Project Settings** →
     **Data API** (URL). A *publishable key* é a substituta da antiga *anon
     key* e pode ficar no app. **Nunca** use aqui a *Secret key*
     (`sb_secret_...`).
4. Clique em **Deploy** e aguarde cerca de 1 minuto. A Vercel mostra o endereço
   do app (ex.: `https://recebidinho.vercel.app`).

Se mudar alguma variável depois, é preciso publicar de novo: **Deployments** →
menu **⋯** do último → **Redeploy**.

## 8. Informar o endereço do app ao Supabase

1. No Supabase: **Authentication** → **URL Configuration**.
2. Em **Site URL**, coloque o endereço da Vercel (ex.:
   `https://recebidinho.vercel.app`) e clique em **Save**.

Isso será usado nos e-mails de troca de senha da equipe.

## 9. Conferir o app publicado

1. Abra o endereço da Vercel. Deve aparecer **Recebidinho** e a linha
   **Supabase: configurado**. Se aparecer "NÃO configurado", revise as variáveis
   do passo 7 e faça o **Redeploy**.
2. Toque em cada tela da lista: todas abrem com o título e "Em construção".
3. Instalação no celular:
   - **Android (Chrome):** menu **⋮** → **Instalar app** (ou **Adicionar à tela
     inicial**).
   - **iPhone (Safari):** botão **Compartilhar** → **Adicionar à Tela de Início**.
   - O ícone verde do Recebidinho deve aparecer na tela inicial e abrir o app sem
     a barra do navegador.
4. Teste de notificação no computador (Chrome):
   1. Abra o app, clique no cadeado ao lado do endereço → **Notificações** →
      **Permitir**.
   2. Aperte **F12** → aba **Application** → **Service workers**. Deve mostrar
      `activated and is running`.
   3. No campo **Push**, escreva `{"titulo":"Teste","corpo":"Chegou encomenda"}` e
      clique em **Push**. Deve aparecer uma notificação; ao clicar nela, abre a
      tela do morador.
   4. Se nada aparecer, confira se as notificações do Chrome estão permitidas nas
      configurações do Windows/Mac.

---

## Bom saber

- **Projeto do Supabase pausado:** no plano gratuito, o projeto pausa depois de
  7 dias sem nenhum uso. Com o uso diário da portaria isso não deve acontecer; se
  acontecer, entre no painel e clique em **Restore project**.
- **Limites do plano gratuito do Supabase** (folgados para um condomínio): 500 MB
  de banco e 1 GB de arquivos. As fotos são pequenas e apagadas 30 dias após a
  retirada.
- **Plano gratuito da Vercel (Hobby):** pelas regras da Vercel, é para uso não
  comercial. Como o app é um site estático, ele pode ser movido para outra
  hospedagem gratuita sem mudar o código, se for preciso.
