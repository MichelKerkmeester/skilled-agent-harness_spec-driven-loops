---
title: "Task Breakdown: Full Enablement and Finalize"
description: "Ordered, verifiable tasks for the finalize CAS, flip execution, gate authority-state widening, and the real reader-contract check."
contextType: "implementation"
parent: "system-deep-loop/036-deep-loop-innovation/012-runtime-enablement/010-full-enablement-finalize"
---

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->

# Task Breakdown: Full Enablement and Finalize

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Packet** | system-deep-loop/036-deep-loop-innovation/012-runtime-enablement/010-full-enablement-finalize |
| **Level** | 2 |
| **Status** | Planned |
<!-- /ANCHOR:metadata -->

<!-- ANCHOR:tasks -->
## 2. TASKS

### U1 — Finalize CAS + flip path
- [ ] T-001: Add `compareAndSwapFinalize` (reversible→final, epoch+1, writer `dark`) to `authority-registry.ts`, mirroring the forward and rollback CAS, with integrity digest and lock discipline preserved.
- [ ] T-002: Add finalize transition input/facts types to `types.ts`; the facts state window-free operator-decision bypass honestly.
- [ ] T-003: Add a `--finalize` path to `flip-authority.cjs` that drives the CAS across the frozen mode order, re-reads each record from disk, and fails unless it is exactly `new_authoritative_final` at epoch+1.
- [ ] T-004: Tests — finalize CAS lands the record; wrong-epoch finalize is denied and leaves the record whole; flip runner asserts on the on-disk record; negative control recorded.

### U2 — Execute finalize
- [ ] T-005: Run `flip-authority.cjs --finalize --commit` for all eight modes; capture the record set.
- [ ] T-006: Confirm `verify-authority.cjs` reports eight modes on `new_authoritative_final` from stored records.

### U3 — Gate widening
- [ ] T-007: Widen `run-gate.mjs` authority-state to accept `new_authoritative_final`; keep the absent-record default failing; update the description.

### U4 — Real reader-contracts
- [ ] T-008: Replace `checkReaderContracts` with a real per-mode check: ledger fold → materialized legacy file → real consumer → clean-read assertion.
- [ ] T-009: Add a module-level negative control to the check; prove red-when-disabled / green-when-restored at the command line.

### Verify
- [ ] T-010: Restore test-dirtied DB files; re-run the full suite → candidate failed ≤ baseline.
- [ ] T-011: Run the whole-system gate → verdict PASS, zero not-run; `validate.sh 010 --strict` Errors:0.
<!-- /ANCHOR:tasks -->
