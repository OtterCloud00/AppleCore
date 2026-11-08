# STATO PROGETTO — Applecore

> Documento di handoff: da leggere a inizio sessione (umano o agente).
> Ultimo aggiornamento: 8 novembre 2026.

> **Aggiornamento 5 nov 2026 — migrazione eseguita.**
> L'app gira su **TanStack Start 1.0 React** (Vite 8) con route file-based in
> `src/routes/`, auth Better Auth (`src/lib/auth.ts`, `src/server/auth.ts`) e
> route media autenticata (`src/routes/media/$.ts`). Il build usa Cloudflare
> Workers (`@cloudflare/vite-plugin`); in dev Nitro su Node legge i media da
> `APPLECORE_MEDIA_DIR` (default `media`). Le sezioni sotto che citano
> Next.js/`proxy.ts`/submodule sono storiche, salvo i punti su catalogo e
> media; vedi anche `TANSTACK-PLAN.md`.

> **Aggiornamento 8 nov 2026 — to-do README eseguiti.**
> - `src/routes/index copy.tsx` splittato in `hub.tsx` (Hub) e `auth.tsx` (LoginForm + BetterAuth); `index copy.tsx` eliminato.
> - `TANSTACK-PLAN.md` archiviato come `TANSTACK-PLAN-1.md`; nuovo `TANSTACK-PLAN.md` scritto con percorsi di adozione rimanenti (Store, Pacer, Hotkeys, Virtual, Markdown+Highlight, Charts, Query, Devtools, Redact).
> - `TANSTACK-PLAN-REPORT.md` creato con stato di completamento del piano TanStack (2/16 librerie adottate).
> - Report architettura (`improve-codebase-architecture`) scritto in temp: 4 candidati di deepening, top recommendation = spostare LoginForm da auth.tsx nel modulo /.
> - `impeccable` hook attivato per questo progetto (`.impeccable/config.json` + `config.local.json`).
> - `src/routes/index.tsx`: testo placeholder sostituito con copy inglese ("Applecore" / "Your iOS & SwiftUI Courses" / "Watch lessons, track progress, and take notes straight from the browser."); lista corsi hard-coded sostituita con rendering dinamico da `src/lib/catalog` (Candidato 3 del report architettura — landing pubblica ora mostra i corsi reali dal catalogo).

> ⚠️ Cambio nome (1 nov 2026): l'app si chiama **Applecore** (ex SwiftVault).
> Repo aggiornati: codice → `github.com/OtterCloud00/AppleCore` (public),
> media → **`orchard`** (es-SwiftVault, ex-stvt-media) su GitHub
> (`github.com/OtterCloud00/orchard`, private) e in locale in
> `C:\Users\Stefy\Documents\Dev\orchard`. Le chiavi localStorage restano `hub:*`.

## Missione essenziale

App web su **TanStack Start 1.0 React** (Vite 8, Tailwind 4, TS, pnpm),
migrata da Next.js il 5 novembre 2026 (decisione 25/10/2026 + hosting
**Cloudflare** Workers: dettagli in `TANSTACK-PLAN.md`; scaffold generato con
la CLI TanStack in cartella vuota separata). Sostituisce la scuola Teachable
di Sean Allen (chiusa il **24 novembre 2026**). Video scaricati e dentro
la repo privata `orchard` (cartella esterna in dev, fetch autenticato in
prod), app serverless su CF Workers con auth moderna. Zero costi, uso
personale.

⚠️ **Licenza**: materiali per uso personale; vietato esporli pubblicamente
(no mirror su server): per questo il hub richiede credenziali e la strategia
media è "nel repo privato". Non proporre YouTube/R2 public senza averlo
discusso (la discussione sulle opzioni c'è: YT private o R2 public sono state
valutate e scartate: Content ID/strike e lock-in).

## Struttura chiave

- `src/data/catalog.json` → corsi/moduli/lezioni. **Sorgente di verità** (lo
  script la rigenera per corso con merge incrementale).
- `src/lib/auth.ts` + `src/server/auth.ts` → Better Auth single-user
  (memory adapter, utente da `SITE_USER`/`SITE_PASS`, sessioni 30 giorni).
  Il sign-up via HTTP è bloccato; le lezioni `/c/**` e `/media/**` richiedono
  login (fallback Basic per client esterni). In dev senza env resta aperto;
  in produzione senza env non espone niente.
- `src/routes/media/$.ts` + `src/server/media.ts` → media autenticati.
  In dev leggono `APPLECORE_MEDIA_DIR` (default `media`, fuori da `public/`);
  in produzione arrivano da GitHub `orchard` con `GH_TOKEN`.
- `orchard/<corso>/<modulo>/NN - nome file.mp4` → i video.
  `orchard/<corso>/<modulo>/_risorse/` → zip/swift/avatar di progetto,
  NON lezioni: lo script li salta; si agganciano alle lezioni con `links`.
- `scripts/build-catalog.mjs` → generatore catalogo (merge per modulo).
- `scripts/apply-links.mjs` → creato volatile per mappare gli allegati: nasce e
  muore ad ogni modulo (vedi GUIDA-OPERATIVA).
- `scripts/apply-links-auto.mjs` → mapping automatico finito (commit `331adbc`):
  JOIN scan Teachable ↔ `_curriculum.json` ↔ catalogo. 136 lezioni launchpad/
  swiftui: 46 allegati in `_risorse` + 66 URL esterni estratti dai testi
  (pulizia etichette incollate: 6 regole in `cleanUrl`). Zero unmatched;
  WWDC "What's New in SwiftUI" recuperato come lezione `link` (iOS 15 + iOS 16).
  Skip: 16 `referral` + 5 `upsell` (promozioni, niente asset) e 4 `image`
  (screenshot inline della pagina non scaricati — recuperabili da Teachable
  fino al 24/11/2026 se mai servissero).
- **Pipeline scarico Teachable (2026)**: `scripts/teachable-relay.mjs`
  (collettore HTTP locale: la pagina autenticata nel browser OpenCode
  invia scan/URL firmati al relay, i cookie NON escono mai dal tab) +
  `scripts/launchpad-dl.mjs` / `scripts/swiftui-dl.mjs` (downloader resumable
  da URL firmati S3, validi ~5h, skip sezione BONUS, txt note automatici) +
  `scripts/av1-necessari.ps1` (encode AV1 dei soli mp4 >100 MiB + swap NEW-aware).
  Dettagli in GUIDA-OPERATIVA §5.
- Funzioni app: player con resume (localStorage), progressi, note per lezione,
  ricerca, PDF, download interni (`/media/...` con download attr), link esterni.

## Stato media (25 oct sera)

- **WidgetKit: NEL REPO MEDIA** — 8 moduli, 63 lezioni (6 di tipo "link"
  WWDC senza mp4 → 57 mp4 / 3,22 GB), push in background
- **iOS Dev Launchpad: NEL REPO MEDIA** — 12 moduli / 67 lezioni (61
  H.264 + 6 AV1) / 3,23 GB con allegati; catalogo committato (`42ead67`)
- **SwiftUI Fundamentals: NEL REPO MEDIA** — 9 moduli / 68 lezioni (60
  H.264 + 8 AV1) / 3,98 GB con allegati; catalogo committato
- **AV1 solo-necessari: FINITO ✓** — 14 file encodati + swappati (6
  launchpad + 8 swiftui, ottimi ratio: 104-171 MiB → 38-90 MiB, ~-59%)
  **ZERO >100 MiB**; profilo 720p CRF34 preset10 g240 audio copy faststart
- **Split repo FATTO ✓ (29 ott, decisone utente: solo LOCALE, niente mega
  push)**: la history "megapush chunked" verso GitHub è stata **abbandonata**
  dopo 6×HTTP 408 (upload lungi >500MB non reggono) — la repo privata GitHub
  `swiftvault-media` risulta ormai inesistente/raggiungibile (non spingere
  più). Stato finale:
  - **Repo media locale**: `C:\Users\Stefy\Documents\Dev\orchard`
    (es-`swiftvault-media` / `stvt-media`; rinominato 1 nov 2026, remote
    aggiornato su `github.com/OtterCloud00/orchard`; principali commit
    tematici, corsi: widgetkit, ios-dev-launchpad, swiftui-fundamentals +
    ebook how-i-became → **solo essa**, tree pulita)
  - **`git filter-repo --path public/media --invert-paths --force` ESEGUITO**
    sul code repo: **zero** path media in tutta la history (46→39 ref,
    7 commit solo-media potati); backup pre-filtro (mirror, hardlink) in
    `C:\Users\Stefy\Documents\Dev\swiftvault-backup-prefilter.git`
    → eliminare quando tutto è verificato
  - **Submodule** su `public/media` → url **GitHub** (`https://github.com/
OtterCloud00/orchard.git`, `branch = main`, agg. 1 nov 2026 — prima era
    un path locale). Il repo public contiene solo il puntatore, non i media:
    chi clona senza accesso a orchard vede la cartella vuota
  - ⚠️ ref `refs/t3/orchestration-v2/checkpoints/*` (8) puntano al vecchio
    history: **non spingerle mai**; push pubblico solo della ref `main`
  - mapping "lezione ↔ allegato" **FATTO** automatico (`331adbc`,
    apply-links-auto.mjs — GUIDA §3 ora è solo referenza storica)
- `how-i-became-an-ios-dev`: ebook PDF con viewer iframe ✓

**Nessun file >100 MiB resterà nel repo** (il guardaroba "AV1-tutto" è stato
revocato: i file H.264 sotto il limite restano originali).

## Blocco GitHub risolto (che vie erano)

Due strade valutate a suo tempo:

- **A. R2**: scartata (decisione utente).
- **B. AV1 re-encode**: scelta in versione ridotta "solo i file >100 MiB"
  (decisione rivista la sera stessa: prima si disse "tutta la libreria",
  poi si è направлении al minimo necessario per rientrare nei 100 MiB).
  WidgetKit fase 1 completata così; launchpad/swiftui via `av1-necessari.ps1`.
  **Regola valida per i file già committati**: non ricomprimere → la history
  avrebbe doppio blob (H.264 ma anche AV1). Encode PRIMA del commit.

## Limite pratico e il piano "quando si gonfia"

GitHub: file singoli < 100 MB, repo privato consigliato ≤ ~5 GB.
Attuale ~1.5 GB → quando superiamo comodamente 3–4 GB (o push lenti):

**Migrazione a Cloudflare R2** (10 GB gratis, egress gratis) — col hosting
CF deciso è la strada naturale: **bucket + R2 binding nel Worker**, NON
l'URL pubblica `pub-XXXX.r2.dev`:

1. bucket R2 (es. `orchard`) + caricare le cartelle dei corsi
2. binding nel `wrangler` config (es. `MEDIA` → bucket) → il Worker serve
   i media su una route interna (autenticata col cookie: 1 dominio, zero
   URL pubbliche, ripescate le valutazioni anti-r2.dev)
3. `pnpm catalog -- --course <id> --folder "public\media\<id>" --base /media/<id>`
   (route interna invece del blob storage: il catalogo non cambia semantica,
   cambia solo chi risponde)

## Framework: TanStack Start (decisione 25/10/2026 — migrazione FATTA 5 nov 2026)

Prima la regola era condizionale ("se hosting Cloudflare → TanStack Start,
mai Next+OpenNext"). **Ora è incondizionale**: si droppa Next e si migra a
**TanStack Start 1.0 React** prima del primo deploy, perché:

- **Hosting deciso: Cloudflare** → il deploy "Cloudflare" è uno dei percorsi
  first-party di Start (Nitro preset `cloudflare` → Workers), e 1 Worker
  unico serve app **e** media via **R2 binding** nello stesso processo:
  login a cookie + media protetti sullo stesso dominio, senza secondo progetto
- Un'unica codebase amica di qualunque hosting futuro (preset CF ufficiale
  = spostamento mezza giornata)
- Da 1.0 STABILE (13/10/2026) con docs anche per **Solid** (eventuale port
  futuro UI-only, non richiesto ora)
- **Piano di migrazione in 8 step: `TANSTACK-PLAN.md`** (mezza giornata); versione storica archiviata come `TANSTACK-PLAN-1.md`. Stato completamento: vedi `TANSTACK-PLAN-REPORT.md`.
- ⚠️ **Regola procedurale (1 nov 2026)**: lo scaffold venga generato con la
  CLI TanStack **in una cartella vuota separata** (es.
  `C:\Users\Stefy\Documents\Dev\applecore-start`), MAI dentro il repo
  dell'app: copiare/spostare codice in un albero pulito dall'esterno
  (→ istruzioni in `TANSTACK-PLAN.md` §Migrazione step 0/2)
- **Rotte file-based attive**: `/` (landing pubblica), `/better-auth` (auth pubblica), `/courses` (catalogo pubblico); `/c/$courseId`, `/hub`, `/c/$courseId/l/$lessonId` e `/media/**` richiedono login (redirect a `/?to=` se non autenticato).

- Cosa si ricicla: `catalog.json` e tutti gli script, player/resume/progressi
  (localStorage = client-side, identico), Tailwind 4, componenti UI
- Cosa si riscrive: le route App Router → `src/routes/` TanStack Router
  (file-based), `proxy.ts` → middleware/server di Start (Basic Auth stessa
  logica, stessi env)
- **vinext SCARTATA** (feb 2026, v1.0 set 2026): "reimplementazione AI di Next
  su Vite" (1 ingegnere, 1 settimana) — codebase che vive in un layer
  non-Next, supporto a lungo termine non impegnato e 2 pivot CF su
  Next-on-Workers in 12 mesi. Non è il ponte: è un clone sperimentale.
  Decisione utente, definitiva.

## Deploy su Cloudflare (decisione 1 nov 2026 — dopo la migrazione)

1. **Repo media = `orchard`** (private `OtterCloud00/orchard`,
   root = corsi; cartella locale `C:\Users\Stefy\Documents\Dev\orchard`).
   In dev i media si leggono da lì via `APPLECORE_MEDIA_DIR` (nessuna copia
   dentro `public/`); il vecchio submodule non serve più all'app.
2. **Hosting = Cloudflare Workers** (1 worker):
   - build con `@cloudflare/vite-plugin`, deploy con `wrangler deploy`
   - i media in produzione arrivano da GitHub `orchard` con `GH_TOKEN`
     (niente R2): la route `/media/**` fa da proxy autenticato, così il
     token resta solo sul server
   - env/secrets sul Worker: `SITE_USER`, `SITE_PASS`,
     `BETTER_AUTH_SECRET` (o `SESSION_SECRET`), `GH_TOKEN`
     (`npx wrangler secret put …`) — niente dev-consente-aperto in prod
     (⚠️ `.env.local` attuale usa le demo `stefy/test`: CAMBIARE prima del deploy)
3. Test post-deploy: `/` → login moderno; con login → 200; media solo da app
   autenticata (cookie); 401/redirect senza login

## Decisione media: AV1 **solo necessari** (25 ott 2026, rivista sera)

Prima decisione "re-encode AV1 su TUTTA la libreria"; **rivista a serata**:
si encodano con AV1 **solo gli mp4 >100 MiB** (limite GitHub), il resto resta
H.264 originale (nessuna perdita di qualità inutile, niente blob doppi nel
git history). Profilo tenuto: **720p · CRF 34 · preset 10 · g=240 ·
audio copy · faststart** (--720p stabilito nei test di qualità). Misurato su
CPU i3-2100: ~75 fps (2,5x realtime) → un file grande ~7-8 min.

- WidgetKit: i 8 file over-limit **fatti, swappati e committati**
  (commit `e2b9629`, -59% medio)
- Launchpad + SwiftUI: `scripts/av1-necessari.ps1` (encode + swap NEW-aware:
  l'originale può anche non essere già nel repo). Secondo pass possibile con
  skip se lo stage è già valido (per i file arrivati dopo il primo scan)
- Nomi/path IDENTICI → il catalogo non si tocca; mai commitare H.264 che
  verrà poi sostituito: i blob resterebbero in history
- ffmpeg via winget (Gyan.FFmpeg, alias in Links). Playback AV1:
  Chromium/Edge ok, WMP no

## Cosa fare il prossimo giro

- [ ] Ultimi pass di commit media launchpad/swiftui (elenco su) → push `orchard`
- [ ] Push GitHub repo codice su OtterCloud00/AppleCore + deploy
      **Cloudflare Workers** (`@cloudflare/vite-plugin`, secrets
      `SITE_USER`/`SITE_PASS`/`BETTER_AUTH_SECRET`/`GH_TOKEN`)
      (⚠️ cambiare password demo `stefy/test` PRIMA del deploy)
- [ ] Test post-deploy: `/` → login moderno; route → 200 col cookie;
      media solo dopo autenticazione
- [ ] TanStack Start: completare percorsi di adozione rimanenti
      (Store, Pacer, Hotkeys, Virtual, Markdown+Highlight, Charts, Query,
      Devtools panel, Redact) — vedi `TANSTACK-PLAN.md` §Percorso di adozione
- [ ] Candidati architettura (report in temp: `architecture-review-*.html` e `-v2.html`):
      - #1 spostare LoginForm da auth.tsx in / — NON applicato (scelta utente: index = solo vetrina)
      - #2 deep-wrap localStorage in storage module — ✅ applicato (storage.ts espone interfaccia di dominio getDone/setDone/getNote/setNote/getPos/setPos/loadAllDone; chiavi hub:* nascoste; aggiornati c/$courseId.tsx, c/$courseId/l/$lessonId.tsx, VideoPlayer.tsx)
      - #3 catalogo dinamico in landing — ✅ applicato (index.tsx renderizza courses da @/lib/catalog)
      - #4 hub.tsx come rotta /hub con auth guard — ✅ applicato (createFileRoute('/hub') con beforeLoad redirect a / se non autenticato)
- Comandi Impeccable eseguiti:
      - init — ✅ PRODUCT.md creato
      - document — ✅ DESIGN.md + .impeccable/design.json creati
      - extract — ✅ IslandShell.tsx + Button.tsx creati
      - adapt — ✅ viewport-fit=cover, safe area footer, touch target 44px
      - clarify — ✅ messaggi vuoti, stati di errore/successo, etichette
      - distill — ✅ nessun elemento ridondante
      - animate — ✅ feedback caricamento corso più evidente
      - bolder — ✅ titolo hero text-5xl, CoreMark size 260
      - polish — ✅ 0 anti-patterns su tutti i file pubblici

## Roadmap facoltativa

- PWA installabile · export/import progressi e note · contatore ore video
