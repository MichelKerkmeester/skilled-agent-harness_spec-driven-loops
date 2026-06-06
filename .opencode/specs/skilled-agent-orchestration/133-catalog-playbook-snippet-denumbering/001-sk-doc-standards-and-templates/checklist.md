---
title: "Verification Checklist: sk-doc Standards & Templates De-Numbering [133/001/checklist]"
description: "Verification Date: 2026-06-06"
trigger_phrases:
  - "133 phase 001 checklist"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/133-catalog-playbook-snippet-denumbering/001-sk-doc-standards-and-templates"
    last_updated_at: "2026-06-06T00:00:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Authored phase 001 checklist during 133 scaffold"
    next_safe_action: "Verify items as edits land"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-session"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Verification Checklist: sk-doc Standards & Templates De-Numbering

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

- [ ] CHK-001 [P0] Requirements documented in spec.md (REQ-001..006)
- [ ] CHK-002 [P0] Technical approach + dispatch briefs defined in plan.md
- [ ] CHK-003 [P1] cli-opencode provider pre-flight passed (Xiaomi/opencode-go)
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [ ] CHK-010 [P0] No prescriptive numbered-snippet-filename guidance remains (REQ-001/003): `rg 'NNN-feature|globally sequential|3-digit|[0-9]{3}-feature-name' sk-doc/references sk-doc/assets/feature_catalog sk-doc/assets/testing_playbook` = 0
- [ ] CHK-011 [P0] Category-folder numbering `NN--category-name` PRESERVED everywhere (REQ-002)
- [ ] CHK-012 [P0] Ordering rule (root doc defines order) present in both references (REQ-004)
- [ ] CHK-013 [P1] create-command docs + YAML assets aligned (REQ-005)
- [ ] CHK-014 [P1] Feature IDs (`{CAT}-001`, `M-NNN`) left intact in playbook template links
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing

- [ ] CHK-020 [P0] `python3 .opencode/skills/sk-doc/scripts/tests/test_validator.py` passes (logic unchanged)
- [ ] CHK-021 [P0] sk-doc strict validation passes on edited references/templates
- [ ] CHK-022 [P1] `git diff sk-doc/scripts/validate_document.py` shows comment-only change (no logic delta)
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [ ] CHK-FIX-001 [P0] Finding class recorded: this is a `cross-consumer` doc-contract change (references → templates → create-commands → validator wording)
- [ ] CHK-FIX-002 [P0] Same-class producer inventory done: every sk-doc surface that states the snippet convention enumerated (spec §3)
- [ ] CHK-FIX-003 [P0] Consumer inventory: create-commands + validator comment + template_rules description all updated together
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [ ] CHK-030 [P0] No secrets; doc/config-only edits
- [ ] CHK-031 [P1] Dispatch briefs carry BANNED OPERATIONS + ALLOWED WRITE PATHS (RM-8)
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [ ] CHK-040 [P1] spec/plan/tasks/checklist synchronized
- [ ] CHK-041 [P1] DeepSeek review sign-off recorded (category numbering preserved)
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [ ] CHK-050 [P1] Only the 12 contract files changed (no snippet renames in this phase)
- [ ] CHK-051 [P1] Scoped commit used (`git commit --only`); `git show --stat HEAD` verified
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 9 | [ ]/9 |
| P1 Items | 9 | [ ]/9 |
| P2 Items | 0 | [ ]/0 |

**Verification Date**: 2026-06-06 (planned)
<!-- /ANCHOR:summary -->
