---
title: "Tasks: Full Enablement and Finalize"
description: "Ordered, verifiable tasks for the finalize CAS, flip execution, gate authority-state widening, and the real reader-contract check, staged so each unit is verified before the next."
trigger_phrases:
  - "full enablement finalize tasks"
importance_tier: "important"
contextType: "planning"
parent: "system-deep-loop/036-deep-loop-innovation/012-runtime-enablement/010-full-enablement-finalize"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/036-deep-loop-innovation/012-runtime-enablement/010-full-enablement-finalize"
    last_updated_at: "2026-08-24T07:21:02Z"
    last_updated_by: "claude"
    recent_action: "Executed finalize, re-measured the gate to PASS, and proved the reader-contract negative control"
    next_safe_action: "Close out 005 and 006 against the finalized runtime, then recursive-validate"
    blockers: []
    key_files: []
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Finalize mirrors the existing forward CAS, window-free, one state forward"
      - "The CAS, flip path, gate widening, and reader-contract check pre-existed; this phase executed and re-measured them"
---

# Tasks: Full Enablement and Finalize

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->

<!-- ANCHOR:notation -->
## Task Notation

|| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
| `[P]` | Parallelizable |
| `[B]` | Blocked |
<!-- /ANCHOR:notation -->

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

Finalize CAS and flip path (build unit U1). These add the transition without executing it. Pre-existed from earlier work; re-read and re-run before the irreversible step rather than trusted from record.

- [x] **T-001** `compareAndSwapFinalize` (reversible→final, epoch+1, writer `dark`) present in `authority-registry.ts`, mirroring the forward and rollback CAS with integrity digest and lock discipline.
- [x] **T-002** Finalize transition input/facts types present in `types.ts`; the facts state the window-free operator-decision bypass honestly (`rollbackWindowRequired: false`).
- [x] **T-003** `--finalize` path present in `flip-authority.cjs`; drives the CAS across the frozen mode order, re-reads each record from disk, and fails unless it is exactly `new_authoritative_final` at epoch+1.
- [x] **T-004** Tests present and green — 47 tests across `authority-finalize` + `per-mode-authority-flip`: CAS lands the record; wrong-epoch finalize denied and record left whole; flip runner asserts on the on-disk record; negative control recorded.
<!-- /ANCHOR:phase-1 -->

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

Execute finalize (U2 — the operator lifted the deferral) and widen the gate (U3), then the real reader-contract check (U4).

- [x] **T-005** Ran `flip-authority.cjs --finalize --commit`; all eight modes `finalized` to `new_authoritative_final`/epoch 3/`dark`, `allFlipped: true`, after a backup and a clean dry-run.
- [x] **T-006** `verify-authority.cjs` reports eight modes on `new_authoritative_final`, `dark`, `stored`, `allOnLedger: true`, exit 0 (its predicate widened to accept the final tier).
- [x] **T-007** `run-gate.mjs` authority-state accepts `new_authoritative_final`, still fails on the absent-record default; description updated. Pre-existing (U3); confirmed by the PASS receipt.
- [x] **T-008** `checkReaderContracts` is a real per-mode check: ledger fold → materialized legacy file → real consumer → clean-read assertion. Pre-existing (U4); all 8 read cleanly.
- [x] **T-009** Module-level negative control proven at the command line: corrupt-inject turned `reader-contracts` red and the verdict FAIL; restoring turned both green.
<!-- /ANCHOR:phase-2 -->

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] **T-010** DB files restored; full suite re-run on the finalized tree → candidate 14 failed ≤ baseline 19, all pre-existing/env, zero `MODULE_NOT_FOUND`.
- [x] **T-011** Whole-system gate → verdict PASS, all 7 checks pass, zero not-run; `validate.sh 010-full-enablement-finalize --strict` Errors: 0.
<!-- /ANCHOR:phase-3 -->

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] **T-012** All eight modes are on `new_authoritative_final` from stored records, the legacy shadow writer is dropped, and the whole-system gate returns a literal PASS earned by an observed read.
- [x] **T-013** `implementation-summary.md` records the finalize records, the gate PASS, the suite delta, and the negative controls.
<!-- /ANCHOR:completion -->

<!-- ANCHOR:cross-refs -->
## Cross-References

|| Reference | Location |
|-----------|----------|
| Requirements | `spec.md` §4 |
| Plan | `plan.md` |
| Verification contract | `checklist.md` |
| Predecessor | `../005-whole-system-gate/` |
| Predecessor | `../009-mode-projection-contracts/` |
<!-- /ANCHOR:cross-refs -->
