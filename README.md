# Recebidinho

Gestão de encomendas da portaria do condomínio: o porteiro registra a encomenda,
o morador recebe um aviso no celular (Web Push, sem custo por mensagem) e, na
retirada, o porteiro dá baixa com o código de 4 dígitos.

Roda em planos gratuitos: **Supabase** (banco, login, fotos, Edge Functions) e
**GitHub Pages** (hospedagem do app).

## Estrutura

```
recebidinho/
├── frontend/                 App PWA (React + Vite + vite-plugin-pwa)
│   ├── index.html
│   ├── vite.config.js        Manifesto do PWA e configuração do service worker
│   ├── vercel.json           Para publicar na Vercel, se trocar de hospedagem
│   ├── .env.example          Variáveis de ambiente (copiar para .env.local)
│   ├── public/               Ícones e favicon (provisórios)
│   └── src/
│       ├── main.jsx          Ponto de entrada
│       ├── App.jsx           Rotas
│       ├── sw.js             Service worker: cache do app + recebimento de push
│       ├── lib/supabase.js   Cliente do Supabase (só a publishable key)
│       └── pages/            Uma tela por arquivo
├── supabase/
│   ├── migrations/           SQL do banco (tabelas, índices, RLS, bucket de fotos)
│   └── functions/            Edge Functions (próximas etapas)
├── .github/workflows/        Publicação automática no GitHub Pages
└── docs/
    └── configuracao.md       Passo a passo: Supabase, chaves VAPID e publicação
```

## Rodar no computador

Precisa do Node.js 22 ou mais novo.

```bash
cd frontend
cp .env.example .env.local   # e preencha com os dados do Supabase
npm install
npm run dev                  # abre em http://localhost:5173
```

Para testar o PWA (service worker e instalação) use a versão de produção:

```bash
npm run build
npm run preview              # abre em http://localhost:4173
```

## Segurança

- Nenhuma chave secreta fica no código. O app usa só a *publishable key* do
  Supabase (pública e protegida pelo RLS).
- As chaves VAPID e a chave secreta do Supabase ficam apenas nos segredos das
  Edge Functions.
- RLS ligado em todas as tabelas: a equipe só acessa dados do próprio condomínio;
  moradores não acessam o banco diretamente.
