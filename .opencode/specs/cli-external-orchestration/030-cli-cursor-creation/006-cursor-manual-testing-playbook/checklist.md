---
title: "Verification Checklist: Cursor manual-testing playbook"
description: "Verification checklist for the Cursor manual-testing playbook phase."
trigger_phrases: ["cursor manual testing playbook checklist"]
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "cli-external-orchestration/030-cli-cursor-creation/006-cursor-manual-testing-playbook"
    last_updated_at: "2026-07-24T04:16:30Z"
    last_updated_by: "claude-code"
    recent_action: "Authored checklist.md for phase 006 (Planned)"
    next_safe_action: "Author phase 007"
    blockers: []
    key_files: ["spec.md", "plan.md", "tasks.md"]
    session_dedup: { fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000", session_id: "cli-cursor-creation-authoring", parent_session_id: null }
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->
# Verification Checklist: Cursor manual-testing playbook

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
- [ ] CHK-003 [P1] cli-codex root playbook + a scenario file read as the structural template
<!-- /ANCHOR:pre-impl -->

<!-- ANCHOR:code-quality -->
## CODE QUALITY
- [ ] CHK-004 [P0] 9 category subdirectories present, each with `>=1` `CU-NNN` scenario file
- [ ] CHK-005 [P0] Total scenario count is 15-20 inclusive; CU-NNN sequence is gap-free and duplicate-free from CU-001
- [ ] CHK-006 [P1] `execution-modes`/`approvals-and-sandbox` use Cursor's real modes/flags, not ported sibling categories
<!-- /ANCHOR:code-quality -->

<!-- ANCHOR:testing -->
## TESTING
- [ ] CHK-007 [P0] Hallucination-fixture scenario exists; its Fail condition names the fake-flag reference explicitly
- [ ] CHK-008 [P0] `validate_document.py` reports 0 structural errors on every playbook file
- [ ] CHK-009 [P1] Cursor-unique categories (worktree-isolation, cloud-worker) each note their execution-safety caveat
<!-- /ANCHOR:testing -->

<!-- ANCHOR:fix-completeness -->
## FIX COMPLETENESS
- [ ] CHK-010 [P1] `hooks` category names the CLI partial-event-delivery caveat and the phase-004 events
<!-- /ANCHOR:fix-completeness -->

<!-- ANCHOR:security -->
## SECURITY
- [ ] CHK-011 [P0] No scenario embeds a real credential/token; only placeholders for `CURSOR_API_KEY`/`CURSOR_AUTH_TOKEN`
<!-- /ANCHOR:security -->

<!-- ANCHOR:docs -->
## DOCUMENTATION
- [ ] CHK-012 [P0] Root file's Global Preconditions gate EXECUTION on `cursor-agent login` and note fail-closed-without-auth
- [ ] CHK-013 [P1] Playbook cross-referenced from `cli-cursor/SKILL.md`
- [ ] CHK-014 [P2] No fabricated changelog/version-history narrative in this phase's docs
<!-- /ANCHOR:docs -->

<!-- ANCHOR:file-org -->
## FILE ORGANIZATION
- [ ] CHK-015 [P1] Temp files in `scratch/` only; cleaned before completion
<!-- /ANCHOR:file-org -->

<!-- ANCHOR:summary -->
## Verification Summary
| Category | Total | Verified |
|---|---|---|
| P0 Items | 6 | [ ]/6 |
| P1 Items | 7 | [ ]/7 |
| P2 Items | 1 | [ ]/1 |

**Verification Date**: Planned — not yet executed.
<!-- /ANCHOR:summary -->

---

## RELATED DOCUMENTS
- `spec.md`, `plan.md`, `tasks.md`
