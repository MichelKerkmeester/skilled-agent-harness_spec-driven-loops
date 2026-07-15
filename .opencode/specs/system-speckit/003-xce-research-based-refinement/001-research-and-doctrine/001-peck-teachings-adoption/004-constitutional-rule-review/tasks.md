---
title: "Tasks: Phase 4: constitutional-rule-review"
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
    packet_pointer: "system-speckit/003-xce-research-based-refinement/001-research-and-doctrine/001-peck-teachings-adoption/004-constitutional-rule-review"
    last_updated_at: "2026-06-10T06:19:50Z"
    last_updated_by: "gpt-5.5-fast"
    recent_action: "Completed rule staleness diagnostic"
    next_safe_action: "Use diagnostic for future reviews"
    blockers: []
    key_files:
      - "constitutional/"
      - "scripts/constitutional-rule-staleness.cjs"
      - "references/memory/memory_system.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-scaffold/004-constitutional-rule-review"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Phase 4: constitutional-rule-review

<!-- SPECKIT_LEVEL: 2 -->

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

- [x] T001 Choose the diagnostic host (standalone read-only script)
- [x] T002 Choose the field (last_confirmed date plus provenance)
- [x] T003 [P] Determine the backfill source (git last-touch dates per rule)
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T004 Add the field to each constitutional/*.md (backfilled from git)
- [x] T005 Build the read-only diagnostic that lists rules by staleness
- [x] T006 Document the review cadence
- [x] T007 Confirm the diagnostic performs no writes
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T008 Diagnostic prints all rules with date + age, sorted by staleness
- [x] T009 Diff constitutional/ before/after a run; confirm read-only
- [x] T010 Update phase docs; parent changelog left out of scope for this brief
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] Diagnostic verified read-only and complete
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
