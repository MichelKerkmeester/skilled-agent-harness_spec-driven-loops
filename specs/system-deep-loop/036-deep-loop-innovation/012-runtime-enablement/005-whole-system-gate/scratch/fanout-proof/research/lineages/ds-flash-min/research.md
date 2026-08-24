# Whole-System Gate Fidelity: The Frozen-Candidate Measurement Contract and the Conditions a PASS Verdict Actually Requires

- **Lineage:** fanout-ds-flash-min-1787198541887-w6k53d (ds-flash-min)
- **Executor:** cli-opencode (cline-pass/cline-pass/deepseek-v4-flash)
- **Iterations:** 1 of 1 (maxIterations reached; legal convergence)
- **Generated:** 2026-08-20T04:10:00Z

## 1. Executive Summary

The whole-system gate measured at frozen candidate `81949212b...` against baseline `8c9f0b694...` and recorded verdict **FAIL**. A PASS verdict is not merely "all checks pass" — it is the joint satisfaction of the frozen-candidate contract: every enumerated required check executed against the same frozen candidate SHA, none failed, and none that is required for the measurement was left `not-run`. In this run exactly one check, `authority-state`, is load-bearing: its FAIL determined the verdict, and its root cause is a missing compiled registry module, not a proven authority-state conflict.

## 2. Research Recap

- **Init (phase_init):** Bound `artifact_dir` to the lineage override. Created `deep-research-config.json` (immutable, from orchestrator), `deep-research-strategy.md`, `deep-research-state.jsonl` (config record), and `findings-registry.json`.
- **Loop (phase_main_loop, iteration 1):** Inspected the gate receipt, plan check-set enumeration, and the per-mode authority-flip source to identify the load-bearing check and the frozen-candidate contract. Recorded 5 findings (all new, newInfoRatio 1.0) plus two ruled-out directions. Max iterations (1) reached → legal stop to synthesis.
- **Synthesis (phase_synthesis):** Compiled `research.md`, regenerated the dashboard, and appended the `synthesis_complete` event. Save was skipped by lineage instruction (no repo tooling, no generate-context.js).

## 3. Key Findings

1. **F1 — `authority-state` is the load-bearing check.** Its FAIL drives the verdict even though `reader-contracts` and `fanout-real-run` are `not-run`. [SOURCE: specs/.../005-whole-system-gate/scratch/receipt.json]
2. **F2 — the failure is an artifact gap, not a policy conflict.** `Cannot find module '.../per-mode-authority-flip/authority-registry.js'` imported from `index.ts`; only `.ts` sources exist, no compiled `.js`. [SOURCE: specs/.../005-whole-system-gate/scratch/receipt.json checks[2]; file:.opencode/skills/system-deep-loop/runtime/lib/per-mode-authority-flip/]
3. **F3 — durable authority states exist.** `authority-selector.ts` enumerates `legacy_authoritative`, `new_authoritative_reversible`, `new_authoritative_final`; continuity records "8 of 8 modes read legacy_authoritative", so the declared PASS condition (every mode at `new_authoritative_reversible`) is unmet. [SOURCE: file:.opencode/skills/system-deep-loop/runtime/lib/per-mode-authority-flip/authority-selector.ts:87; spec.md]
4. **F4 — the frozen-candidate contract holds for the executable checks.** `tree-clean` and `candidate-frozen` PASS (same tree measured), `runtime-suite` PASS (4188 vs 4111, Δ+77). The only REQ-002-relevant gap is the missing registry module at the candidate. [SOURCE: specs/.../005-whole-system-gate/scratch/receipt.json checks[0,1,3,4]]
5. **F5 — `not-run` is honest, not a mask.** Both `not-run` rows carry explicit reasons; because REQ-006 demands a failing check yields a failing verdict and the decisive check already FAILED, the `not-run` rows do not manufacture a PASS. A PASS must not be reachable while any required check is `not-run`. [SOURCE: specs/.../005-whole-system-gate/scratch/receipt.json checks[5,6]; plan.md §5]

## 4. The Frozen-Candidate Measurement Contract

A valid PASS verdict requires all of:

- **REQ-001/RESOLVED** — candidate and baseline SHAs resolved from the environment, never hand-typed. Confirmed by the `candidate-frozen` (identical) check.
- **REQ-002/HONORED** — every check runs against the same frozen candidate; `tree-clean` + `candidate-frozen` confirm the measured tree. The single REQ-002-correlated failure is the missing compiled registry module.
- **REQ-003/RECORDED** — the receipt names both SHAs, every check, and the verdict, and is written on pass or fail.
- **REQ-004/RECORDED** — the result is a delta against baseline (failed +0, passed +77).
- **REQ-005/HONORED** — the gate changes no runtime code, protocol document, or authority record.
- **REQ-006/THE PASS GUARD** — a failing check produces a failing verdict; there is no advisory tier. This is the property that stopped a FAIL from being masked.
- **REQ-007/RECORDED (deferred)** — fan-out must be a real run, not a fixture; recorded `not-run` because the authority verdict was already determined.
- **REQ-008/FAILED** — authority state of all modes read and recorded; the reader could not load the registry (missing `.js`).

## 5. Recommendations

1. Resolve the `authority-registry.js` absent-artifact gap (compile the per-mode-authority-flip package) so `authority-state` can actually read authority rather than crashing on module resolution, then re-run the gate at a fresh frozen candidate.
2. Add an explicit "required for PASS" marker to the enumerated check set, distinct from a check that merely runs, so REQ-006 alone does not have to carry the vacuity guard. Today a PASS is only guaranteed "not vacuous" because the load-bearing check failed; the plan/goals do not yet mark which `not-run` outcomes would themselves force FAIL.
3. Treat `not-run` as acceptable only while the decisive verdict is already determined; do not carry `not-run` rows into a PASS receipt.

## 6. Eliminated Alternatives

| Approach | Reason Eliminated | Evidence | Iteration(s) |
| --- | --- | --- | --- |
| Treat `authority-state` module-resolution as a semantic authority disagreement | The runtime directory holds only `.ts` sources; no compiled `.js` registry artifact exists, so the reader could not even load state — an artifact gap, not a state conflict | file:.opencode/skills/system-deep-loop/runtime/lib/per-mode-authority-flip/; receipt.json checks[2] | 001 |
| Require `fanout-real-run` to force FAIL | Its `not-run` reason explicitly defers to the already-determined authority verdict; it cannot change the outcome | specs/.../005-whole-system-gate/scratch/receipt.json checks[6] | 001 |

## 7. Ruled-Out Directions
- Nothing further ruled out beyond the two rows above; the run was a single focused iteration.

## 8. Open Questions
- Would the two currently-`not-run` REQUIRED checks convert a would-be PASS into `not-run` under the enumerated set, or does REQ-006 alone already forbid a vacuous PASS?
- Should "required for PASS" be an explicit property of each enumerated check separate from "executes"?

## 9. Convergence Report
- Stop reason: `max_iterations` (1 of 1 reached; legal convergence)
- Total iterations completed: 1
- Questions answered ratio: 1/4
- Average newInfoRatio: 1.0

## 10. References
- `specs/system-deep-loop/036-deep-loop-innovation/012-runtime-enablement/005-whole-system-gate/spec.md`
- `specs/system-deep-loop/036-deep-loop-innovation/012-runtime-enablement/005-whole-system-gate/plan.md`
- `specs/system-deep-loop/036-deep-loop-innovation/012-runtime-enablement/005-whole-system-gate/scratch/receipt.json`
- `specs/system-deep-loop/036-deep-loop-innovation/012-runtime-enablement/005-whole-system-gate/scratch/receipt.md`
- `file:.opencode/skills/system-deep-loop/runtime/lib/per-mode-authority-flip/authority-selector.ts`, `authority-registry.ts`