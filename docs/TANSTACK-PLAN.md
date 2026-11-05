# PIANO TANSTACK — Applecore (25 ott 2026, up. 1 nov 2026 ×2)

> Ricerca fatta su tanstack.com (Start **1.0 stabile** dal 13/10/2026).
> **DECISIONE (25/10 sera): drop di Next** — percorso deploy **documentato
> ufficialmente** nelle guide Start (via Nitro).
> Migrazione a **TanStack Start in React** PRIMA del primo deploy.
> Inventario librerie verificato live il 25/10/2026 tramite registry npm
> (versioni esistenti di ogni package React/Solid).
>
> **Aggiornamento 1 nov 2026**:
> 1. **Hosting: CLOUDFLARE** (era Vercel) → Workers + route media interna;
>    dettagli in §Architettura deploy (sostituisce la tabella
>    pro/contro Vercel)
> 3. **Video >50MB**: nel repo media i video oltre 50MB esistono solo come
>    parti binarie in `public/media/widgetkit/_split/` (limite GitHub);
>    logica di ricomposizione on-demand nella route dei media, vedi
>    §Video >50MB: parti binarie in `_split` (nuovo)
> 4. **R2 scartata** (stesso giorno, seconda revisione): i media NON vanno
>    su un bucket R2 — vengono **tutti da `orchard` su GitHub**, unica
>    sorgente (develop: submodule; prod: fetch autenticato del Worker).
>    §Architettura deploy riscritta, secrets con in più `GH_TOKEN`
> 5. **Markdown / Highlight adottate subìto** (non più "futuro"): note in
>    markdown renderizzato e snippet di codice evidenziati SONO dentro lo
>    step 7 del percorso di adozione — niente seconda fase, le note si
>    usano dal giorno 1 (il persist `notes` dello Store, step 3, è già
>    la materia prima)
> 6. **Fase 2 abolita**: anche Charts (dashboard dei progressi) entra nel
>    percorso di adozione (step 8) — stessa ragione: niente metà lavori,
>    la dashboard nasce col resto, non "dopo"

## Inventario completo sul sito — disponibilità React / Solid (verificato npm)

| Libreria | Categoria | Versione React | Versione Solid | Applecore |
|---|---|---|---|---|
| **Start** | framework | 1.169.4 ✓ | 1.169.4 ✓ | ✅ IL framework (React) |
| **Router** | framework | 1.170.46 ✓ | 1.170.43 ✓ | ✅ file-based + search-params |
| **Query** | data/state | 5.104.5 ✓ | 5.104.5 ✓ | ✅ (vedi sotto) |
| **Store** | data/state | 0.11.2 ✓ | 0.11.2 ✓ | ✅ progressi/resume/note |
| **DB** (beta) | data/state | 0.5.12 ✓ | 0.3.12 ✓ | ❌ (no server; futuro sync) |
| **Table** | ui | 9.3.1 ✓ | 9.3.1 ✓ | ❌ (nessuna griglia) |
| **Form** | ui | 1.33.5 ✓ | 1.33.5 ✓ | ❌ (nessun form) |
| **Charts** | ui | 1.1.0 ✓ | 1.1.0 ✓ | ✅ dashboard progressi (step 8) |
| **Virtual** | ux | 3.14.22 ✓ | 3.13.49 ✓ | ✅ moduli >15 lezioni |
| **Pacer** | ux | 0.24.1 ✓ | 0.24.0 ✓ | ✅ throttle salvataggi |
| **Hotkeys** | ux | 0.17.0 ✓ | 0.17.0 ✓ | ✅ scorciatoie player |
| **Devtools** | tooling | 0.10.13 ✓ | 0.8.13 ✓ | ✅ panel in dev |
| **Redact** | runtime | 0.2.3 ✓ (nato 26/10/2026) | — (runtime solo React) | 🔶 si prova a port finito (step 11) |
| **AI** | vanilla | — (vanilla 1.0.0, utilizzabile da React) | — | ❌ |
| **Markdown** | vanilla | — (vanilla 1.0.0) | — | ✅ note lezione renderizzate |
| **Highlight** | vanilla | — (vanilla 1.1.0) | — | ✅ snippet di codice nelle note |
| **CLI** | tooling | 0.72.0 | — | ✅ scaffold migrazione |
| **Config** | tooling | 0.22.2 | — | ❌ (tooling per publisher) |

**Bilancio**: **13 librerie con adapter React E Solid in parallelo** (esatte le
versioni rilevate in npm), le altre 2 (Markdown / Highlight) sono Vanilla e
ADOOTTATE (step 7), solo AI resta vanilla fuori. La parità React/Solid è
completa: un eventuale port futuro tocca solo le componenti UI.

## Percorso di adozione: React su Cloudflare (con l'ordine degli step)

1. **CLI** `npx @tanstack/cli create` — scaffold del progetto in **una
   cartella vuota separata** (MAI dentro il repo dell'app, vedi nota del
   1 nov in cima al file); i pezzi dell'app migrano fra i due alberi
   (step 0 della migrazione)
2. **Start + Router** — `vite.config`: `[tanstackStart(), nitro(), viteReact()]`;
   route file-based `src/routes/`: `/` · `/c/$course` ·
   `/c/$course/$module/$lesson`; search-params type-safe per deep-link
   lezione e (futuro) timestamp del resume nella URL
3. **Store** — store core con persist per `pos`/`done`/`notes` una sola
   chiave versionata in localStorage (le chiavi `hub:*` vecchie restano
   lette per compat)
4. **Pacer** + Store — `throttle` di Pacer sostituisce il timer fatto a
   mano che salva il `currentTime` (oggi "ogni 5s")
5. **Hotkeys** — scorciatoie player: spazio play/pause, frecce ±10s,
   J/K/L stile YouTube, F fullscreen, N/P lezione precedente/successiva
6. **Virtual** — lista lezioni dei moduli lunghi (Appetizers: 26 lezioni)
7. **Markdown + Highlight** — le note per-lezione (chiave `notes`
   già nello Store/persist dello step 3) si renderizzano in markdown
   dal giorno 1, NON in una seconda fase ("evitare i lavori a metà"):
   pannello note nella pagina lezione, markdown renderizzato lato
   client (le note sono private/locali: niente server) e bundle
   lazy-loaded SOLO nella pagina lezione; **Highlight** evidenzia gli
   snippet di codice (lezioni SwiftUI/widgetkit: blocchi swift spesso
   citati), con highlighter a caricamento asincrono SOLO se la nota
   contiene un blocco codice
8. **Charts** — dashboard progressi nella home: la "fase 2" sparisce
   (stesso principio di Markdown + Highlight, niente fasi attese):
   stato fatto/rimanenza per corso e per modulo, previsione di
   completamento a ritmo attuale (lezione al giorno / settimana…),
   dati tutti dallo Store dello step 3 (`done`/`pos`), zero fetch
   extra; bundle Charts SOLO nella route dashboard, il resto
   dell'app non lo tocca
9. **Query + Query Devtools** — lazy-load dell'indice di ricerca
   (`index.json` via fetch con cache) e prefetch media delle prossime
   lezioni via Router loader (integrazione ufficiale di Query con Start):
   da installare SOLO quando la ricerca non sta più nel bundle
10. **Devtools panel** — `@tanstack/react-devtools` in dev per ispezionare
   store/query; zero bundle in prod
11. **Redact** — swap di runtime che si fa per ULTIMO, quando tutti gli
   step prima sono a posto: un plugin nel `vite.config` (`redact()`),
   zero righe di codice app cambiate, -66% di runtime nel browser.
   Il dettaglio e il "perché non era nell'inventario" in
   §Redact: runtime React alternativo

### Le NON adottate (e perché)

- **DB** (beta): no server API in Applecore — ripescabile per un futuro
  sync client-server
- **Table / Form**: nessuna griglia o form nell'app (uso personale)
- **AI**: vanilla, nessun use-case
- **Config**: tooling per publisher di pacchetti, non per app
- ~~**Markdown / Highlight**~~ → **promosse alle adottate** (1 nov, step 7
  del percorso): restarle "futuro" avrebbe lasciato il lavoro a metà
  dal primo deploy — note già persistite (chiave `notes` dello Store)
  ma senza rendering. Entrano con lo stesso taglio della migrazione,
  niente fasi sparse

## Skills di progetto installate (`.agents/skills/`) — quando entrano in gioco

Regola utente (25/10): usarle tutte durante il percorso TanStack.

| Skill | Quando | Come |
|---|---|---|
| **find-skills** | Step 0 migrazione (prima dello scaffold) | cercare nel registry skill utili al port (es. TanStack/Vite/Tailwind); installarle in `.agents/skills/` e aggiornare questa tabella |
| **frontend-design** | Step 5 componenti (se il port tocca la UI: dashboard/player/pannello note markdown) | identità visiva durante il porting: tipografia/palette intenzionale, evitare l'aspetto "template default" |
| **improve-codebase-architecture** | POST-migrazione (dopo la verifica step 7) | scan deepening-opportunities con report HTML: i seam nuovi resi possibili da Router/Store (adapter localStorage, interfacce catalogo). ⚠️ `disable-model-invocation: true` → invocabile solo dall'utente. ⚠️ richiede la skill "codebase-design" (vocabolario): **✅ INSTALLATA** (`mattpocock/skills@codebase-design`, 855K install — trovata via find-skills) |

Calendario: find-skills PRIMA, frontend-design DURANTE, improve-codebase-architecture DOPO.

## Login: homescreen pubblica (sostituisce il prompt nativo 401)

Problema oggi: Basic Auth usa **il prompt del browser** (quella finestra grigia
da ":wpa admin router") — pratico ma brutto, senza stesso marchingegno né
branding. Nel port si sostituisce con tutta materia propria app:

- **`/` pubblica**: chi non è autenticato vede la landing (titolo corsi,
  copertine, "contenuto riservato") con form di login
- **server function di login**: validate credenziali vs env
  `SITE_USER`/`SITE_PASS` → cookie di sessione **firmato** (secret da env
  `SESSION_SECRET`, con fallback automatico se assente), HttpOnly,
  SameSite=Lax, scadenza 30 giorni
- **middleware** sostituisce il Basic: cookie valido → let it go; assente →
  l'utente resta su `/` pubblica; route protette → redirect `/`. I media
  NON passano da qui: il secondo progetto accetta solo URL firmate HMAC
  (§Architettura deploy) — così niente doppio login né cookie cross-dominio
- **logout** per svuotare il cookie (piccolo bottone nel hub)
- compatibilità: Basic Auth continua a valere come fallback se il cookie
  non c'è (per client tipo download tool), come oggi
- `SESSION_SECRET` entra nelle secrets del Worker Cloudflare assieme a
  SITE_USER/SITE_PASS (`npx wrangler secret put …`)

> **Deviazione 3 nov 2026 (richiesta esplicita dell'utente, 3 passaggi
> di messa a punto — schema definitivo)**: la parte pubblica **si ferma
> alla pagina corso** (`/c/$courseId` — "non più in fondo di così").
> - `/` per gli ospiti = **la landing disegnata** (schermata editoriale:
>   CoreMark grande come unica decorazione, titolo Fraunces, banda
>   d'ingresso con la form; rivelio orchestrato dei 5 semi), NON una
>   pagina login spoglia: la rotta dedicata
>   `/login` è stata rimossa come ridondante
> - hub `/`, pagine corso `/c/$courseId` → **pubbliche**
> - `/c/$courseId/l/$lessonId` → `beforeLoad` redirect a `/?to=<path>`
>   (la landing stessa, con ritorno automatico dopo l'accesso; validazione
>   anti-open-redirect nel `validateSearch` della home)
> - dopo il login: **ricaricamento pieno** `window.location.assign(returnTo)`
>   — così l'header `useSession` nasce con lo stato giusto dal SSR
>   (l'atom Better Auth si aggiorna solo sui percorsi client Better Auth,
>   non dopo una serverFn custom)
> - `/media/*` resta protetto (401 / Basic fallback)
> - Auth = Better Auth (stateless, adapter memory + cookieCache 30d,
>   `tanstackStartCookies()`). e2e verificato in browser: gate lezione →
>   landing con `?to` → login → ritorno sulla lezione richiesta.

Buon motivo per attivare **frontend-design** durante step 5: la landing e
il hub meritano identità visiva propria (palette del sito corsi, tipografia
equa, non-tavola genitoriale di default).

## Migrazione Next → Start React (8 step — UNA fase da mezza giornata)

Media in volo non bloccano: `public/media` è **untracked** e `public/` funziona
uguale con Vite. Ordine previsto:

1. **find-skills** a caccia di skill utili
2. **Routes**: `src/routes/` file-based (App Router → Router):
   `/` (dashboard) · `/c/$course` (corso) · `/c/$course/$module/$lesson`
   (lezione + player). `next/link` → `Link`, `useParams`/`useSearchParams` →
   hooks del Router (search-params type-safe = bonus resume deep-link)
3. **Auth, versione moderna**: niente più prompt nativo 401 (quello stile
   "pagina di configurazione router"). Route pubblica `/login` con form →
   server function valida `SITE_USER`/`SITE_PASS` → **session cookie
   firmato**; il middleware protegge le route dell'app. I media restano
   su **`orchard` (repo GitHub privato)**: la route interna li streamma
   con `GH_TOKEN`, protetta dallo stesso cookie (niente secondo progetto
   niente HMAC, vedi §Login: homescreen pubblica e §Architettura
   deploy). Vedasi [§ Login: homescreen pubblica].
   La route media NON serve solo file statici: implementa anche la
   ricomposizione on-demand delle parti `_split` (§Video >50MB)
4. **Componenti**: UI passa quasi intatta (client components senza direttive
   "use client"; `next/head` → `<head>` di Start; niente `next/image`)
5. **Verifica locale**: `pnpm build` + `vite preview` → player OK, range
   request su `/media/*.mp4` OK (incluso il seek su una lezione split,
   §Video >50MB), 401 senza auth, ricerca e resume OK.
   A verifica verde: **frontend-design** SOLO se la UI merita un ritocco
   durante il port; **improve-codebase-architecture** post-migrazione
   (l'utente lo invoca a mano)
6. **Deploy Cloudflare** (o prima push e poi import): preset Nitro
   `cloudflare` → `wrangler deploy`; secrets `SITE_USER`, `SITE_PASS`,
   `SESSION_SECRET`, `GH_TOKEN` (PAT read-only sul repo `orchard`, per la
   route media); test post-deploy come da `STATO-PROGETTO` §Deploy
   (401 → redirect a `/login`)

Stima: mezza giornata. Trade-off accettato: rinuncio a React Compiler
(legato a Next); il resto (Tailwind, TS, pnpm) sale senza attriti.

## Architettura deploy: Cloudflare Workers + media da `orchard` (GitHub) (DECISO 1 nov 2026; R2 scartata in seconda revisione)

L'hosting è Cloudflare (era il piano Vercel: la variante HMAC
"2 progetti" è **abbandonata**; del vecchio confronto sopravvive invece
l'idea "1 app + GH_TOKEN", la scelta giusta — vedi tabella sotto). 1 solo Worker.
I media NON vanno su un bucket: **`orchard` (repo GitHub privato) è l'unica
sorgente** — in develop via submodule, in produzione il Worker pesca i file
da GitHub. Un solo posto di verità, niente doppio storage da tenere allineato:

| Pezzo | Decisione |
|---|---|
| App | TanStack Start 1.0 React, Nitro preset `cloudflare`, `wrangler deploy` |
| Media | fetch dal repo `orchard` (`OtterCloud00/orchard`, private): la route interna streamma da `raw.githubusercontent.com` **autenticato** con `GH_TOKEN`, **solo col cookie di sessione valido**; le parti `_split` vengono unite al bisogno (§Video >50MB: parti binarie in `_split` e ricomposizione on-demand) |
| Login | cookie firmato (`SESSION_SECRET`) = unico controllo, app e media su 1 dominio: niente copia cookie cross-dominio, niente URL firmate HMAC |
| Repo media | `orchard` resta la sorgente **unica** per develop (submodule su `public/media`) e per la produzione (fetch GitHub); nei deploy CF il submodule NON viene montato ma non serve: il Worker va sul repo remoto. Push di un video su `orchard` = aggiornamento in produzione al primo request successivo ("source of truth" immediato) |
| Secrets | `SITE_USER`, `SITE_PASS`, `SESSION_SECRET`, `GH_TOKEN` (PAT read-only su `orchard` — wrangler secret put). Il token sta SOLO nel Worker: l'app espone i media protetti da cookie, mai il token |
| Costi | Workers free tier; storage GitHub già pagato dal repo. Raw autenticato = nessuna soglia condivisa con l'API REST; cache sul Worker per non ripetere i fetch |

- **Repo public**: `github.com/OtterCloud00/AppleCore` già pulito di media
  (filter-repo fatto), submodule su `public/media` per lo sviluppo locale
  (catalogo e dev); in produzione la stessa repo è la fonte via fetch
- Le parti `_split` e i video ≤50MB vivono SOLO sul repo `orchard`: push
  incrementale dei soli corsi nuovi, il deploy dell'app non tocca i media
- Cache sul Worker: le parti/asset sono **immutabili** (commit su GitHub =
  contenuto congelato) → `Cache API` con chiave `path + commit SHA`
  (o lunga durata + busta sul push), così il fetch a GitHub resta un evento
  raro e l'ingombro dei rate limit un non-problema

> Come già per Vercel (e per lo stesso motivo): **i deploy cloudflare
> confezionano solo il repo codice app, i submodule non vengono montati**
> → la route media va sul repo remoto autenticata (i media restano
> privati ma senza bucket né URL esterne firmate: l'accesso passa
> sempre dal Worker, protezione cookie + token server-side).

## Video >50MB: parti binarie in `_split` e ricomposizione on-demand (1 nov 2026)

Situazione nel repo media: i video oltre 50MB **non esistono come `.mp4`** —
sono divisi in parti binarie da 50MB esatti (52.428.800 byte, l'ultima più
piccola) sotto `widgetkit/_split/<cartella>/<nome video>_parts/`
(`<nome>.mp4.part000`, `<nome>.mp4.part001`, …), con `reassemble.cmd`
incluso, SHA-256 verificato e README esplicativo nel `_split`. ~40 video
divisi a oggi (elenco nel README). Su GitHub restano **solo le parti**;
sarà l'app a unirle al bisogno.

**Principio: gli `src` del catalogo restano invariati.** Il player continua
a puntare al percorso "virtuale" dell'originale
(`/media/widgetkit/.../<nome>.mp4`); è la **route dei media** a decidere
cosa servire. Il player (e Store/Hotkeys col player) non sa nulla degli
split.

| Pezzo | Logica da implementare |
|---|---|
| Catalogo | La regola "cartelle `_` escluse" resta: `_split` NON è un modulo né media diretto. `build-catalog.mjs` viene esteso con una **passata su `_split`** che, per ogni `<nome>_parts` corrispondente a una lezione esistente, annota `parts: <n>` (n° di parti) — utile per badge "video in più parti" e per i test; se l'originale manca e non c'è `_split`, la lezione è davvero senza src |
| Route media | Handler unico (server route / middleware Nitro, dev e prod): riceve `/media/<path>.mp4` → 1) **originale presente** (dev: file su disco nel submodule; prod: fetch autenticato su `orchard` via `GH_TOKEN`) → stream statico come oggi; 2) **originale assente** → cerca `_split/…/<nome>_parts/*.part000`; se c'è, **stream-through**: parti servite in sequenza, `Content-Length` = somma delle parti, byte identici (verifica SHA-256 già fatta allo split) |
| Range request | Fondamentale per il seek: rispondere `206` mappando l'offset sulla parte giusta (trovo la parte che contiene lo start, stream da lì fino in fondo alla parte, poi le successive). Il check già previsto in §Migrazione step 7 ("range request su `/media/*.mp4` OK") va ripetuto **su una lezione split** |
| Dev (Node/Nitro) | Parti lette con `fs.createReadStream` concatenate in sequenza — **nessun file temporaneo**. Facoltativo: al primo hit, cache dell'originale unito accanto alle parti (gitignored) per servire poi statico; decide l'uso reale, non il piano |
| Prod (Workers) | Stream-through con **Range passthrough**: il fetch autenticato a `raw.githubusercontent.com` della singola parte porta lo start-offset giusto (`Range: bytes=<offset interno alla parte>`) — niente buffer interi in memoria: la parte `n` entra nello stream verso il player solo quando la `n-1` è stata consumata. Il fetch delle parti passa dalla **Cache API** (le parti sono immutabili nel commit: la parte 000 si scarica da GitHub UNA volta per commit, poi tutte dalla edge cache) — su GitHub l'originale >50MB non esiste e va bene così: l'unione vive solo nel canale della singola request |
| URL encoding | Spazi, `#`, caratteri speciali nei nomi (`05 - What's New in Xcode 15.mp4.part001`): unico encoding, già convenzione del catalogo (segmento × `encodeURIComponent`, `/` reali restano separatori); la route media fa il **reverse** prima di toccare il disco/l'URL GitHub |

Costo: la ricomposizione on-demand è I/O banale (concatenazione, nessuna
ricompressione); la parte 001 entra nello stream appena la 000 è
consumata → nessuna latenza percepibile per il player. Nessun doppio
storage su disco a dovere.

Nella migrazione tocca: **step 4** (media da statico a handler, altrimenti
i ~40 video oltre 50MB non si vedono in dev né in prod) e **step 7**
(verifica col seek su una lezione split, es. "What's New in Xcode 15",
55,7 MB in 2 parti).

## Regole d'oro

1. **Store + Pacer + Virtual + Hotkeys**: adozione subito dopo il port
   (migliorano il player e sopravvivono a qualunque futuro hosting)
2. **Markdown + Highlight + Charts**: subìto, dentro gli step 7-8 del
   percorso — le note si renderizzano e la dashboard esiste da subito,
   niente "futuro"/"fase 2" che lascia il lavoro a metà
3. **Query**: solo quando serve davvero (ricerca lazy / prefetch), con
   devtools accese solo in dev
4. **DB / Table / Form / Config / AI**: fuori — nessun uso reale per l'app
5. **Router**: sempre TanStack Router, mai App Router (Next esce di scena)
6. **Solid**: uguale-oppure (13/13 adapter paralleli verificati npm) →
   l'eventuale port tocca solo le componenti UI
