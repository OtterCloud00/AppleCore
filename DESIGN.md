---
name: Applecore
description: Personal video-course platform for iOS & SwiftUI learning
colors:
  canvas: "#eef0e6"
  panel: "#f8f9f2"
  panel2: "#e3e7d8"
  hairline: "#cfd7c7"
  ink: "#18271f"
  muted: "#5a6e60"
  accent: "#c94a32"
  success: "#4d8b3f"
typography:
  display:
    fontFamily: '"Fraunces", Georgia, serif'
    fontSize: "clamp(1.75rem, 4vw, 2.75rem)"
    fontWeight: 800
    lineHeight: 1.05
    letterSpacing: "0em"
  body:
    fontFamily: '"Instrument Sans", ui-sans-serif, system-ui, sans-serif'
    fontSize: "1rem"
    fontWeight: 400
    lineHeight: 1.5
  label:
    fontSize: "0.69rem"
    fontWeight: 700
    letterSpacing: "0.16em"
    textTransform: uppercase
rounded:
  sm: "4px"
  md: "8px"
  lg: "14px"
  xl: "16px"
spacing:
  sm: "8px"
  md: "16px"
  lg: "24px"
  xl: "32px"
components:
  button-primary:
    backgroundColor: "{colors.accent}"
    textColor: "#fff"
    rounded: "{rounded.md}"
    padding: "0.72rem 1rem"
  button-secondary:
    backgroundColor: "{colors.panel2}"
    textColor: "{colors.ink}"
    rounded: "{rounded.md}"
    padding: "0.72rem 1rem"
  card:
    backgroundColor: "{colors.panel}"
    border: "1px solid {colors.hairline}"
    rounded: "{rounded.lg}"
    padding: "1rem"
  input:
    backgroundColor: "color-mix(in oklab, var(--surface-strong) 88%, var(--panel2))"
    border: "1px solid {colors.hairline}"
    rounded: "0.75rem"
    padding: "0.7rem 0.9rem"
  chip:
    backgroundColor: "{colors.chip-bg}"
    border: "1px solid {colors.chip-line}"
    rounded: "999px"
    padding: "0.35rem 0.65rem"

---

# Design System: Applecore

## Overview

**Creative North Star: "Il Laboratorio del Melaio"**

Crisp e moderno. Un sistema visivo ispirato al laboratorio di falegnameria: materiali onesti, bordi arrotondati ma precisi, ombre morbide che danno profondità senza appesantire. La palette è ispirata alla mela: buccia rossa come accento, polpa verde per i successi, carta e legno per le superfici. Ogni elemento ha uno scopo; nulla è decorativo se non il CoreMark, l'unico marchio grafico dell'app.

**Key Characteristics:**

- Colori derivati dal mondo della mela (buccia, polpa, carta, legno)
- Ombre morbide per profondità, mai bordi netti aggressivi
- Tipografia bicore: Fraunces per i titoli display, Instrument Sans per il corpo
- Superfici con backdrop-filter blur e leggeri gradienti
- Il CoreMark è l'unico elemento decorativo consentito

## Colors

Palette ispirata alla mela e ai materiali da laboratorio, con un unico accento di buccia e un verde successo.

### Primary

- **Mela Buccia** (#c94a32): Colore di accento principale. Usato per bottoni primari, link attivi, bordi di focus, e dettagli decorativi del CoreMark. È il colore che attira l'attenzione, usato con parsimonia (≤10% di ogni schermo).

### Secondary (optional; omit if the project has only one accent)

Omitted — the project has a single accent color.

### Tertiary (optional)

Omitted — the project has no tertiary color role.

### Neutral

- **Carta** (#eef0e6): Sfondo principale delle pagine e delle aree ampie.
- **Pannello** (#f8f9f2): Sfondo di card, modali e sezioni in primo piano.
- **Pannello 2** (#e3e7d8): Sfondo secondario per elementi interni alle card e differenziazione di gerarchia.
- **Capello** (#cfd7c7): Bordi sottili, divider, linee di separazione.
- **Inchiostro** (#18271f): Testo principale, titoli, testi di maggiore importanza.
- **Muto** (#5a6e60): Testo secondario, placeholder, etichette, sottotitoli.

### Named Rules

**The One Voice Rule.** Il colore di accento (Mela Buccia) è usato su ≤10% di qualsiasi schermo. La sua rarità è il punto: attira l'attenzione solo dove serve davvero.

## Typography

**Display Font:** Fraunces (with Georgia, serif fallback)

**Body Font:** Instrument Sans (with ui-sans-serif, system-ui, sans-serif fallback)

**Character:** Bicore intenzionale: Fraunces porta carattere editoriale e calore ai titoli display; Instrument Sans mantiene leggibilità e pulizia nel corpo e nelle etichette.

### Hierarchy

- **Display** (800, clamp(1.75rem, 4vw, 2.75rem), 1.05, 0em): Titoli principali di pagina e sezione. Usa font-variation-settings "SOFT" 60, "WONK" 1 per carattere unico.
- **Headline** (600, 1.9rem, 1.0, -0.015em): Titoli di sezione all'interno delle pagine (es. titolo corso, titolo lezione).
- **Title** (600, 1rem, 1.2, -0.015em): Titoli di card, moduli, sezioni secondarie.
- **Body** (400, 1rem, 1.5, 0em): Testo di paragrafo, descrizioni, contenuto principale. Max measure 65–75ch su schermi ampi.
- **Label** (700, 0.69rem, 1.2, 0.16em, uppercase): Etichette, kicker, badge, sotto-titoli piccoli. Spaziamento tra lettere per leggibilità a dimensioni ridotte.

## Layout

Modello spaziale basato su griglia reattiva con breakpoints sm (640px), md, lg. Container principale `page-wrap` con larghezza massima 1080px e margini laterali automatici. Le sezioni usano padding generoso (pt-10 sm:py-14 per l'hero, px-4 sm:px-10 per il contenuto). Ritmo spaziale: sm=8px, md=16px, lg=24px, xl=32px. Le card usano gap-4 tra elementi, sezione mt-8 tra blocchi principali.

## Elevation & Depth

Il sistema usa ombre morbide per profondità, mai bordi netti aggressivi. Le superfici galleggiano leggermente sopra lo sfondo con ombre offset e blur morbido.

### Shadow Vocabulary

- **Ombra ambientale** (`0 1px 0 var(--inset-glint) inset, 0 22px 44px var(--shadow), 0 6px 18px var(--shadow-strong)`): Usata sulle card principali (`island-shell`), dà profondità con luce radente dall'alto e ombra morbida sotto.
- **Ombra elemento** (`0 18px 34px var(--shadow), 0 4px 14px var(--shadow-strong)`): Usata sulle card secondarie (`feature-card`, `demo-card`), più sottile.
- **Ombra focus** (`box-shadow: 0 0 0 3px color-mix(in oklab, var(--accent) 24%, transparent)`): Usata su input e elementi interattivi in stato focus.

### Named Rules

**The Soft-By-Default Rule.** Le ombre sono sempre morbide (blur ≥ 4px), mai offset netti o zero-blur. La profondità si ottiene con sovrapposizione di più ombre, non con bordi duri.

## Shapes

Cornici arrotondate ma non eccessive. I bordi sono morbidi, mai taglienti. Il raggio principale delle card è 14px; i bottoni e gli input usano raggi più piccoli (8px e 0.75rem); i chip sono completamente arrotondati (999px).

- **Card radius:** 14px (`--radius-card`)
- **Button radius:** 0.85rem (~13.6px)
- **Input radius:** 0.75rem (~12px)
- **Chip radius:** 999px (pillole completamente arrotondate)
- **Bordi:** 1px solid `--hairline` (#cfd7c7) per definire i contorni senza appesantire.

## Components

### Buttons

- **Shape:** Arrotondato (0.85rem ~ 13.6px radius)
- **Primary:** Sfondo `{colors.accent}` (#c94a32), testo bianco, padding 0.72rem 1rem, font-weight 700, transizione su hover e transform
- **Hover / Focus:** Hover alza leggermente il bottone (`translateY(-1px)`) e scurisce lo sfondo; focus mostra anello con ombra color accent al 24%
- **Secondary / Ghost:** Sfondo mix di panel2, testo inchiostro, bordo capello; usato per azioni secondarie
- **Danger:** Sfondo leggermente tinto di rosso, testo #b8453a, usato per azioni distruttive

### Chips (if used)

- **Style:** Sfondo `--chip-bg` (mix di panel), bordo 1px `--chip-line`, testo `--sea-ink-soft`, padding 0.35rem 0.65rem
- **State:** Usato per etichette tipo lezione (video, pdf, file, link) e stati

### Cards / Containers

- **Corner Style:** 14px radius (`--radius-card`)
- **Background:** Gradiente lineare 165deg da surface-strong a surface, con inset glint
- **Shadow Strategy:** Ombra ambientale multi-strato (`island-shell`), più sottile per card secondarie (`feature-card`)
- **Border:** 1px solid `--line` (#cfd7c7)
- **Internal Padding:** 1rem (p-5) per card contenuto, p-6 sm:p-8 per sezioni principali

### Inputs / Fields

- **Style:** Sfondo surface-strong mixato con panel2, bordo 1px `--hairline`, radius 0.75rem, padding 0.7rem 0.9rem
- **Focus:** Bordi diventano mix di accent al 58% con line, ombra con accent al 24%
- **Error / Disabled:** Errore usa `--accent` (#c94a32) per testo e bordo; disabled ha opacità 0.55 e cursore not-allowed

### Navigation

- **Style:** Link testuali con sottolineatura animata (scaleX da 0 a 1 su hover/attivo), colore `--sea-ink-soft` da inattivo, `--sea-ink` da attivo
- **Typography:** `font-semibold`, tracking-tight
- **Default/hover/active:** Sottolineatura accent-gradient (`linear-gradient(90deg, var(--accent), var(--success))`), colore testo passa a inchiostro
- **Mobile treatment:** Breakpoint sm (640px), sottolineatura leggermente più bassa (-4px)

### CoreMark (Signature Component)

- **Description:** Marchio grafico di Applecore: mela tagliata a metà con stella a cinque semi. SVG inline, `aria-hidden="true"`, outline in `currentColor`, semi in rosso buccia. Animazione dei semi orchestrata (disabilitata con `prefers-reduced-motion`). È l'unico elemento decorativo dell'app.

## Do's and Don'ts

### Do:

- **Do** Usa l'accento (Mela Buccia #c94a32) con parsimonia: ≤10% di ogni schermo.
- **Do** Mantieni le ombre morbide (blur ≥ 4px), mai bordi duri o zero-blur.
- **Do** Usa la tipografia bicore: Fraunces per display, Instrument Sans per corpo e label.
- **Do** Tieni i sottotitoli dei corsi in inglese sulle pagine pubbliche, italiano sulle pagine loggate.
- **Do** Usa `role="alert"` per i messaggi di errore e `aria-valuenow/val` sulle progress bar.

### Don't:

- **Don't** Usare colori hard-coded fuori dai token del design system (es. `#b8453a` invece di `var(--accent)`).
- **Don't** Aggiungere elementi decorativi oltre al CoreMark.
- **Don't** Usare gradient text, glass decoration, o bordi colorati sinistro/destro sopra 1px sulle card.
- **Don't** Sovraccaricare le pagine pubbliche con informazioni delle pagine loggate.

---
