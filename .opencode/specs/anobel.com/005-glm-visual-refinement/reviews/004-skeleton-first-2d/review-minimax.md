## Verdict
**AGREE-WITH-CHANGES** — confidence 0.78. The geometry-kernel direction is correct and the 5-stage pipeline (preflight → render → verify → best-of-3 → downgrade) is sound. But the spec hides three load-bearing ambiguities that will block implementation or invalidate the predicted +15-pt lift if unresolved.

## What GPT-5.5 got right
- **Root-cause framing is honest**: RC-1/RC-2/RC-3 are hard-fact, geometry-checkable defects, not taste — and the citation of "direct LLM numerical positioning → out-of-boundary errors" matches a known LLM failure mode.
- **"Model as renderer" pattern is the right abstraction** for this defect class — LaySPA/LaTCoder/GeoSVG-RL/AdaCoder are legitimate analogues.
- **Best-of-3 → downgrade is a sane failure policy** — gives the model one retry on geometry without burning three GLM calls.
- **REQ-007 (linear-flow negative control)** is correctly identified as the regression canary.
- **Rollback via `A5_ARM=control`** is the right shape even if Phase 001 isn't built yet.

## Gaps / risks / errors

**CRITICAL — would block implementation**

1. **A5 and A7 disagree on the title region**: A5 reserves `y=344, h=112` (diagram_max_y=320); A7 reserves `y=352, h=104` (visual end ≤328, baseline ≥368). That's an **8-32 px conflict** that determines every other constraint. The spec punts this to "Open Questions" but `compute-skeleton.mjs` cannot be written without locking it. **Resolution:** pick one, measure Dutch copy on the prod font *before* writing skeleton code, then freeze.

2. **Two different architectures are stitched together.** A5 says "GLM receives the skeleton as canonical geometry… may not invent x/y/w/h" → GLM still emits HTML, just constrained. A7 says GLM emits a semantic plan (`bento_plan_v2`) and a separate deterministic **Renderer** computes all bboxes from templates. These are different code paths:
   - A5 path: `skeleton JSON → GLM(HTML) → browser` (GLM in the loop; needs `forbid_glm_coordinate_text` regex)
   - A7 path: `bento_plan_v2 → GLM(plan) → deterministic Renderer → HTML` (GLM out of the loop; needs 5 specialized renderers per `tile_type`)
   
   The spec.md reads as A5 but the A7 render-mapping paragraph is included as if it were the same thing. Pick one. The A7 path is more deterministic and harder to break; the A5 path is faster to build but relies on GLM compliance with negative constraints.

3. **Best-of-3 search space is undefined.** "Recompute up to 3 skeleton candidates" — but what varies between candidates? The inputs (Dutch copy + tile type) are deterministic. If the variation is just spacing tweaks, all three candidates fail AABB for the same reason (5th matrix row still doesn't fit). AdaCoder/LaTCoder vary decomposition strategy, not micro-geometry. **Required:** name the axes (e.g., row-height ∈ {compact, default, generous}, node-order permutations, legend on/off) and prove candidate diversity ≠ noise.

**HIGH — material risk to the +15-pt lift claim**

4. **The five treatments are not one geometry.** Matrix = grid (works with the proposed skeleton). Node/hub-spoke = polar around center (needs anchor angles). Routing = graph with edge crossings (needs orthogonal router, not AABB). Funnel = trapezoidal/contracting (the box schema can't represent sloped edges). Popover = z-stacked overlay (needs z-index, not in the schema). One `nodes[]/connectors[]` schema is matrix-shaped; you'll ship a special case for each non-matrix treatment or fail them. **Either** branch the schema by `layout_mode` (linear-flow | hub-spoke | matrix-3 | stacked-rows | mini-map | linearized — A7 already lists these) **or** explicitly accept that funnel/popover downgrades will be common and lower the SC-004 threshold.

5. **`forbid_glm_coordinate_text` is harder than it looks.** False positives on `width: 100%`, `flex: 1`, `padding: 24px` (legitimate), and `transform: translate(-50%, -50%)` (centering pattern) will trigger spurious FAILs and inflate the downgrade rate. You need an allow-list of "permitted numeric CSS" vs a deny-list of "forbidden layout CSS" — and the boundary is fuzzy. **Pilot this regex on 5 existing tiles before building the rest.**

6. **No validation that GLM-5.2 actually obeys the negative constraint.** The whole pipeline assumes GLM, when told "do not invent x/y/w/h," will comply. This is an empirical question. A 5-tile pilot with *only* the prompt constraint (no skeleton) would measure compliance in <1 hour and either validate or kill the architecture before any skeleton code is written.

7. **SC-001 target band 65-82 is optimistic against the design-audit anti-slop tax.** Deterministic skeletons will likely improve geometry scores but introduce a *new* defect class — "templated feel" — that blind auditors (MiniMax-M3) dock for. The current 35-58 scores likely bundle geometry + taste defects; geometry-only fixes may yield only +8-12 pts, not +15. **Confidence on +15-pt hit: I'd put it at 35-50%, not "predicted."** Recommend SC-001 floor at +8 pts (target band 55-70) with +15 as a stretch.

**MEDIUM**

8. **Auto-linearize (compute time: `nodes>5 / rows>3 / edges>6`) and runtime downgrade (FAIL#2) are two different downgrade mechanisms** with no defined relationship. Which fires first? If both, what's the SC-004 denominator — runtime downgrades only, or both? Spec is silent.

9. **Cost claim is implausible.** NFR-P01: "−100 to +400 tokens." The skeleton JSON example is ~80 lines / ~700-900 tokens serialised. To net −100 you'd need GLM to save >800 output tokens, which it won't because it's still writing HTML. Realistic: +400 to +900 input tokens per 2D tile. Cost-per-tile rises.

10. **Ship-gate thresholds undefined.** `text_padding_violation_count > 0` fails? `connector_anchor_error_count > 2` fails? `node_collision_count > 1` fails? Without thresholds the ship-gate is a vibe-check. Name them in REQ-006.

11. **"Preserve semantic intent via '+N more'" is unspecified.** What renders "+N more" — a button, a pill, a counter? Where in the skeleton does it sit? If the original 2D tile had 6 categories and you show 4 + "+2 more", the maritime client notices the truncation. Plan needs a renderable spec for the affordance, not a phrase.

12. **Rollback depends on Phase 001 (`Red - not built`).** `A5_ARM=control` reverts to "001 prompt+gate behavior" but 001 doesn't exist. Define rollback as "revert to current single-shot GLM prompt" (pre-001 behavior) until 001 ships, then upgrade.

13. **Best-of-3 wall-clock is under-counted.** Each candidate needs a browser render to verify, so 1 verifier failure = 3 skeleton computes + 3 renders + best-pick. That's ~3-6s extra per failed tile, not the "no extra GLM call" framing implies. Acceptable, but state it.

14. **The "deterministic templates reduce visual variety" risk is rated Low; for a B2B maritime dashboard this is High.** Maritime clients pay for "designed" feel; five matrix tiles on one dashboard all using the same skeleton look mass-produced. The mitigation ("vary semantic emphasis, color token") is content variety, not visual variety. Add: per-treatment layout-variant pool (≥3 variants per `tile_type`), selected by seed from `tile_id`.

## Strongest improvement or alternative

**Make Phase 1 a 5-tile compliance pilot before writing skeleton code.** Pick `accountbeheer-4 (35), oci-4 (58), goedkeuringssysteem-4 (55), orders-facturen-4 (52), aangepast-assortiment-3 (58)`. For each:
1. Hand-author a reference skeleton (one per treatment).
2. Inject it into the current `buildCurrentPrompt` with the `glm_rules` block from A5.
3. Run GLM, render in browser, measure with `_audit.mjs`.
4. Score: did GLM comply with the negative constraint? Did score improve? How much?

This single pilot (~2-3 hours) answers questions 2, 5, 6, and 7 above and either (a) validates the architecture and you build skeleton automation with confidence, or (b) reveals GLM-5.2 ignores the skeleton and you save weeks by pivoting to the A7 pure-renderer path. It also produces the first concrete data point for the lift prediction, replacing the current "predicted +15 pts" with a measured number.

## One thing to test or verify before building this phase

**Resolve the title-region constant (104 vs 112) against measured production Dutch copy, then re-pilot 3 tiles with a hand-authored skeleton before automating.** Two things must be true to ship this phase:
1. The reserved title region is empirically correct on the prod font for the longest current Dutch title + 1-line description.
2. GLM-5.2 follows a negative prompt constraint (`forbid_glm_coordinate_text`) at least 70% of the time on 2D tiles.

If either fails, the pipeline architecture must change (likely to A7's pure renderer path), and that's cheaper to discover now than after 700 LOC of skeleton code.