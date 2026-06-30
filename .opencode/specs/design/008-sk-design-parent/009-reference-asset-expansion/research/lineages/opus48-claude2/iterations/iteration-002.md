# Iteration 2: design-foundations expansion matrix

## Focus
Assess `design-foundations` (color/type/layout static system) against the corpus gaps the gap-analysis routes to it — data-viz (14d), three-dials brief→config intake (08t), brand-seed color (N3), gestalt depth (14g) — and produce its matrix entry.

## Findings

### F2.1 — Foundations is well-covered for color/type/layout but has zero data-viz [confirmed]
Current references: `color/{oklch_workflow,palette_theming}`, `type/typography_system`, `layout/layout_responsive`, `corpus_map`; **0 assets**. The corpus_map shows deep distillation of oklch-skill, colorize, layout, baseline, adapt, and designer-skills typography-scale/readable-measure [SOURCE: design-foundations/references/corpus_map.md:33-41]. Data is only touched as *typographic* alignment (tabular numerals) [SOURCE: design-foundations/references/type/typography_system.md:44,93]. Real data-visualization foundations — chart-type selection, axis/encoding, color-for-data, sparklines — are absent. The corpus carries them: designer-skills `ui-design` explicitly lists "data viz" [SOURCE: external/designer-skills-main/README.md:72]. This is gap 14d (should-add) [SOURCE: gap-analysis.md:24].

### F2.2 — The taste three-dials brief→config intake is real, but cross-cutting [confirmed; divergence flagged]
`taste-skill` §0 ("Read the Room": page-kind / vibe / audience / constraints → a one-line "Design Read") and §1 ("THE THREE DIALS": `DESIGN_VARIANCE`, `MOTION_INTENSITY`, `VISUAL_DENSITY` with an inference table and use-case presets) are a concrete brief→config intake [SOURCE: external/taste-skill.md:13-79]. gap-analysis routes 08t to "foundations/intake ref" [SOURCE: gap-analysis.md:25]. **Divergence to surface:** only `VISUAL_DENSITY` is a foundations concern; `DESIGN_VARIANCE`→interface and `MOTION_INTENSITY`→motion. The dials are most naturally an *interface/shared intake*, with foundations consuming the density dial. I record it as a foundations candidate per the gap-analysis routing but flag the cross-cutting ownership tension as an open question for the build phase.

### F2.3 — Brand-seed color (greenfield) is a small fold-in, not a new reference [confirmed, nice]
Gap N3: `impeccable`'s greenfield brand-seed color (derive a palette from a single brand seed when no system exists) folds into `color/palette_theming.md` as a short subsection; nice-to-have [SOURCE: gap-analysis.md:35].

### F2.4 — Gestalt/grid depth is already substantially covered [confirmed → mostly do-NOT]
Gap 14g is explicitly downgraded: "already largely covered by `cognitive_laws.md` + `layout_responsive.md`" [SOURCE: gap-analysis.md:33,43]. `cognitive_laws.md` lives in parent `shared/` (confirmed present). Only a light top-up would be justified, so this is near the do-NOT line.

### F2.5 — Foundations is the natural home for the first token-scaffold asset [inferred]
Foundations is the most "system"-shaped mode (color tokens, type scale, spacing scale) yet ships 0 assets. A fill-in starter scaffold (OKLCH ramp + type scale + spacing scale, pre-wired to `design_token_vocabulary.md`) would turn the static-system references into a usable artifact. Effort/leverage make this a nice-to-have, not a should.

## Prioritized Additions (design-foundations)

| ID | Type | Title | Why it raises usefulness | Corpus sources | Effort |
|----|------|-------|--------------------------|----------------|--------|
| FN-R1 | reference | `references/data_viz.md` — data-visualization foundations | Closes the only real coverage hole: chart-type selection, axis/encoding, color-for-data (sequential/diverging/categorical), sparklines, table alignment beyond tabular-nums. | designer-skills `ui-design` data-viz; baseline (tabular-nums) | M |
| FN-R2 | reference | `references/intake/design_read_dials.md` — brief→config intake (Design Read + three dials) | Adds a structured intake gate before token decisions; the density dial is foundations-owned. **Cross-cutting** — coordinate with interface/motion ownership at build time. | taste-skill §0–1 | S |
| FN-R3 | reference | brand-seed color fold-in to `color/palette_theming.md` | Greenfield path: derive a palette from one brand seed when no system exists. Small, nice-to-have (N3). | impeccable | S |
| FN-A1 | asset | `assets/token_starter.md` — fill-in OKLCH ramp + type-scale + spacing-scale scaffold | First foundations asset; turns the static-system references into a fill-in artifact wired to `design_token_vocabulary.md`. Nice-to-have. | oklch-skill; layout; shared/design_token_vocabulary | M |

## Do-NOT-add (design-foundations)
- **Splitting foundations into `color` + `layout` children** — that is mimo's domain-pure taxonomy; taxonomy is decided and out of scope.
- **A heavy new Gestalt/grid reference (14g)** — already covered by `shared/cognitive_laws.md` + `layout_responsive.md`; at most a light top-up. [if-effective bar: marginal]
- **taste-skill §2 brief→design-system map (Fluent/Carbon/Polaris/etc.)** — that is framework/package selection, closer to interface grounding + `sk-code`, not static visual foundations.
- **Re-deriving OKLCH / contrast / dark-mode** — already deep in `oklch_workflow.md` + `palette_theming.md`; no duplication.

## Sources Consulted
- `.opencode/skills/sk-design/design-foundations/references/corpus_map.md` (full), `type/typography_system.md` (grep), `layout/layout_responsive.md` (head, iter 1 carry)
- `external/taste-skill.md` §0–2 (lines 13–120)
- `external/designer-skills-main/README.md` (data-viz grep, line 72)
- `gap-analysis.md` rows 14d, 08t, N3, 14g

## Assessment
- **newInfoRatio: 0.8** — New mode with genuinely new findings (data-viz hole, three-dials cross-cutting tension, token-scaffold asset idea), but the zero-assets pattern and the gap-analysis baseline were partly established in iter 1.
- **Novelty justification:** Surfaces the first real ownership-divergence (three-dials) and confirms foundations is the best-covered mode, which sharpens the do-NOT bar.
- **Confidence:** High on coverage (references + corpus_map read); Medium on the three-dials ownership call.

## Reflection
- **Worked:** Reading taste §0–1 plus a targeted data-viz grep across both the corpus and the live references settled both should-adds cleanly.
- **Ruled out:** color/layout child split (taxonomy, out of scope); heavy gestalt reference (already covered).
- **Failed:** nothing; the three-dials ownership is deferred, not failed.

## Recommended Next Focus
Iteration 3: `design-motion` — emil advanced interaction/gesture craft (08e), overdrive advanced rendering (06), and any gpt-taste motion overlap; produce its matrix entry.
