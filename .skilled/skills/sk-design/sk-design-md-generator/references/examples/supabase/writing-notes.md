---
title: Supabase DESIGN.md Writing Notes
description: Editorial notes explaining the measured data, fidelity decisions, and validation caveats in the Supabase v3 Style Reference example.
trigger_phrases:
  - Supabase DESIGN.md writing notes
  - Supabase style reference validation
  - Supabase extraction caveats
importance_tier: normal
contextType: general
version: 1.0.3.0
---

# Writing Notes: Supabase DESIGN.md (v3)

Open this beside the Supabase `DESIGN.md` when a value needs explaining: the notes record which sections the formatter pasted verbatim, which font names were inferred, and why the Surfaces table reads light on a dark page.

## 1. OVERVIEW

### Purpose

- This is a v3 **Style Reference**, regenerated from the existing `tokens.json` with no re-crawl. Value-bearing sections (Tokens — Colors, Spacing & Shapes, Surfaces, Quick Start) are pasted verbatim from `build-write-prompt.ts`; only prose was authored.
- Final validation at generation: **score 99/100, claims 100/100, PASS** (zero critical failures). A current `validate.ts` run over the shipped pair reports **45/100, FAIL** (eleven hard failures: missing `## Motion` and ten missing Quick Start groups, plus two advisory warnings) until the exemplar is regenerated. The `unknown-font: "### Tailwind v4"` warning is a benign heuristic false-positive on the required Quick Start subheading — same warning the gold anobel exemplar would raise.
- Theme set to **dark**: the background tokens are near-black (`#171717` cards, `#0f0f0f` footer, `#000000` base) and Snow (`#fafafa`) is the dominant text colour. The pre-rendered Surfaces table labels Canvas as `#fafafa` by formatter convention; it was pasted unchanged per the fidelity rule despite the dark theme.
- Two fonts: Circular (headings/body/UI) and Source Code Pro (numerics + uppercase tier labels). `fontInfo.loadedFonts` only reports a generic `custom-font`, so font names come from `typographyLevels` — substitutes (Inter / Fira Code) are inferred, not extracted.
- Data caveats observed: Source Code Pro's 700 weight is a single low-confidence `$25` instance; component border `rgb(54,54,54)` and Secondary text `rgb(18,18,18)` are NOT in `colorTokens`, so they are described as "dark-gray"/"near-black" rather than printed as phantom hexes. Most shadow tokens are no-op transparent stacks — Elevation reports them honestly rather than claiming a depth system.

### When to Use

- When a value in the Supabase `DESIGN.md` needs explaining.
- When a reader needs to know which sections the formatter pasted verbatim.
- When a font name needs checking against what was inferred.
- When the Surfaces table's reading on a dark page needs explaining.
