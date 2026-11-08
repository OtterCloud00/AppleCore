# REPORT — Stato di completamento di TANSTACK-PLAN.md

Data: 8 novembre 2026
Fonte: `TANSTACK-PLAN.md`, `STATO-PROGETTO.md`, `package.json`, `src/routes/`

---

## Sintesi

La migrazione a TanStack Start (React) è **iniziata ma non completata**. Il framework e il Router sono integrati, ma la maggior parte delle librerie TanStack previste dal piano non è installata né utilizzata. Alcune pagine contengono ancora testo placeholder.

---

## Stato per step (Percorso di adozione — TANSTACK-PLAN.md §Percorso di adozione)

| # | Step | Libreria | Stato | Note |
|---|------|----------|-------|------|
| 0 | Scaffold CLI | `@tanstack/cli` | ❌ Non fatto | Lo scaffold avrebbe dovuto avvenire in una cartella separata (`applecore-start`); non risulta eseguito in questo repo |
| 1 | Start + Router | `@tanstack/react-start`, `@tanstack/react-router` | ✅ Fatto | `vite.config.ts` usa `tanstackStart()`; `src/routes/` è file-based con `createFileRoute`; rotte `/`, `/better-auth`, `/courses`, `/c/$courseId`, `/c/$courseId/l/$lessonId`, `/media/$`, `/api/auth/$` |
| 2 | Store | `@tanpack/store` | ❌ Non installato | Non in `package.json`; i progressi usano ancora `localStorage` diretto (`hub:pos:*`, `hub:done:*`, `hub:note:*`) |
| 3 | Pacer + Store | `@tanstack/pacer` | ❌ Non installato | Il timer di salvataggio del `currentTime` è ancora fatto a mano (ogni 5s) |
| 4 | Hotkeys | `@tanstack/hotkeys` | ❌ Non installato | |
| 5 | Virtual | `@tanstack/react-virtual` | ❌ Non installato | |
| 6 | Markdown + Highlight | `@tanstack/markdown`, `@tanstack/highlight` | ❌ Non installati | Non in `package.json`; le note non sono renderizzate in markdown |
| 7 | Charts | `@tanstack/react-charts` | ❌ Non installato | Nessuna dashboard progressi |
| 8 | Query | `@tanstack/react-query` | ❌ Non installato | Nessuna ricerca lazy né prefetch media |
| 9 | Devtools panel | `@tanstack/react-devtools` | ⚠️ Parziale | Installato (`0.10.14`) e presente in `vite.config.ts` (`devtools()`), ma zero bundle in prod da verificare |
| 10 | Redact | `@tanstack/redact` | ❌ Non fatto | Swap di runtime da fare per ultimo, dopo tutti gli altri step |

---

## Stato delle librerie (Inventario — TANSTACK-PLAN.md §Inventario completo)

| Libreria | Versione React prevista | Presente in `package.json` | Usata nel codice | Stato |
|---|---|---|---|---|
| Start | 1.169.4 | ✅ 1.169.4 | ✅ vite.config | Adottato |
| Router | 1.170.46 | ✅ 1.170.46 | ✅ src/routes/ | Adottato |
| Query | 5.104.5 | ❌ | ❌ | Non adottato |
| Store | 0.11.2 | ❌ | ❌ | Non adottato (localStorage diretto) |
| DB | 0.5.12 | ❌ | ❌ | Non adottato (nessun server) |
| Table | 9.3.1 | ❌ | ❌ | Non adottato |
| Form | 1.33.5 | ❌ | ❌ | Non adottato |
| Charts | 1.1.0 | ❌ | ❌ | Non adottato |
| Virtual | 3.14.22 | ❌ | ❌ | Non adottato |
| Pacer | 0.24.1 | ❌ | ❌ | Non adottato |
| Hotkeys | 0.17.0 | ❌ | ❌ | Non adottato |
| Devtools | 0.10.13 | ✅ 0.10.14 | ⚠️ solo vite.config | Parziale |
| Redact | 0.2.3 | ❌ | ❌ | Non adottato |
| Markdown | 1.0.0 | ❌ | ❌ | Non adottato |
| Highlight | 1.1.0 | ❌ | ❌ | Non adottato |
| AI | 1.0.0 | ❌ | ❌ | Non adottato |
| CLI | 0.72.0 | ❌ | ❌ | Non adottato |
| Config | 0.22.2 | ❌ | ❌ | Non adottato |

**Bilancio**: 2 librerie adottate (Start, Router), 1 parziale (Devtools), 14 non adottate.

---

## Problemi rilevati nel codice

1. **`src/routes/index.tsx`** contiene testo placeholder (`edtycfghxfgxdghxrtdghfghfd`, `dtgfdhjdfgsdghfghsfgdghfdsd`, ecc.): la home non è ancora rifinita.
2. **Route tree TanStack Router non generato**: errori TS2345/TS2353 su rotte dinamiche (`/c/$courseId/l/$lessonId`, `/media/$`) — manca la registrazione delle rotte nel route tree (`routeTree.gen.ts`).
3. **`Hub` in `hub.tsx`** dichiarato ma mai esportato/usato (TS6133).
4. **`index copy.tsx`** è stato eliminato (codice splittato in `auth.tsx` e `hub.tsx` per la task 1 del README).

---

## Decisioni storiche (da TANSTACK-PLAN.md e STATO-PROGETTO.md)

- Hosting: **Cloudflare Workers** (Nitro preset `cloudflare`, `wrangler deploy`)
- Media: repo privato `orchard` su GitHub, fetch autenticato con `GH_TOKEN` (R2 scartata)
- Auth: cookie firmato (`SESSION_SECRET`) + Better Auth; Basic Auth come fallback
- Video >50MB: ricomposizione on-demand delle parti `_split` nella route media
- Migrazione da Next.js fatta il 5 novembre 2026 (secondo STATO-PROGETTO, ma il codice risulta incompleto)

---

## Stima lavoro residuo

Almeno **2-3 giorni** per completare gli step 2-11 (installazione librerie, integrazione Store/Pacer/Hotkeys/Virtual/Markdown/Highlight/Charts/Query, rifinitura home, generazione route tree, verifiche build+deploy).
