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
    last_updated_at: "2026-08-24T06:19:12Z"
    last_updated_by: "claude"
    recent_action: "Conformed the tasks to the v2.2 template; all items stay pending and U2-deferred"
    next_safe_action: "Start T-001 (finalize CAS) when the operator lifts the U2 deferral"
    blockers:
      - "U2 finalize is deferred by operator decision; no task has started"
    key_files: []
    completion_pct: 0
    open_questions: []
    answered_questions:
      - "Finalize mirrors the existing forward CAS, window-free, one state forward"
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

Finalize CAS and flip path (build unit U1). These add the transition without executing it.

- [ ] **T-001** Add `compareAndSwapFinalize` (reversible→final, epoch+1, writer `dark`) to `authority-registry.ts`, mirroring the forward and rollback CAS, with integrity digest and lock discipline preserved.
- [ ] **T-002** Add finalize transition input/facts types to `types.ts`; the facts state the window-free operator-decision bypass honestly.
- [ ] **T-003** Add a `--finalize` path to `flip-authority.cjs` that drives the CAS across the frozen mode order, re-reads each record from disk, and fails unless it is exactly `new_authoritative_final` at epoch+1.
- [ ] **T-004** Tests — finalize CAS lands the record; wrong-epoch finalize is denied and leaves the record whole; the flip runner asserts on the on-disk record; the negative control is recorded.
<!-- /ANCHOR:phase-1 -->

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

Execute finalize (U2 — the operator-deferred step) and widen the gate (U3), then the real reader-contract check (U4).

- [ ] **[B] T-005** Run `flip-authority.cjs --finalize --commit` for all eight modes; capture the record set. **Blocked: U2 deferred by operator.**
- [ ] **[B] T-006** Confirm `verify-authority.cjs` reports eight modes on `new_authoritative_final` from stored records. **Blocked: depends on T-005.**
- [ ] **T-007** Widen `run-gate.mjs` authority-state to accept `new_authoritative_final`; keep the absent-record default failing; update the description.
- [ ] **T-008** Replace `checkReaderContracts` with a real per-mode check: ledger fold → materialized legacy file → real consumer → clean-read assertion.
- [ ] **T-009** Add a module-level negative control to the check; prove red-when-disabled / green-when-restored at the command line.
<!-- /ANCHOR:phase-2 -->

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] **T-010** Restore the test-dirtied DB files; re-run the full suite → candidate failed-count ≤ baseline.
- [ ] **T-011** Run the whole-system gate → verdict PASS, zero not-run; `validate.sh 010-full-enablement-finalize --strict` Errors: 0.
<!-- /ANCHOR:phase-3 -->

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] **T-012** All eight modes are on `new_authoritative_final` from stored records, the legacy shadow writer is dropped, and the whole-system gate returns a literal PASS earned by an observed read.
- [ ] **T-013** `implementation-summary.md` records the finalize records, the gate PASS, the suite delta, and the negative controls — authored only once the work is built.
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
