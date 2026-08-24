---
title: "Implementation Plan: Full Enablement and Finalize"
description: "Sequence the window-free finalize CAS, the flip-runner finalize path, the gate authority-state widening, and the real reader-contract check, with a full-suite and gate verification reaching literal PASS."
trigger_phrases:
  - "full enablement finalize plan"
  - "authority finalize plan"
importance_tier: "important"
contextType: "planning"
parent: "system-deep-loop/036-deep-loop-innovation/012-runtime-enablement/010-full-enablement-finalize"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/036-deep-loop-innovation/012-runtime-enablement/010-full-enablement-finalize"
    last_updated_at: "2026-08-24T07:21:02Z"
    last_updated_by: "claude"
    recent_action: "Executed the finalize and re-measured the gate to a literal PASS"
    next_safe_action: "Close out 005 and 006 against the finalized runtime, then recursive-validate"
    blockers: []
    key_files:
      - ".opencode/skills/system-deep-loop/runtime/lib/per-mode-authority-flip/authority-registry.ts"
      - ".opencode/skills/system-deep-loop/runtime/scripts/flip-authority.cjs"
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "The rollback-window ceremony is not required; finalize is window-free by operator decision, recorded honestly"
---

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

# Implementation Plan: Full Enablement and Finalize

<!-- ANCHOR:summary -->
## 1. SUMMARY

|| Aspect | Value |
|--------|-------|
| **Surface** | The authority registry finalize CAS, the flip runner, the whole-system gate, and their unit tests |
| **Change class** | Authority advance (reversible → final) plus a real gate reader-contract check; no new write path |
| **Authority** | All eight modes advance `new_authoritative_reversible → new_authoritative_final`; the legacy shadow writer is dropped |
| **Blast radius** | High and model-irreversible: finalize drops the legacy path. Confined to a not-pushed worktree; deferred (U2) by operator decision |

The reversible flip already routes every canonical write to the ledger (`dark`) writer, so the finalize
state and the reader-contract check — not any new write path — were what remained. This plan sequenced them in
four bounded units, verifying each before the next. **The operator lifted the deferral and the plan executed**:
all eight modes are now `new_authoritative_final` and the whole-system gate reaches a literal PASS.
<!-- /ANCHOR:summary -->

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

|| Gate | Command | Pass condition |
|------|---------|----------------|
| Finalize CAS | unit tests on `compareAndSwapFinalize` | Lands `new_authoritative_final` at epoch+1, writer `dark`; wrong-epoch CAS denied, record whole |
| Authority state | `node scripts/verify-authority.cjs` | Eight modes on stored `new_authoritative_final`; absent-record default still fails |
| Reader contract | whole-system gate `reader-contracts` check | Real per-mode fold → materialize → consumer → clean read; negative control red-when-disabled |
| Whole-system gate | `run-gate.mjs` | Verdict PASS, zero not-run; tree unchanged by the run |
| Suite delta | full runtime suite vs captured baseline | Candidate failed-count ≤ baseline |
| Packet | `validate.sh 010-full-enablement-finalize --strict` | `Errors: 0` |
<!-- /ANCHOR:quality-gates -->

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

The existing forward flip (`flip-authority.cjs`) is already a registry-direct transition that honestly
bypasses the certificate "by operator decision" and asserts the landed record on disk. Finalize mirrors that
exact pattern one state forward, window-free, recording the truth rather than fabricating a closed window.

The reversible flip already routes canonical writes to the ledger (`dark`) writer, so the finalize state and
the reader-contract check are what remain before the improved loop is genuinely live rather than shadowed.
Each build unit is a link the next depends on, so each is verified before the next begins.
<!-- /ANCHOR:architecture -->

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Finalize CAS + flip path (U1)

- Add `compareAndSwapFinalize` (reversible→final, epoch+1, writer `dark`) to the authority registry, mirroring
  `compareAndSwap`/`compareAndSwapRollback`, with integrity digest and lock discipline preserved.
- Add a `--finalize` path to the flip runner that drives the CAS across the frozen mode order, re-reads each
  record from disk, and fails unless it is exactly `new_authoritative_final`.
- Negative control: a wrong-epoch CAS is denied and leaves the record whole.

### Phase 2: Execute finalize and widen the gate (U2, U3)

- Run the finalize for all eight modes; capture the record set; confirm `verify-authority.cjs` shows eight on
  `new_authoritative_final` from stored records. **This was the U2 deferral point; the operator lifted it and it executed.**
- Widen `run-gate.mjs` authority-state to accept `new_authoritative_final` while still failing on the
  absent-record default.

### Phase 3: Real reader-contracts (U4)

- Replace the reader-contract stub with a real per-mode check: fold the ledger through the mode's projection
  contract, materialize the legacy file, run the real consumer, assert a clean read.
- Add a module-level negative control proven red-when-disabled and green-when-restored at the command line.
<!-- /ANCHOR:phases -->

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

|| Test Type | Scope | Tools |
|-----------|-------|-------|
| Finalize CAS | Authority registry | Unit tests: lands final; wrong-epoch denied and record whole |
| Flip runner | Finalize path | Unit tests: asserts on the on-disk record; negative control recorded |
| Authority survival | Live loop | `node scripts/verify-authority.cjs` — eight on stored final |
| Reader contract | Per-mode read | Gate check with a module-level negative control proven red at the command line |
| Suite delta | Full runtime suite | Full `vitest run` vs captured baseline; candidate failed ≤ baseline |
<!-- /ANCHOR:testing -->

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

|| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| `005-whole-system-gate` | Predecessor | Reconciled to PASS on the finalized tree alongside this phase | The reader-contract check lives in the gate |
| `009-mode-projection-contracts` | Predecessor | Complete | A projection contract per mode is required for the real reader-contract fold |
| Operator U2 lift | Input | Lifted | Finalize is model-irreversible; the operator lifted the deferral and it executed |
<!-- /ANCHOR:dependencies -->

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

Not pushed. Every edited file is restorable from git in the worktree; a `git checkout HEAD -- <path>` reverts
any unit. Finalize is model-irreversible but physically reversible here: the `.authority-state` records are
gitignored, so they were backed up outside the tree before the flip, and the named rollback is to restore that
backup. The finalize has run; all eight modes are `new_authoritative_final`.
<!-- /ANCHOR:rollback -->

<!-- ANCHOR:cross-refs -->
## Cross-References

|| Reference | Location |
|-----------|----------|
| Requirements | `spec.md` §4 |
| Task list | `tasks.md` |
| Verification contract | `checklist.md` |
| Predecessor | `../005-whole-system-gate/` |
| Predecessor | `../009-mode-projection-contracts/` |
<!-- /ANCHOR:cross-refs -->
