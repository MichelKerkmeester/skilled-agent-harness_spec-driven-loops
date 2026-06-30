## Verdict
**AGREE-WITH-CHANGES** — confidence 0.75 — the measurement framing is correct, but the phase over-commits to optimistic lift targets and leaves the most load-bearing gate (MiniMax) unvalidated.

## What GPT-5.5 got right
- Correctly identifies that the program is unproven without an end-to-end re-run on the same 45 tiles.
- The five-sub-gate adoption gate, downgrade-inflation tags, and linear no-regression checks are the right controls.
- Demoting contrast exit-0 from headline to sub-metric is sound, given it's near-tautological for a hard contrast gate.
- Cost accounting and paired per-tile deltas address the biggest measurement risks.

## Gaps / risks / errors
- **Over-optimistic success criteria.** SC-001 targets 80–91% SHIP and SC-002 targets an 8–20 pt diagram-vs-linear delta, but the research itself warns "Treat the predicted lift as a hypothesis, not a forecast." The phase should treat these as exploratory bands, not pass/fail gates.
- **MiniMax hard-gate contradiction.** REQ-001 makes MiniMax status a hard ship requirement, while the open questions ask whether MiniMax should run on every tile or failure-only, given "unproven precision against human labels." You cannot both hard-gate on it and admit it is unvalidated.
- **"Keep-prior" is underspecified.** For the 18 baseline non-SHIP tiles, there is no reliable "prior best render." The edge case says "Tile with no prior best render: a gate block records a new fail," which means the adoption gate will mechanically block many of the exact tiles the pipeline is supposed to recover.
- **Cost ceiling ignores skeleton/GPT-5.5 overhead.** NFR-P01 cites ≤63 GLM calls for "A1 + gate + one-repair," but the full pipeline includes best-of-3 skeleton recomputation (step 8) and GPT-5.5 escalation (step 10). The cost model is not closed.
- **Baseline comparability is fragile.** The spec locks the numeric baseline (27/45, 81.1 mean) but not the audit gate version. If phase 001's `audit-concept.sh` evolves during 001–005, paired deltas become invalid.
- **Statistical power is unaddressed.** With n=45, one tile = 2.2 percentage points. The success criteria ignore confidence intervals; a 36/45 vs 27/45 difference needs a test, not just a count.
- **"Validated" predecessors are undefined.** The Definition of Ready says phases 001–005 must be "shipped and pass `validate.sh --recursive`," but the phase itself notes 001–005 are currently "planning only, no code yet." This is a sequencing gap.

## Strongest improvement or alternative
**Remove MiniMax from the hard adoption gate until it is calibrated against human labels.** Run a stratified calibration on ~15 tiles first, then either (a) keep it as a hard gate with measured precision/recall, or (b) use it as a shadow diagnostic while the deterministic geometry/contrast/casing/palette gates govern ship/keep/downgrade. This is higher-leverage than building around an unvalidated auditor.

## One thing to test or verify before building this phase
**Calibrate the deterministic sub-gates against human SHIP/NO-SHIP labels on a stratified sample** (linear winners, known 2D failures, borderline contrast/casing cases) before running the full batch. If geometry/contrast gates disagree with human labels, the entire lift metric is uninterpretable.