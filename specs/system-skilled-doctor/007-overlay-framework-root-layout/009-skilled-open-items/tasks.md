---
title: "Tasks: Phase 9: close the four Skilled-side open items of the overlay layout"
description: "Task Format: T### [P?] Description (file path). Verify: <command> prints <expected output>"
trigger_phrases:
  - "skilled open items tasks"
importance_tier: "normal"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.4 -->
# Tasks: Phase 9: close the four Skilled-side open items of the overlay layout

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
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Bring the worktree branch current with local main (`worktrees/481-overlay-framework-root-layout`). Verify: `git -C <worktree> log -1 --format=%h` prints `b4799f7d547`.
- [x] T002 Take the baseline gates on the worktree at main tip (`plan.md` §2). Verify: the engine suite prints `tests 262`, the guard suite `tests 20`, the contract test `tests 9`.
- [x] T003 Confirm each item before fixing it (`spec.md` Measured Behavior). Verify: each item has a quoted command output there.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T004 [P] Resolve a pinned commit without reading `FETCH_HEAD`, from the consumer, a local upstream checkout or a checked fetch, and refuse naming every place looked (`.skilled/commands/doctor/scripts/release-update.cjs`), with a stale-`FETCH_HEAD` test (`release-update.test.cjs`). Verify: the new test fails on the unfixed engine and passes after. Evidence: `5ce1cd58dc3`; the two new tests fail on the old engine (81/83) and pass after (95/95). Deviation: the fetch into the project stays, because check, align and apply read the pinned base there.
- [x] T005 [P] Run scope discovery once at the fan-out root and hand the list to every lineage config through an optional runner input (`deep-review.yaml`, `fanout-run.cjs`), with a test and the contract docs in step. Verify: the new test passes and a run without the input writes `reviewScopeFiles: []` as before. Evidence: `da0162af612`; deep-loop set 341/341 (baseline 334), and the new seed tests fail on the old runner.
- [x] T006 [P] Probe the top level in `stagedUnownedChanges` with `gitTopLevelOrNull` (`overlay-engine.cjs`), with a real linked-worktree commit test. Verify: the new test fails on the unfixed engine and passes after. Evidence: `3ddeef925dd`; the hook test fails on the old engine and with the upstream reads left on the hook env, and the suite passes 263/263.
- [x] T007 [P] Replace the bare `generate-context.js <spec-folder>` line with the `--json` form (`.skilled/skills/sk-git/references/large-reorg-playbook.md`). Verify: the new form exits 0 on this phase folder. Evidence: `bf51f84b407`; the `--json` form with only `specFolder` exits 1 with `INSUFFICIENT_CONTEXT_ABORT`, so the line adds `sessionSummary`, which exits 0 on this folder.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T008 Run an `@review` pass on the branch diff and fix until it approves. Verify: its final `Review status:` line is a pass. Evidence: `Review status: APPROVED`, two P2 wording findings fixed in `62922548e2b`.
- [x] T009 Rerun the gates on the branch, merge into main, and rerun them on merged main (`plan.md` §2). Verify: every gate exits 0 at or above its baseline count. Evidence: on merged main `1ac1fba6a25` engine 263/263, guard 20/20, contract 9/9, route-validate exit 0, release-update 95/95, deep-loop 341/341 (11 files), each exit 0.
- [x] T010 Strict-validate this phase, phases 010 and 011, and the parent recursively. Verify: every run prints `RESULT: PASSED`. Evidence: `validate.sh --recursive --strict` on the parent printed `RESULT: PASSED` for the parent and all 11 phases, exit 0.
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
