---
title: "Tasks: Phase 3: reap-orphaned-model-server"
description: "Tasks for reaping an orphaned model server at supervisor startup."
trigger_phrases:
  - "reap orphaned model server tasks"
importance_tier: "normal"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Phase 3: reap-orphaned-model-server

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

- [x] T001 Read the demand preflight and reap path (`model-server-supervision.cjs`)
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T002 Orphan branch with parent and command checks (`prepareModelServerDemandTarget`)
- [x] T003 Injectable lookups and no give-up cooldown for this reap
- [x] T004 Tests: orphaned, supervised, reused PID, unreadable parent
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T005 Run the supervision suites
- [x] T006 Live run: `kill -9` a launcher, start the advisor again, check `ps`
- [x] T007 Strict validation of this folder
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
<!-- /ANCHOR:cross-refs -->

---
