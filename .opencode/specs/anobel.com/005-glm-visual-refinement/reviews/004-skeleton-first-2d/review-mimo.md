Let me read the key research files to ground my review in the actual data.Now let me check the existing 001 and 002 implementation status since this phase depends on them:Now I have enough context. Here's my rigorous second opinion:

---

## Verdict

**AGREE-WITH-CHANGES** — confidence **0.68** — The core mechanism (upstream geometry, model-as-renderer, deterministic verification) is architecturally sound and well-grounded in LaTCoder/GeoSVG-RL/LaySPA evidence, but the spec contains an unresolved A5-vs-A7 skeleton format conflict, underspecified enforcement of GLM compliance, and an optimistic effort/risk profile that could sink the phase.

---

## What GPT-5.5 got right

1. **Root cause diagnosis is precise.** The RC-1/RC-2/RC-3 ledger is hard-fact grounded (overflow=true in 8 audit rows, `position:absolute` counts, title Y-position checks). The ~41-pt gap between 2D-positioned (35-58) and linear-flow (86-94) is real and measurable.

2. **"Model-as-renderer" is the correct architectural move.** The evidence from LaTCoder, LaySPA, GeoSVG-RL, and DCGen consistently shows that plan-first + bounded-region + deterministic audit outperforms prompt-only layout. Demoting GLM to a mechanical renderer that fills visual details but doesn't own coordinates is the right framing.

3. **Adaptive escalation (best-of-3 only after failure) is well-motivated.** AdaCoder's pattern of "start cheap, test, escalate only when failure feedback proves it's needed" is the correct default. Always-on 3x generation is wasteful for tiles that pass first time.

4. **Downgrade-to-linear as the terminal failure state is correct.** Never giving GLM a third chance at coordinates and instead falling back to a known-good primitive class is the right safety net.

5. **The experiment design (iter-r3-A5.md) is rigorous.** Paired A/B, blocked randomization, blinded MiniMax audit, sentinel tiles, 7-gate adoption criteria with specific thresholds. This is proper experiment discipline.

---

## Gaps / risks / errors

### G1: A5 and A7 propose CONFLICTING skeleton formats (HIGH — will cause implementation confusion)

A5 (`iter-r2-A5.md`) proposes a **freeform skeleton JSON** where GLM receives explicit pixel boxes, anchors, and connector routes — GLM renders FROM these coordinates. A7 (`iter-r2-A7.md`) proposes a **semantic plan** (`bento_plan_v2` JSON) where GLM outputs `nodes[]` with `role` and `importance` fields, and a **deterministic renderer** maps them to fixed templates (`hub-spoke`, `matrix-3`, `stacked-rows`).

These are fundamentally different contracts:
- A5: "Here are exact pixel positions. Render them." (GLM receives geometry)
- A7: "Here are semantic nodes. Renderer computes positions." (GLM outputs semantics, renderer owns geometry)

The spec merges both as "A5 + A7" without declaring which contract wins. The skeleton-schema.json needs to be ONE of these, not both. **If you build A5's format, GLM still has to interpret pixel coordinates correctly. If you build A7's format, you need a deterministic renderer that maps semantic plans to pixel positions.** These are different engineering paths with different risk profiles.

**Recommendation:** Pick A7's semantic plan as the canonical contract (GLM outputs `bento_plan_v2`, renderer computes pixels). A5's skeleton JSON becomes the renderer's OUTPUT, not GLM's INPUT. This eliminates the risk of GLM misinterpreting pixel coordinates.

### G2: GLM contract compliance enforcement is underspecified (HIGH)

The spec says `forbid_glm_coordinate_text=true` but describes no enforcement mechanism. GLM is a language model — you can instruct it not to output `position:absolute` or `transform:` but it may comply only probabilistically. The verifier catches violations post-render, but:

- What happens when GLM emits `style="left: 40px; top: 132px"` in the HTML? The verifier flags it → FAIL#1 → best-of-3 → but the recomputed skeleton is upstream, not in GLM's output. The "recompute" is meaningless if GLM keeps ignoring the contract.
- The spec's `auditA5Geometry` checks DOM bboxes but doesn't check whether GLM injected coordinate text. There's no `grep` for `position:absolute` or `left:` in the rendered HTML as a FAIL trigger.

**Recommendation:** Add a deterministic HTML pre-check BEFORE the bbox audit: scan the rendered HTML for forbidden coordinate patterns (`position:\s*absolute`, `left:\s*\d+px`, `top:\s*\d+px`, `transform:\s*translate`). If found → immediate FAIL, no bbox audit needed. This catches GLM non-compliance cheaply.

### G3: The "best-of-3 recompute" scoring function is undefined (MEDIUM)

REQ-004 says "recompute up to 3 skeleton candidates and pick the best geometry/AABB score" but never defines the score. Is it:
- A binary pass/fail on preflight AABB checks?
- A continuous score (e.g., total overlap area + distance from anchors)?
- A composite of multiple metrics?

Without a scoring function, "best-of-3" is just "pick the one that passes preflight" — which means you might get 3 skeletons that all fail preflight, and you have no way to pick. The spec should define:
1. The scoring function (continuous, not binary)
2. What happens when all 3 fail preflight (downgrade immediately? or try 3 more?)

**Recommendation:** Define the score as: `score = (pass_preflight ? 1000 : 0) - overlap_area_px - anchor_error_px - overflow_px`. If all 3 fail, pick the highest score and send it to GLM anyway (the post-render verifier will catch it → downgrade). Don't recompute infinitely.

### G4: The 104px vs 112px title region is load-bearing and unresolved (MEDIUM)

The spec lists this as an "open question" but proceeds as if it's minor. It's not. The title region size determines:
- `diagram_max_y` (320 vs 328)
- The gap between diagram and title (24px)
- Whether Dutch description copy fits or triggers overflow
- The entire skeleton geometry for every 2D tile

A7 says 104px. A5 says 112px. The spec should resolve this BEFORE building the skeleton compute module, not after.

**Recommendation:** Measure the longest Dutch title + description pair from the 45-tile manifest using production fonts at ≥13px. If it fits in 104px, use 104px (more diagram space). If not, use 112px. This is a 30-minute measurement task that should be T000, not an open question.

### G5: Effort estimate is optimistic (MEDIUM)

Plan says 11-20 hours total, with compute-skeleton.mjs at 4-6 hours. But compute-skeleton.mjs is a **constraint solver** that must:
- Measure Dutch text (requires font metrics or canvas measurement)
- Reserve regions with hard boundaries
- Pack node/row boxes with collision avoidance under caps
- Compute connector anchor points
- Route connectors orthogonally with standoff gaps
- Validate AABB preflight

This is closer to a mini layout engine than a utility function. The LaTCoder and LaySPA papers that inform this approach took research teams weeks to build. Even in a simplified form, 4-6 hours is tight for a reliable implementation.

**Recommendation:** Budget 8-12 hours for compute-skeleton.mjs alone, 16-28 hours total. If this is too much, consider starting with a simpler version that only handles `matrix-3` and `stacked-rows` (the two most common failing treatments) and deferring `node`, `routing`, `funnel`, `popover` to a second iteration.

### G6: The downgrade module's "semantic intent preservation" is underspecified (MEDIUM)

REQ-005 says downgrade to linear-flow/stacked-list/compact-matrix with "+N more" preserving semantic intent. But:
- How does a 6-node routing diagram with 8 edges become a linear flow? Which edges are dropped? In what order?
- How does a matrix with 4 rows × 3 columns become a stacked list? Which cells are "+N more"?
- Who decides: the skeleton module or GLM?

The spec says "not crowded geometry" but doesn't define the transformation rules. If GLM decides, you're back to trusting the model for layout. If the skeleton module decides, you need a separate graph-to-linear algorithm.

**Recommendation:** The downgrade module should be deterministic, not GLM-owned. Define specific downgrade templates per treatment:
- `matrix` → `stacked-rows` (keep first 3 rows, "+N more" the rest)
- `node` → `stacked-rows` (nodes become rows, edges become a count)
- `routing` → `linear-flow` (keep source→destination, drop intermediate nodes)
- `funnel` → `stacked-rows` (stages become rows with percentages)

### G7: Interaction with phase 001's repair pass is undefined (LOW-MEDIUM)

Phase 001 has its own "one failure-only repair pass" that operates on all tiles. Phase 004 has best-of-3 + downgrade for 2D tiles. What happens when:
1. Phase 001's gate fails a 2D tile → triggers 001's repair
2. 001's repair produces a new HTML → 004's verifier runs
3. 004's verifier fails → triggers best-of-3 skeleton recompute
4. Best-of-3 produces a new skeleton → GLM renders → 004's verifier runs again

Is this the intended flow? Or should 001's repair be bypassed for 2D tiles (since 004 handles them)?

**Recommendation:** For tiles routed as `2d_positioned`, bypass 001's repair pass entirely. 004's best-of-3 + downgrade is the complete failure-handling path for 2D tiles. Running both repair paths creates unpredictable interactions.

### G8: Statistical power of 3 replicates is questionable (LOW)

The experiment design uses 3 replicates per tile per arm. The primary metric is SHIP rate (binary pass/fail per tile). With 45 tiles × 3 reps = 135 observations per arm, and a baseline SHIP rate of 60%, detecting a +10pp improvement (to 70%) requires approximately:
- Effect size: 0.10
- Alpha: 0.05 (one-sided)
- Power: 0.80
- Required n per arm: ~170 (for a two-proportion z-test)

135 per arm is underpowered for the claimed +10pp lift at standard significance. The cluster bootstrap with paired design helps, but 3 replicates per tile gives limited within-tile variance information.

**Recommendation:** Either increase to 5 replicates (225 per arm, sufficient power) or accept that the experiment is exploratory and the decision rule should use wider CI bounds (e.g., 80% CI instead of 90% CI).

---

## Strongest improvement or alternative

**Implement A7's semantic plan format as the GLM contract, and build the deterministic renderer as the skeleton compute module's output consumer.**

The single highest-value change is resolving G1. Instead of giving GLM a skeleton with pixel coordinates (A5's approach), have GLM output a `bento_plan_v2` JSON (A7's approach), then run a deterministic renderer that maps the semantic plan to pixel positions. This:
1. Eliminates the risk of GLM misinterpreting pixel coordinates
2. Makes the skeleton compute module a pure function (plan → pixels) with no GLM involvement
3. Enables the renderer to be template-based (one template per layout mode), which is simpler than a general constraint solver
4. Matches the existing research evidence (LaTCoder, LaySPA, GeoSVG-RL all use semantic plans, not pixel coordinates)

The skeleton compute module becomes: `bento_plan_v2 → layout template → pixel positions → AABB validation → skeleton JSON`. GLM never sees pixel coordinates at all.

---

## One thing to test before building this phase

**Before writing any code, run GLM-5.2 with the A5 skeleton JSON prompt on the 5 weakest tiles (accountbeheer-4, orders-facturen-4, goedkeuringssysteem-4, oci-4, aangepast-assortiment-3) and check whether GLM actually renders from the skeleton or ignores it.**

This is a 2-hour experiment that tests the core assumption: will GLM obey a skeleton contract? If GLM ignores the skeleton and invents coordinates anyway (which IFScale research suggests is likely for dense instruction sets), the entire phase needs to pivot to A7's semantic plan approach where GLM outputs semantics and a renderer owns all geometry. If GLM obeys, the A5 approach is viable and you can proceed as specified.

Do not invest 11-20 hours building a geometry kernel before confirming GLM will use it.