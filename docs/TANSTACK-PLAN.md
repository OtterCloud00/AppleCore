# PIANO TANSTACK — Applecore (aggiornato 8 nov 2026)

> Stato attuale: la migrazione a TanStack Start 1.0 React è **iniziata ma non completata**.
> Framework (Start) e Router sono integrati; le restanti librerie del piano (Store, Pacer,
> Hotkeys, Virtual, Markdown, Highlight, Charts, Query, Devtools panel, Redact) non sono
> ancora installate né usate. Vedi `TANSTACK-PLAN-REPORT.md` per il dettaglio.

## Decisioni già prese (confermate)

- **Hosting**: Cloudflare Workers (Nitro preset `cloudflare`, `wrangler deploy`)
- **Media**: repo privato `orchard` su GitHub (`OtterCloud00/orchard`), fetch autenticato con `GH_TOKEN`; R2 scartata
- **Auth**: cookie firmato (`SESSION_SECRET`) + Better Auth; Basic Auth come fallback per client esterni
- **Video >50MB**: ricomposizione on-demand delle parti `_split` nella route `/media/**`
- **Scaffold**: CLI TanStack in cartella separata, MAI dentro il repo dell'app
- **localStorage**: chiavi `hub:*` mantenute per compatibilità

---

## Percorso di adozione (step rimanenti)

L'ordine segue `TANSTACK-PLAN-1.md` (versione storica). Gli step 0-1 sono da considerarsi
parzialmente fatti (Router e Start presenti); dal 2 in poi tutto da fare.

### 2. Store — store core con persist
- `pos`, `done`, `notes` in una chiave versionata in localStorage
- Le chiavi `hub:*` vecchie restano lette per compat
- Sostituisce gli accessi diretti a `localStorage` in `src/routes/c/$courseId/l/$lessonId.tsx` e `src/routes/hub.tsx`

### 3. Pacer + Store
- `throttle` di Pacer sostituisce il timer fatto a mano che salva `currentTime` ogni 5s

### 4. Hotkeys
- Scorciatoie player: spazio play/pause, frecce ±10s, J/K/L stile YouTube, F fullscreen, N/P lezione precedente/successiva

### 5. Virtual
- Lista lezioni dei moduli lunghi (es. Appetizers: 26 lezioni) con `@tanstack/react-virtual`

### 6. Markdown + Highlight
- Le note per-lezione (chiave `notes` già prevista nello Store) si renderizzano in markdown dal giorno 1
- Pannello note nella pagina lezione, markdown renderizzato lato client
- Highlight evidenzia gli snippet di codice (blocchi Swift/SwiftUI) con caricamento asincrono solo se la nota contiene codice

### 7. Charts
- Dashboard progressi nella home: stato fatto/rimanenza per corso e modulo, previsione di completamento
- Bundle Charts solo nella route dashboard

### 8. Query + Query Devtools
- Lazy-load dell'indice di ricerca (`index.json` via fetch con cache)
- Prefetch media delle prossime lezioni via Router loader
- Da installare solo quando la ricerca non sta più nel bundle

### 9. Devtools panel
- `@tanstack/react-devtools` in dev per ispezionare store/query; zero bundle in prod

### 10. Redact
- Swap di runtime per ultimo: plugin `redact()` in `vite.config`, zero righe di codice app cambiate

---

## Lavoro immediato (next actions)

1. Generare il route tree di TanStack Router (`routeTree.gen.ts`) per risolvere gli errori TS sulle rotte dinamiche
2. Rifinire `src/routes/index.tsx` (contiene testo placeholder)
3. Installare `@tanpack/store` e integrare lo store al posto degli accessi diretti a `localStorage`
4. Installare `@tanstack/pacer` e sostituire il timer di salvataggio `currentTime`
5. Eseguire `pnpm build` + `vite preview` per verificare build e player
6. Deploy su Cloudflare Workers con `wrangler deploy` (secrets: `SITE_USER`, `SITE_PASS`, `SESSION_SECRET`, `GH_TOKEN`)

---

## Librerie non adottate (per scelta)

- **DB** (beta): nessun server API in Applecore
- **Table / Form**: nessuna griglia o form nell'app (uso personale)
- **AI**: vanilla, nessun use-case
- **Config**: tooling per publisher, non per app
