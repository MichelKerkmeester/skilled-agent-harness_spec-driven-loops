---
title: "Tasks: Phase 4: Live-Follow Log Hygiene"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "live follow log hygiene tasks"
importance_tier: "normal"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Phase 4: Live-Follow Log Hygiene

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

- [x] T001 Cap policy: size-based, 256KB default via `LIVE_FOLLOW_LOG_MAX_BYTES`, one retained generation
- [x] T002 Synthetic throwaway repo built; no live follower was touched
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T003 `log_state_change()` early-returns on an unchanged state key; divergence keys on `diverged:$ahead:$behind` (`.opencode/bin/git-live-follow.sh`)
- [x] T004 `fetch-failed` and `fast-forward-blocked` are state-gated too
- [x] T005 Size cap with one retained `.1` generation; incoming bytes accounted before write, never truncated in place
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T006 Held divergence: 4 entries before, 1 after
- [x] T007 Re-entry produced a second entry
- [x] T008 Cap held at the boundary; pid lock preserved and a competing follower exited cleanly
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] Line counts recorded before and after
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Parent**: See `../spec.md`
<!-- /ANCHOR:cross-refs -->

---
