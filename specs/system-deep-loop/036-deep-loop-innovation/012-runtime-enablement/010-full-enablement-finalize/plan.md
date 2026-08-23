---
title: "Implementation Plan: Full Enablement and Finalize"
description: "Sequence the window-free finalize CAS, the flip-runner finalize path, the gate authority-state widening, and the real reader-contract check, with a full-suite and gate verification reaching literal PASS."
contextType: "implementation"
parent: "system-deep-loop/036-deep-loop-innovation/012-runtime-enablement/010-full-enablement-finalize"
---

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

# Implementation Plan: Full Enablement and Finalize

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Packet** | system-deep-loop/036-deep-loop-innovation/012-runtime-enablement/010-full-enablement-finalize |
| **Level** | 2 |
| **Status** | Planned |
| **Approach** | Orchestrator scopes and verifies; a dispatched executor writes code in bounded units |
<!-- /ANCHOR:metadata -->

<!-- ANCHOR:approach -->
## 2. APPROACH

The reversible flip already routes canonical writes to the ledger (`dark`) writer, so the finalize state and
the reader-contract check — not any new write path — are what remain. Build in four bounded units, verifying
each before the next, because each is a link the next depends on.

The existing forward flip (`flip-authority.cjs`) is already a registry-direct transition that honestly bypasses
the certificate "by operator decision" and asserts the landed record on disk. Finalize mirrors that exact
pattern one state forward, window-free, recording the truth rather than fabricating a closed window.
<!-- /ANCHOR:approach -->

<!-- ANCHOR:units -->
## 3. BUILD UNITS

- **U1 — Finalize CAS + flip path.** Add `compareAndSwapFinalize` (reversible→final, epoch+1, writer `dark`)
  to the authority registry, mirroring `compareAndSwap`/`compareAndSwapRollback`. Add a `--finalize` path to
  the flip runner that drives it across the frozen mode order, re-reads each record from disk, and fails unless
  it is exactly `new_authoritative_final`. Negative control: the CAS toggle already present; a wrong-epoch CAS
  is denied and leaves the record whole.
- **U2 — Execute finalize.** Run the finalize for all eight modes; capture records; confirm `verify-authority.cjs`
  shows eight on `new_authoritative_final` from stored records.
- **U3 — Gate widening.** Widen `run-gate.mjs` authority-state to accept `new_authoritative_final` while still
  failing on the absent-record default.
- **U4 — Real reader-contracts.** Replace the reader-contract stub with a real per-mode check: fold the ledger
  through the mode's projection contract, materialize the legacy file, run the real consumer, assert a clean
  read. Module-level negative control proven red at the command line.
<!-- /ANCHOR:units -->

<!-- ANCHOR:verification -->
## 4. VERIFICATION

- Per unit: read the diff, re-run the unit's tests, negative-control every new guard (disable one condition →
  red; restore → green; record both counts).
- Whole phase: restore the test-dirtied DB files; re-run the full runtime suite → candidate failed-count ≤
  baseline; run the whole-system gate → verdict PASS with zero not-run; `validate.sh 010 --strict` Errors:0.
<!-- /ANCHOR:verification -->

<!-- ANCHOR:rollback -->
## 5. ROLLBACK

Not pushed. The `.authority-state` records and every edited file are restorable from git in the worktree; a
`git checkout HEAD -- <path>` reverts any unit. Finalize is model-irreversible but physically reversible here.
<!-- /ANCHOR:rollback -->
