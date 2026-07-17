---
title: "Tasks: Standards, Templates & Config"
description: "Task breakdown for standards, templates & config."
trigger_phrases:
  - "001-standards-templates-config tasks"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-doc/011-skill-anchor-toc-removal/001-standards-templates-config"
    last_updated_at: "2026-05-26T00:00:00Z"
    last_updated_by: "claude-opus-4-7"
    recent_action: "Updated standards/templates/config to forbid TOC"
    next_safe_action: "Proceed to phase 002"
    blockers: []
    key_files: []
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Tasks: Standards, Templates & Config

<!-- SPECKIT_LEVEL: 1 -->
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
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Confirm tocRequired flags + validator gating
- [x] T002 Locate all template/standards/create-command files
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T003 Flip tocRequired:false for readme/install_guide/playbook
- [x] T004 Update core_standards TOC policy to Never
- [x] T005 Strip TOC/anchors from the sk-doc doc templates
- [x] T006 Remove TOC mandates from creation references + create-command contracts/YAMLs
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T007 Update test_validator.py 2 cases
- [x] T008 Confirm TOC-less README passes validate_document.py
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] Verification passed
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
<!-- /ANCHOR:cross-refs -->
