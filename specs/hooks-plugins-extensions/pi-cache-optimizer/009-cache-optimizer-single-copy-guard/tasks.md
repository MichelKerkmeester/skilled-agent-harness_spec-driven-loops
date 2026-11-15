---
title: "Tasks: Let a second pi-cache-optimizer copy stand down so pi starts in git worktrees"
description: "Reproduce the worktree conflict, add the copy claim and its tests, and prove the load with a two-copy Pi run."
trigger_phrases:
  - "cache optimizer single copy guard tasks"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.4 -->
# Tasks: Let a second pi-cache-optimizer copy stand down so pi starts in git worktrees

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

**Task Format**: `T### [P?] Description (file path). Verify: <command> prints <expected output>`

`E` is `.pi/extensions/pi-cache-optimizer`.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Reproduce the conflict from the worktree. Verify: `pi -p ...` prints `Tool "edit_lines" conflicts with`. Evidence: printed, and the same run from the main checkout printed `OK`.
- [x] T002 Take the baseline (`E`). Verify: `npm test` prints `fail 0`. Evidence: `pass 118, fail 0`, and `npm run typecheck` exited 0.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T003 Add the copy claim and the guarded entry point (`E/index.ts`). Verify: `npm run typecheck` exits 0. Evidence: exit 0.
- [x] T004 Add the two-copy tests (`E/tests/copy-claim.test.ts`). Verify: `npm test` prints `fail 0`. Evidence: `pass 120, fail 0`.
- [x] T005 Record the fork change (`E/CHANGES-FROM-UPSTREAM.md`). Verify: `rg -n 'One Active Copy per Load' E/CHANGES-FROM-UPSTREAM.md` prints one line.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T006 Run Pi from the worktree with a throwaway agent folder linking to a second copy. Verify: the old code prints the conflict and the new code does not. Evidence: the control run printed `Tool "edit_lines" conflicts with ...`; the guarded run printed no extension error and stopped only at the missing model, since the throwaway folder holds no provider config.
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
