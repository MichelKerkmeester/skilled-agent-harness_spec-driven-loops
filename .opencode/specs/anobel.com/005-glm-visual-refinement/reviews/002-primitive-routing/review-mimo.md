## Verdict

**AGREE-WITH-CHANGES** — confidence 0.82 — the core primitive-split diagnosis is sound and the 10/35 taxonomy is well-evidenced, but the spec contains a self-contradictory model dial, an unexamined assumption that GLM-5.2 can emit correct skeleton JSON for the very layouts it cannot render, and a dimension mismatch that would confuse implementers.

---

## What GPT-5.5 got right

1. **The root-cause decomposition is genuinely good.** RC-1 through RC-4 trace specific render failures to specific GLM limitations (no constraint solver, no collision detection, instruction-density overload). The 41-point gap is real and the causal mechanism is named, not hand-waved.

2. **The `(d)` proof is the right architectural test.** Insisting that `aangepast-assortiment-4` (donut/ring) routes `linear-flow` while `-3` and `-5` route `2d-positioned` — within the same concept — proves the classifier keys on form not letter. This prevents the most common cargo-cult failure: routing by treatment index.

3. **Deterministic lookup over keyword matching.** Choosing a hand-curated `PRIMITIVE_MAP` over a keyword heuristic avoids the "funnel/scope" borderline problem entirely. If it's wrong, it's wrong in a known, auditable way.

4. **The repair policy split is pragmatic.** Linear-flow tiles only get Round-2 on gate failure (cheap); 2D tiles always get a mandatory Round-2 (justified by the score gap). This matches effort to blast radius.

---

## Gaps / risks / errors

### 1. Model dial contradicts itself (critical)

The A3 recommendation specifies:
> Code/skeleton model: `glm-5.2`, `thinking.enabled`, `reasoning_effort=max`

But the research grounding explicitly states:
> `glm-5.2` is documented as text-only. Do not send screenshots to `glm-5.2`.

**The problem:** if the skeleton-first sub-pipeline (phase 004) generates bounding-box JSON that must be visually correct, it needs spatial reasoning about the 480×480 canvas. GLM-5.2 has never seen an image. Specifying it as the skeleton author while calling it text-only is a direct contradiction — either the skeleton author must be `glm-5v-turbo`/`glm-4.6v`, or the skeleton is pure-prose and doesn't need vision. The spec doesn't clarify which.

**Failure mode:** An implementer uses GLM-5.2 for skeleton JSON, it produces plausible-looking but spatially wrong bboxes (overlapping, out-of-zone), and the deterministic validators catch 80% of them — but the 20% that slip through produce *worse* tiles than the original, because now there's a wrong skeleton constraining the render.

### 2. 560×480 vs 480×480 — dimension mismatch (medium)

The user prompt states tiles are **560×480**. The A3 contract specifies:
> Canvas: `480x480`.
> Safe x range: `24..456`.

A 480px safe range on a 560px canvas wastes 80px. On a 480px canvas, 24..456 is 432px. Which is it? If the canvas is 560 wide, the safe zones are wrong. If it's 480, the user prompt is wrong. This needs resolution before anyone writes a validator.

### 3. The classifier is a look-up table, not a classifier (design smell)

The spec calls it a "deterministic classifier" but it's really a 45-entry hard-coded map. This is fine for the 45-tile pilot but creates a scaling problem: any new concept or treatment requires manually editing `primitive-map.mjs`. The open question about "should the classifier expose a per-tile override layer?" is the right one, and the spec punts on it. Recommendation: **answer it now** — the map should export a `defaultPrimitive(concept, n)` function that falls back to `linear-flow` (the safe default) when a tile isn't in the map, so the pipeline never throws on an unmapped tile. The curated entries override.

### 4. GLM-5.2 skeleton generation for 2D layouts — the bootstrapping problem

The spec assumes the 2D pipeline is: skeleton-first → render → audit → Round-2 repair. But the skeleton itself requires spatial reasoning (where do 4 matrix rows go in a 480×324 diagram zone?). If GLM can't place coordinates correctly during render, **why would it place them correctly in a skeleton JSON?** The answer might be that structured JSON is easier than CSS — that's plausible — but it's an untested assumption. The spec should name this as a risk: "Phase 004's skeleton-first approach assumes GLM emits more accurate spatial coordinates in JSON than in CSS. This must be validated on 3-5 tiles before full implementation."

### 5. Phase dependency creates dead code

The repair policy for linear-flow tiles (`repair=failure-only`) depends on phase 001's gate. Phase 001 doesn't exist yet. So for the entire life of phase 002, 35 tiles carry a repair policy that never triggers. The spec acknowledges this ("the repair policy is inert until 001's gate is live") but doesn't specify: is phase 002 shippable without phase 001? Can we run the classifier and emit routing metadata without the gate? If yes, say so explicitly. If no, phase 002 is blocked.

### 6. No mixed-primitive handling

Some tiles may be "mostly linear with a small 2D element" (e.g., a table with an embedded mini-chart). The spec's binary `linear-flow | 2d-positioned` classification doesn't account for this. For the 45-tile set this may not matter, but the open question about borderline forms hints at it. The spec should state explicitly: "For the 45-tile pilot, every tile is classified as one primitive. Mixed-primitive tiles are out of scope and will require a future `mixed` route."

---

## Strongest improvement or alternative

**Replace the model dial with a two-model contract:**

| Role | Model | Rationale |
|------|-------|-----------|
| Skeleton/geometry author | `glm-5v-turbo` (or `glm-4.6v`) | Must see reference layouts to emit spatially correct bboxes |
| First-pass visual concept | `glm-5v-turbo` | Current behavior, no change |
| Round-2 repair | `glm-5v-turbo` with audit JSON | Must see screenshot + skeleton + findings |
| Structured audit/classification | `glm-5.2` | Text-only, reasoning-heavy — this is where it shines |

The key insight: use GLM-5.2 for what it's good at (structured reasoning, audit JSON, classification) and vision models for what they're good at (spatial layout, visual repair). The current spec assigns GLM-5.2 to the one task it's documented to fail at.

---

## One thing to test before building this phase

**Validate the 10/35 split against the actual rendered tiles, not just the concept descriptions.** Specifically: watch the 5 tiles that are classified `2d-positioned` but whose concept descriptions sound linear (e.g., `favorieten-4` "popover", `een-factuur-4` "connector map"). Confirm that their actual rendered HTML uses absolute positioning and 2D coordinate placement. If any of them are actually linear-flow with a 2D *label* (because the concept description says "connector" but the implementation is a stacked list), the map is wrong and the split is wrong. One round of visual verification on the 10 `2d-positioned` tiles is the cheapest possible preflight.