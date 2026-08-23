---
title: "Feature Specification: Full Enablement and Finalize"
description: "Advance all eight modes from reversible to final authority so the legacy shadow writer is dropped, make the whole-system gate's reader-contract check observe a real ledger-projected read, and reach a literal PASS verdict — completing the runtime enablement the reversible flip stopped short of."
trigger_phrases:
  - "full enablement finalize"
  - "authority finalize"
  - "reader contract enablement"
importance_tier: "critical"
contextType: "implementation"
parent: "system-deep-loop/036-deep-loop-innovation/012-runtime-enablement"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/036-deep-loop-innovation/012-runtime-enablement/010-full-enablement-finalize"
    last_updated_at: "2026-08-23T16:30:00Z"
    last_updated_by: "claude"
    recent_action: "Scoped the finalize transition, gate authority-state widening, and the real reader-contract check"
    next_safe_action: "Build the window-free reversible-to-final CAS in the authority registry"
    blockers: []
    key_files:
      - ".opencode/skills/system-deep-loop/runtime/lib/per-mode-authority-flip/authority-registry.ts"
      - ".opencode/skills/system-deep-loop/runtime/scripts/flip-authority.cjs"
      - ".opencode/skills/system-deep-loop/runtime/lib/per-mode-authority-flip/authority-selector.ts"
    completion_pct: 0
    open_questions: []
    answered_questions:
      - "The rollback-window ceremony is not required for this system; finalize is window-free by operator decision, recorded honestly rather than fabricated as satisfied"
      - "The reversible flip already routes canonical writes to the ledger writer, so literal PASS needs a real reader-contract check, not a state change"
---

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->

# Feature Specification: Full Enablement and Finalize

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Packet** | system-deep-loop/036-deep-loop-innovation/012-runtime-enablement/010-full-enablement-finalize |
| **Level** | 2 |
| **Priority** | P0 |
| **Status** | Planned |
| **Created** | 2026-08-23 |
| **Owner skill** | system-deep-loop |
| **Authority posture** | All eight modes advance reversible → final; the legacy shadow writer is dropped |

> Phase adjacency under `012-runtime-enablement`: this child was created after `005-whole-system-gate`
> reached an honest INCOMPLETE-clean verdict (six checks pass, reader-contracts recorded not-run because no
> mode was fully enabled). The operator directed that the improved ledger loop go live and the legacy path be
> dropped, and that the rollback-window migration ceremony — an over-engineering for this system's risk
> profile — not gate the cutover. This phase completes the enablement so the gate returns a literal PASS.
<!-- /ANCHOR:metadata -->

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

The reversible flip moved all eight modes to `new_authoritative_reversible`, which already routes every
canonical write to the ledger-backed (`dark`) writer while keeping the legacy writer alive as a shadow. Two
things remain before the improved loop is genuinely live rather than shadowed. First, no mode has advanced to
`new_authoritative_final`, so the legacy shadow writer is never dropped and the legacy path is still carried.
Second, the whole-system gate's reader-contract check is a hardcoded `not-run` stub — it names an
end-to-end ledger-projected read but observes nothing — so the gate can only reach INCOMPLETE, never a literal
PASS that attests the loop reads live.

### Purpose

Advance all eight modes to `new_authoritative_final` through a window-free finalize transition, widen the
gate's authority-state check to accept the final state, and replace the reader-contract stub with a real,
negative-controlled check that folds each mode's ledger through its projection contract, materializes the
legacy file, and proves a real consumer reads it — so the gate returns a literal PASS earned by observed
behaviour.

### Calibration

> **Severity calibration (carry verbatim, do not re-escalate).** The actor for every risk below is the
> operator or a stale local file in a not-pushed worktree, never a remote attacker. Read every item as
> cutover-readiness and integrity risk, not breach risk.

### Non-Goals

- Fabricating rollback-window, rollback-drill, or successful-execution evidence. Finalize is window-free by an
  explicit, recorded operator decision; nothing pretends the window closed.
- Deleting the rollback-gate and rollback-drill modules. Removing that unused machinery is follow-up cleanup,
  not a precondition for the loop going live.
- Changing what the ledger writer produces or how the projection contracts fold. Those shipped in `009`.
- Softening any passing gate condition. The reader-contract check is completed to observe a real read; it must
  still be able to fail and to record not-run when a real read is absent.

<!-- /ANCHOR:problem -->

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

- A window-free `new_authoritative_reversible → new_authoritative_final` compare-and-swap in the authority
  registry, mirroring the existing forward and rollback CAS methods, honest about bypassing the certificate
  and window by operator decision.
- A finalize path in the flip runner that drives that CAS for the frozen mode order, re-reads each record from
  disk, and fails loudly unless the record actually landed at `final` — never reporting success without a
  written record.
- Widening the gate's authority-state check to accept `new_authoritative_final` (and its description) without
  removing the requirement that every mode be on a stored ledger-authoritative record.
- Replacing the reader-contract stub with a real check: for each mode, fold its ledger through its projection
  contract, materialize the legacy file, run the mode's real consumer against it, and assert a clean read; a
  module-level negative control that makes a load-bearing assertion go red when disabled.

### Out of Scope

- Rollback-gate/drill/window module deletion, protocol-document edits, and pushing the branch.

### Affected Surfaces

| Surface | Change |
|---------|--------|
| `lib/per-mode-authority-flip/authority-registry.ts` | New window-free reversible→final CAS method |
| `lib/per-mode-authority-flip/types.ts` | Finalize transition facts / input types |
| `scripts/flip-authority.cjs` | Finalize path, assert-on-disk, CAS negative-control seam |
| `005-whole-system-gate/scratch/run-gate.mjs` | Authority-state accepts final; reader-contracts becomes a real check |
| `tests/unit/` | Finalize CAS + flip-runner tests; reader-contract check tests with negative control |
<!-- /ANCHOR:scope -->

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

- **REQ-001**: A window-free reversible→final CAS advances a mode to `new_authoritative_final` at epoch N+1 with the selected writer staying `dark`.
- **REQ-002**: The finalize transition record honestly states no rollback-window/certificate precondition was required; it fabricates no window, drill, or execution evidence.
- **REQ-003**: The flip runner re-reads each record from disk after finalize and fails unless it is exactly `new_authoritative_final` at the expected epoch.
- **REQ-004**: After finalize, the selector routes each mode to `dark` with no shadow route; the legacy shadow writer is dropped.
- **REQ-005**: The gate's authority-state check passes when every mode is on a stored `new_authoritative_final` record and still fails on the absent-record default.
- **REQ-006**: The gate's reader-contract check runs a real end-to-end read for every mode: ledger fold → materialized legacy file → real consumer → clean-read assertion.
- **REQ-007**: The reader-contract check carries an independent negative control that turns a load-bearing assertion red when its single condition is disabled, and green when restored.
- **REQ-008**: The finalize CAS is proven by an attempted finalize against a wrong expected state/epoch that is denied and leaves the record whole.
<!-- /ANCHOR:requirements -->

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: `verify-authority.cjs` reports all eight modes on `new_authoritative_final` from a stored record.
- **SC-002**: The whole-system gate returns verdict PASS with every check passing and none not-run.
- **SC-003**: The reader-contract check is proven real by a negative control: disabling its one condition turns it red; restoring turns it green, with both counts recorded.
- **SC-004**: The finalize CAS negative control (wrong expected epoch) is denied and the on-disk record is byte-identical afterwards.
- **SC-005**: The runtime suite's failed-test count does not increase against the captured baseline.
- **SC-006**: The working tree is unchanged by the gate run, proven by status and diff.
<!-- /ANCHOR:success-criteria -->

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Risk | Consequence | Mitigation |
|------|-------------|------------|
| Finalize skips a real safety window | An irreversible cutover with no stability soak | Confined to a not-pushed worktree by operator decision; the record states the window was not satisfied rather than faking it; `.authority-state` records restorable |
| The reader-contract check passes vacuously | A green that observes no real read — the exact defect this epic hunts | The check runs each mode's real consumer against a materialized file and carries a negative control proven red at the command line |
| Widening authority-state hides a half-finalized fleet | The gate passes with some modes not final | The check requires every mode on a stored final record and still fails on the absent-record default |
| Finalizing breaks consumers assuming reversible | Suite regressions | Full-suite re-run measured against the captured baseline; fix root causes before claiming PASS |

**Dependencies**: `005-whole-system-gate` (honest INCOMPLETE-clean baseline), `009-mode-projection-contracts`
(a projection contract per mode). No successor; this is the epic's terminal enabling phase.
<!-- /ANCHOR:risks -->

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

None requiring an operator. The operator has directed a window-free finalize and a live ledger loop with the
legacy path dropped; rollback-module deletion is deferred cleanup recorded in the summary.
<!-- /ANCHOR:questions -->
