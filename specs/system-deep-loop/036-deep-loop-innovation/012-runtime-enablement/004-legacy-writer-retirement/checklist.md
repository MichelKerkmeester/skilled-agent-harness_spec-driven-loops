---
title: "Checklist: Legacy Writer Retirement"
description: "Blocking verification contract for retiring the direct-append writers: tree-wide absence, a guard proven by firing, and every legacy file still produced by the projection."
trigger_phrases:
  - "legacy writer retirement checklist"
  - "direct append guard verification"
importance_tier: "critical"
contextType: "planning"
parent: "system-deep-loop/036-deep-loop-innovation/012-runtime-enablement/004-legacy-writer-retirement"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/036-deep-loop-innovation/012-runtime-enablement/004-legacy-writer-retirement"
    last_updated_at: "2026-08-19T07:00:00Z"
    last_updated_by: "opencode"
    recent_action: "Defined the retirement verification contract"
    next_safe_action: "Wait for the fleet phase"
    blockers:
      - "Predecessor 003-fleet-enablement must pass first"
    key_files: []
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Checklist: Legacy Writer Retirement

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->

<!-- ANCHOR:protocol -->
## Verification Protocol

Two rules govern this phase. Absence is proven by a tree-wide search, not by the list of files that were edited. And a
guard counts only after it has been observed failing a real attempted direct append.
<!-- /ANCHOR:protocol -->

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [ ] CHK-001 [P0] Predecessor `003-fleet-enablement` complete with all seven modes on ledger authority
- [ ] CHK-002 [P0] Tree-wide inventory of direct-append paths completed across documents and code (REQ-006)
- [ ] CHK-003 [P0] Per-mode contents of every manifest-named legacy file captured (REQ-004, SC-004)
- [ ] CHK-004 [P1] Authority record bytes captured for all seven modes (REQ-007, SC-006)
<!-- /ANCHOR:pre-impl -->

<!-- ANCHOR:code-quality -->
## Code Quality

- [ ] CHK-005 [P0] No executable direct-append path remains reachable (REQ-002, SC-002)
- [ ] CHK-006 [P1] Each removed or neutralised path is recorded with which was chosen and why
- [ ] CHK-007 [P1] The guard fails loudly rather than logging and continuing (REQ-003)
- [ ] CHK-008 [P1] Comments carry the durable why; no spec paths, packet numbers, or task ids in code comments
<!-- /ANCHOR:code-quality -->

<!-- ANCHOR:testing -->
## Testing

- [ ] CHK-009 [P0] A real attempted direct append fails; the guard was observed firing (REQ-008, SC-003)
- [ ] CHK-010 [P0] Tree-wide search finds no direct-append instruction in any mode's protocol documents (REQ-001, SC-001)
- [ ] CHK-011 [P0] Tree-wide search finds no reachable direct-append code path (REQ-002, SC-002)
- [ ] CHK-012 [P1] Full suite re-run and reported as a delta against a captured baseline
<!-- /ANCHOR:testing -->

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [ ] CHK-013 [P0] Every manifest-named legacy file exists and is current after its writer is retired, compared against the pre-phase capture rather than merely existing (REQ-004, SC-004)
- [ ] CHK-014 [P0] Every consumer of every legacy file runs post-retirement; exit statuses recorded (REQ-005, SC-005)
- [ ] CHK-015 [P1] No legacy file lost its only producer
<!-- /ANCHOR:fix-completeness -->

<!-- ANCHOR:security -->
## Security

- [ ] CHK-016 [P0] All seven authority records are byte-identical to their pre-phase state (REQ-007, SC-006)
- [ ] CHK-017 [P1] The direct append used to prove the guard left no residue in any ledger or legacy file
<!-- /ANCHOR:security -->

<!-- ANCHOR:docs -->
## Documentation

- [ ] CHK-018 [P1] `implementation-summary.md` records the inventory, the per-path decisions, and the guard firing
- [ ] CHK-019 [P2] Protocol documents read correctly for an agent that never saw the direct-append instruction
<!-- /ANCHOR:docs -->

<!-- ANCHOR:file-org -->
## File Organization

- [ ] CHK-020 [P2] Evidence files live in this folder's `scratch/`
- [ ] CHK-021 [P2] The scoped diff touches only protocol documents, direct-append paths, and the guard
<!-- /ANCHOR:file-org -->

<!-- ANCHOR:summary -->
## Verification Summary

- [ ] CHK-022 [P0] `validate.sh` on this folder with `--strict` reports Errors: 0
- [ ] CHK-023 [P0] Every item above is `[x]` with evidence, or the phase is not complete
<!-- /ANCHOR:summary -->

<!-- ANCHOR:sign-off -->
## Sign-off

| Role | Condition |
|------|-----------|
| Builder | Retirement complete, guard in place, evidence written |
| Verifier | Re-ran the tree-wide searches and the guard firing independently |
<!-- /ANCHOR:sign-off -->
