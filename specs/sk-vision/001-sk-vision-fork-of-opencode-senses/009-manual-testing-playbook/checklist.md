---
title: "Verification Checklist: sk-vision 009 manual testing playbook"
description: "Verification Date: 2026-08-16"
trigger_phrases:
  - "sk-vision 009 checklist"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-vision/001-sk-vision-fork-of-opencode-senses/009-manual-testing-playbook"
    last_updated_at: "2026-08-16T12:00:00.000Z"
    last_updated_by: "pi"
    recent_action: "Created 009 checklist skeleton."
    next_safe_action: "Fill with evidence at closeout."
    blockers: []
    key_files:
      - "checklist.md"
      - "spec.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "sk-vision-009-manual-testing-playbook"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Verification Checklist: sk-vision 009 manual testing playbook

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->

---

<!-- ANCHOR:protocol -->
## Verification Protocol

| Priority | Handling | Completion Impact |
|----------|----------|-------------------|
| **[P0]** | HARD BLOCKER | Cannot claim done until complete |
| **[P1]** | Required | Complete or documented deferral |

---

<!-- ANCHOR:items -->
## Verification Items

| ID | Priority | Item | Status | Evidence |
|----|----------|------|--------|----------|
| V001 | P0 | Root playbook at canonical path | [ ] | test -f |
| V002 | P0 | 16 scenarios, IDs VSN-001..016, kebab-case, no numeric prefixes | [ ] | find output matches spec table |
| V003 | P0 | Deterministic contracts with synchronized prompts | [ ] | read per file + grep table vs contract |
| V004 | P0 | `validate-playbook-package.cjs` exit 0 | [ ] | command output |
| V005 | P0 | root `validate_document.py --type reference` exit 0 | [ ] | command output |
| V006 | P0 | benchmark scaffold only (no report files) | [ ] | find benchmark/ output |
| V007 | P1 | catalog cross-links resolve | [ ] | test -f each link target |
| V008 | P1 | live evidence or named-blocker SKIP recorded | [ ] | implementation-summary |
| V009 | P0 | `validate.sh --strict` on this child exit 0 | [ ] | command output |
<!-- /ANCHOR:items -->
