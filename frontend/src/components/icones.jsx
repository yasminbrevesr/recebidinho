// Ícones simples (traço), herdam a cor do texto.
function Icone({ children, tamanho = 24 }) {
  return (
    <svg width={tamanho} height={tamanho} viewBox="0 0 24 24" fill="none" stroke="currentColor"
      strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      {children}
    </svg>
  )
}

export const IconePacote = (p) => (
  <Icone {...p}>
    <path d="M21 8 12 3 3 8v8l9 5 9-5V8Z" />
    <path d="m3 8 9 5 9-5M12 13v8M7.5 5.5l9 5" />
  </Icone>
)

export const IconePrancheta = (p) => (
  <Icone {...p}>
    <rect x="5" y="4" width="14" height="17" rx="2" />
    <path d="M9 4V3h6v1M9 10h6M9 14h6M9 18h3" />
  </Icone>
)

export const IconeSino = (p) => (
  <Icone {...p}>
    <path d="M6 16V11a6 6 0 1 1 12 0v5l1.5 2h-15L6 16Z" />
    <path d="M10 20a2 2 0 0 0 4 0" />
  </Icone>
)

export const IconeOlho = (p) => (
  <Icone {...p}>
    <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12Z" />
    <circle cx="12" cy="12" r="3" />
  </Icone>
)

export const IconeOlhoFechado = (p) => (
  <Icone {...p}>
    <path d="M3 3l18 18M10.6 5.1A10 10 0 0 1 12 5c6.5 0 10 7 10 7a17 17 0 0 1-3.2 4.1M6.6 6.6A17 17 0 0 0 2 12s3.5 7 10 7a9.9 9.9 0 0 0 5.4-1.6" />
    <path d="M9.9 9.9a3 3 0 0 0 4.2 4.2" />
  </Icone>
)

export const IconeCamera = (p) => (
  <Icone {...p}>
    <path d="M4 8h3l2-3h6l2 3h3a1 1 0 0 1 1 1v10a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V9a1 1 0 0 1 1-1Z" />
    <circle cx="12" cy="13.5" r="3.5" />
  </Icone>
)

export const IconeBusca = (p) => (
  <Icone {...p}>
    <circle cx="11" cy="11" r="7" />
    <path d="m20 20-4-4" />
  </Icone>
)

export const IconeCheck = (p) => (
  <Icone {...p}>
    <path d="m5 12.5 4.5 4.5L19 7.5" />
  </Icone>
)

export const IconeSinoCortado = (p) => (
  <Icone {...p}>
    <path d="M3 3l18 18M8.5 5.2A6 6 0 0 1 18 11v4M6 11v5l-1.5 2H16" />
    <path d="M10 20a2 2 0 0 0 4 0" />
  </Icone>
)

export const IconeDownload = (p) => (
  <Icone {...p}>
    <path d="M12 4v11m0 0-4-4m4 4 4-4M5 20h14" />
  </Icone>
)
