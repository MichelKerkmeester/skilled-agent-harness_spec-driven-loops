# Iteration 001 — ds-flash-min lineage

- **Run:** 1
- **Status:** complete
- **Focus:** Which single check is load-bearing for the PASS verdict, and what the `authority-state` failure exposes about the frozen-candidate measurement contract
- **Iteration:** 1 of 1
- **Topic:** Whole-System Gate fidelity: the frozen-candidate measurement contract and the conditions a PASS verdict actually requires

## Summary

The whole-system gate at frozen candidate `81949212b...` recorded verdict `FAIL`. Exactly one check — `authority-state` — is load-bearing: it resolved to FAIL, so the verdict was determined to FAIL regardless of the two `not-run` checks. The failure root cause is a missing compiled module, not a semantic authority conflict. Under the measurement contract, `not-run` verifies a check was not silently skipped and does not mask a failure, because the authoritative checks that did run already produced a non-pass verdict. A PASS would only be reachable if every entry in the enumerated check set that is required for authority to have moved were actually measured at the frozen SHA.

## Findings

- **F1 (load-bearing check):** `authority-state` is the decisive check. Its FAIL drives verdict FAIL even though `reader-contracts` and `fanout-real-run` are `not-run`. [SOURCE: specs/.../005-whole-system-gate/scratch/receipt.json]
- **F2 (root cause is artifact, not policy):** The `authority-state` check failed with `Cannot find module '.../per-mode-authority-flip/authority-registry.js'` imported from `.../index.ts`. Only `.ts` sources exist (`authority-registry.ts`, `authority-selector.ts`, etc.); no compiled `.js` artifact is present, so the state reader cannot even load the registry. This is a build/runtime-artifact gap, not a demonstrated conflict between blend states. [SOURCE: specs/.../005-whole-system-gate/scratch/receipt.json checks[2]; file:.opencode/skills/system-deep-loop/runtime/lib/per-mode-authority-flip/]
- **F3 (authority states exist as durable targets):** `authority-selector.ts` enumerates `legacy_authoritative`, `new_authoritative_reversible`, `new_authoritative_final`; continuity notes "8 of 8 modes read legacy_authoritative". The gate's `authority-state` description ("Every mode authority has moved to new_authoritative_reversible") is the declared PASS condition and is currently unsatisfied. [SOURCE: file:.opencode/skills/system-deep-loop/runtime/lib/per-mode-authority-flip/authority-selector.ts:87; spec.md metadata/continuity]
- **F4 (frozen-candidate contract holds for the executable checks):** `tree-clean` and `candidate-frozen` both PASS, so the checks that ran measured the same frozen tree; `runtime-suite` PASS (4188 vs 4111, Δ+77). The measurement contract (REQ-002) is honored for the suite, consumer, and tree checks — the only REQ-002-relevant failure is the missing registry module at the candidate. [SOURCE: specs/.../005-whole-system-gate/scratch/receipt.json checks[0,1,3,4]]
- **F5 (not-run is honest, not a mask):** `reader-contracts` and `fanout-real-run` are recorded as `not-run` with explicit reasons (no enabled mode; fan-out skipped because the verdict was already determined). Because REQ-006 demands a failing check yields a failing verdict and the decisive check already FAILED, the `not-run` rows do not manufacture a PASS. The diagnostic property to watch: a PASS verdict must not be reachable while any required check is `not-run`. [SOURCE: specs/.../005-whole-system-gate/scratch/receipt.json checks[5,6]; plan.md §5]

## Answer to focus

The single load-bearing check for this run is `authority-state`; its FAIL determined the verdict. `not-run` is recorded honestly and only acceptable because the verdict was already non-pass — it never converts into a PASS. The frozen-candidate contract (REQ-001..003, REQ-006) is the true gate: a PASS requires every enumerated required check to have executed against the same frozen candidate SHA with no FAIL and no `not-run` for a required authority-measurement check.

## What worked
- Cross-referencing the receipt's per-check status with the plan's enumerated check-set rationale and the verified split of (PASS, FAIL, not-run) in receipt.json produced an unambiguous load-bearing-check identification.

## What failed / Dead ends
- Blindly treating the `authority-state` module-resolution error as a semantic authority disagreement would misdiagnose the cause; corrected by reading the authority-flip dir and confirming no `.js` artifact exists.
- Investigating whether `fanout-real-run` should force FAIL was a dead end: its `not-run` reason explicitly defers to the already-determined verdict, so it cannot change the outcome.

## Next focus
Confirm whether the two `not-run` checks being REQUIRED would convert a would-be PASS into `not-run` (vacuity guard), and whether REQ-006 alone is sufficient to forbid a vacuous PASS, or whether the enumerated check set needs an explicit "required for PASS" marker separate from "executes".