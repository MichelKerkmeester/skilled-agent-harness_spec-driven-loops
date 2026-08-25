---
title: Pi Remote Current UI to Target Map
description: Maps current Pi Remote components to their Claude-style mobile targets, relocation decisions, implementation sequence, and verification gates.
trigger_phrases:
  - 'move runtime controls out of chat flow'
  - 'Pi Remote composer island'
  - 'current component target mapping'
importance_tier: normal
contextType: implementation
version: 1.2.0.3
---

# Current UI → Target Component Map

> Pre-SvelteKit design research, retained for context. It describes the earlier React app, not the shipped Svelte UI.

Maps each existing component to the Claude-style target and the concrete change. Source files
are in `app-mobile/src/`. This is the working spec for the rebuild; the GPT-Luna
research (`research-gpt-luna.md`) and GPT-SOL council (`council-gpt-sol.md`) enrich it.

---

## Component inventory (today)

| Component | File | Role now | Problem |
|-----------|------|----------|---------|
| `Session` | `App.tsx` (~873) | Chat screen: title block, `TranscriptList`, `RuntimeStrip`, `CommandPalette`, composer `<form>` | Controls + palette sit **in the flow** above a full-width Send bar |
| `TranscriptList` / `Block` | `App.tsx` (~1179 / ~1302) | Virtualized blocks; evidence collapse | Assistant text is plain sans; no per-turn action row |
| `RuntimeStrip` | `RuntimeStrip.tsx` | Model select + Effort select + Build·Plan toggle + status | Three stacked controls occupying prime chat space |
| `CommandPalette` | `CommandPalette.tsx` | `/`-command combobox that inserts into draft | Separate stacked row; not discoverable as "tools" |
| composer `<form>` | `App.tsx` (~1115) | `label "Steer Pi"` + `textarea rows=3` + footer hint + Send/Steer/Later/Stop | Full-width **Send bar**; hint text; no `+`; no circular send |

---

## Target architecture

Move controls **out of the message flow** into two homes, and rebuild the composer as an island.

### A. Header (in-session) — model identity + effort
- Center: **`<model> ⌄`** button → opens a **bottom sheet** with the Model list (from
  `RuntimeStrip`'s Select data) and the Effort segment (off/high/max) and the Build·Plan toggle.
- This absorbs all of `RuntimeStrip` into a sheet reachable from a quiet header control.
- Keeps every capability; removes three stacked controls from the chat.

### B. Composer island — the centerpiece (rebuild `prompt-composer`)
```
┌─────────────────────────────────────────────┐
│  textarea: "Reply to pi"                      │  ← grows to ~5 lines, serif or sans input
│                                               │
│  [+]                       [mic]  ( ↑ / ■ )   │  ← control row inside the island
└─────────────────────────────────────────────┘
        pi can make mistakes · read-only         ← muted disclaimer line above
```
- **`+` (left)** opens a small menu = **Tools**: the `/`-command list (from `CommandPalette`)
  + the **Plan/Build** toggle + (future) attach. This rehomes `CommandPalette` and the plan
  control without stacked rows.
- **Right cluster:** a mic affordance, then **one circular primary button that morphs by state**:
  - idle + empty → disabled/ghost (or mic only)
  - idle + text → **clay circle, `↑`** = Send
  - running → **carbon circle, `■`** = Stop (primary), with Steer/Later demoted into the `+`/overflow
    or a secondary control — running-state actions must stay reachable but not shout.
- Radius ~22–26px, hairline border, soft shadow, fill = `--surface`. No full-width bar.
- Drop the "Enter to send · Shift+Enter" hint on mobile (no hardware Enter); keep behavior.

### C. Message flow (`Block` / `TranscriptList`)
- **Assistant text block** → Source Serif prose: `font-family: var(--font-serif)`, ~1.1875rem,
  line-height ~1.55, paragraph spacing. This is the biggest visual win.
- **User text block** → compact quiet bubble (`--stone` fill, rounded, tight padding), not prose.
- **Action row** under each *assistant* turn (last turn at minimum): monochrome outline icons
  mapped to OUR real capabilities — **Copy**, **Retry** (resend last prompt), and optionally
  **Steer**. No thumbs (no rating backend) unless we wire it; honesty over mimicry.
- Evidence (thinking/tool/usage) stays collapsed but restyle as a subtle inline disclosure
  ("Thought for a moment ›") that reads calmly beside serif prose — not a boxed card.
- **Scroll-to-bottom** → replace the text pill with a soft circular `↓` chevron button.
- **Disclaimer line** "pi can make mistakes — actions stay read-only" above the composer.

---

## Sequenced build (highest-leverage first)

1. **Composer island** — rebuild `prompt-composer`: island shell, `+` tools menu (absorbs
   CommandPalette + Plan), right-side **morphing circular send/stop**, remove Send bar + hint.
2. **Assistant serif prose + user bubble** — restyle `Block` text by role; set vertical rhythm.
3. **Per-turn action row** — Copy + Retry (+ Steer) under assistant turns.
4. **Header model control + sheet** — centered `<model> ⌄` opening a sheet that hosts Model +
   Effort + Build·Plan (absorbs `RuntimeStrip`).
5. **Polish** — evidence-as-quiet-disclosure, circular scroll-to-bottom chevron, disclaimer,
   subtle header glow, motion.

Each step is independently shippable and keeps every existing capability + the security posture.
Verification per step: `npm run typecheck -w @pi-remote/web`, `npm run test:web`, and a true-390px
CDP screenshot (light + dark) compared against `screens/claude-*.png`.
