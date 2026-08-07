# Iteration 001 — Correctness

Dimension: Correctness · Target: `015-prodmode-recall-gate` (spec-folder, PLANNED) · Lineage: review

## Scope

Audited the *design logic* of the planned gate as described in `spec.md` and `plan.md`. No gate code exists yet (`run-spec-recall-gate.mjs` absent), so correctness review targets the planned algorithm and its invariants, cross-checked against what the live harness `run-eval-v2.mjs` actually computes.

## Observations

1. **Prod-column-only verdict is well-defined and computable.** The harness emits, per class and overall, a `prodMode` completeRecall@K block distinct from `evalMode` and `evalVsProdDelta` [SOURCE: run-eval-v2.mjs:312-341]. A gate reading only `prodMode.completeRecallAt3` is therefore reading a real, isolated column. REQ-001's "read only prod" invariant is satisfiable against the current harness output shape. No correctness defect.

2. **Distinct exit-code design is sound.** The only `process.exitCode` write in the harness is the crash handler `process.exitCode = 1` [SOURCE: run-eval-v2.mjs:357]. A gate emitting its own recall-verdict code (e.g. 2/3) keeps the verdict signal disjoint from the crash signal, satisfying REQ-002/SC-001. The plan's claim that line 357 is the crash handler is accurate. No correctness defect.

3. **Mode semantics are internally coherent.** PROMOTION = "prod column rises over baseline → exit 0", REGRESSION = "prod column not below baseline by tolerance → exit 0" [SOURCE: spec.md:108-109]. The two modes are non-overlapping and each maps to a single comparison against the stored baseline. The missing-baseline branch (PROMOTION seeds + neutral code; REGRESSION fails closed) is specified [SOURCE: spec.md:165]. No correctness defect.

4. **Non-saturation premise verified at the data layer.** completeRecall@K only moves when a query has ≥2 targets to be incomplete about; the harness already pools only `MEASURABILITY_CLASSES` queries [SOURCE: run-eval-v2.mjs:277], and those classes carry multi-target rows in the source ground truth [SOURCE: lib/eval/data/ground-truth.json:768-818]. The plan's "single-target saturates" rationale is correct. No correctness defect.

## Findings

None at P0/P1. The planned algorithm is logically consistent and computable against the live harness contract. A completeness concern about the *reuse surface* (whether the gate can actually be "thin") is deferred to the Maintainability dimension (iteration-004) to keep dimensions clean.

## New-Finding Ratio

findingsNew: 0 · newFindingsRatio: 0.00

Review verdict: PASS
