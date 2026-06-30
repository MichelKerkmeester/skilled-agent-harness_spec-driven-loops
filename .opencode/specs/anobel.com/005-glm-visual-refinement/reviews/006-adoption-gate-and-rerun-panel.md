# Panel Synthesis — Phase 006: adoption-gate-and-rerun

> 5-model second-opinion panel. Advisory only — no spec edits, no implementation.
> Source reviews: `reviews/006-adoption-gate-and-rerun/review-{glm,mimo,deepseek,kimi,minimax}.md`

## Panel table

| Model | Verdict | Confidence | Top gap | Top improvement |
|-------|---------|-----------|---------|-----------------|
| GLM-5.2 | AGREE-WITH-CHANGES | 0.72 | Conflates "gate-passing" with "adoption-worthy" — the gate has no *quality floor*, only defect sub-gates, so a routing-diagram downgraded to a stacked-list with "+N more" passes everything and ships; tagging ≠ gating | Split into two decisions and **pre-register decision2**: ADOPT iff SHIP ≥ 80% **AND** `recovered-2D / (recovered-2D + downgraded-to-linear) ≥ 0.5` among the 18 baseline failures (~10 lines in spec.md §5, zero code) |
| MiMo-v2.5-Pro | AGREE-WITH-CHANGES | 0.72 | **Circular validation**: the gate determines SHIP, SHIP is measured against the gate, the gate's thresholds are this spec — no independent ground truth, so the gate can validate itself and say ADOPT | Add an **independent human-labeled ground-truth set (25-30 tiles) before the batch**; measure gate precision/recall/accuracy against it and report in the lift report |
| DeepSeek-v4-Pro | AGREE-WITH-CHANGES | 0.72 | **The gate IS the result (confound)** — a five-sub-gate AND determines the SHIP rate; without a loose-gate counterfactual you can't attribute lift to the pipeline vs gate strictness; "keep-prior" is undefined for the first re-run | Add a **gate-configuration ablation**: run the same 45-tile output set through loose (geometry+contrast) / deterministic-only / full-five gates; the loose-vs-full delta is the "gate tax" — costs zero extra API calls |
| Kimi-k2.7 | AGREE-WITH-CHANGES | 0.75 | **MiniMax hard-gate contradiction** — REQ-001 makes MiniMax status a hard ship requirement while the open questions admit its precision is unproven; you can't both hard-gate on it and call it unvalidated. Plus over-optimistic SC and underspecified "keep-prior" | **Remove MiniMax from the hard gate until calibrated** against human labels (stratified ~15 tiles); then either keep it as a measured hard gate or run it as a shadow diagnostic while deterministic gates govern ship/keep/downgrade |
| MiniMax-M3 | AGREE-WITH-CHANGES | 0.78 | The **ADOPT/ITERATE/REJECT decision rule is an open question, not a requirement** (REQ-007 points to thresholds that don't exist) — so the run is interpretive and any outcome can be rationalized as ADOPT; cost ceiling undercounts; MiniMax-status vs failure-only contradiction blocks linear winners | **Pre-register the decision rule as a typed function in spec.md REQ-007** (explicit ADOPT/ITERATE/REJECT thresholds + tie-breakers), removed from §10 open questions, with a checklist item `[x]` before the batch starts |

**Mean confidence: 0.74** (5 AGREE-WITH-CHANGES)

## Consensus (≥3 models agree)

1. **The phase is the correct final step and the engineering is clean** — pure-function adoption gate + sequential driver + idempotent resumable JSONL ledger; all 5 endorse.
2. **The `recovered-2D / downgraded-to-linear / improved-linear` tagging (REQ-005) is the single most valuable requirement** — all 5 credit GPT-5.5 explicitly for naming the downgrade-inflation problem most specs miss.
3. **Paired tile-level deltas (REQ-003), not independent angle-summing, is the right discipline for n=45** — all 5.
4. **The ADOPT decision rule must be pre-registered in spec.md before the run, not deferred to checklist.md** — glm, minimax, mimo (and deepseek's "open questions are load-bearing design decisions"). Without it the run is interpretive and "the team cannot move the goalposts after seeing results" (minimax).
5. **The gate is self-validating / circular — there is no independent ground truth** — mimo, deepseek, kimi, minimax. A SHIP rate that rises by converting 2D→linear lets the gate "validate" itself.
6. **MiniMax is a hard gate input but is unvalidated, and the failure-only design contradicts it** — glm, kimi, minimax (and the spec calibrates MiniMax *after* the batch, which glm calls "backwards"). If linear winners get no MiniMax audit → status=unknown → blocked, mass-blocking the very tiles REQ-006 protects.
7. **Calibrate the gate against human labels BEFORE the batch, not in Phase 3** — all 5. Multiple suggest also re-running the original 004 harness on the same 45 tiles as a control arm to disambiguate "new pipeline" from "new gates."
8. **The ~63-GLM-call cost ceiling undercounts the full pipeline** — all 5: it ignores step-8 best-of-3 skeleton recompute and step-10/phase-005 GPT-5.5 escalation + MiniMax rescores. Realistic ≈ 120-200 GLM + 5-15 GPT-5.5 + 20-40 MiniMax (minimax).
9. **n=45 statistical power is ignored** — mimo (±10-12pt CI, not ±3), kimi, minimax (1 tile = 2.2pp; a single re-run is underpowered), glm (3 re-runs + sign test, or state unquantified variance) — the predicted bands are overconfident.

## Divergence

- **What breaks the circularity:** mimo → independent human-labeled set (25-30 tiles); deepseek → gate-configuration ablation (loose/deterministic/full); minimax → pre-registered typed decision rule + 5-tile calibration; glm → split decision1/decision2 with a recovered-2D floor; kimi → remove MiniMax from the hard gate. These are complementary, not conflicting.
- **"keep-prior" semantics:** glm and deepseek both flag it as a silent escape hatch — for the 18 baseline failures the "prior best" is the failing 35-58 render, so keep-prior ships a known-bad tile and counts it non-regression. glm wants a `prior-best-quality` threshold below which keep-prior is forbidden.
- **MiniMax disposition:** kimi → remove from hard gate until calibrated; glm → calibrate before Core; deepseek → run it as a shadow audit via the ablation. All agree it can't be an uncalibrated hard veto.
- **Quality-floor mechanism:** glm wants a recovered-2D ratio floor in decision2; minimax wants `recovered-2D ≥ 50%` + `taste_score ≥ 7/10`; mimo wants ≥5 of 18 tagged recovered-2D as a hard SC.
- **Linear no-regression threshold:** minimax says "≥90% passing" is too permissive (allows degrading 1-2 strong tiles) — should be 100%.

## Adopt-worthy improvements GPT-5.5 missed (ranked, cross-model)

1. **Pre-register a typed ADOPT/ITERATE/REJECT decision rule in spec.md REQ-007 before the run** (minimax, glm, mimo, deepseek). minimax gives a concrete function — ADOPT iff SHIP ≥ 80% AND diagram-vs-linear delta ≤ 20 AND recovered-2D ≥ 50% of failing 2D AND linear no-regression = 100% AND zero RC-4 locked-field regressions; ITERATE/REJECT bands defined. Turns the open question "80% via downgrades only — ADOPT or ITERATE?" into a pre-registered ITERATE.
2. **Break the circular validation with independent ground truth** (mimo, deepseek, kimi, minimax). Either a human-labeled 25-30 tile set (precision/recall/accuracy) OR a gate-configuration ablation (loose/deterministic/full from the same renders — zero extra API cost) OR both.
3. **Add a quality/recovered-2D floor so downgrade-inflation can't masquerade as success** (glm, mimo, minimax): at least 50% of the recovered pass-rate (or ≥5 of 18 tiles) must be genuine 2D repair, not primitive collapse.
4. **Remove MiniMax from the hard gate until calibrated** (kimi, glm, minimax) — stratified ~15-tile calibration first; then a measured hard gate or a shadow diagnostic. Resolves the unknown-status mass-block of linear winners.
5. **Define "keep-prior" with a prior-best-quality threshold** (glm, deepseek, kimi) — forbid keep-prior shipping a known-bad 35-58 baseline render and counting it as non-regression.
6. **Re-run the original 004 harness on the same 45 tiles as a control arm** (minimax, deepseek) — to attribute lift to the new pipeline vs the new gates (the baseline-confound).
7. **Measure the real cost ceiling on a 3-5 tile dry run and add ceiling-break/abort logic** (glm, mimo, deepseek, minimax) — the driver currently has no per-tile cost abort and no mid-batch abort criteria.
8. **Report confidence intervals, not just point estimates** (mimo, kimi, minimax) — for n=45, state the ~±10-12pt CI; consider 3 re-runs + a sign test to separate pipeline lift from model sampling variance.
9. **Snapshot per-tile RC labels in the baseline fixture** (glm) — so the report can say "X overflow fixed, Y collision fixed," not just an aggregate count (distinguishes "fixed the hard problems" from "converted 18 diagrams to lists").
10. **Specify the JSONL ledger schema explicitly in the spec** (minimax) — `primitive_label`, `sub_gate_verdicts{}`, `paid_call_count`, `wall_clock_ms`, `downgrade_path`, `minimax_score` — paired deltas depend on a common field structure.

## Red flags (≥2 models flag a risk)

- **Decision rule missing / deferred** (minimax, glm, mimo, deepseek) — the run is interpretive without it; defaulted-ADOPT silently regresses the program.
- **Circular / self-validating gate, no independent ground truth** (mimo, deepseek, kimi, minimax) — "the gate IS the result."
- **No quality floor → downgrade-inflation ships as success** (glm, mimo, minimax) — the gate structurally rewards the downgrade path.
- **MiniMax uncalibrated hard gate + unknown-status mass-block** (glm, kimi, minimax) — internal contradiction with the failure-only NFR and REQ-006 linear no-regression.
- **"keep-prior" silently ships known-bad baseline renders** (glm, deepseek, kimi) on the exact tiles the program was built to fix.
- **Cost ceiling undercounts; no enforcement** (all 5).
- **n=45 underpowered; bands overconfident** (mimo, kimi, minimax, glm).
- **Sequencing gap** (kimi) — Definition of Ready requires 001-005 "shipped and pass validate.sh", but they are planning-only.

## Net recommendation

**REVISE before building** — and the revisions are cheap-but-essential (mostly spec.md text, near-zero code). The architecture (pure gate + driver + tagging + paired deltas) is endorsed 5/5. Mandatory before the re-run: (1) pre-register the typed ADOPT/ITERATE/REJECT rule in spec.md with a recovered-2D quality floor; (2) break circularity via human labels and/or a gate-config ablation, calibrated *before* the batch; (3) remove MiniMax from the hard gate until calibrated; (4) define keep-prior's quality threshold; (5) re-run the original harness as a control arm and report CIs. Without these, "80-84% SHIP" is a number that cannot be trusted to mean "the program worked."
