---
title: "Verification Checklist: docs, agents, governance and closeout"
description: "Verification checklist for the cli-cursor docs/agents/governance/closeout phase."
trigger_phrases: ["cli-cursor closeout checklist"]
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "cli-external-orchestration/030-cli-cursor-creation/007-docs-agents-governance-and-closeout"
    last_updated_at: "2026-07-24T04:16:30Z"
    last_updated_by: "claude-code"
    recent_action: "Authored checklist.md for phase 007 (Planned)"
    next_safe_action: "Author the phase-parent spec.md"
    blockers: []
    key_files: ["spec.md", "plan.md", "tasks.md"]
    session_dedup: { fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000", session_id: "cli-cursor-creation-authoring", parent_session_id: null }
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->
# Verification Checklist: docs, agents, governance and closeout

All items below are unchecked — this phase is Planned, not yet implemented.

<!-- ANCHOR:protocol -->
## Verification Protocol
| Priority | Handling |
|---|---|
| P0 | Must pass before this phase is Complete |
| P1 | Should pass; document any gap |
| P2 | Nice-to-have; document if skipped |
<!-- /ANCHOR:protocol -->

<!-- ANCHOR:pre-impl -->
## PRE-IMPLEMENTATION
- [ ] CHK-001 [P0] Requirements documented in `spec.md`
- [ ] CHK-002 [P0] Technical approach defined in `plan.md`
- [ ] CHK-003 [P0] Touch-list built from a fresh grep of the current tree, not a replayed template
<!-- /ANCHOR:pre-impl -->

<!-- ANCHOR:code-quality -->
## CODE QUALITY
- [ ] CHK-004 [P0] Every roster/governance/cross-skill surface enumerating the 3 siblings gains a symmetric `cli-cursor` entry (no "3-of-4" surfaces)
- [ ] CHK-005 [P1] Each added mention matches its siblings' exact phrasing/format in that surface
<!-- /ANCHOR:code-quality -->

<!-- ANCHOR:testing -->
## TESTING
- [ ] CHK-006 [P0] `validate.sh --recursive --strict` on `030-cli-cursor-creation` returns 0 errors, 0 warnings across parent + all children
- [ ] CHK-007 [P0] `parent-skill-check.cjs` and `validate_skill_package.py` against the hub both return 0 fails
- [ ] CHK-008 [P1] Coverage-sweep grep confirms `cli-cursor` present wherever all 3 siblings appear
<!-- /ANCHOR:testing -->

<!-- ANCHOR:fix-completeness -->
## FIX COMPLETENESS
- [ ] CHK-009 [P1] Completion metadata reconciled: 001 Complete, 002-006 Planned, 007 status truthful; no doc claims a conflicting state
<!-- /ANCHOR:fix-completeness -->

<!-- ANCHOR:security -->
## SECURITY
- [ ] CHK-010 [P1] No credential/token introduced in any governance or roster edit
<!-- /ANCHOR:security -->

<!-- ANCHOR:docs -->
## DOCUMENTATION
- [ ] CHK-011 [P1] Root-`AGENTS.md`-as-Cursor-rules question resolved with a recorded decision
- [ ] CHK-012 [P1] No fabricated Cursor changelog/version-history narrative introduced
<!-- /ANCHOR:docs -->

<!-- ANCHOR:file-org -->
## FILE ORGANIZATION
- [ ] CHK-013 [P1] Only in-scope grep-identified files edited; no concurrently-dirty file staged
<!-- /ANCHOR:file-org -->

<!-- ANCHOR:summary -->
## Verification Summary
| Category | Total | Verified |
|---|---|---|
| P0 Items | 5 | [ ]/5 |
| P1 Items | 8 | [ ]/8 |
| P2 Items | 0 | [ ]/0 |

**Verification Date**: Planned — not yet executed.
<!-- /ANCHOR:summary -->

---

## RELATED DOCUMENTS
- `spec.md`, `plan.md`, `tasks.md`
