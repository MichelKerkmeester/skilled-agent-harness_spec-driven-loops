---
title: "Tasks: Phase 7: compiled-routing-withdrawal"
description: "Ordered tasks for compiled-routing-withdrawal, each closed with recorded command evidence."
trigger_phrases:
  - "008 phase 007 tasks"
  - "compiled-routing-withdrawal tasks"
importance_tier: "normal"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Phase 7: compiled-routing-withdrawal

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

- [x] T001 Observe the guard's state after the class change — evidence: `sk-prompt inputs-do-not-compile` alongside `cli-external-orchestration stale-manifest`
- [x] T002 Enumerate every surface that names the hub — evidence: Closure manifest hub list and file set, a runtime rollout bundle, an activation fence, four hardcoded lists and the authored copies of the first three
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T003 Remove the hub from the closure manifest — evidence: Hub list 6 to 5; file set 55 to 48 with the count field updated to match
- [x] T004 Delete the runtime rollout bundle and activation fence — evidence: Both directories removed
- [x] T005 Remove the four hardcoded hub entries — evidence: Guard, sync tool, runtime resolver and the bundle-path map; a search across all four returns nothing
- [x] T006 Delete the authored copies of the same artifacts — evidence: Authored activation and rollout directories removed, leaving five hubs in each
- [x] T007 Refresh the hubs whose routing inputs earlier phases edited — evidence: One hub refreshed here and a second later in the program, each followed by carrying its new hash into the authored manifest
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T008 Confirm the withdrawal is total — evidence: A search across the guard, the sync tool, the runtime engine and the closure manifest returns nothing
- [x] T009 Run the freshness guard — evidence: `All hubs fresh or excused: serving matches inputs, and the runtime matches its source`
- [x] T010 Re-run after the later re-mint — evidence: Guard clean again with all five hubs fresh
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]` — evidence: every task above carries a recorded command result
- [x] No `[B]` blocked tasks remaining — evidence: no task in this phase entered a blocked state
- [x] Manual verification passed — evidence: see the Verification table in `implementation-summary.md`
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
<!-- /ANCHOR:cross-refs -->

---
