---
title: "Tasks: Phase 3: constitutional-rule-review [template:level_1/tasks.md]"
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
    packet_pointer: "system-spec-kit/028-peck-teachings-adoption/004-constitutional-rule-review"
    last_updated_at: "2026-06-02T10:04:54Z"
    last_updated_by: "planning-author"
    recent_action: "Authored phase tasks (planned, not implemented)"
    next_safe_action: "Implement: add last_confirmed field + review diagnostic"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-scaffold/004-constitutional-rule-review"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Phase 3: constitutional-rule-review

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

- [ ] T001 Choose the diagnostic host (script vs /doctor vs /memory:manage)
- [ ] T002 Choose the field (last_confirmed date vs review_by deadline)
- [ ] T003 [P] Determine the backfill source (git dates per rule)
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T004 Add the field to each constitutional/*.md (backfilled from git)
- [ ] T005 Build the read-only diagnostic that lists rules by staleness
- [ ] T006 Document the review cadence
- [ ] T007 Confirm the diagnostic performs no writes
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T008 Diagnostic prints all rules with date + age, sorted by staleness
- [ ] T009 Diff constitutional/ before/after a run; confirm read-only
- [ ] T010 Update phase docs + changelog
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks marked `[x]`
- [ ] No `[B]` blocked tasks remaining
- [ ] Diagnostic verified read-only and complete
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
