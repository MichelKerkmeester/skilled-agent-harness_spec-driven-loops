---
title: "Tasks: Phase 41: goal-held-fixes"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "goal held fixes tasks"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Phase 41: goal-held-fixes

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

- [x] T001 Scaffold the phase and fill the parent phase-map rows (`../spec.md`)
- [x] T002 Record the plugin, hooks node and battery unit suites before any edit (`scratch/baseline.txt`)
- [x] T003 [P] List every caller that runs a `goal.cjs` session action (updated in `651ca91307`)
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T004 Skip null and empty candidates in `statusCodeFromError` (`.opencode/plugins/opencode-goal.js`)
- [x] T005 Delete a goal only on an explicit delete, never on `null` (`.opencode/plugins/opencode-goal.js`)
- [x] T006 Give every archive file a name unique to its record (`.opencode/plugins/opencode-goal.js`)
- [x] T007 Archive the replaced record in `setGoal` and the cleared record in `clearGoal` (`.opencode/plugins/opencode-goal.js`)
- [x] T008 Build the continuation prompt from the bound packet (`.opencode/plugins/opencode-goal.js`)
- [x] T009 Stop at an unreadable current record and skip non-object archives (`.skilled/hooks/goal/lib/goal-core.cjs`)
- [x] T010 Require `--workspace` for current-session actions and update callers (`.skilled/hooks/goal/bin/goal.cjs`)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T011 A test per finding, each failing under a mutation that restores the old code (`scratch/mutations/summary.txt`)
- [x] T012 Plugin, hooks node and battery unit suites rerun at or above baseline (`scratch/after.txt`)
- [x] T013 Live opencode-goal scenario on OpenCode 1.19.3 and 2.0.32 (`scratch/live-goal/`)
- [x] T014 Luna verifies every change (`scratch/luna/`)
- [x] T015 Merge main, push, and record CI on the pushed commit (`implementation-summary.md`)
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



