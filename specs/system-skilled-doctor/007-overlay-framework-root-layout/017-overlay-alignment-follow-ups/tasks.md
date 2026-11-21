---
title: "Tasks: Phase 17: overlay alignment follow-ups"
description: "Task Format: T### [P?] Description (file path). Verify: <command> prints <expected output>"
trigger_phrases:
  - "overlay alignment follow ups tasks"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.4 -->
# Tasks: Phase 17: overlay alignment follow-ups

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

`G` is `.skilled/skills/sk-code/sk-code-skilled/assets/scripts/verify-router-sync.cjs`. `E` is `.skilled/commands/doctor/scripts/overlay-engine.cjs`.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Create the worktree through sk-git (`worktrees/500-overlay-alignment-follow-ups`). Verify: `git worktree list` shows the path on that branch.
- [x] T002 Create this phase with `create.sh --phase` (`017-overlay-alignment-follow-ups/`). Verify: `ls` lists `spec.md`, `plan.md`, `tasks.md` and `goal.md`.
- [x] T003 Run the gates on main before any change (`scratch` gate log). Verify: engine 354, guard 20, contract 9, lsa 76, ldoc 10 and router-sync 55 each exit 0.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T004 Add a test that unrouted folder READMEs pass leg 1b (`verify-router-sync.test.cjs`). Verify: on the unfixed `G` it fails with two orphan lines.
- [x] T005 Copy Barter's README skip into the orphan walk (`G`). Verify: `diff` against Barter's copy exits 0 and the router-sync suite passes 56 of 56.
- [x] T006 Add tests that a Python cache is neither shipped nor deleted by a directory entry (`overlay-engine-cache-skip.test.cjs`). Verify: the file fails on the unfixed `E`.
- [x] T007 Add one cache predicate and apply it on both sides of every directory-entry reader (`E`). Verify: the new file and the whole engine suite exit 0.
- [x] T008 Remove a folder the entry stops shipping once only caches are left, and skip `__pycache__` in the README walk (`E`). Verify: three new tests fail on the previous engine, and the engine suite passes 361 of 361.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T009 Run `@review` over `bf6806ad4b3..7153a45a8b9` and this branch, and fix until it approves (`implementation-summary.md`). Verify: the last round prints an APPROVE verdict with no P0 or P1.
- [ ] T010 Merge into local main with `--no-ff` and a `Spec:` trailer, then remove the worktree and branch without force (`main`). Verify: `git branch --list 'worktrees/500-*'` prints nothing.
- [ ] T011 Rerun the gates and strict recursive validation on merged main (`007` parent). Verify: every suite exits 0 and validation prints 17 `RESULT: PASSED` lines.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks marked `[x]`
- [ ] No `[B]` blocked tasks remaining
- [ ] Manual verification passed
- [x] The final review verdict is recorded in `implementation-summary.md`
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
<!-- /ANCHOR:cross-refs -->

---
