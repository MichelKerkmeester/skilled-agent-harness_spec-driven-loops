---
title: "Tasks: Code Mode MCP Orphan Lifecycle Fix"
description: "Tasks for the stdio lifecycle fix, dist rebuild, smoke verification, and the one-time orphan reap."
trigger_phrases:
  - "code mode orphan tasks"
  - "lifecycle fix tasks"
  - "orphan reap tasks"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/027-xce-research-based-refinement/004-shared-infrastructure/006-code-mode-orphan-lifecycle"
    last_updated_at: "2026-06-11T16:30:00Z"
    last_updated_by: "claude-fable"
    recent_action: "All tasks complete"
    next_safe_action: "None; complete"
---
# Tasks: Code Mode MCP Orphan Lifecycle Fix

<!-- SPECKIT_LEVEL: 1 -->
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

- [x] T001 Confirm root cause: no lifecycle handling in `index.ts`
- [x] T002 Measure orphan population (16 PPID-1 processes)

<!-- /ANCHOR:phase-1 -->
---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T003 Add `exitWhenSessionEnds()` (stdin EOF/close, transport close, reparent watchdog) (`index.ts`)
- [x] T004 Rebuild dist (`npm run build`)

<!-- /ANCHOR:phase-2 -->
---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T005 Smoke: stdin EOF exits 0 promptly
- [x] T006 Reap 16 orphans; census zero; live servers untouched
- [x] T007 Scoped commit

<!-- /ANCHOR:phase-3 -->
---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks `[x]`, no `[B]`
- [x] Orphan census zero
- [x] Build clean, dist current

<!-- /ANCHOR:completion -->
---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`

<!-- /ANCHOR:cross-refs -->
