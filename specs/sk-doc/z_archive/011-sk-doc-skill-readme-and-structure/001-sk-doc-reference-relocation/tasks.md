---
title: "Tasks: sk-doc reference relocation"
description: "Task list for sk-doc reference relocation."
trigger_phrases:
  - "sk-doc reference relocation"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-doc/z_archive/011-sk-doc-skill-readme-and-structure/001-sk-doc-reference-relocation"
    last_updated_at: "2026-05-10T00:00:00Z"
    last_updated_by: "gpt-5.5"
    recent_action: "Relocated sk-doc creation references and updated stale paths"
    next_safe_action: "Continue with Phase 2 after reviewing Phase 1 handoff"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "102-sk-doc-skill-readme-and-structure"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Tasks: sk-doc reference relocation

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

- [x] T001 Review `resource-map.md`
- [x] T002 Inventory current files and references
- [x] T003 Confirm out-of-scope work remains excluded
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T004 Confirm the six expected source files exist.
- [x] T005 Search requested scopes for old path references.
- [x] T006 Move all six files to references root.
- [x] T007 Remove the old specific directory.
- [x] T008 Update sk-doc and create command references.
- [x] T009 Run exact searches and phase validation.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T900 Run exact searches from resource-map.md
- [x] T901 Run phase validation
- [x] T902 Update handoff evidence
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] Manual verification passed
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Resource Map**: See `resource-map.md`
<!-- /ANCHOR:cross-refs -->
