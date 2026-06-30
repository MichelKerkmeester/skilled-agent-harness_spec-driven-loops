# Panel Synthesis — Phase 004: skeleton-first-2d (A5/A7)

> 5-model second-opinion panel. Advisory only — no spec edits, no implementation.
> Source reviews: `reviews/004-skeleton-first-2d/review-{glm,mimo,deepseek,kimi,minimax}.md`

## Panel table

| Model | Verdict | Confidence | Top gap | Top improvement |
|-------|---------|-----------|---------|-----------------|
| GLM-5.2 | AGREE-WITH-CHANGES | 0.72 | The crux assumption (GLM *obeys* a deterministic skeleton) is untested and mis-rated: R-003 "GLM ignores the contract" is rated Likelihood **Low** with zero evidence, against IFScale/instruction-density literature | Insert a **Phase-0 "GLM-obeys-contract" pilot** — hand-author skeletons for 2-3 sentinel tiles, measure transcription fidelity before any 11-20h module work; <85% compliance forces a sequencing/architecture change |
| MiMo-v2.5-Pro | AGREE-WITH-CHANGES | 0.68 | **A5 and A7 propose conflicting skeleton formats** — A5: GLM receives explicit pixel boxes and renders from them; A7: GLM outputs a semantic plan and a deterministic renderer computes pixels. The spec merges both without declaring which wins | Pick **A7's semantic plan** as the canonical contract; A5's skeleton JSON becomes the renderer's *output*, not GLM's input — GLM never sees pixel coordinates |
| DeepSeek-v4-Pro | AGREE-WITH-CHANGES | 0.72 | The skeleton-compute module **IS a graph layout engine and is completely unspecified** (no algorithm named: grid? Sugiyama? force-directed?; no copy-measurement method; no connector router) — "80% of the engineering in a single bullet point" | Ship the **A7 renderer-first architecture**: GLM emits `{nodes, edges, roles}`, a deterministic Node renderer computes all bboxes from templates — removes GLM from geometry, kills the audit-tag circular dependency |
| Kimi-k2.7 | AGREE-WITH-CHANGES | 0.78 | **A5/A7 title-region conflict** (A5: y=344,h=112,max_y=320; A7: y=352,h=104,visual≤328) — an 8-32px conflict that determines every other constraint, punted to "Open Questions" but blocks `compute-skeleton.mjs` | **5-tile compliance pilot before writing skeleton code**: hand-author skeletons for the 5 worst tiles, inject + render + audit; answers obedience, the `forbid_glm_coordinate_text` regex, and the first real lift datapoint |
| MiniMax-M3 | AGREE-WITH-CHANGES | 0.62 | "GLM renders from skeleton" is underspecified and probably unreliable — the whole premise is that GLM ignores spatial prose; a JSON contract doesn't eliminate that (GLM can still emit `transform:translate` to "adjust") | Replace the "render contract" with a **deterministic template renderer**: GLM outputs only A7's semantic plan, a small renderer maps `tile_type`→template→HTML/SVG — structurally eliminates RC-1/RC-2/RC-3 instead of hoping GLM follows a negative rule |

**Mean confidence: 0.70** (5 AGREE-WITH-CHANGES)

## Consensus (≥3 models agree)

1. **The "geometry belongs upstream, GLM is a renderer" thesis is correct and well-evidenced** (LaTCoder/LaySPA/GeoSVG-RL/AdaCoder) — all 5. Demoting GLM from coordinate-author to renderer is the right inversion.
2. **best-of-3-after-failure (not always-on) + downgrade-to-linear as the terminal escape are the right failure policy** — all 5.
3. **The central premise "GLM will obey a deterministic skeleton" is untested — and likely false given the root cause** — all 5. This is the program's biggest methodological gap. Multiple models note that if the skeleton is deterministic, best-of-3 recomputes the *same* candidate → "best-of-3 is theater"/"a no-op" unless a variation strategy is named.
4. **A5 (GLM consumes pixel coords) and A7 (GLM emits semantics, renderer owns pixels) are stitched together without resolution** — mimo, deepseek, kimi, minimax (glm via the downgrade/repair-chain concern). 4 of 5 explicitly recommend the A7 renderer-first path.
5. **The title-region constant (104 vs 112px) is a blocking schema constant, not an open question** — glm, mimo, kimi, minimax. It must be locked against *measured* production Dutch copy before `compute-skeleton.mjs`/schema freeze.
6. **best-of-3's variation axes are undefined** — all 5. The spec must name what differs across candidates (row-height ∈ {compact/default/generous}, node-order, legend on/off) and prove candidate diversity ≠ noise.
7. **560×480 (tile) vs 480×480 (skeleton canvas) is unreconciled** — glm, deepseek (and mimo/minimax reference the same 80px gap) — the skeleton coordinate system may not map 1:1 to the rendered output.
8. **Run a cheap pilot before building the geometry kernel** — all 5 (2-3h hand-authored-skeleton compliance test on the 5 worst tiles).

## Divergence

- **A5 vs A7 strength of recommendation:** deepseek/minimax/mimo say switch to A7 renderer-first outright; kimi/glm say *pilot first*, then pivot to A7 only if GLM compliance is <70-85%.
- **+15pt lift realism:** kimi is sharpest — "+15-pt hit: 35-50%, not predicted"; expects +8-12 (geometry only) and warns of a *new* "templated feel" anti-slop tax that blind MiniMax audits will dock. glm warns SC-004 (<10% downgrade) is gameable by loosening budgets (→ sparse/ugly tiles that still pass).
- **Auto-linearize thresholds:** deepseek says `nodes>5/rows>3/edges>6` is too conservative — typical 4-6 node maritime diagrams get downgraded before the skeleton even tries, undermining SC-001/002. Others don't flag this.
- **Effort estimate:** glm (~1.5-2x optimistic), mimo (8-12h for compute-skeleton alone, 16-28h total vs the plan's 11-20h) — vs the spec's estimate.
- **One-geometry-fits-all-treatments:** kimi uniquely decomposes the five treatments (matrix=grid, hub-spoke=polar, routing=graph+orthogonal-router, funnel=trapezoidal, popover=z-stack) and warns one `nodes[]/connectors[]` schema is matrix-shaped — you'll special-case each or fail them.

## Adopt-worthy improvements GPT-5.5 missed (ranked, cross-model)

1. **Resolve A5-vs-A7 by adopting the A7 renderer-first architecture** (mimo, deepseek, minimax, kimi). GLM emits a semantic plan; a deterministic Node renderer (one template per `layout_mode`) computes all pixels. Eliminates the untested GLM-as-coordinate-renderer assumption *and* the `data-a5-region` audit-tag circular dependency in one move, and the plan is ~70% smaller in tokens.
2. **A Phase-0 GLM-compliance pilot before any module code** (all 5). Hand-author skeletons for the 5 worst tiles (accountbeheer-4, oci-4, goedkeuringssysteem-4, orders-facturen-4, aangepast-assortiment-3); measure coordinate-compliance %. <85% (glm) / <70% (kimi) → pivot architecture.
3. **Lock the title-region constant against measured Dutch copy** (glm, mimo, kimi, minimax) — a 30-min measurement task that should be T000, not an open question; it sets `diagram_max_y` and ripples into every placement.
4. **Define best-of-3's variation axes (or admit it's a no-op)** (all 5) — name the parameter sweep and a continuous scoring function: e.g. `score = (pass_preflight?1000:0) − overlap_area − anchor_error − overflow` (deepseek).
5. **Add a deterministic HTML pre-check for forbidden coordinate patterns** (mimo) — grep the rendered HTML for `position:absolute`, `left:\d+px`, `transform:translate` and FAIL immediately, before the bbox audit; cheaply catches GLM non-compliance. (Pair with an allow-list for legit `flex:1`/`padding`/`translate(-50%)` centering — kimi.)
6. **Make the downgrade module deterministic with per-treatment templates** (deepseek): `matrix→stacked-rows (keep 3 + "+N more")`, `node→stacked-rows`, `routing→linear-flow (source→dest)`, `funnel→stacked-rows`. Don't let GLM own the transformation.
7. **Re-baseline the old outputs through the NEW verifier before claiming +15pt** (glm) — the new verifier adds 6 geometry fields/thresholds; the old 35-58 scores are apples-to-oranges. Insert a Phase-0 baseline capture.
8. **Pin typography per text region in the schema** (glm) — copy-width measurement needs fixed font-family/size/weight; the schema must own typography, not just geometry, or title-reservation math is a guess.
9. **Define a per-treatment layout-variant pool (≥3 variants per `tile_type`, seeded by tile_id)** (kimi) — to counter the "five identical matrix tiles look mass-produced" anti-slop risk on a B2B maritime dashboard (rated Low by spec; kimi rates High).
10. **Bypass 001's repair pass for tiles routed `2d_positioned`** (mimo) — 004's best-of-3 + downgrade is the complete failure path; running both creates unpredictable interactions.

## Red flags (≥2 models flag a risk)

- **Untested central premise: GLM may not obey the skeleton** (all 5) — if compliance is even ~15-20% off, costs balloon, best-of-3 fires constantly, and "skeleton replaces prose" inverts into "skeleton + policing prose."
- **A5/A7 architectural conflict unresolved** (mimo, deepseek, kimi, minimax) — will surface as implementation confusion / two divergent code paths.
- **Title-region constant unlocked** (glm, mimo, kimi, minimax) — blocks schema freeze.
- **best-of-3 undefined → likely a no-op** (all 5).
- **+15pt lift over-optimistic; SC-004 downgrade-rate is gameable** (kimi, glm) — geometry-only fixes plus a new templated-feel tax.
- **Effort underestimated ~1.5-2x** (glm, mimo).
- **560 vs 480 canvas unreconciled** (glm, deepseek) — same family as the 001 dimensional flag; the coordinate system may not map 1:1.

## Net recommendation

**REVISE (heavy) before building.** The thesis is endorsed 5/5 but the phase as written rests on an untested premise and an unresolved architecture. Before any geometry-kernel code: (1) run the GLM-compliance pilot; (2) resolve A5-vs-A7 — panel-preferred is A7 renderer-first so GLM never owns pixels; (3) lock the title-region constant against measured Dutch copy; (4) define best-of-3 variation + scoring (or drop it); (5) re-baseline through the new verifier and set an honest +8-12pt floor with a templated-feel guard. Specify the skeleton-compute algorithm and per-treatment templates rather than leaving the layout engine as a bullet point.
