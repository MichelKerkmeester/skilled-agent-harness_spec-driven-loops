---
title: "Tasks: Phase 20: fork-session-guards"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "fork session guards tasks"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Phase 20: fork-session-guards

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

- [x] T001 Probe a headless Claude session for sub-agent hook payloads (scratch `hookprobe/`)
- [x] T002 Confirm from the fork transcript that `session-prime` injected the parent's brief
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T003 Guard tests, red 10 of 10 (`tests/subagent-guard.test.cjs`)
- [x] T004 Helper tests, red 4 (`tests/hook-session-start.vitest.ts`)
- [x] T005 Guard (`claude/subagent-guard.mjs`)
- [x] T006 Helper and skip (`hooks/claude/shared.ts`, `session-prime.ts`)
- [x] T007 Registry row, sync, pinned count 100
- [x] T008 README updates
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T009 Guard 10 of 10, session-start 12 of 12, sync test 7 of 7, tsc clean
- [x] T010 Relaunch suite 594 of 594, drift guards 4 of 4
- [x] T011 End-to-end runs of both built hooks
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



