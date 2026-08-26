---
title: "Tasks: Containment Auto-Scope for Symlinked Spec Trees"
description: "Task breakdown for auto-resolving the containment repo root to the artifact's real worktree."
importance_tier: "high"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/036-deep-loop-innovation/021-containment-symlink-autoscope"
    last_updated_at: "2026-08-26T17:30:00.000Z"
    last_updated_by: "claude"
    recent_action: "Implemented + verified; tasks complete"
    next_safe_action: "Reconcile docs; commit"
---
# Tasks: Containment Auto-Scope for Symlinked Spec Trees

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core + level2-verify | v2.2 -->

---

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
| `[B]` | Blocked |

<!-- /ANCHOR:notation -->
---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Reproduce the catch-22: symlinked spec tree -> `resolveArtifactScope` returns null
- [x] T002 Confirm the guard scopes correctly once the repo root is the artifact's worktree (`resolveArtifactScope`)
- [x] T003 Confirm a non-worktree artifact must stay unscopable (`resolveArtifactScope` null)

<!-- /ANCHOR:phase-1 -->
---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T004 Add `fs` + `realpathSafe` + `isSubpath` to `runtime-bootstrap.cjs`
- [x] T005 Extend `resolveContainmentRepoRoot(env, cwd, opts)` with the artifact-worktree redirect
- [x] T006 Export `realpathSafe`/`isSubpath` for reuse/testing
- [x] T007 Import `__internals` in `fanout-run.cjs`; pass `lineageDir` + `resolveGitToplevel`
- [x] T008 `node -c` the helper + `fanout-run.cjs`

<!-- /ANCHOR:phase-2 -->
---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T009 node:test: redirect / in-worktree / non-worktree / override-wins (real temp symlinks) (`runtime-bootstrap.test.cjs`)
- [x] T010 Manual repro: symlinked artifact scopes; orphan (negative control) rejected (`resolveArtifactScope` null)
- [x] T011 Comment hygiene clean on all changed files (`check-comment-hygiene.sh` exit 0)
- [x] T012 `run-node-tests.mjs`: no new failures; runtime vitest suite: guard tests pass, no new failures
- [x] T013 `validate.sh --strict` clean; reconcile docs

<!-- /ANCHOR:phase-3 -->
---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] Symlinked artifact scopes correctly
- [x] Negative control still rejected; guard untouched
- [x] No new whole-suite regression on either gate
- [x] Docs validated

<!-- /ANCHOR:completion -->
---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Checklist**: See `checklist.md`
- **Parent**: `../spec.md`

<!-- /ANCHOR:cross-refs -->
