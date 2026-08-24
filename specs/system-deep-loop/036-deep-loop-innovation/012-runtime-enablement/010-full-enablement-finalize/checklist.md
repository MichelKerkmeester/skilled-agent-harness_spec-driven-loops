---
title: "Checklist: Full Enablement and Finalize"
description: "Blocking verification contract for the finalize transition, the widened gate authority-state, the real reader-contract check, and the literal PASS verdict — every item negative-controlled and no removed-safety evidence fabricated."
trigger_phrases:
  - "full enablement finalize checklist"
importance_tier: "critical"
contextType: "verification"
parent: "system-deep-loop/036-deep-loop-innovation/012-runtime-enablement/010-full-enablement-finalize"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/036-deep-loop-innovation/012-runtime-enablement/010-full-enablement-finalize"
    last_updated_at: "2026-08-24T06:19:12Z"
    last_updated_by: "claude"
    recent_action: "Conformed the checklist to the v2.2 template; all items stay pending and U2-deferred"
    next_safe_action: "Work the checks as each build unit lands, once the operator lifts the U2 deferral"
    blockers:
      - "U2 finalize is deferred by operator decision; no check has been exercised"
    key_files: []
    completion_pct: 0
    open_questions: []
    answered_questions:
      - "Finalize is window-free by operator decision; the record states no window was satisfied rather than faking one"
---
# Checklist: Full Enablement and Finalize

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->

<!-- ANCHOR:protocol -->
## Verification Protocol

A check counts only when its guard has been shown able to fail: every new guard is negative-controlled
(disable one condition → red; restore → green; record both counts). Finalize is window-free by an explicit
operator decision — the record states no window was satisfied, and nothing fabricates a closed window, drill,
or execution evidence. No item here is advisory. This packet is Planned and U2-deferred: every item is pending.
<!-- /ANCHOR:protocol -->

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [ ] CHK-001 [P0] Predecessor `009-mode-projection-contracts` complete — a projection contract per mode exists for the real reader-contract fold (REQ-006)
- [ ] CHK-002 [P0] Predecessor `005-whole-system-gate` baseline present — the reader-contract check is completed inside the gate the earlier phase built (REQ-006)
<!-- /ANCHOR:pre-impl -->

<!-- ANCHOR:code-quality -->
## Code Quality

- [ ] CHK-003 [P0] The finalize record honestly states no rollback-window/certificate precondition was required; it fabricates no window, drill, or execution evidence (REQ-002)
- [ ] CHK-004 [P1] Comments carry the durable why; no spec paths, packet numbers, or task ids in code comments
<!-- /ANCHOR:code-quality -->

<!-- ANCHOR:testing -->
## Testing

- [ ] CHK-005 [P0] Finalize CAS lands a mode at `new_authoritative_final` epoch N+1, writer `dark` (REQ-001, SC-001)
- [ ] CHK-006 [P0] Flip runner fails when the on-disk record did not land at final (REQ-003)
- [ ] CHK-007 [P0] Finalize CAS negative control: a wrong-epoch attempt is denied and the record is byte-identical after (REQ-008, SC-004)
- [ ] CHK-008 [P0] Gate authority-state passes on eight stored final records and fails on the absent-record default (REQ-005, SC-005)
- [ ] CHK-009 [P0] Reader-contract check runs a real per-mode read: fold → materialize → consumer → clean read (REQ-006, SC-002)
- [ ] CHK-010 [P0] Reader-contract negative control: red-when-disabled, green-when-restored, both counts recorded (REQ-007, SC-003)
- [ ] CHK-011 [P0] `verify-authority.cjs` shows eight modes on final from stored records (SC-001)
- [ ] CHK-012 [P0] Full suite candidate failed-count ≤ baseline (SC-005)
<!-- /ANCHOR:testing -->

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [ ] CHK-013 [P0] The selector routes each final mode to `dark` with no shadow route; the legacy shadow writer is dropped (REQ-004)
- [ ] CHK-014 [P0] The whole-system gate returns verdict PASS with zero not-run (SC-002)
<!-- /ANCHOR:fix-completeness -->

<!-- ANCHOR:security -->
## Security

- [ ] CHK-015 [P0] No authority record is advanced except through the audited finalize CAS; the integrity digest and lock discipline are preserved (REQ-001)
<!-- /ANCHOR:security -->

<!-- ANCHOR:docs -->
## Documentation

- [ ] CHK-016 [P1] `implementation-summary.md` records the finalize records, the gate PASS, the suite delta, and the negative controls — authored once the work is built (REQ-002)
<!-- /ANCHOR:docs -->

<!-- ANCHOR:file-org -->
## File Organization

- [ ] CHK-017 [P2] The scoped diff touches only the authority registry finalize CAS, the flip runner, the gate check, and their tests; the working tree is unchanged by the gate run (SC-006)
<!-- /ANCHOR:file-org -->

<!-- ANCHOR:summary -->
## Verification Summary

- [ ] CHK-018 [P0] `validate.sh 010-full-enablement-finalize --strict` reports Errors: 0
- [ ] CHK-019 [P0] Every item above is `[x]` with evidence, or the phase is not complete
<!-- /ANCHOR:summary -->

<!-- ANCHOR:sign-off -->
## Sign-off

|| Role | Condition |
|------|-----------|
| Builder | Finalize CAS, flip path, gate widening, and real reader-contract check landed with negative controls |
| Verifier | Re-ran `verify-authority.cjs`, the whole-system gate, and the full suite; PASS earned by an observed read |
<!-- /ANCHOR:sign-off -->
