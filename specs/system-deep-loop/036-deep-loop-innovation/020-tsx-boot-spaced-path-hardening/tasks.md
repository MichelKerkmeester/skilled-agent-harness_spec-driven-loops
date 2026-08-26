---
title: "Tasks: tsx Boot + Containment-Root Hardening"
description: "Task breakdown for the tsx child-env flag strip across 10 entrypoints and the DEEP_LOOP_REPO_ROOT containment override."
importance_tier: "high"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/036-deep-loop-innovation/020-tsx-boot-spaced-path-hardening"
    last_updated_at: "2026-08-26T16:30:00.000Z"
    last_updated_by: "claude"
    recent_action: "Implemented + verified; tasks complete"
    next_safe_action: "Reconcile docs; commit"
---
# Tasks: tsx Boot + Containment-Root Hardening

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

- [x] T001 Reproduce the flag-triggered tsx failure class (`NODE_PRESERVE_SYMLINKS=1` + spaced tsx path)
- [x] T002 Confirm the flag is unused by the runtime (`grep NODE_PRESERVE_SYMLINKS` = none; `realpathSafe` = `fs.realpathSync`)
- [x] T003 Enumerate the 10 tsx re-exec entrypoints (`require.resolve('tsx')`)
- [x] T004 Confirm `repoRoot` is `process.cwd()` at the two `fanout-run.cjs` containment sites

<!-- /ANCHOR:phase-1 -->
---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T005 Create `scripts/runtime-bootstrap.cjs` with `tsxChildEnv` + `resolveContainmentRepoRoot`
- [x] T006 Rewire all 10 entrypoints' tsx child env to `tsxChildEnv({ DEEP_LOOP_TSX_LOADED: '1' })`
- [x] T007 Wire both `fanout-run.cjs` containment sites to `resolveContainmentRepoRoot(process.env, process.cwd())`
- [x] T008 Leave the unrelated `AI_SESSION_CHILD` spawn in `codex-dispatch.cjs` untouched
- [x] T009 `node -c` the helper + all 10 entrypoints

<!-- /ANCHOR:phase-2 -->
---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T010 Write `scripts/tests/runtime-bootstrap.test.cjs` (both helpers + 10-entrypoint guard)
- [x] T011 An entrypoint boots its TS under `NODE_PRESERVE_SYMLINKS=1` (`loop-lock.cjs status`)
- [x] T012 `run-node-tests.mjs`: new test discovered (84 files); no new failures vs baseline
- [x] T013 Runtime vitest suite: no new code-caused failures vs baseline
- [x] T014 `validate.sh --strict` clean; reconcile docs

<!-- /ANCHOR:phase-3 -->
---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All 10 entrypoints route through `tsxChildEnv`
- [x] `DEEP_LOOP_REPO_ROOT` override resolves; blank ignored
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
