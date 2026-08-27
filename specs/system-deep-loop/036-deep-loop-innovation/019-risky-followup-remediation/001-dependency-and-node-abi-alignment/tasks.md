---
title: "Tasks: dependency-seams Worktree-Symlink Fix"
description: "Task breakdown for realpath-ing the dependency-seams comparison base so it passes under a git worktree's symlinked node_modules."
importance_tier: "high"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/036-deep-loop-innovation/019-risky-followup-remediation/001-dependency-and-node-abi-alignment"
    last_updated_at: "2026-08-26T12:20:00.000Z"
    last_updated_by: "claude"
    recent_action: "Realpath'd the comparison base; dependency-seams passes 6/6"
    next_safe_action: "Commit 001; push both 019 children"
---
# Tasks: dependency-seams Worktree-Symlink Fix

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

- [x] T001 Capture the exact failing assertions + messages from the suite JSON (`dependency-seams.vitest.ts:42`, `:63`)
- [x] T002 Confirm `runtime/node_modules` is a symlink to the main checkout (`ls -ld`, `readlink -f`)
- [x] T003 Prove `require.resolve()` returns the realpath (main path) while the base is the raw worktree path
- [x] T004 Confirm the version assertion (#3) passes and the `12.10.0`/`12.11.1` drift is orthogonal
- [x] T005 Decide (operator): realpath the base; defer the version bump (`realpathSync`)

<!-- /ANCHOR:phase-1 -->
---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T006 Import `realpathSync` from `node:fs`
- [x] T007 Realpath the runtime-`node_modules` base in the own-resolution assertion (`:42`)
- [x] T008 Realpath the same base in the tsx-loader assertion (`dependency-seams.vitest.ts:63`)
- [x] T009 Leave the sibling assertion + `PINNED` untouched (scope lock)

<!-- /ANCHOR:phase-2 -->
---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T010 `dependency-seams.vitest.ts` passes 6/6 (`vitest run`)
- [x] T011 Change confined to the one test file (`git diff --stat`)
- [x] T012 Watched the raw-base assertions fail before the fix (negative control via `node` repro)
- [x] T013 Whole runtime suite vs 017 baseline: no new code-caused failures (`vitest run`)
- [x] T014 `validate.sh --strict` clean; reconcile docs

<!-- /ANCHOR:phase-3 -->
---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] `dependency-seams` passes 6/6 in the worktree
- [x] No dependency, lockfile, or production change
- [x] The version drift recorded as separately scoped
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
