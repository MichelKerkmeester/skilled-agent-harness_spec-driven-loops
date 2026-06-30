## Verdict
**AGREE-WITH-CHANGES** — confidence 0.72 — the phase is directionally correct but the gate AND the re-run design conflate "pipeline improvement" with "gate strictness," making the measured lift uninterpretable without a counterfactual.

## What GPT-5.5 got right
- The tagging scheme (`recovered-2D` / `downgraded-to-linear` / `improved-linear`) correctly guards against downgrade-inflation masking the true quality picture.
- Paired per-tile deltas (vs. independent angle-summing) is the right statistical discipline for n=45.
- The risk table in 004/iter-r4-risk.md naming over-optimism, validator overfit, and latency bias is thorough and honest.
- Acknowledging contrast exit-0 as near-tautological for a hard contrast gate shows self-awareness.

## Gaps / risks / errors

1. **The gate IS the result (confound)**. A five-sub-gate AND with `ship / keep-prior / downgrade` doesn't just *measure* the pipeline — it *determines* the SHIP rate. If a tile passes 001-005 beautifully but fails MiniMax taste, it's blocked. If a tile is slop but passes all five, it ships. Without running the same 45 tiles through a *loose gate* (e.g., geometry + contrast only) as a counterfactual, you cannot attribute any lift to the pipeline vs. the gate itself. The spec treats these as separable — they aren't.

2. **"Keep-prior" is undefined for the first re-run**. If a tile has no prior best render (which is the state before this phase runs), the edge-case spec says "record a new fail" — but then how is that scored? Excluded from the denominator? Counted as a failure? This ambiguity alone can swing SHIP by 2-4 tiles (~5-9 pts).

3. **The re-run reuses the development set**. All 45 tiles were used to diagnose RCs, tune the pipeline, and calibrate expectations. Running them again is training-on-test. The predicted-lift table reflects this — there's no holdout to bound overfit. A minimum fix: split 5-8 tiles as a held-out mini-batch before running the full 45, and compare the delta.

4. **MiniMax has veto power with unproven precision**. The open question about MiniMax running on every accepted tile is buried — but in the gate design, MiniMax status = unknown blocks ship (conservative). That means *every* MiniMax timeout or dispatch failure becomes a keep-prior/downgrade, inflating the apparent failure rate. The spec says "tolerate ~1/45 transient" but doesn't account for MiniMax failures *after* all deterministic gates pass — those tiles look like pipeline failures but are instrumentation failures.

5. **Linear no-regression "semantically equivalent" comparator doesn't exist**. REQ-006 requires linear winners remain semantically equivalent, but there is no defined, tested mechanism for comparing tile semantics. Without it, the regression check is an eyeball promise, not a gate.

6. **Cost ceiling is stated but unenforced**. The plan says 63 GLM calls for the A1+gate+one-repair path and paid calls "bounded and reported" — but there's no actual ceiling-break logic in the driver, no per-tile cost abort, and the latency tail policy ("allow 3-6 min before marking fail") was observed at 161s max in the local GLM profile. A tile that hits 161s on GLM then escalates to GPT-5.5 could breach 4+ minutes.

## Strongest improvement or alternative

**Add a gate-configuration ablation to the re-run.** Instead of running the re-run once with the full five-sub-gate AND, run the same 45-tile pass through 2-3 gate configurations in parallel (from a single pipeline output set):

| Gate config | What it measures |
|---|---|
| Geometry + contrast only (loose) | How much the pipeline actually improved rendering quality |
| Geometry + contrast + casing/glyph + palette (no MiniMax) | The deterministic-pipeline contribution, isolated from paid-auditor noise |
| All five (full) | The program as designed |

The difference between the loose gate and the full gate is the *gate tax* — the quality you sacrificed to strictness. This turns an uninterpretable single SHIP number into a diagnostic panel, costs nothing extra in API calls (same renders, different verdicts), and directly answers the open question about whether MiniMax should be a gate or a shadow audit.

## One thing to test or verify before building this phase

**Run the five-sub-gate truth table on 3-5 hand-labeled tiles (a known winner, a known failure, a borderline contrast case, and one where MiniMax and deterministic gates disagree) BEFORE wiring the full adoption gate.** This exposes whether the gate is actually distinguishing quality or just adding noise. If MiniMax disagrees with deterministic gates on a tile a human considers decent, the gate design needs revisiting before it's baked into the re-run.