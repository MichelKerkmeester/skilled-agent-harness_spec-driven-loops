# Panel Synthesis — Phase 002: primitive-routing

> 5-model second-opinion panel. Advisory only — no spec edits, no implementation.
> Source reviews: `reviews/002-primitive-routing/review-{glm,mimo,deepseek,kimi,minimax}.md`

## Panel table

| Model | Verdict | Confidence | Top gap | Top improvement |
|-------|---------|-----------|---------|-----------------|
| GLM-5.2 | AGREE-WITH-CHANGES | 0.82 | Confounds primitive with defect: RC-1 vertical overflow (the dominant scorer) is bucketed under "2d-positioned," so the 2D path fixes RC-2 collisions but leaves RC-1 overflow on the lowest tiles | Add a **defect-route axis** alongside the primitive axis, keyed `{primitive, defectClass}` from the per-tile audit JSON; any tile with `overflow` (linear OR 2D) gets mandatory row-truncation — removes SC-001 circularity |
| MiMo-v2.5-Pro | AGREE-WITH-CHANGES | 0.82 | **Model dial contradicts itself** — A3 names `glm-5.2 thinking.enabled` as skeleton author, but grounding says glm-5.2 is text-only ("do not send screenshots"); a text-only model can't author spatially-correct bbox JSON | Replace with a **two-model contract**: vision model (`glm-5v-turbo`/`glm-4.6v`) for skeleton/geometry + repair; glm-5.2 only for text-only structured audit/classification |
| DeepSeek-v4-Pro | AGREE-WITH-CHANGES | 0.72 | Assumes the 10 static labels are complete/correct with no feedback loop; the donut is a 2D primitive mechanically (arc/center/angles) labeled linear-flow because *this one* scored 88 | Add a **post-generation reclassification gate**: count `position:absolute` + cumulative heights; if a `linear-flow` tile emits ≥3 absolutes or overflows, flip to `2d-positioned` and re-route (~30 LOC). Static map = prior, render = arbiter |
| Kimi-k2.7 | AGREE-WITH-CHANGES | 0.70 | Phase ships **metadata, not a fix**; SC-001/002 test transcription fidelity to `iter-r3-A3.md`, not whether routing moves the score — the 41pt hypothesis is not in the gate | Add SC-003: a 5-tile pilot with a hand-stubbed skeleton + one Round-2; if the routed path doesn't move ≥3/5 tiles by ≥10pts, the routing premise is wrong. Alt: **merge phase 002 into 001** |
| MiniMax-M3 | AGREE-WITH-CHANGES | 0.60 | Correlation ≠ causation: RC-1 overflow also hits linear winners (`een-factuur-1` 88, `favorieten-3` 78, `goedkeuringssysteem-1` 62); routing by primitive won't catch them; donut misclassified | Add a **runtime override**: static map as prior, but let the phase-001 gate re-route any tile that actually overflows/overlaps/title-fails; or route by a lightweight complexity predictor (element/abs-pos/row count) |

**Mean confidence: 0.73** (5 AGREE-WITH-CHANGES — highest-confidence phase)

## Consensus (≥3 models agree)

1. **Route-by-primitive-not-by-treatment-letter is correct, and the `(d)` donut proof is the right falsifier.** All 5 endorse it as "the single most important design decision" (deepseek) / "the right architectural test" (mimo). Routing by letter would have wrongly sent `aangepast-assortiment-4` (donut, 88) down the skeleton path.
2. **A deterministic hand-curated lookup (not an LLM/keyword classifier) is right-sized** for a finite 45-tile set — glm, mimo, deepseek, kimi.
3. **The static map needs a runtime/render override — it cannot be trusted alone** — glm (defect axis), deepseek (reclassification gate), minimax (runtime override), kimi (SC-003 pilot). The "map as prior, render as arbiter" framing recurs verbatim across deepseek and minimax.
4. **RC-1 overflow is NOT a 2D-only problem; routing by primitive misses route-by-defect** — glm, deepseek, kimi, minimax all name the same overflowing *linear* tiles (`goedkeuringssysteem-1` 62, `goedkeuringssysteem-3` 66, `favorieten-3` 78) that get `repair=failure-only` and no mandatory round-2.
5. **The donut-as-linear-flow label is suspect** (deepseek, minimax, kimi) — it is radial/2D mechanically; the 88 score reflects this render, not the class. A future low-scoring donut silently routes wrong.
6. **`primitiveFor()` throwing on unmapped tiles = pipeline crash; add a safe default** — mimo, deepseek (both: default to `linear-flow` + a loud "triage-me" flag, one line of code).
7. **Success criteria test label fidelity, not score improvement** — kimi, minimax (and glm's "frozen-strata circularity"): SC-001 validates the map against the artifact it came from, with no independent ground truth.

## Divergence

- **Why the map can't be trusted varies by mechanism:** glm wants `{primitive, defectClass}` keyed on the audit JSON; deepseek/minimax want a *runtime* render-based re-route; kimi wants a falsification *pilot* (or to merge into 001); mimo focuses on the *model-dial* contradiction over routing per se.
- **Should the phase exist standalone?** kimi: "merge this phase into phase 001 (gate)" to avoid the metadata-only smell. Others keep it separate but add a feedback loop.
- **Donut handling:** deepseek/kimi want it reclassified as its own/2D category; minimax flags it as a weakness in REQ-003 but doesn't demand reclassification.
- **Source of the 10/35 split:** kimi/glm suspect post-hoc rationalization (labels authored *after* seeing scores); mimo trusts the taxonomy but distrusts the model assignment.

## Adopt-worthy improvements GPT-5.5 missed (ranked, cross-model)

1. **A runtime/render-based override on top of the static map** (glm, deepseek, minimax, kimi — 4 models, strongest cross-model item). Concrete: after render, count `position:absolute` + measure cumulative heights; a `linear-flow` tile with ≥3 absolutes or overflow flips to `2d-positioned` and re-routes. Closes the RC-1 blind spot and the donut foot-gun; ~30 LOC.
2. **Route by defect, not only by primitive** (glm): key `{primitive, defectClass∈{none,overflow,collision,title-break}}` from the existing `overflow:true` audit flags; tests SC-001 against defect presence (independent ground truth) instead of the self-authored stratum.
3. **Resolve the model-dial contradiction** (mimo): two-model contract — vision model for spatial skeleton/repair, glm-5.2 for text-only audit/classification. "The current spec assigns GLM-5.2 to the one task it's documented to fail at."
4. **A score-moving pilot as a real SC** (kimi): 5 labeled 2D tiles, routed path vs baseline; require ≥3/5 move ≥10pts. Turns a metadata exercise into a falsifiable claim before 003-005 build on it.
5. **Safe default for unmapped tiles** (mimo, deepseek): `defaultPrimitive(concept, n) → linear-flow` + triage flag; never throw mid-batch.
6. **Pre-build confusion matrix / `position:absolute` audit** (glm, deepseek): tabulate `{primitive-from-map, RC-1, RC-2, RC-3, score}` for all 45; if any `linear-flow` tile has an RC-1 defect <70, the defect-route axis is mandatory not optional.
7. **State the downstream cost the router triggers** (glm): 10 tiles each needing skeleton + mandatory round-2 ≈ 20+ added GLM calls in phase 004 — make it a conscious decision.
8. **Independent primitive-labeling audit** (kimi): a second human labels 5 mid-distribution tiles from `concepts.md §2` blind; <100% agreement means the labels are partly score-driven, weakening the "general principle" claim.
9. **Prefer an explicit `tileId` over `slugFromOut` path-parsing** (glm): re-deriving the key from `dist/<concept>-glm-<n>.html` is a latent foot-gun on multi-hyphen slugs like `aangepast-assortiment-4`.

## Red flags (≥2 models flag a risk)

- **RC-1 overflow on linear tiles gets no mandatory repair** (glm, deepseek, kimi, minimax — 4 models). The route-by-primitive design is "provably under-protective" (glm) on the named tiles.
- **Model-dial self-contradiction** (mimo, with kimi/deepseek/minimax all separately doubting GLM-5.2 can emit valid non-overlapping bbox JSON). This is a *critical*-tagged issue that also propagates into phases 004/005.
- **SC tests fidelity to its own design artifact, not reality** (glm "frozen-strata circularity", kimi, minimax) — no independent ground truth; risk of post-hoc rationalization.
- **Donut misclassification** (deepseek, minimax, kimi) — a class-vs-instance error that will silently misroute future donuts.
- **Repair policies are inert until phase 001 lands** (kimi, minimax, deepseek, mimo) — phase 002 alone only emits `skeletonFirst=true` metadata; spec doesn't say whether it's shippable without 001.

## Net recommendation

**REVISE (light) — direction strongly validated, closest-to-keep of the six.** Keep the deterministic route-by-primitive map and the `(d)` proof. Required fold-ins before build: (1) a runtime/render override so the map is a prior not a prison (4-model consensus); (2) resolve the model-dial contradiction (vision model for geometry); (3) add a score-moving SC/pilot so success means "routing closes the gap," not "labels match"; (4) safe-default unmapped tiles; (5) reclassify or carve out the donut. Consider kimi's alternative of folding the classifier into phase 001's gate to remove the metadata-only seam.
