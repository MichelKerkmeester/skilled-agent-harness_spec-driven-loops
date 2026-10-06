---
title: "Tasks: Recycle an advisor daemon that runs code older than the current build"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "stale build daemon recycle tasks"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Recycle an advisor daemon that runs code older than the current build

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

- [x] T001 Trace why a rebuilt advisor kept serving old code
- [x] T002 Confirm the CLI connects to a live daemon without the launcher
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T003 Add the launcher predicate and the recycle ahead of the bridge
- [x] T004 Keep a skipped recycle silent on stdout and fall back to the bridge
- [x] T005 Add the CLI predicate and the recycle wait
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T006 Run the predicate tests, advisor suite, stress suite and typecheck
- [x] T007 Prove both paths live against a real daemon
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



