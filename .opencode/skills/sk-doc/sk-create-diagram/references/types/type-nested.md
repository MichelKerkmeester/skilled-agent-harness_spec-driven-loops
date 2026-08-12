---
title: "Nested Containment"
description: "Layout conventions for hierarchy through containment — scope boundaries, folder nesting, trust zones — nested rounded rectangles with inset padding and stroke hierarchy."
trigger_phrases:
  - "nested containment diagram"
  - "scope boundary hierarchy"
  - "folder nesting visualization"
  - "blast radius diagram"
  - "containment ring hierarchy"
importance_tier: normal
contextType: implementation
version: 1.0.0.0
---

# Nested Containment

**Best for:** hierarchy through containment — scope boundaries, CLAUDE.md cascade, trust zones, folder nesting, blast radius. Outer = broader, inner = more specific.

## 1. Layout conventions
- 3–5 rounded rectangles (`rx=8`), nested with consistent inset padding (24–32px horizontal, 32–36px vertical recommended).
- Each level labeled at the top-left in Geist Mono eyebrow style (7–8px, letter-spacing 0.14em). Labels sit on a paper-colored mask rect over the ring's top border.
- Stroke hierarchy: outer rings faint (`rgba(..,0.30–0.45)`), progressing to muted, to ink, to coral at the innermost focal.
- Fills step up in opacity from outer to inner: `rgba(..,0.015)` → `rgba(..,0.025)` → accent-tint on the innermost.
- Optional file-icon glyph (folded-corner rect) inside each level hints at scope content.
- Italic Instrument Serif callouts (see `primitive-annotation.md`) — 1–2 max.

## 2. Anti-patterns
- More than 6 levels (information disappears inward).
- Irregular padding between levels — unaligned nesting looks accidental.
- Content inside rings that isn't part of the hierarchy — use a sibling diagram.
- Coral on multiple levels — hierarchy collapses.

## 3. Examples
- `assets/examples/example-nested.html` — minimal light
- `assets/examples/example-nested-dark.html` — minimal dark
- `assets/examples/example-nested-full.html` — full editorial
