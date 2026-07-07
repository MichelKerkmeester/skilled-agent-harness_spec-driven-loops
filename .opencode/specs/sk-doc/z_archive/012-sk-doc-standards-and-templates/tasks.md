---
title: "Tasks: sk-doc Standards & Templates De-Numbering [133/001/tasks]"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "133 phase 001 tasks"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "sk-doc/z_archive/012-sk-doc-standards-and-templates"
    last_updated_at: "2026-06-06T00:00:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Authored phase 001 tasks during 133 scaffold"
    next_safe_action: "Execute T001 after approval"
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
# Tasks: sk-doc Standards & Templates De-Numbering

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->

---

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
| `[P]` | Parallelizable |
| `[B]` | Blocked |

**Task Format**: `T### [P?] Description (file path)`
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 cli-opencode provider pre-flight (Xiaomi/opencode-go); cache configured providers
- [x] T002 Read the 12 contract files + confirm exact edit anchors (spec §3)
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T003 Rewrite per-feature filename rule + add ordering rule (`sk-doc/references/feature_catalog_creation.md`)
- [x] T004 Rewrite numeric-slug line + tree example (`sk-doc/references/manual_testing_playbook_creation.md`)
- [x] T005 [P] De-number tree/table/rules/scaffold/Related-refs (`assets/feature_catalog/feature_catalog_template.md`)
- [x] T006 [P] De-number scaffold + metadata path + Related refs (`assets/feature_catalog/feature_catalog_snippet_template.md`)
- [x] T007 [P] De-number tree + Feature-File links + scaffold; KEEP Feature IDs (`assets/testing_playbook/manual_testing_playbook_template.md`)
- [x] T008 [P] De-number scaffold + metadata path (`assets/testing_playbook/manual_testing_playbook_snippet_template.md`)
- [x] T009 [P] Align create-command doc (`commands/create/feature-catalog.md`)
- [x] T010 [P] Align create-command doc (`commands/create/testing-playbook.md`)
- [x] T011 [P] Align YAML assets (`commands/create/assets/create_feature_catalog_{auto,confirm}.yaml`)
- [x] T012 [P] Align YAML assets (`commands/create/assets/create_testing_playbook_{auto,confirm}.yaml`)
- [x] T013 De-stale `NNN-feature.md` comment, NO logic change (`sk-doc/scripts/validate_document.py`)
- [x] T014 De-stale description if needed (`sk-doc/assets/template_rules.json`)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T015 Run `test_validator.py` + sk-doc strict validate
- [x] T016 Run REQ grep guards (no numbered-filename guidance remains; category folders intact)
- [x] T017 DeepSeek adversarial diff review: category numbering preserved; validator logic intact
- [x] T018 Scoped commit (`git commit --only -- <12 paths>`); verify `git show --stat HEAD`
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] Validator tests + grep guards pass; review sign-off recorded in checklist.md
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Checklist**: See `checklist.md`
<!-- /ANCHOR:cross-refs -->
