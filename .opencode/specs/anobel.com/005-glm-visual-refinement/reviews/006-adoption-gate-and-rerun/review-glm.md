## Verdict
AGREE-WITH-CHANGES — confidence 0.72 — the adoption-gate + measured re-run is the correct final phase and the engineering is sound, but the design conflates "gate-passing" with "adoption-worthy," and that conflation is exactly the failure mode (downgrade inflation / validator overfit) the phase claims to guard against.

## What GPT-5.5 got right
- **Gate location is correct.** Step 11 belongs at the end as a per-tile AND over deterministic sub-gates; it is cheap, pure, and resumable. Putting human/MiniMax taste as one sub-gate (not a separate oracle) is the right shape.
- **Downgrade-inflation guard (REQ-005) is the single most valuable requirement in the spec.** Tagging `recovered-2D` / `downgraded-to-linear` / `improved-linear` is the only thing that makes the headline SHIP rate honest. This is non-trivial and GPT-5.5 named it explicitly — credit where due.
- **Paired tile-level deltas (REQ-003, risk row "Over-optimism on n=45").** Refusing to sum A1/A3/A4/A5 independently is correct and rare; most plans silently stack predicted lifts. Good.
- **Idempotent/resumable JSONL ledger + `transient-fail` exclusion (NFR-R01/R02).** Correctly handles the ~1/45 dispatch tail without biasing the quality denominator.
- **Contrast exit-0 demotion (open question 1).** Correctly identifying a hard-gate sub-metric as near-tautological is a sharp call; SC-003 reflects it.
- **Measurement-only blast radius.** Writes confined to `research/rerun/`; rollback = don't adopt. Risk/scope ratio is genuinely Low.

## Gaps / risks / errors

1. **The headline SC (SHIP 80-84%) is not adoption-worthy on its own — but the decision rule that maps metrics → ADOPT is deferred to `checklist.md`, which I wasn't given.** The two open questions ("SHIP 80% via downgrades only — ADOPT or ITERATE?", "MiniMax on every accepted tile or failure-only?") are not open — they *are* the adoption decision, and they must be answered in `spec.md` §5 Success Criteria with explicit thresholds, not punted to a doc this review doesn't cover. A gate that can't decide ADOPT is a measurement phase, not an adoption gate. (RC-7, RC-2)

2. **The adoption gate has no "quality floor" sub-gate — only correctness sub-gates.** Geometry/contrast/casing/palette/MiniMax-status all measure *defects*, none measure *richness*. A tile that downgrades from a routing-diagram to `stacked-list` with `+N more` passes every sub-gate and ships. This means the gate structurally rewards the downgrade path. REQ-005 tags it after the fact, but tagging ≠ gating. The decision function's type should be `ship | keep-prior | downgrade` where `downgrade` is *scored lower than a prior 2D ship*, not treated as equivalent pass-rate. As written, `keep-prior` and `downgrade` are both "not ship" — but a downgrade that loses diagram richness is a *regression* against a prior-best 2D render, and the spec doesn't say so. (RC-1, RC-2, RC-7)

3. **MiniMax-M3 as a gate input is calibrated *after* the batch in Phase 3 ("calibrate the adoption gate against a hand-labeled stratified sample").** This is backwards and is the validator-overfit risk row made concrete. You will calibrate a gate that already decided 45 tiles. The MiniMax sub-gate must be calibrated on the hand-labeled stratified sample *before* Core, or it is noise injected into the decision function. The risk row for "MiniMax audit noise" names this and then the plan ignores its own mitigation. (RC-7, RC-8)

4. **No pre-registered baseline for the 18 baseline-failing tiles' failure modes.** The re-run will show 18 tiles flip to ship — but without a per-tile recorded *reason* (overflow / collision / title / contrast / slop) in the baseline fixture, you cannot report "X overflow failures fixed, Y collision failures fixed" — only an aggregate count. That makes it impossible to distinguish "pipeline fixed the hard problems" from "pipeline converted 18 diagrams to lists." Phase 1 Setup snapshots SHIP/mean/delta but not per-tile RC labels. (RC-1 through RC-7)

5. **`keep-prior` assumes a prior-best render exists and is preserved — but the edge case section says "Tile with no prior best render: gate blocks ship."** For the 18 baseline failures, what *is* the prior best? If it's the failing 35-58 render, `keep-prior` ships a known-bad tile and counts it as non-regression. The gate needs a `prior-best-quality` threshold below which `keep-prior` is forbidden and the tile must `downgrade` or `fail`. As written, `keep-prior` is a silent escape hatch for the exact tiles the program was built to fix. (RC-1, RC-2)

6. **Cost ceiling math is optimistic and unbudgeted for the calibration pass.** "~63 GLM calls (45 + 18 repair)" assumes one repair per failure and zero repair on the calibration sample, zero skeleton recompute (step 8 best-of-3), zero GPT-5.5 escalation retries. Step 8 alone triples GLM calls on 2D failures. NFR-P01's ceiling will be breached on the first real run; the spec should report a *measured* ceiling with a breach flag, not assert a predicted one as a success criterion. (SC-004, RC-2)

7. **No deterministic-repeatability statement for the external model calls.** GLM/MiniMax/GPT-5.5 at temp≈0 are not bit-reproducible. A re-run that shows +8 SHIP could be run-to-run variance, not pipeline lift. With n=45 and ~1/45 transient fails, a single re-run is underpowered to attribute lift to the program vs. model sampling noise. The plan needs either (a) 3 re-runs with a sign test, or (b) an explicit caveat that the lift point estimate has unquantified variance. GPT-5.5 flagged "n=45 over-optimism" for *angle sums* but missed it for *sampling variance*.

## Strongest improvement or alternative

**Split the adoption gate into two decisions and pre-register the second one before Core:**

```
decision1 = ship | keep-prior | downgrade   (correctness — current spec)
decision2 = adopt-pipeline | iterate | reject  (program-level — currently missing/deferred)
```

Define `decision2` in `spec.md` §5 as a **tradeoff frontier**, not a single SHIP threshold, before any code runs:

> ADOPT requires **both** (a) SHIP ≥ 80% **and** (b) `recovered-2D / (recovered-2D + downgraded-to-linear)` ≥ 0.5 among the 18 baseline failures — i.e. at least half the recovered pass-rate comes from genuine 2D repair, not primitive collapse.

This single change turns the open question "80% via downgrades only — ADOPT or ITERATE?" into a *pre-registered answer* (ITERATE), kills the downgrade-inflation failure mode structurally rather than via after-the-fact tagging, and makes the headline metric honest. It costs ~10 lines in `spec.md` and zero code. Without it, the phase will produce a number that cannot be trusted to mean "the program worked."

## One thing to test or verify before building this phase

**Run the adoption gate's decision function by hand on 6 tiles before writing the driver** — pick 2 baseline linear winners (should `ship`), 2 known-2D-failures that step 9 would downgrade (should `downgrade`, and you must confirm `downgrade` scores below a prior 2D ship in your decision logic), and 2 borderline-slop tiles that pass geometry/contrast but are visually dull (confirm whether MiniMax catches them or they `ship` as RC-7 slop). If the gate's output on these 6 doesn't match your intent, the entire 45-tile batch is uninterpretable. This is the "calibrate before Core" fix for gap #3 applied to the whole gate, not just MiniMax.