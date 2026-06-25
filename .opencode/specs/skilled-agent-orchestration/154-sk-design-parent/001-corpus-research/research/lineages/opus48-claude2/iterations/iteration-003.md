# Iteration 3: Named aesthetics, apple-bento, and the DESIGN.md artifact overlap

## Focus
Read apple-bento-grid-main and the named-aesthetic standalone docs (stitch + brutalist/minimalist/soft) to decide whether named aesthetics are a child, siblings, or assets — and to locate the artifact that ties the family together.

## Findings

### F10 — apple-bento-grid is a self-contained "named-aesthetic generator" package, with its own design-system.md + evals
Its structure is a complete skill bundle: `SKILL.md` (workflow: read design system selectively → gather content → choose theme/layout → compose cards → generate HTML → visual review → screenshot), `design-system.md` (full light/dark tokens, card CSS/HTML, layout templates, skeleton), `examples/` (rendered HTML+PNG), `evals/evals.json`, and `scripts/screenshot.mjs`. It produces *static HTML for screenshot export*, not interactive UI. This proves a named aesthetic can be a self-contained leaf skill with its own token reference and eval harness. [SOURCE: external/apple-bento-grid-main/SKILL.md:30-46], [SOURCE: external/apple-bento-grid-main/SKILL.md:200-204]

### F11 — KEY OVERLAP: stitch-skill *authors* a DESIGN.md; sk-design-md-generator *extracts* one — same artifact, opposite directions
`stitch-design-taste` generates a `DESIGN.md` that is "the single source of truth" encoding atmosphere, color calibration, typography, component behaviors, layout principles, motion philosophy, and an anti-pattern ban list — produced *from taste directives*. The existing `sk-design-md-generator` produces a "v3 Style Reference DESIGN.md" *from a live site's real CSS*. Both emit the **same downstream contract** (a DESIGN.md / Style Reference that other agents consume) by two acquisition paths: **author-from-judgment** vs **extract-from-existing**. This is strong evidence for a dedicated **design-spec / style-reference** child that owns the DESIGN.md artifact and has (at least) two modes: extract and author. [SOURCE: external/stitch-skill.md:9-26], [SOURCE: external/stitch-skill.md:115-162], [SOURCE: .opencode/skills/sk-design-md-generator/SKILL.md]

### F12 — A single "anti-slop taste" core is shared across the whole interface-build cluster
stitch's rules — Inter banned; never pure `#000`; max 1 accent <80% saturation; no neon/AI-purple; no 3-equal-column card rows; asymmetric heroes; spring physics (stiffness 100/damping 20); perpetual micro-motion; transform/opacity only; explicit AI-cliché copy bans ("Elevate/Seamless/Unleash") — are the *same anti-templated-defaults judgment* that `sk-design-interface` exists to enforce, and that `taste-skill`, `gpt-taste`, `bencium`, `emil`, `soft` all restate. This shared core is the spine of the **interface/taste** child (= the matured sk-design-interface). The named aesthetics (brutalist/minimalist/soft/apple-bento) are *presets that specialize that core* along atmosphere axes (stitch literally parameterizes Density/Variance/Motion 1–10). [SOURCE: external/stitch-skill.md:40-113], [SOURCE: external/stitch-skill.md:29-35]

### F13 — Named aesthetics are a "preset/axis" layer, not peer activity-children
Confirms F9's hypothesis: brutalist (raw Swiss + military terminal, rigid grids, extreme type contrast), minimalist (warm monochrome editorial, flat bento, muted pastels, no gradients/heavy shadows), soft (high-end agency "expensive" feel), apple-bento (Apple bento cards) are all *style directions* — values plugged into the same interface/taste + color + layout + motion machinery. For a 4–7 taxonomy they should collapse into ONE optional "aesthetic directions / style presets" reference set consumed by the build children, not 4 separate children. [SOURCE: external/brutalist-skill.md], [SOURCE: external/minimalist-skill.md], [SOURCE: external/soft-skill.md], [SOURCE: external/apple-bento-grid-main/design-system.md]

## Sources Consulted
- `external/apple-bento-grid-main/SKILL.md` (full workflow + structure + reference files).
- `external/stitch-skill.md` (full: DESIGN.md goal, analysis instructions, output structure, anti-patterns).
- `external/brutalist-skill.md`, `external/minimalist-skill.md`, `external/soft-skill.md` (front-matter from iter 1; aesthetic positioning).
- `.opencode/skills/sk-design-md-generator/SKILL.md` (description: live-site CSS → v3 Style Reference DESIGN.md).

## Assessment
- **newInfoRatio: 0.65** — The apple-bento package anatomy, the stitch↔sk-design-md-generator DESIGN.md overlap, and the shared anti-slop core are new and high-value; the named-aesthetic positioning partially confirms iter-1/iter-2 hypotheses.
- **Novelty justification:** Surfaces the DESIGN.md artifact as the family's connective contract and resolves how named aesthetics fit — both directly seed KQ4, KQ5, and KQ7.
- **Confidence:** High on the DESIGN.md overlap (both descriptions read directly); medium on the "presets not children" recommendation (a design call, defensible from evidence).

## Reflection
- **Worked:** Reading the two structural exemplars (apple-bento package + stitch generator) revealed the shared DESIGN.md contract that links the existing sk-design-md-generator to the corpus.
- **Insight:** The DESIGN.md / Style Reference is the *interface* between a "decide the design language" child and the "build/polish" children — a natural seam in the taxonomy.
- **Ruled out:** Four separate named-aesthetic children (brutalist/minimalist/soft/apple-bento as peers) — wrong axis; they are presets, and four of them would blow the 4–7 budget on one domain.

## Recommended Next Focus
Iteration 4: Deep-read the layout + color/token cluster (layout, baseline, adapt, oklch, colorize) to define the boundaries of the "layout/structure" and "color/tokens" candidate children and assign their corpus sources.
