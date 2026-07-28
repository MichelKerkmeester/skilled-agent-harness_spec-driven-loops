---
title: "Verification Checklist: Create-Journey Gate Fixes"
description: "Planned verification items for the journey-critical fixes, template consistency, silent-discard reporting, and the two-class journey proof."
trigger_phrases:
  - "create journey gate fixes checklist"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-doc/019-skill-routing-refactor/024-create-journey-gate-fixes"
    last_updated_at: "2026-07-28T00:00:00Z"
    last_updated_by: "claude-code"
    recent_action: "Planned"
    next_safe_action: "Execute after operator go"
    blockers:
      - "Execution awaits operator authorization"
    key_files:
      - "checklist.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "024-create-journey-gate-fixes"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->

# Verification Checklist: Create-Journey Gate Fixes

---

<!-- ANCHOR:protocol -->
## Verification Protocol

Items are marked only with command output or diff evidence at execution time.
<!-- /ANCHOR:protocol -->

---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [ ] CHK-001 [P1] Every lens-2/lens-3 finding re-verified at its cited file:line on the execution tip
- [ ] CHK-002 [P1] Broken parent journey reproduced in a temp dir with the exact doctor/gate failures captured
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [ ] CHK-003 [P1] Generator error path follows the existing ContractError conventions
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing

- [ ] CHK-004 [P1] Failing-fixture test covers the unknown-mode alias row
- [ ] CHK-005 [P1] Two-class journey proof green: scaffold → gate --fix → clean gate → doctor 0 failures
- [ ] CHK-006 [P1] Contract + doctor suites and drift guards pass
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [ ] CHK-007 [P1] resourceContractVersion declared in template + scaffolder; committed manifests byte-identical fleet-wide
- [ ] CHK-008 [P1] Router/registry example templates set-equivalent; doctor 5b/5e pass on an all-examples hub
- [ ] CHK-009 [P1] Workflow conformance steps use gate --fix then clean re-run in both journeys
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [ ] CHK-011 [P1] No new execution paths beyond the generator's named error; probes stay root-contained
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [ ] CHK-010 [P1] Template notes state only validation that actually runs (family, runtimeLoopTypes)
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [ ] CHK-012 [P1] All edits confined to create-skill assets/scripts/SKILL.md and their tests; no new top-level files
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

Pending execution.
<!-- /ANCHOR:summary -->
