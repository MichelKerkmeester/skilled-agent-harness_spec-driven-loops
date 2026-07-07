---
title: "Verification Checklist: sk-code Asset-Template Alignment + Smart-Router Conformance"
description: "Verification Date: 2026-06-14"
trigger_phrases:
  - "sk-code asset router checklist"
  - "asset template verification"
  - "router guard checklist"
  - "loading levels verification"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "sk-code/z_archive/010-sk-code-ponytail-based-refinement/007-sk-code-asset-router-alignment"
    last_updated_at: "2026-06-14T06:45:00Z"
    last_updated_by: "claude-opus"
    recent_action: "Verification items checked against guard evidence"
    next_safe_action: "Run validate.sh --strict on this phase folder"
    blockers: []
    key_files:
      - ".opencode/skills/sk-code/SKILL.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "146-007-sk-code-asset-router-alignment"
      parent_session_id: null
    completion_pct: 95
    open_questions: []
    answered_questions: []
---
# Verification Checklist: sk-code Asset-Template Alignment + Smart-Router Conformance

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->

---

<!-- ANCHOR:protocol -->
## Verification Protocol

| Priority | Handling | Completion Impact |
|----------|----------|-------------------|
| **[P0]** | HARD BLOCKER | Cannot claim done until complete |
| **[P1]** | Required | Must complete OR get user approval |
| **[P2]** | Optional | Can defer with documented reason |
<!-- /ANCHOR:protocol -->

---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [x] CHK-001 [P0] Requirements documented in spec.md (REQ-001..REQ-006)
- [x] CHK-002 [P0] Technical approach defined in plan.md (additive, structural-only)
- [x] CHK-003 [P1] Dependencies identified and available (sk-doc validator, sk-code guards)
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] Edited assets/SKILL.md pass structure validation (`validate_document.py` VALID)
- [x] CHK-011 [P0] No validator errors or warnings on the changed files
- [x] CHK-012 [P1] N/A - no executable code changed; markdown conformance only
- [x] CHK-013 [P1] Edits follow the sk-doc asset + smart-router templates
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing

- [x] CHK-020 [P0] All acceptance criteria met (REQ-001..REQ-006 verified)
- [x] CHK-021 [P0] Manual verification complete (guard outputs captured)
- [x] CHK-022 [P1] Edge case: STACK_FOLDERS still parses; both Iron Law lines intact
- [x] CHK-023 [P1] Negative case: playbook by-section anchors still resolve
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [x] CHK-FIX-001 [P0] N/A - conformance task, not a bug fix; no findings to classify
- [x] CHK-FIX-002 [P0] N/A - no behavioral producer changed (router prose is additive)
- [x] CHK-FIX-003 [P0] Consumer scan done: playbook + verify_stack_folders + canary checked
- [x] CHK-FIX-004 [P0] N/A - no security/path/parser/redaction logic touched
- [x] CHK-FIX-005 [P1] N/A - no input matrix; structural doc edits only
- [x] CHK-FIX-006 [P1] N/A - no process-wide state read
- [x] CHK-FIX-007 [P1] Evidence pinned to this branch's guard runs, not a moving range
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] No hardcoded secrets (markdown docs only)
- [x] CHK-031 [P0] N/A - no input handling changed
- [x] CHK-032 [P1] N/A - no auth/authz surface touched
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] Spec/plan/tasks synchronized with the implemented work
- [x] CHK-041 [P1] N/A - no code comments added; markdown content preserved verbatim
- [ ] CHK-042 [P2] README update not required; sk-code README unaffected by this conformance pass
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P1] No temp files outside scratch/
- [x] CHK-051 [P1] scratch/ empty at completion
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 12 | 12/12 |
| P1 Items | 13 | 13/13 |
| P2 Items | 1 | 0/1 |

**Verification Date**: 2026-06-14
<!-- /ANCHOR:summary -->

---
