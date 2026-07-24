---
title: "Verification Checklist: cli-cursor hooks feature-catalog + playbook coverage"
description: "Verification checklist for the cli-cursor hooks feature-catalog and playbook coverage phase."
trigger_phrases: ["cli-cursor hooks catalog checklist"]
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "cli-external-orchestration/030-cli-cursor-creation/009-cursor-hooks-catalog-and-playbook-coverage"
    last_updated_at: "2026-07-24T15:00:00Z"
    last_updated_by: "claude-code"
    recent_action: "Authored checklist.md for phase 009 (Planned)"
    next_safe_action: "Wait for operator go-ahead before dispatching LUNA agents"
    blockers: []
    key_files: ["spec.md", "plan.md", "tasks.md"]
    session_dedup: { fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000", session_id: "cli-cursor-hooks-catalog-planning", parent_session_id: null }
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->
# Verification Checklist: cli-cursor hooks feature-catalog + playbook coverage

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
- [ ] CHK-003 [P1] `spec-gate-prebind.mjs` re-read fresh immediately before dispatch (it is another session's in-flight work)
<!-- /ANCHOR:pre-impl -->

<!-- ANCHOR:code-quality -->
## CODE QUALITY
- [ ] CHK-004 [P0] Feature catalog names all 5 hook adapter files with source anchors, following `create-feature-catalog`'s exact package contract
- [ ] CHK-005 [P0] Playbook `hooks/` category names all 5 hook adapter files, following `create-manual-testing-playbook`'s exact package contract
- [ ] CHK-006 [P0] `spec-gate-prebind.mjs` is labeled unreviewed/uncommitted everywhere it's mentioned, never presented as confirmed-working
<!-- /ANCHOR:code-quality -->

<!-- ANCHOR:testing -->
## TESTING
- [ ] CHK-007 [P0] `validate_document.py` reports 0 structural errors on every new/modified feature-catalog and playbook file
- [ ] CHK-008 [P1] Grep sweep confirms all 5 adapter filenames present in both docs
- [ ] CHK-009 [P0] `validate.sh 030-cli-cursor-creation --recursive --strict` returns 0/0 after this phase lands
<!-- /ANCHOR:testing -->

<!-- ANCHOR:fix-completeness -->
## FIX COMPLETENESS
- [ ] CHK-010 [P1] Both agents' output independently re-verified by direct file read, not accepted from self-report alone
<!-- /ANCHOR:fix-completeness -->

<!-- ANCHOR:security -->
## SECURITY
- [ ] CHK-011 [P1] No credential/token introduced in any new or modified doc
<!-- /ANCHOR:security -->

<!-- ANCHOR:docs -->
## DOCUMENTATION
- [ ] CHK-012 [P1] Feature catalog and playbook cross-reference each other where the contracts require it
- [ ] CHK-013 [P2] No fabricated changelog/version-history narrative introduced
<!-- /ANCHOR:docs -->

<!-- ANCHOR:file-org -->
## FILE ORGANIZATION
- [ ] CHK-014 [P1] Only in-scope feature-catalog and playbook files touched; no packet-local `graph-metadata.json` added to either package (both are `sk-doc`-owned document types, not spec folders)
<!-- /ANCHOR:file-org -->

<!-- ANCHOR:summary -->
## Verification Summary
| Category | Total | Verified |
|---|---|---|
| P0 Items | 7 | [ ]/7 |
| P1 Items | 6 | [ ]/6 |
| P2 Items | 1 | [ ]/1 |

**Verification Date**: Planned — not yet executed.
<!-- /ANCHOR:summary -->

---

## RELATED DOCUMENTS
- `spec.md`, `plan.md`, `tasks.md`
