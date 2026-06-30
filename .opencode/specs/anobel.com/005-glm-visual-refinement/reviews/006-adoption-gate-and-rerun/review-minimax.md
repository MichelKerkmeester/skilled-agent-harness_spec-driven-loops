## Verdict
**AGREE-WITH-CHANGES** — 0.78 — the phase is necessary and directionally correct, but the central success metric (the ADOPT/ITERATE/REJECT rule) is left as an open question, the cost ceiling undercounts skeleton recompute + GPT-5.5 escalation, and a hard internal contradiction between the MiniMax-status gate requirement and the failure-only NFR will mass-block linear winners if left unresolved.

## What GPT-5.5 got right
- The phase structure is right: pure-function adoption gate + sequential driver + stateless metrics computer + idempotent JSONL ledger — clean separation of concerns.
- The risk table is honest about the real failure modes (downgrade inflation, MiniMax noise, latency tail, validator overfit) and the `recovered-2D` vs `downgraded-to-linear` tagging in REQ-005 is the right countermeasure against pass-rate inflation.
- Reusing `gen-tile.mjs` + the phase-001 audit gate keeps the run comparable to the 004 baseline.
- Conservative gate ordering (geometry → contrast → casing/glyph → palette → MiniMax-status) is a reasonable defensive ordering; "keep prior best" is the correct fallback when the gate fails.
- Acknowledging in SC-003 that contrast exit-0 is near-tautological shows the author understands the metric is a check, not a target.
- Idempotent per-tile resume (NFR-R02) and the "transient-fail" exclusion from the quality denominator (NFR-R01) are sound measurement practice.

## Gaps / risks / errors (specific)
1. **Decision rule is an open question, not a requirement.** REQ-007 says "exactly one recommendation tied to the decision rule thresholds in `checklist.md`" — but those thresholds are not in spec/plan. §10 still lists "if SHIP hits 80% only via downgrades, ADOPT or ITERATE?" as **OPEN**. Without a pre-registered rule, the run is interpretive, not measured — the team can rationalize any outcome as ADOPT. This is exactly the kind of failure mode **RC-7 (slop)** will not be caught by, so a defaulted-ADOPT would silently regress the program.
2. **Cost ceiling of ≤63 GLM calls undercounts the full pipeline.** The 63 = 45 first-pass + 18 repair math ignores step 8 (best-of-3 skeleton recompute) and phase 005 (GPT-5.5 escalation). If 2D-positioned tiles = ~22 and each runs best-of-3 skeletons + 1 render, that is ~66+ skeleton calls alone, before GLM renders. Realistic ceiling is 120-200 GLM calls + 5-15 GPT-5.5 + 20-40 MiniMax paid calls. REQ-004 acceptance is non-falsifiable as written.
3. **Internal contradiction: MiniMax-status required by gate vs. failure-only by NFR-P02.** REQ-001 says ship only if "MiniMax status" passes. NFR-P02 says "Paid escalation fires failure-only, never on linear winners." If linear winners have no MiniMax audit → status=`unknown` → per the edge-case "Tile passing geometry but with `MiniMax status = unknown`: gate blocks ship" → all linear winners are now blocked. This contradicts REQ-006 (linear no-regression) and inflates the denominator of tiles needing paid audits (and cost).
4. **`recovered-2D` is defined as "passed the gate," not "passed the gate at acceptable quality."** A tile can pass geometry/contrast/casing but still be visually mediocre (**RC-7 slop**). Without a human-labeled quality floor or a MiniMax-M3 score threshold (e.g., `taste_score ≥ 7/10`), "recovered" becomes a label that includes bland-but-valid output. The pass-rate is not the same as recovered-quality.
5. **Linear no-regression threshold of "≥90% passing" is too permissive.** With ~18 linear winners, 90% = 16.2 tiles, so 1-2 regressions are within tolerance. Combined with "semantically equivalent" being undefined, this lets the run adopt while degrading 1-2 strong tiles — the exact opposite of the program's "don't break what works" premise.
6. **No abort criteria or pre-registered rollback thresholds.** The plan's rollback section says "REJECT or ITERATE" but does not define what triggers aborting mid-batch (e.g., MiniMax API down >30 min, >3 transient failures, audit gate returning 0% pass rate suggesting harness regression, or any **RC-4** casing/glyph regression on locked fields).
7. **Baseline confound: "frozen baseline" is not apples-to-apples.** The 27/45 = 60% is from the 004 run with the **original** prompt/harness. The re-run uses the new 001-005 pipeline. Measured lift conflates "new pipeline" with "new gates" — you cannot attribute lift to A1/A3/A4/A5 without also re-running the original harness on the same 45 tiles. Paired deltas assume the baseline was produced by a comparable process; it was not.
8. **JSONL ledger schema is not specified.** REQ-002 says "45 per-tile records produced, each with final verdict, audit score, and gate flags" — but the field set, types, and serialization format (e.g., `primitive_label`, `sub_gate_verdicts{}`, `paid_call_count`, `wall_clock_ms`, `downgrade_path`, `MiniMax_score`) are not in the spec. This is a Level 2 spec — schema should be explicit, not deferred to implementation, especially because paired deltas depend on common field structure.
9. **The 90s median wall-clock target is unvalidated for the full pipeline.** Current observation is avg ~26s for a single render. The full pipeline (contract + gate + repair + skeleton + possible escalation) is plausibly 60-180s per tile. The plan does not state the action if the target is missed, nor does it state the P99 budget for tail handling.
10. **Human spot-check has no protocol.** §L2 testing says "human spot-check of accepted tiles for **RC-7** slop" — but the sample size, sampling method (random vs stratified across recovered/downgraded/improved-linear), raters (1? 2? calibrated?), and the action triggered by spot-check findings are all undefined. Without a protocol, the spot-check is performative.

## Strongest improvement or alternative
**Pre-register the ADOPT/ITERATE/REJECT decision rule as a typed function in spec.md REQ-007 (not in checklist.md), with explicit thresholds and tie-breakers, BEFORE the re-run starts.** Concretely:

```
ADOPT iff:
  SHIP >= 80% (36/45)
  AND diagram-vs-linear delta <= 20 pts
  AND recovered-2D >= 50% of previously-failing 2D tiles
  AND linear no-regression = 100% (not 90%)
  AND zero locked-field regressions (RC-4)

ITERATE iff:
  60% <= SHIP < 80%
  OR recovered-2D < 50% of previously-failing 2D
  OR 95% <= linear no-regression < 100%
  OR MiniMax-status = unknown on >2 tiles

REJECT iff:
  SHIP < 60%
  OR linear no-regression < 95%
  OR any RC-4 regression on locked fields
  OR transient-fail rate > 2/45
```

This must be in spec.md REQ-007 acceptance criteria, removed from §10 open questions, and linked from a checklist item marked `[x]` before the batch starts. Without it, the run is interpretive. With it, the run is falsifiable — and the team cannot move the goalposts after seeing results.

## One thing to test or verify before building this phase
**Run a 5-tile calibration pilot on stratified samples (1 known linear winner, 2 known 2D failures, 1 borderline contrast, 1 with casing issue from **RC-4**) and compute (a) gate-vs-human-label agreement, (b) MiniMax-vs-human agreement on taste/slop, (c) actual wall-clock per stage including skeleton recompute, (d) the rate of `MiniMax status = unknown` if failure-only is enforced.** This is the cheapest way to validate gate precision, surface the MiniMax contradiction in gap #3, and confirm the cost model in gap #2. The plan lists calibration as Phase 3 verification — it should be **Phase 1, gated before driver implementation**: if gate-vs-human agreement is <80% on the 5-tile pilot, the gate logic needs revision before the 45-tile batch is even scheduled. Also confirm whether the original 004 harness can be re-run on the same 45 tiles to disambiguate the baseline confound (gap #7) — if it can, that re-run should be scheduled first as the control arm.