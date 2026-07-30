---
title: "Verification Checklist: Program-Surface Leftovers"
description: "Verification checklist for program-surface leftovers."
trigger_phrases:
  - "program leftovers verification checklist"
importance_tier: "normal"
contextType: "verification"
_memory:
  continuity:
    packet_pointer: "sk-doc/019-skill-routing-refactor/033-json-optimization-implementation/019-program-surface-leftovers"
    last_updated_at: "2026-07-30T11:00:00Z"
    last_updated_by: "claude-code"
    recent_action: "Authored phase docs"
    next_safe_action: "Begin execution per plan.md"
    blockers: []
    key_files:
      - "checklist.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "033-json-optimization-implementation/019-program-surface-leftovers"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: checklist-core | v2.2 -->
<!-- SPECKIT_LEVEL: 2 -->

# Verification Checklist: Program-Surface Leftovers

---

<!-- ANCHOR:protocol -->
## Verification Protocol

Each item is marked complete only with evidence specific to that item. Evidence text is never reused across items — the defect this program is remediating was a checklist whose rows all shared one blob.
<!-- /ANCHOR:protocol -->

---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [ ] CHK-001 [P1] Each finding was re-confirmed against the current tree before being fixed
- [ ] CHK-002 [P2] Provenance was established for anything blaming outside this program's range
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [ ] CHK-003 [P1] Changes are surgical and confined to the scope declared in spec.md
- [ ] CHK-004 [P1] No ephemeral artifact label appears in any code comment
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing

- [ ] CHK-005 [P0] Every gate was run by exit code, not by reading its tail output
- [ ] CHK-006 [P0] A negative case was exercised for any guard this phase adds
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [ ] CHK-007 [P0] Every requirement in spec.md section 4 has a matching evidence line
- [ ] CHK-008 [P1] Anything deliberately not done is recorded with a reason rather than omitted
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [ ] CHK-009 [P1] No change widens a permission grant or removes an existing containment check
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [ ] CHK-010 [P1] Status and completion fields agree with what the evidence supports
- [ ] CHK-011 [P2] Continuity frontmatter reflects the phase's real state at close
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [ ] CHK-012 [P2] Artifacts live under the phase folder and follow the naming convention
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

- [ ] CHK-013 [P0] `validate.sh <folder> --strict` reports Errors:0
- [ ] CHK-014 [P0] No completion claim in this phase outruns its evidence
- [ ] CHK-015 [P1] Each item above carries evidence unique to itself
<!-- /ANCHOR:summary -->
