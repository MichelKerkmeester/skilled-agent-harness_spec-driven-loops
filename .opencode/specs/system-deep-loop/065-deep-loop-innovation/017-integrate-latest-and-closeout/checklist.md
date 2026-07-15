---
title: "Checklist: Integrate Latest & Closeout (065 phase 014)"
description: "Checklist for phase 014 of the system-deep-loop recommendations implementation: final integration, drift reopening, whole-system gate rerun, and packet closeout."
trigger_phrases:
  - "integrate latest and closeout checklist"
  - "deep-loop phase 014 checklist"
importance_tier: "critical"
contextType: "planning"
parent: "system-deep-loop/065-deep-loop-innovation/017-integrate-latest-and-closeout"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/065-deep-loop-innovation/017-integrate-latest-and-closeout"
    last_updated_at: "2026-07-15T16:30:00Z"
    last_updated_by: "opencode"
    recent_action: "Defined the blocking final-SHA and closeout verification contract"
    next_safe_action: "Run the final-SHA gate only after drift dispositions are complete"
    blockers: []
    key_files: []
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Verification Checklist: Integrate Latest & Closeout

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->

<!-- ANCHOR:protocol -->
## Verification Protocol

This checklist is the blocking SOL verifier contract for phase 014. Every item is checked against the exact final SHA; the report records the origin target, pre-integration SHA, final SHA, reopened phases, commands, exit codes, generated-metadata result, and any approved carry-forward item. A pre-integration phase-013 result is historical evidence only.
<!-- /ANCHOR:protocol -->

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [ ] CHK-006 [P0] Phase `016-whole-system-gate` is green on its pre-integration SHA with receipts and candidate evidence
- [ ] CHK-007 [P2] The origin target, pre-integration SHA, pinned 000 baseline, and integration worktree are recorded before merge
<!-- /ANCHOR:pre-impl -->

<!-- ANCHOR:code-quality -->
## Code Quality

- [ ] CHK-008 [P1] Integration and closeout changes are scoped to the phase contract; no adjacent cleanup or silent phase patching is included
- [ ] CHK-009 [P2] Research inputs and historical receipts remain append-only; no recommendation, open-item, or changelog history is deleted
<!-- /ANCHOR:code-quality -->

<!-- ANCHOR:testing -->
## Testing

- [ ] CHK-001 [P0] Latest origin is integrated in a clean worktree and the final SHA, merge result, and unexpected-mutation check are recorded
- [ ] CHK-002 [P0] Touched contracts are re-censused and each has an owning phase, changed assumption, baseline/receipt impact, and drift disposition
- [ ] CHK-003 [P0] Relevant drift reopens the owning phase and downstream consumers before phase 013 is rerun
- [ ] CHK-004 [P0] The complete phase-013 gate runs on the exact final SHA, including behavior and mode baselines, mixed-version replay, crash injection, counterfactual and degeneration tests, and parity against 000
- [ ] CHK-013 [P0] A blocking SOL receipt is bound to the final SHA and records gate commands, exit codes, and evidence paths
- [ ] CHK-014 [P0] Recursive `validate.sh --strict` passes on the final candidate and no pre-integration receipt is presented as final evidence
- [ ] CHK-015 [P0] Every 065 open item has an append-only disposition, owner, or explicit carry-forward next action
- [ ] CHK-016 [P0] Parent and child statuses, phase-map state, completion percentages, and gate results reconcile after verification
- [ ] CHK-017 [P0] Deterministic metadata tooling regenerates `description.json` and `graph-metadata.json` across the affected packet tree without hand-written generated content
- [ ] CHK-018 [P1] Final changelog entries identify the integration target, final SHA, gate outcome, reopened phases, and remaining approved deferrals
<!-- /ANCHOR:testing -->

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [ ] CHK-005 [P1] The drift ledger covers every changed contract and proves either a relevant reopen route or a non-relevant disposition
<!-- /ANCHOR:fix-completeness -->

<!-- ANCHOR:security -->
## Security

- [ ] CHK-010 [P2] No credentials, tokens, or sensitive runtime data are written into the integration report, changelogs, or generated metadata
<!-- /ANCHOR:security -->

<!-- ANCHOR:docs -->
## Documentation

- [ ] CHK-011 [P2] The phase outcome, final SHA, reopen set, gate result, open-item dispositions, and metadata result are reflected in the packet docs
<!-- /ANCHOR:docs -->

<!-- ANCHOR:file-org -->
## File Organization

- [ ] CHK-012 [P1] Integration lands through a clean, path-scoped worktree workflow with no unexpected tracked mutation outside the accepted candidate
<!-- /ANCHOR:file-org -->

<!-- ANCHOR:summary -->
## Verification Summary

The phase is complete when every P0 check passes on one exact final SHA, every relevant drift item has a reopened and reverified owner, the complete phase-013 gate is green, generated metadata and parent status reconcile, and the closeout record preserves all historical evidence and approved carry-forward work.
<!-- /ANCHOR:summary -->

<!-- ANCHOR:sign-off -->
## Sign-off

Signed off when the SOL verifier confirms the final-SHA contract, recursive strict validation is green, the generated metadata is refreshed, and the final worktree and packet state show no unexpected mutation.
<!-- /ANCHOR:sign-off -->
