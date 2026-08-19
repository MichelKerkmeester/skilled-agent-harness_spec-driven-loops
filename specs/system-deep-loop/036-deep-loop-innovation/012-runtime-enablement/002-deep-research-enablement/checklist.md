---
title: "Checklist: Deep-Research Enablement"
description: "Blocking verification contract for the pilot mode: seam census, parity with a working negative control, the authority move, and a real post-flip fan-out run."
trigger_phrases:
  - "deep-research enablement checklist"
  - "pilot flip verification"
importance_tier: "critical"
contextType: "planning"
parent: "system-deep-loop/036-deep-loop-innovation/012-runtime-enablement/002-deep-research-enablement"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/036-deep-loop-innovation/012-runtime-enablement/002-deep-research-enablement"
    last_updated_at: "2026-08-19T07:00:00Z"
    last_updated_by: "opencode"
    recent_action: "Defined the pilot verification contract"
    next_safe_action: "Wait for the predecessor gates"
    blockers:
      - "Predecessor 001-append-gateway-and-projection must pass first"
    key_files: []
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Checklist: Deep-Research Enablement

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->

<!-- ANCHOR:protocol -->
## Verification Protocol

The flip is irreversible by policy, so the pre-flip gates carry the entire safety margin. No item here is advisory. A
parity result counts only when a perturbed run has been shown to make the same oracle report divergence.
<!-- /ANCHOR:protocol -->

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [ ] CHK-001 [P0] Predecessor `001-append-gateway-and-projection` complete with its reader contract green (REQ-007)
- [ ] CHK-002 [P0] Both command variants proven by execution to reach one shared composition seam (REQ-001, SC-001)
- [ ] CHK-003 [P0] Pre-flip bytes of every mode's authority record captured (REQ-008, SC-006)
- [ ] CHK-004 [P1] Runtime suite baseline captured before any edit
<!-- /ANCHOR:pre-impl -->

<!-- ANCHOR:code-quality -->
## Code Quality

- [ ] CHK-005 [P0] The seam routes through the gateway with no variant retaining a private write path (REQ-001)
- [ ] CHK-006 [P0] Protocol documents name the gateway; the direct-append instruction is off the canonical path (REQ-002)
- [ ] CHK-007 [P1] The flip supplies no actor, capability, or commit by hand (REQ-005)
- [ ] CHK-008 [P1] Comments carry the durable why; no spec paths, packet numbers, or task ids in code comments
<!-- /ANCHOR:code-quality -->

<!-- ANCHOR:testing -->
## Testing

- [ ] CHK-009 [P0] Live-shaped parity run reports zero divergence (REQ-003, SC-002)
- [ ] CHK-010 [P0] Perturbed run makes the same oracle report divergence (SC-002)
- [ ] CHK-011 [P0] A divergent or stale parity result is shown to block the flip rather than warn (REQ-004)
- [ ] CHK-012 [P0] The transition produced one event, one epoch, one canonical route (SC-003)
- [ ] CHK-013 [P0] A real multi-leaf fan-out completes after the flip (REQ-006, SC-004)
- [ ] CHK-014 [P1] Full suite re-run and reported as a delta against the baseline
<!-- /ANCHOR:testing -->

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [ ] CHK-015 [P0] All six legacy-file consumers still run after the flip; exit statuses recorded (REQ-007, SC-005)
- [ ] CHK-016 [P0] The legacy state file stayed readable throughout the migration (REQ-007)
- [ ] CHK-017 [P1] Leaves in the post-flip fan-out are confirmed to have written through the gateway, not the file (SC-004)
<!-- /ANCHOR:fix-completeness -->

<!-- ANCHOR:security -->
## Security

- [ ] CHK-018 [P0] No non-pilot mode's authority record differs from its pre-flip bytes (REQ-008, SC-006)
- [ ] CHK-019 [P0] Exactly one mode was requested; a multi-mode request was never attempted (REQ-008)
- [ ] CHK-020 [P1] The perturbation used for the negative control was fully discarded
<!-- /ANCHOR:security -->

<!-- ANCHOR:docs -->
## Documentation

- [ ] CHK-021 [P1] `implementation-summary.md` records parity evidence, the negative control, and the fan-out proof
- [ ] CHK-022 [P2] Protocol documents read correctly for an agent that has never seen the old instruction
<!-- /ANCHOR:docs -->

<!-- ANCHOR:file-org -->
## File Organization

- [ ] CHK-023 [P2] Evidence files live in this folder's `scratch/`
- [ ] CHK-024 [P2] The scoped diff touches only this phase's surfaces
<!-- /ANCHOR:file-org -->

<!-- ANCHOR:summary -->
## Verification Summary

- [ ] CHK-025 [P0] `validate.sh` on this folder with `--strict` reports Errors: 0
- [ ] CHK-026 [P0] Every item above is `[x]` with evidence, or the phase is not complete
<!-- /ANCHOR:summary -->

<!-- ANCHOR:sign-off -->
## Sign-off

| Role | Condition |
|------|-----------|
| Builder | Migration and flip complete, evidence written |
| Verifier | Re-ran parity, the negative control, and the fan-out independently |
<!-- /ANCHOR:sign-off -->
