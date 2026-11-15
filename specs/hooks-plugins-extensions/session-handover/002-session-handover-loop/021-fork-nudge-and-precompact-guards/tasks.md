---
title: "Tasks: Phase 21: fork-nudge-and-precompact-guards"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "fork nudge and precompact guards tasks"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Phase 21: fork-nudge-and-precompact-guards

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

- [x] T001 Probe a fork's PostToolUse payload (scratch `hookprobe/`)
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T002 Nudge tests, red 1 of 38 (`tests/claude-adapters.test.cjs`)
- [x] T003 PreCompact helper tests, red (`tests/hook-precompact.vitest.ts`)
- [x] T004 Nudge skip (`claude/context-nudge.mjs`)
- [x] T005 `isSubagentPayload`, skip and log line (`compact-inject.ts`)
- [x] T006 README updates
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T007 Relaunch suite 596 of 596, PreCompact and session-start 25 of 25, tsc clean
- [x] T008 Built PreCompact hook logs the skip for a fork payload
- [x] T009 Drift guards 4 of 4, README validators 0 issues
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



