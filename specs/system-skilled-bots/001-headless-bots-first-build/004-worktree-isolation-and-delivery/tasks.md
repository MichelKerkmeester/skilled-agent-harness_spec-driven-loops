---
title: "Tasks: Phase 4: worktree-isolation-and-delivery"
description: "Task Format: T### [P?] Description (file path). Verify: <command> prints <expected output>"
trigger_phrases:
  - "worktree isolation and delivery tasks"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.4 -->
# Tasks: Phase 4: worktree-isolation-and-delivery

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:notation -->
## Task Notation
<!-- FILL: Keep the prefix table and add the two shell variables this task list uses. GOOD: `R` is `scripts/rotate-logs.sh`. `A` is `logs/archive/`. WEAK: Variables are defined below. -->

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
| `[P]` | Parallelizable |
| `[B]` | Blocked |

**Task Format**: `T### [P?] Description (file path). Verify: <command> prints <expected output>`

`B` is `.skilled/skills/system-skilled-bots`. `T` is a temp git repository made by the test fixture, with a fake main checkout that holds a `node_modules` folder.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup
<!-- FILL: Replace the sample tasks with the real setup steps. Each task names a file and a verify command. GOOD: T001 Confirm `logs/archive/` holds 10 archives. Verify: `ls logs/archive | wc -l` prints 10. WEAK: T001 Set up the project. -->

- [x] T001 Confirm phase 3 is closed and its runner refuses `isolation: worktree` (`../003-manual-runner/acceptance-criteria.md`). Verify: `rg -n 'Closeable:\*\* Yes' ../003-manual-runner/acceptance-criteria.md` prints one line. Evidence: `rg -n 'Closeable:\*\* Yes'` printed `109:**Closeable:** Yes`; the refusal sat in `posture.ts` (`isolation-worktree-unsupported`), not the runner.
- [x] T002 Record the operator's answers to ADR-001 to ADR-005 (`decision-record.md`). Verify: `rg -c 'Status\*\* \| Proposed' decision-record.md` prints 0. Evidence: ADR-001 to ADR-005 are Accepted through the frozen decisions D1 to D4 in `goal.md`; `rg -c 'Status\*\* \| Proposed' decision-record.md` prints 0.
- [x] T003 [P] Build the temp-repository fixture with a fake main checkout and a worktree bot `BOT.md` (`$B/runtime/tests/fixtures/`). Verify: `ls $B/runtime/tests/fixtures` lists the worktree bot and the negative fixture. Evidence: worktree bots `tests/fixtures/bots/worktree-posture` and `worktree-slow`, naming stubs in `tests/fixtures/naming-stub/`; the negative checker fixtures live in `scripts/fixtures/` beside the checker's others (ADR-007 item 5).
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation
<!-- FILL: Write one implementation task per file change. Add a `Verify:` line with the command and its expected output. GOOD: T002 Add the `--keep <n>` branch. Verify: `--keep 3` leaves 3 archives. WEAK: T002 Implement the feature. -->

- [x] T004 Resolve the worktree base and refuse a base inside the checkout or a vendored tree (`$B/runtime/lib/isolation.ts`). Verify: the base-refusal test in `isolation.vitest.ts` passes with the default `.worktrees` base refused. Evidence: `isolation.vitest.ts` base-refusal case passed: unconfigured, `.worktrees` from env and from git config, and a base inside the Skilled tree are all refused, with no tree made.
- [x] T005 Create the worktree through `worktree-naming.sh create <slug> --no-provision` with `SPECKIT_WORKTREE_BASE` set for the child call only (`$B/runtime/lib/isolation.ts`). Verify: in `T`, `git worktree list` shows a `worktrees/NNN-<slug>` branch at a path outside the checkout. Evidence: placement case passed; the tree is `<base>/001-bot-nightly` on branch `worktrees/001-bot-nightly`, outside the checkout.
- [x] T006 Link the shared paths, record each link and return path, branch and links (`$B/runtime/lib/isolation.ts`). Verify: `find <worktree> -maxdepth 4 -type l` lists exactly the recorded links. Evidence: placement case asserts the symlinks found in the tree equal the recorded links.
- [x] T007 Remove a clean, unchanged tree by unlinking every recorded link, then `git worktree remove` and `git branch -d`, never forced (`$B/runtime/lib/isolation.ts`). Verify: `rg -n -- '--force|branch -D' $B/runtime/lib/isolation.ts` prints nothing and the removal test passes. Evidence: `rg -n -- '--force\|branch -D' runtime/lib/isolation.ts` printed nothing (rc=1); the removal case passed.
- [x] T008 Keep a dirty, unmerged or half-provisioned tree and write the kept reason (`$B/runtime/lib/isolation.ts`). Verify: the four kept-state rows of the matrix test pass and `git worktree list` still shows each tree. Evidence: kept-state cases passed for dirty untracked, dirty modified, unmerged, stashed and half-provisioned; each tree stays in `git worktree list`.
- [x] T009 Resolve delivery targets from the success list, the failure override and the local-only value (`$B/runtime/lib/delivery.ts`). Verify: the resolution test prints `not-attempted` for an empty list and picks the override on a failed run. Evidence: resolution cases passed: `not-attempted` for an empty list, the override picked on a failed run.
- [x] T010 Write delivery records through `queued`, `claimed`, then `delivered`, `failed` or `unknown`, with no retry from `unknown` (`$B/runtime/lib/delivery.ts`). Verify: the forced-uncertain test leaves one `unknown` record and a send counter of 1. Evidence: forced-uncertain case passed: one `unknown` entry, send counter 1, a second pass sends 0.
- [x] T011 Send the desktop notice through `osascript` and record it as `attempted` only (`$B/runtime/lib/delivery.ts`). Verify: the channel test asserts state `attempted` and never `delivered`. Evidence: a stub answering `acknowledged` is stored as `attempted`; the sender test against a stub `osascript` records exit 0 as `attempted` and exit 1 as `failed`.
- [x] T012 Drop the worktree refusal and call isolation before dispatch and delivery after the terminal record (`$B/runtime/lib/runner.ts`). Verify: the runner test shows the terminal record written before the first send, a lease key with no worktree path, and no `worktree-naming.sh` call for a definition with no posture answer. Evidence: terminal-before-send case passed (the record on disk at send time is terminal, with the entry `claimed`); concurrency case shows no tree path in either lease; the no-posture case shows no naming script call.
- [x] T013 Add the worktree invariant to the checker, importing the shared-path list from `isolation.ts` (`$B/scripts/bot-check.cjs`). Verify: the checker run on the negative fixture exits non-zero and prints the invariant id. Evidence: checker on `scripts/fixtures/worktree-shared-paths-unresolved` exited 1 and printed `FAIL: worktree-shared-paths-unresolved: ...`; it calls `resolveSharedPaths` from `isolation.ts`.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification
<!-- FILL: Write one verification task per requirement. Each one runs a command. GOOD: T003 Run both invocations. Verify: `ls logs/archive | wc -l` prints 3 and 10. WEAK: T003 Test everything. -->

- [x] T014 Run both test files (`$B/runtime/tests/`). Verify: `npx vitest run runtime/tests/isolation.vitest.ts runtime/tests/delivery.vitest.ts` exits 0 with no skipped test. Evidence: 27 passed, 0 skipped, no warning printed.
- [x] T015 Prove the main checkout's dependency folders survive a removal (`$B/runtime/tests/isolation.vitest.ts`). Verify: the entry count of the fake `node_modules` before and after removal is equal. Evidence: removal case: `node_modules` lists alpha, beta and gamma before and after.
- [x] T016 [P] Prove two concurrent worktree runs get different numbers (`$B/runtime/tests/isolation.vitest.ts`). Verify: the concurrency test prints two distinct `NNN` values. Evidence: concurrency case passed with two distinct `NNN` values from two live child runs.
- [x] T017 Run the worktree fixture bot once by hand (`$B/runtime/tests/fixtures/`). Verify: `bots run <fixture-id>` exits 0 and the run record holds a worktree path, a branch and one delivery record per target. Evidence: run with the stub executor first on PATH, not a model: `bots run worktree-posture` exited 0, and the record holds `worktreePath` `<temp>/wtbase/001-bot-worktree-posture`, branch `worktrees/001-bot-worktree-posture` and one delivery entry (`local-only`, `not-attempted`). See implementation-summary.md.
- [x] T018 Kill a worktree run mid-edit (`$B/runtime/tests/isolation.vitest.ts`). Verify: the tree is still in `git worktree list` and the record names it as kept with reason `dirty`. Evidence: kill case passed: the record of the killed run is `unknown`, the tree is kept with reason `dirty`, and it is still in `git worktree list`.
- [x] T019 [P] Grep delivery bodies for secrets and command lines (`$B/runtime/tests/delivery.vitest.ts`). Verify: the test that greps every body for allowlisted environment values finds none. Evidence: body-grep case passed over three bodies.
- [x] T020 [P] Confirm no install path was added (`$B/runtime/lib/`). Verify: `rg -n 'launchctl bootstrap|\.plist' $B/runtime/lib` prints nothing. Evidence: printed nothing, rc=1.
- [x] T021 Notify once when a needs-you item opens, keyed by the item id (`$B/runtime/lib/delivery.ts`). Verify: the needs-you test in `delivery.vitest.ts` shows one send per target and none on a second pass over the same item. Evidence: needs-you case passed: 2 targets, 2 sends, each entry carries the item id, the second pass sends 0.
- [x] T022 Send one real desktop notice through the channel (`scratch/live-desktop-notice.sh`). Verify: a notification appears and the script prints state `attempted`. Evidence: run once with operator approval on 2026-11-23, exit 0, `{"state":"attempted","evidence":"osascript exit 0"}` in `scratch/live-desktop-notice-result.txt`.
- [x] T023 Write a failing negative control for a resumed worktree run (`$B/runtime/tests/isolation.vitest.ts`). Verify: on the code before the fix, a worktree bot that edits and parks, once answered, does not resume in the same tree with the edit. Evidence: the resume failed with the stub's exit 7 because the parked edit was missing from its fresh tree, `expected 'failed' to be 'completed'` (`scratch/resume-negative-control.txt`).
- [x] T024 Keep a parked run's tree as `awaiting-decision` and resume in it, refusing a missing tree as `parked-worktree-missing` and a changed posture as `resume-posture-changed` (`$B/runtime/lib/runner.ts`, `$B/runtime/lib/isolation.ts`, `$B/runtime/lib/dispatch.ts`). Verify: the negative control passes, a removed parked tree refuses the resume with no new tree, and a Vibe resume's prompt names the parked tree. Evidence: the five parked-resume cases pass, including a stale parked prompt and a changed posture; ADR-008 records the rule and its edge cases.
- [x] T025 Check delivery's record rewrites and advance the generation stamp once per pass (`$B/runtime/lib/delivery.ts`). Verify: with the records folder read-only, the claim file names each failed write and the stamp still advances. Evidence: the claim reads `record write failed: as claimed: ... EACCES ...; as attempted: ... EACCES ...`, and the stamp moves once per pass.
- [x] T026 Keep a tree as `dirty`, links intact, when a folder made to hold links holds anything else (`$B/runtime/lib/isolation.ts`). Verify: an install inside the tree's `node_modules` keeps the tree with every link still a link. Evidence: the stray-folder case passes with detail `node_modules/delta`.
- [x] T027 Drive the real linking failure path (`$B/runtime/tests/delivery.vitest.ts`). Verify: an unlistable scope folder makes linking throw, the run is refused `worktree-setup-failed`, the tree is kept `half-provisioned` and the notice names it. Evidence: the case passes with `linking failed: ... EACCES`.
- [x] T028 Finish a fresh tree when a read-only OpenCode run is refused before any child starts (`$B/runtime/lib/runner.ts`). Verify: the refused run's record shows the tree `removed` and the worktree list holds only the checkout. Evidence: the case at `.skilled/skills/system-skilled-bots/runtime/tests/isolation.vitest.ts:431` failed against the earlier code (`scratch/unconfined-refusal-negative-control.txt`, tree left active) and passes now; a resumed tree goes back to `awaiting-decision`.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria
<!-- FILL: Keep the three completion lines and add the one artifact that proves the phase is done. GOOD: `--keep 3` leaves 3 archives and the suite passes. WEAK: Work is complete. -->

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] Manual verification passed (T017 with the stub executor)
- [x] The T017 run record is linked from `implementation-summary.md`
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References
<!-- FILL: Name the spec and plan files. Add the decision record when the packet has one. GOOD: Specification: `spec.md`. Plan: `plan.md`. WEAK: See the other docs. -->

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Decisions**: See `decision-record.md`
- **Closure gate**: See `acceptance-criteria.md`
<!-- /ANCHOR:cross-refs -->

---

## Verification Checklist
<!-- FILL: Fill each checklist section below. GOOD: Each CHK line names the command that answers it. WEAK: The checklist is done. -->

<!-- ANCHOR:protocol -->
## Verification Protocol
<!-- FILL: Keep the three rows and add the rule this packet uses for a blocked task. GOOD: P0 blocks close. P1 needs a recorded reason. WEAK: Follow the priorities. -->

| Priority | Handling | Completion Impact |
|----------|----------|-------------------|
| **[P0]** | HARD BLOCKER | Cannot claim done until complete |
| **[P1]** | Required | Must complete OR get user approval |
| **[P2]** | Optional | Can defer with documented reason |

A task blocked by an unclosed predecessor phase is marked `[B]` with the phase named, and blocks close.
<!-- /ANCHOR:protocol -->

---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation
<!-- FILL: Write one check per setup fact, each with a command. GOOD: CHK-001 [P0] The start commit is in `goal.md` section 4. WEAK: Setup is ready. -->

- [x] CHK-001 [P0] Requirements documented in spec.md: `rg -c '^\| REQ-' spec.md` prints 10. Observed 11: REQ-011 was added after this check was written
- [x] CHK-002 [P0] Technical approach defined in plan.md: `rg -n '^### Data Flow' plan.md` prints one line
- [x] CHK-003 [P1] Phase 3 closed and ADR-001 to ADR-005 decided (T001, T002)
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality
<!-- FILL: Write one check per file rule. A command must answer it. GOOD: CHK-010 [P0] `bash -n scripts/rotate-logs.sh` exits 0. WEAK: Code is clean. -->

- [x] CHK-010 [P0] `npx tsc --noEmit` from the skill root exits 0. Ran as `npm run typecheck` in `runtime/`: exit 0
- [x] CHK-011 [P0] The two test files run with no warning printed
- [x] CHK-012 [P1] Every shell-out checks the exit status, and exit 3 from `worktree-naming.sh create` is handled as a half-provisioned tree (stub test passes)
- [x] CHK-013 [P1] No code comment names a packet, phase or requirement id: `rg -n 'REQ-|ADR-|phase [0-9]' $B/runtime/lib` prints nothing (rc=1)
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing Checklist
<!-- FILL: Write one check per acceptance criterion. GOOD: CHK-020 [P0] `--keep 3` leaves 3 archives. WEAK: Tests pass. -->

- [x] CHK-020 [P0] Every row in `acceptance-criteria.md` is Met with its evidence named, including the live desktop notice and the parked-resume row
- [x] CHK-021 [P0] T017 manual run done and its record read (stub executor)
- [x] CHK-022 [P1] The eight-row tree-state matrix in `plan.md` has one passing test per row. Runner end: clean, dirty, unmerged and half-provisioned cases. Reaper: one dry-run case that would reap the clean tree and keeps dirty, unmerged and half-provisioned
- [x] CHK-023 [P1] The three adversarial link cases (main `node_modules`, outside folder, dangling) pass
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:security -->
## Security
<!-- FILL: Write one check per security surface. Write `N/A` with a reason when none applies. GOOD: CHK-030 [P0] `scripts/rotate-logs.sh` reads no credential. WEAK: Security is fine. -->

- [x] CHK-030 [P0] No delivery body holds a command line, environment value or secret (T019)
- [x] CHK-031 [P0] A worktree base inside the checkout or a vendored tree is refused before dispatch (T004)
- [x] CHK-032 [P1] No removal is forced: `rg -n -- '--force|branch -D' $B/runtime/lib/isolation.ts` prints nothing (rc=1)
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation
<!-- FILL: Write one check per document that must agree. GOOD: CHK-040 [P1] `spec.md` and `tasks.md` both name `--keep <n>`. WEAK: Docs are updated. -->

- [x] CHK-040 [P1] `spec.md`, `plan.md` and `tasks.md` name the same delivery states: `rg -n 'attempted' spec.md plan.md tasks.md` prints a match in each
- [x] CHK-041 [P1] Code comments explain why links are removed before the tree
- [x] CHK-042 [P2] The skill README names `worktree-reaper.sh --numbered` as the reclaim path for kept trees. Evidence: `.skilled/skills/system-skilled-bots/README.md:32` names `.skilled/bin/worktree-reaper.sh --numbered` as the hand-run reclaim path for kept trees; bot trees use the numbered naming (`.skilled/skills/system-skilled-bots/runtime/lib/isolation.ts:47`, `:528`).
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization
<!-- FILL: Write one check per file location rule. GOOD: CHK-050 [P1] Test copies live under `scratch/test/`. WEAK: Files are organized. -->

- [x] CHK-050 [P1] Temp repositories live under the system temp folder and are deleted by the test teardown
- [x] CHK-051 [P1] scratch/ cleaned before completion. Evidence: scratch/ was reviewed on 2026-11-24 and kept on purpose: every file is cited by a row, by name or as part of the `review-fix-suite-1.txt` to `-3.txt` range, and nothing temporary is left.
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary
<!-- FILL: Count the boxes by priority and write the three totals. GOOD: P0 12, P1 13, P2 1. WEAK: Most items done. -->

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 8 | 8/8 |
| P1 Items | 10 | 9/10 |
| P2 Items | 1 | 0/1 |

**Verification Date**: 2026-11-23. CHK-051 is left to the orchestrator, because scratch holds cited evidence. CHK-042 is deferred to the hub-wiring phase.
<!-- /ANCHOR:summary -->

---
