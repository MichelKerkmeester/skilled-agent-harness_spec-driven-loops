---
title: "Tasks: Phase 1: self-check-templates"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "tasks"
  - "name"
  - "template"
  - "tasks core"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-speckit/027-xce-research-based-refinement/001-research-and-doctrine/001-peck-teachings-adoption/002-self-check-templates"
    last_updated_at: "2026-06-10T04:32:22Z"
    last_updated_by: "gpt-5.5-fast"
    recent_action: "Completed self-check guidance in manifest templates"
    next_safe_action: "Proceed to next peck phase when ready"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-scaffold/002-self-check-templates"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Phase 1: self-check-templates

<!-- SPECKIT_LEVEL: 1 -->

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

- [x] T001 Inventory the three manifest templates (templates/manifest/{spec,plan,checklist}.md.tmpl)
- [x] T002 Confirm comment-guidance approach vs a tracked section
- [x] T003 [P] Draft the self-check + failure-modes copy
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T004 Add the block to spec.md.tmpl
- [x] T005 Add the block to plan.md.tmpl
- [x] T006 Add the block to checklist.md.tmpl
- [x] T007 Update header/section manifest ONLY if a tracked section was added - not needed because guidance stayed in HTML comments
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T008 Scaffold a throwaway folder and confirm blocks render
- [x] T009 Run validate.sh --strict and confirm green
- [x] T010 Update phase docs; parent changelog is out of allowed scope
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] Strict validation passed on a scaffold
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
<!-- /ANCHOR:cross-refs -->

---

<!--
CORE TEMPLATE (~60 lines)
- Simple task tracking
- 3 phases: Setup, Implementation, Verification
- Add L2/L3 addendums for complexity
-->
