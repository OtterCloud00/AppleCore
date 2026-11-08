# Applecore

App web personale per corsi iOS e SwiftUI, costruita con **TanStack Start 1.0 React**, Vite 8, Tailwind 4, TypeScript e pnpm. Deploy su Cloudflare Workers. Zero costi, uso personale, media in repo privato (`orchard`).

## Struttura

```
Applecore/
├── src/
│   ├── routes/          # Route file-based TanStack Router
│   │   ├── index.tsx            # /          Landing pubblica (vetrina, inglese)
│   │   ├── auth.tsx             # /better-auth Login/BetterAuth (inglese)
│   │   ├── courses.tsx          # /courses   Catalogo corsi (inglese)
│   │   ├── hub.tsx              # /hub       Dashboard autenticata (italiano)
│   │   ├── c/$courseId.tsx      # /c/:id     Pagina corso (italiano, login)
│   │   ├── c/$courseId/l/$lessonId.tsx  # Lezione (italiano, login)
│   │   ├── media/$              # /media/*   Media autenticati
│   │   └── api/auth/$           # API auth
│   ├── components/              # Componenti UI condivisi
│   │   ├── IslandShell.tsx
│   │   ├── Button.tsx
│   │   ├── CoreMark.tsx         # Marchio Applecore
│   │   ├── Progress.tsx
│   │   ├── ThemeToggle.tsx
│   │   ├── Header.tsx
│   │   └── Footer.tsx
│   ├── lib/                     # Logica condivisa
│   │   ├── catalog.ts           # Lettura catalogo corsi
│   │   ├── storage.ts           # Interfaccia dominio localStorage
│   │   ├── auth.ts              # Better Auth configurazione
│   │   └── auth-client.ts
│   ├── server/                  # Route server (auth, media)
│   │   ├── auth.ts
│   │   └── media.ts
│   ├── data/                    # Dati catalogo
│   │   └── catalog.json
│   ├── styles.css               # Token CSS e tema
│   └── __root.tsx               # Route radice
├── docs/
│   ├── TANSTACK-PLAN.md         # Piano adozione TanStack (attivo)
│   ├── TANSTACK-PLAN-1.md       # Piano storico (archiviato)
│   ├── TANSTACK-PLAN-REPORT.md  # Stato completamento piano
│   ├── GUIDA-OPERATIVA.md       # Come aggiungere moduli/corsi
│   └── STATO-PROGETTO.md        # Stato progetto e handoff
├── PRODUCT.md                   # Contesto prodotto (Impeccable)
├── DESIGN.md                    # Sistema visuale (Impeccable)
└── .impeccable/                 # Config design system (Impeccable)
```

## Regole lingua

| Area | Pagine | Lingua |
|------|--------|--------|
| Pubbliche | `/`, `/better-auth`, `/courses` | Inglese |
| Loggate | `/c/$courseId`, `/hub`, `/c/$courseId/l/$lessonId` | Italiano |

## Navigazione

- `/` — Landing pubblica con catalogo corsi. Le card sono **statiche (vetrina)**, per entrare nei corsi serve il login.
- `/better-auth` — Login / sign-up Better Auth (inglese).
- `/courses` — Catalogo corsi pubblico. Cliccando un corso senza login si va a `/auth` con ritorno al corso dopo l'accesso.
- `/c/$courseId` — ❌ Login richiesto. Pagina corso con progressi e lezioni.
- `/c/$courseId/l/$lessonId` — ❌ Login richiesto. Pagina lezione con player video e note.
- `/hub` — ❌ Login richiesto. Dashboard progressi e ricerca lezioni.
- `/media/*` — ❌ Login richiesto. Media protetti.

## Avvio in sviluppo

```bash
# Installa dipendenze
pnpm install

# Avvia server di sviluppo (porta 3000)
pnpm dev

# Build di produzione
pnpm build

# Anteprima build
pnpm preview

# Deploy su Cloudflare Workers
pnpm deploy
```

## Variabili ambiente (`.env.local`)

```env
BETTER_AUTH_URL=http://localhost:3000
SITE_USER=tuo_utente
SITE_PASS=tua_password
SESSION_SECRET=una_segreta_lunga_e_casuale
```

## Comandi disponibili

- `pnpm dev` — avvia dev server
- `pnpm build` — build produzione
- `pnpm preview` — anteprima build locale
- `pnpm lint` — esegue ESLint
- `pnpm format` — Prettier + ESLint fix
- `pnpm check` — verifica formattazione Prettier
- `pnpm deploy` — build + deploy Cloudflare Workers

## Aggiungere un corso

Vedi `docs/GUIDA-OPERATIVA.md` per la routine completa (scarico da Teachable, catalogo, risorse, commit).

## Licenza

Materiali per uso personale. Vietato esporre pubblicamente (no mirror su server). Vedi `docs/STATO-PROGETTO.md` §Licenza.
