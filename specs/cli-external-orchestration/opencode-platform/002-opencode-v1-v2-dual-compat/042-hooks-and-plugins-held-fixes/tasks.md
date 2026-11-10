---
title: "Tasks: Phase 42: hooks-and-plugins-held-fixes"
description: "Ordered tasks for the held hook and plugin fixes: baseline, one fix per finding with a failing-first test, live plugin reruns, review and ship."
trigger_phrases:
  - "hooks and plugins held fixes tasks"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Phase 42: hooks-and-plugins-held-fixes

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
- [x] T002 Record the suite counts before any edit (`scratch/baseline/`)
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T003 [P] Unarm hop-cap and stale records only at their own arm time (`.skilled/hooks/session-relaunch/lib/killer.cjs`)
- [x] T004 [P] Treat `last` as a non-negative count (`.skilled/hooks/session-relaunch/lib/hop-history.cjs`)
- [x] T005 [P] Redact `Bearer` tokens (`.skilled/hooks/post-edit-quality/lib/post-edit-router.cjs`)
- [x] T006 [P] Pick the first string path field (`.skilled/hooks/post-edit-quality/codex/post-edit-quality.cjs`, `devin/post-edit-quality.cjs`)
- [x] T007 [P] Keep the iteration config inside the project (`.skilled/hooks/task-dispatch/lib/dispatch-guard.cjs`)
- [x] T008 Serialise the loop-count update (`.skilled/hooks/task-dispatch/lib/dispatch-guard.cjs`)
- [x] T009 [P] Resolve the hooks folder through git (`.skilled/hooks/git/install-hooks.sh`)
- [x] T010 [P] Resolve the Cursor child from the adapter's folder (`.skilled/hooks/mcp-route-guard/cursor/mcp-route-guard.mjs`)
- [x] T011 [P] Accept every truthy kill-switch value in the route-guard core (`.skilled/hooks/mcp-route-guard/lib/mcp-route-guard.cjs`)
- [x] T012 [P] Cap the bytes the shared stdin reader keeps (`.skilled/hooks/shared/hook-adapter-shared.cjs`)
- [x] T013 [P] Cache the relaunch flags file until it changes (`.opencode/plugins/session-relaunch.js`)
- [x] T014 [P] Use the core's unknown-session token in event handling (`.opencode/plugins/system-spec-gate.js`)
- [x] T015 Cache file hashes by file identity and cap concurrent advisor spawns (`.opencode/plugins/system-skill-advisor.js`)
- [x] T016 [P] Run the startup guards without blocking the event stream (`.opencode/plugins/session-cleanup.js`)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T017 Revert each fix and show its new test fail (`scratch/mutation/`)
- [x] T018 Rerun the plugin, hook node:test, hook vitest and battery unit suites (`scratch/after/`)
- [x] T019 Rerun the four touched plugin scenarios live on both versions (`scratch/live-runs/`)
- [x] T020 Luna review of every change (`scratch/luna/`)
- [x] T021 Merge main, push, and record CI on the pushed commit (`implementation-summary.md`)
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
