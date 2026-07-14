---
title: Vercel DESIGN.md Writing Notes
description: Editorial notes explaining the measured data, fidelity decisions, and validation caveats in the Vercel v3 Style Reference example.
trigger_phrases:
  - Vercel DESIGN.md writing notes
  - Vercel style reference validation
  - Vercel extraction caveats
importance_tier: normal
contextType: reference
version: 1.0.0.0
---

# Writing Notes: Vercel (v3 Style Reference)

- This DESIGN.md is a **v3 Style Reference** regenerated from the existing `tokens.json` — no re-crawl, no network. Only the deterministic WRITE prompt (`build-write-prompt.ts`) was run over the extracted tokens.
- Final validation: **score 99/100, claims 100/100, PASS** (`validate.ts`). Zero critical failures — no phantom hex, no quickstart-phantom-color.
- The one remaining warning (`unknown-font: ### Tailwind v4`) is a benign parser artifact: the validator reads the pre-rendered Quick Start sub-heading as a font name. Warnings do not block PASS; the heading is pasted unchanged per the fidelity contract.
- Data-quality caveat: the older extraction produced a **41-row Colors table** — far more than a curated palette would carry. Most low-frequency hues (Magenta/Teal/Voltage/Ember families) appear only in icons and gradients, so prose rations them to the chromatic reserve and keeps page chrome neutral.
- Component fills for the Primary CTA and the scrolled Nav variant are stored as `lab()` values in `tokens.json`; prose names those by their captured semantic tokens (Obsidian / near-white) rather than concretizing a hex from lab-space.
- The pre-rendered sections (Colors, Spacing & Shapes, Surfaces, Quick Start) were pasted verbatim — including the noisy raw Border-Radius element tags — to preserve fidelity.
