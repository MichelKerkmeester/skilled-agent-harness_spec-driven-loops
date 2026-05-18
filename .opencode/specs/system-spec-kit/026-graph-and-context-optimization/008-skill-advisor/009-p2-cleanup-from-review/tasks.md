---
title: "Tasks: Phase 1: p2-cleanup-from-review [template:level_1/tasks.md]"
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
    packet_pointer: "scaffold/009-p2-cleanup-from-review"
    last_updated_at: "2026-05-18T06:42:51Z"
    last_updated_by: "template-author"
    recent_action: "Closed launcher lease P2 cleanup"
    next_safe_action: "Run final validation evidence"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-scaffold/009-p2-cleanup-from-review"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Phase 1: p2-cleanup-from-review

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

- [x] T001 Read packet scope and approved file table
- [x] T002 Read the 3 launchers, lease helper, integrity helper, skill graph DB, contract doc, and tests
- [x] T003 [P] Confirm package-specific typecheck and vitest commands
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T004 Add `startedAt=` diagnostics to all `LEASE_HELD_BY` paths
- [x] T005 Add SIGQUIT and uncaughtException lease cleanup hooks across launchers
- [x] T006 Add readonly SQLite lease probe and integrity busy timeout hardening
- [x] T007 Remove code-index non-lease state writes from the lease-file path
- [x] T008 Expand DELETE-mode warning and DB-dir override documentation
- [x] T009 Tighten launcher-lease tests and add clean-exit/SIGQUIT/startedAt coverage
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T010 Run 3 package typechecks
- [x] T011 Run 3 targeted `launcher-lease` suites, 6 tests each
- [x] T012 Run existing skill-advisor `launcher-bootstrap` suite
- [x] T013 Create packet changelog and strict validation evidence
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] Verification passed with recorded evidence
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
