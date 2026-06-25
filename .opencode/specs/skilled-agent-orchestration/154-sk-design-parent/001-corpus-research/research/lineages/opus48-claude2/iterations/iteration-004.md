# Iteration 4: Layout/structure and color/tokens children — boundaries and a coupling signal

## Focus
Deep-read the layout and color/token anchors (layout, oklch, baseline, with colorize/adapt context) to fix the boundaries of the "layout/structure" and "color/tokens" candidate children and assign their corpus sources.

## Findings

### F14 — "Layout/structure" is a well-bounded child with its own depth
`layout.md` covers: spacing systems (4pt scale, semantic tokens, `gap` over margins, `clamp()` fluid spacing), visual hierarchy (squint test, size/weight/color/position/space matrix, 2–3 dimensions), grid tooling (Flex 1D / Grid 2D / named areas / **container queries**), rhythm, depth/elevation scale, optical adjustments (44px hit areas, optical centering), and a "Register" split (Brand = asymmetric/grid-breaking vs Product = predictable grids). It maps cleanly to designer-skills `ui-design` layout-grid + spacing-system + visual-hierarchy + responsive-design. Boundary: structure/space/hierarchy — NOT color, NOT motion. [SOURCE: external/layout.md:24-148], [SOURCE: external/designer-skills-main/ui-design/skills/layout-grid/SKILL.md]

### F15 — "Color/tokens" is a deep, self-referencing child (color science + tokens)
`oklch-skill.md` is a perceptual-color-space specialist: hex/rgb/hsl→oklch conversion, palette/scale generation, APCA/WCAG contrast, gamut/P3 fallbacks, Tailwind v4 `@theme`, with four bundled reference files (color-conversion, palette-generation, accessibility-contrast, gamut-and-tailwind). Plus `colorize.md` (introduce strategic color systems). Maps to designer-skills `design-systems` design-token + theming-system + dark-mode-design + `ui-design` color-system. Boundary note: oklch's contrast checks overlap the accessibility/QA child — color owns *palette-level* contrast, QA owns *audit-level* WCAG sweeps. [SOURCE: external/oklch-skill.md:10-90], [SOURCE: external/designer-skills-main/design-systems/skills/design-token/SKILL.md]

### F16 — `baseline.md` is a cross-cutting "deslop" constraint checklist, not a domain child
`baseline-ui` is an opinionated lint/constraint set spanning stack, components, interaction, animation, typography, layout, performance, and design — restating the shared anti-slop core (no gradients/purple, compositor-only animation, ≤200ms feedback, `h-dvh` not `h-screen`, one accent per view, `tabular-nums`, accessible primitives). It overlaps *every* child. Signal: it is either (a) the fast entry-point of the **audit/QA** child or (b) a **shared reference** the parent exposes to all children — not its own peer child. [SOURCE: external/baseline.md:20-86]

### F17 — COUPLING SIGNAL: the impeccable verb-skills share a command prefix and a live-mode reference
`layout.md` ends with "hand off to `{{command_prefix}}impeccable polish`" and references a shared `reference/live.md` "params contract" (density/structure live params). The verb-skills (layout, audit, polish, clarify, distill, harden, optimize, adapt, animate, colorize, bolder, quieter, overdrive, delight) are therefore a **templated, cross-referencing family with a shared command prefix and shared live-mode runtime** — they were authored to compose under one umbrella (`impeccable`). This is the corpus's clearest **shared-runtime / tight-internal-coupling** evidence, and it argues that whichever children absorb these verbs benefit from a shared parent runtime (templates, live-params, command prefix). [SOURCE: external/layout.md:148], [SOURCE: external/layout.md:150-168], [SOURCE: external/impeccable.md]

### F18 — The "tone/intensity" verbs (bolder/quieter/overdrive/distill/clarify) are modifiers, not children
They adjust an existing design's intensity or clarity rather than owning a domain: bolder/quieter/overdrive = a single intensity dial on taste/aesthetic; distill = simplify; clarify = microcopy/labels. clarify maps to sk-design-interface's existing "interface writing rules," and the intensity dials map to stitch's Density/Variance/Motion 1–10 axes. They fold into the interface/taste child (as intensity + writing modes) or the audit/refine child — not a separate child. [SOURCE: external/bolder.md], [SOURCE: external/quieter.md], [SOURCE: external/distill.md], [SOURCE: external/clarify.md]

## Sources Consulted
- `external/layout.md` (full), `external/oklch-skill.md` (full), `external/baseline.md` (full).
- `external/colorize.md`, `external/adapt.md`, `external/bolder.md`, `external/quieter.md`, `external/distill.md`, `external/clarify.md` (front-matter + positioning from iter 1).
- designer-skills `ui-design` and `design-systems` skill descriptions (iter 2).

## Assessment
- **newInfoRatio: 0.55** — Layout depth, oklch's self-contained reference set, baseline's cross-cutting nature, the impeccable shared-prefix/live.md coupling signal, and the tone-verbs-as-modifiers resolution are new; cluster identity partly confirmed prior iterations.
- **Novelty justification:** Fixes two child boundaries with assigned sources and surfaces the strongest shared-runtime signal in the corpus (F17), which is decisive for KQ6.
- **Confidence:** High — all from full doc reads.

## Reflection
- **Worked:** Reading anchors at full depth exposed the shared command-prefix/live-params coupling that front-matter alone hid.
- **Insight:** baseline being cross-cutting is itself a structural argument for a parent that owns shared references.
- **Ruled out:** "Color" and "layout" as one combined child — each has its own deep reference set and distinct boundary; combining them would hide depth.
- **Ruled out:** tone/intensity verbs as standalone children.

## Recommended Next Focus
Iteration 5: Deep-read the motion/interaction cluster (animate, interaction-design, 12-principles, fixing-motion-performance, pseudo-elements, delight) to bound the "motion/interaction" child and test whether motion-performance belongs with motion or with the perf/QA child.
