## Verdict

**AGREE-WITH-CHANGES** — confidence **0.72** — The architecture (compact contract → deterministic gate → one repair pass) is sound and the root-cause mapping is rigorous, but the SHIP prediction is over-optimistic by ~5-10pp and the proposal skips a cheap validation step that could de-risk the entire experiment.

---

## What GPT-5.5 got right

1. **Replace-diffuse-prose strategy is correct.** The research (IFScale, LaTCoder) shows instruction density degrades GLM compliance. Replacing ~800 tokens of scattered layout rules with ~350-450 tokens of compact spatial contract is the right direction. The contract is load-bearing and short.

2. **Deterministic gate as authority, not model self-report.** The preflight JSON is self-reported by GLM — untrustworthy by design. Making the gate the acceptance authority (not the preflight) is the single most important architectural decision. This is Goodhart-resistant.

3. **Single repair pass constraint.** Unbounded iteration loops are the classic failure mode of LLM repair pipelines. One repair + one re-gate is the correct ceiling for a first experiment.

4. **Failure JSON as measurement surface.** Creating a stable schema consumed by phases 002-006 is the right way to sequence work. This phase produces data, not just a fix.

5. **RC-1..5 mapping to gate checks.** Each of the 6 gate checks maps to a specific RC-id. This is auditable and verifiable. No orphan checks, no uncovered RCs.

6. **Arm-based A/B design.** Three arms (C0, T1, T2) cleanly decompose: does the prompt alone lift? Does gate+repair add? This is proper experiment design.

---

## Gaps / risks / errors

### Gap 1: SHIP prediction is over-optimistic (SC-001)

The spec predicts 34-37/45 = 76-82% SHIP. The math doesn't hold:

- The 18 non-SHIP tiles include both **layout failures** (RC-1..5, fixable by this phase) and **diagram complexity failures** (2D positioning, NOT fixable by this phase — that's phases 004-005).
- Linearizing diagram tiles (cap 3 rows/nodes) doesn't produce a good tile — it produces a truncated tile. A matrix with 6 rows showing only 3 + "+3 more" might score 55-65, still below SHIP.
- The 41pt gap (35-58 for diagrams vs 86-94 for linear) won't narrow to 15-22pts by capping rows. The cap reduces overflow but also reduces information density, which the audit likely penalizes.
- **Realistic prediction: 30-34/45 = 67-76%** (a 7-16pp lift, not 16-22pp). The gate catches RC-1..5 mechanically, but the linearized diagram tiles still underperform on aesthetics/information.

**Fix:** Add a "predicted per-tile band" table in the spec that breaks down which tiles are expected to lift by how much, and why. Don't aggregate to a single SHIP number.

### Gap 2: No gate validation on existing baseline

The proposal jumps straight to a full 45-tile regeneration experiment. But the gate's 6 checks have never been run against the existing 45 tiles. This is a **2-hour validation step** that could save 10+ hours:

1. Run the gate on the existing 45 baseline tiles (no GLM calls).
2. Measure: does the gate flag accountbeheer-4, oci-4, goedkeuringssysteem-4? Does it pass accountbeheer-5, kwartaalcijfers-2?
3. If the gate has low recall (misses known-bad tiles) or low precision (flags known-good tiles), the gate checks need revision BEFORE the experiment.

**Fix:** Add a Phase 0 "gate validation" step: run the gate on the 45 existing tiles, report precision/recall against the known RC-1..5 failures. If recall < 80%, revise checks before proceeding.

### Gap 3: Repair regression risk is unaddressed

The spec says: "fails twice = no second repair; record the residual failure JSON and keep the best-scoring pass." But it doesn't define "best-scoring pass." If the repair introduces a NEW failure (different from the original), which failure JSON is "better"? The spec needs:

- A repair must not introduce new gate failures that weren't present in the original.
- If the re-gated repair has new failures, discard the repair and keep the original.
- "Best-scoring pass" should be defined as: fewer gate failures, then higher contrast min, then original preferred.

### Gap 4: No T1 success metric (prompt-only arm)

SC-001 defines success for T2 (prompt + gate + repair = 76-82%), but there's no success metric for T1 (prompt only). What if T1 lifts to 70%? That means the prompt contract alone is doing most of the work and the gate+repair adds only 6pp — not worth the Playwright dependency. What if T1 doesn't lift at all? That means the contract is being dropped under instruction load (the original problem).

**Fix:** Define a T1 success band: "T1 lifts to ≥67% (30/45) validates the prompt contract. T1 <63% (28/45) means the contract is being dropped and the gate is load-bearing."

### Gap 5: 45 tiles / 3 arms = 15 tiles per arm — underpowered

15 tiles per arm is too few for statistical significance. A 5pp SHIP difference (60% → 65%) on 15 tiles = 0.75 tiles = noise. The proposal doesn't address experimental power.

**Fix:** Either (a) run each arm twice (30 tiles per arm) for stability, or (b) define the experiment as "directional signal, not statistical proof" and set the adoption threshold in phase 006 accordingly.

### Risk 1: data-a1-role attribute reliability

The gate uses `data-a1-role` attributes to target elements for bbox checks. But GLM generates HTML from text prompts. If the contract says "add data-a1-role='visual' to the visual panel div," GLM might:

- Forget the attribute entirely (instruction density problem — the original root cause)
- Add it to the wrong element
- Add it correctly but change the element's styling

If `data-a1-role` is unreliable, the gate must fall back to CSS selector/position heuristics (e.g., "the div with background-color: navy and height: 304px is the visual panel"). This fallback is harder to implement but more robust.

**Fix:** The gate should have a fallback targeting strategy: try `data-a1-role` first, fall back to CSS selector heuristics. Document both paths.

### Risk 2: Headless bbox fragility

Playwright/Puppeteer bbox measurements on inline-styled HTML are flaky:

- Font rendering differs between headless Chrome versions (subpixel rounding)
- The title band boundary is y=356..456 — a 2px rendering difference could flip pass/fail
- CSS `overflow: hidden` on the tile container could clip elements before they're measured
- The gate's 6 checks are ALL bbox-based, so rendering fragility propagates to every check

**Fix:** Add a tolerance band (±3px) to the gate's bbox checks. Document the tolerance in the failure JSON schema. Run the gate twice on the same tile and confirm deterministic results (NFR-C01).

### Risk 3: Contract inflates prompt past IFScale cliff

The spec says the contract "replaces" diffuse prose, but doesn't quantify the net token delta. If the existing layout prose is 400 tokens and the new contract is 450 tokens, that's a net +50 tokens — possibly past the IFScale cliff. If the existing prose is 800 tokens, the net is -350 tokens — well within bounds.

**Fix:** Measure the existing `contract()` function's token count in `gen-tile.mjs` before implementing. The net delta must be ≤ 0 tokens (replacement, not addition). If the existing prose is shorter than the new contract, the contract must be trimmed.

### Error 1: Geometry mismatch between A1 research and spec

The A1 research specifies geometry for a 480x480 tile: `x=24..456, y=24..328, title y=352..456`. The spec adapts to 560x480: `x=30..530, y=30..328, title y=356..456`. The Y coordinates are preserved but X is adjusted. However:

- The visual panel width changes from 432px (480-24-24) to 500px (560-30-30). That's a 16% width increase. Does this affect the primitive caps? A matrix with 3 rows at 432px width looks different than at 500px width. The spec doesn't address this.
- The title band height changes from 104px (456-352) to 100px (456-356). That's a 4px reduction. Does this affect the title/description layout? The spec doesn't address this.

**Fix:** Document the geometry adaptation rationale and confirm the caps are still appropriate at 500px visual width.

---

## Strongest improvement or alternative

**Add a Phase 0: gate validation on existing baseline.**

Before any GLM regeneration, run the proposed gate on the 45 existing tiles. This is a 2-hour, zero-cost step that:

1. Validates gate recall: does it flag the 5 known-bad tiles (accountbeheer-4, orders-facturen-4, goedkeuringssysteem-4, oci-4, aangepast-assortiment-3)?
2. Validates gate precision: does it pass the 5 known-good tiles (kwartaalcijfers-2, accountbeheer-5, een-factuur-5, accountbeheer-1, orders-facturen-1)?
3. Produces the baseline failure JSON that phases 002-006 can diff against.
4. If recall < 80% or precision < 90%, the gate checks need revision before the experiment — saving 10+ hours of wasted GLM calls.

This is the highest-ROI change because it de-risks the entire experiment at near-zero cost. The gate is the load-bearing surface; validate it before building on it.

---

## One thing to test or verify before building this phase

**Run the gate on the existing 45 baseline tiles and report the confusion matrix.**

If the gate correctly flags ≥4/5 known-bad tiles and correctly passes ≥4/5 known-good tiles, the gate checks are well-calibrated and the experiment can proceed. If not, the gate needs revision and the experiment would be premature.

This is a 2-hour smoke test that determines whether the entire phase is built on a solid foundation or on an untested assumption about what the gate can detect.