---
title: "Checklist: Fleet Enablement"
description: "Blocking verification contract for the serial fleet driver: dry run, injected-failure containment, resume without re-flip, per-mode reader contracts, and final fleet authority state."
trigger_phrases:
  - "fleet enablement checklist"
  - "fleet driver verification"
importance_tier: "critical"
contextType: "planning"
parent: "system-deep-loop/036-deep-loop-innovation/012-runtime-enablement/003-fleet-enablement"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/036-deep-loop-innovation/012-runtime-enablement/003-fleet-enablement"
    last_updated_at: "2026-08-19T07:00:00Z"
    last_updated_by: "opencode"
    recent_action: "Defined the fleet verification contract"
    next_safe_action: "Wait for the pilot phase"
    blockers:
      - "Predecessor 002-deep-research-enablement must pass first"
    key_files: []
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Checklist: Fleet Enablement

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->

<!-- ANCHOR:protocol -->
## Verification Protocol

Assertions are made against authority-record bytes and command exit statuses, never against the driver's own log — the
log is part of what is under test. Every mode is verified on its own evidence; a green on one mode never stands in for
another.
<!-- /ANCHOR:protocol -->

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [ ] CHK-001 [P0] Predecessor `002-deep-research-enablement` complete including its fan-out proof
- [ ] CHK-002 [P0] Each mode's reader set derived from its own projection manifest entries (REQ-003)
- [ ] CHK-003 [P0] Any mode lacking a manifest entry is flagged as a failure to investigate, not skipped (REQ-003)
- [ ] CHK-004 [P0] Pre-run authority record bytes captured for all seven modes (SC-002)
- [ ] CHK-005 [P1] Mode order fixed and recorded as data (REQ-001)
<!-- /ANCHOR:pre-impl -->

<!-- ANCHOR:code-quality -->
## Code Quality

- [ ] CHK-006 [P0] Each coordinator call requests exactly one mode (REQ-006)
- [ ] CHK-007 [P0] Per-mode state is external, so a stopped run is resumable (REQ-005)
- [ ] CHK-008 [P1] The per-mode step is the pilot's procedure parameterised, not a reimplementation
- [ ] CHK-009 [P1] Comments carry the durable why; no spec paths, packet numbers, or task ids in code comments
<!-- /ANCHOR:code-quality -->

<!-- ANCHOR:testing -->
## Testing

- [ ] CHK-010 [P0] Dry run over all six modes changes no authority record, proven by diff against the pre-run capture (SC-001)
- [ ] CHK-011 [P0] An injected failure stops the driver and names both the mode and the failing check (REQ-004, SC-002)
- [ ] CHK-012 [P0] After the injected stop, later modes' records are byte-identical to the pre-run capture (SC-002)
- [ ] CHK-013 [P0] Resume enables the remaining modes without re-flipping earlier ones (REQ-005, SC-003)
- [ ] CHK-014 [P1] Full suite re-run and reported as a delta against a captured baseline
<!-- /ANCHOR:testing -->

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [ ] CHK-015 [P0] Every mode's reader contract passes against that mode's own projected files (REQ-003, SC-004)
- [ ] CHK-016 [P0] All seven authority records read as ledger authority on an independent read (REQ-008, SC-005)
- [ ] CHK-017 [P1] No mode was enabled without passing its own parity gate (REQ-002)
<!-- /ANCHOR:fix-completeness -->

<!-- ANCHOR:security -->
## Security

- [ ] CHK-018 [P0] A multi-mode request was never constructed (REQ-006)
- [ ] CHK-019 [P0] `research` was not re-flipped by the driver
- [ ] CHK-020 [P1] Injected failures and their fixtures were fully removed after the test
<!-- /ANCHOR:security -->

<!-- ANCHOR:docs -->
## Documentation

- [ ] CHK-021 [P1] `implementation-summary.md` records the dry run, the injected-failure containment, and the resume
- [ ] CHK-022 [P2] The recorded mode order and its reasoning are legible to someone re-running the driver later
<!-- /ANCHOR:docs -->

<!-- ANCHOR:file-org -->
## File Organization

- [ ] CHK-023 [P2] The driver lives under `runtime/scripts/` alongside the existing operational scripts
- [ ] CHK-024 [P2] Evidence files live in this folder's `scratch/`
<!-- /ANCHOR:file-org -->

<!-- ANCHOR:summary -->
## Verification Summary

- [ ] CHK-025 [P0] The completed run required no operator input after it started (REQ-007, SC-006)
- [ ] CHK-026 [P0] `validate.sh` on this folder with `--strict` reports Errors: 0
- [ ] CHK-027 [P0] Every item above is `[x]` with evidence, or the phase is not complete
<!-- /ANCHOR:summary -->

<!-- ANCHOR:sign-off -->
## Sign-off

| Role | Condition |
|------|-----------|
| Builder | Driver built, full run complete, evidence written |
| Verifier | Re-read the authority records independently rather than trusting the driver's log |

<!-- /ANCHOR:sign-off -->
