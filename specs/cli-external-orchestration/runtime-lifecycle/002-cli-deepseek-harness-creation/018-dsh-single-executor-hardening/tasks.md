---
title: "Tasks: Phase 18: dsh-single-executor-hardening"
description: "Task Format: T### [P?] Description (file path). Verify: <command> prints <expected output>"
trigger_phrases:
  - "dsh single executor hardening tasks"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.4 -->
# Tasks: Phase 18: dsh-single-executor-hardening

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

Shell variables, set from the worktree root before the first task:
- `DL=.skilled/skills/system-deep-loop/runtime`
- `A=.skilled/commands/deep/assets`
- `C=specs/cli-external-orchestration/runtime-lifecycle/002-cli-deepseek-harness-creation/018-dsh-single-executor-hardening`

Edit tasks name the edit in `plan.md` section 4. Every `Verify:` runs from the worktree root unless it says `cd $DL`.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup
<!-- FILL: Replace the sample tasks with the real setup steps. Each task names a file and a verify command. GOOD: T001 Confirm `logs/archive/` holds 10 archives. Verify: `ls logs/archive | wc -l` prints 10. WEAK: T001 Set up the project. -->

- [x] T001 Count every search text (`$C/plan.md`). Verify: each search text of E1 to E7, E10 and E11 counts `1` in its file, and `1.6.25.0` counts `1` in each of the four E12 files. Evidence: All 23 search texts counted 1 before the build.
- [x] T002 Rerun the baselines (`$C/plan.md`). Verify: each "Before" value in `plan.md` section 5 prints as recorded, the full suite included. Evidence: Named suites 11, drift and compile 23, sweep, reducer and upsert 208, drift `OK commands=3`, typecheck 0, route guard fresh, full suite `2894 passed | 8 skipped (2902)`.
- [x] T003 Record the operator's C6 choice (`$C/goal.md`). Verify: `goal.md` section 4 holds Option A, Option B or "deferred" with a reason. Evidence: `goal.md` section 4 records the operator's deferral.
- [x] T004 Confirm nothing reads the echoed harness stdout (`$A/deep-review-auto.yaml`). Verify: in both auto workflows, the lines between `runAuditedExecutorCommand({` in the harness branch and the end of that step parse no stdout of the step, read by hand and quoted in `goal.md`. Evidence: Both harness branches end with `process.exit(dispatchExit)` and the step captures no output, quoted in `goal.md`.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation
<!-- FILL: Write one implementation task per file change. Add a `Verify:` line with the command and its expected output. GOOD: T002 Add the `--keep <n>` branch. Verify: `--keep 3` leaves 3 archives. WEAK: T002 Implement the feature. -->

- [x] T005 Apply E1 and E2 (`$DL/lib/deep-loop/executor-audit.ts`). Verify: `rg -c 'DISPATCH_ENV_KEYS|echoStdout' $DL/lib/deep-loop/executor-audit.ts` prints at least `4`, and `cd $DL && npm run typecheck` exits 0. Evidence: `rg -c` prints 5 and typecheck exits 0.
- [x] T006 Apply E3 (`$DL/scripts/fanout-run.cjs`). Verify: `node -e "console.log(typeof require('./$DL/scripts/fanout-run.cjs').sweepStaleDshHomes)"` prints `function`. Evidence: Prints `function`.
- [x] T007 Apply E4 and E5 in both auto workflows (`$A/deep-review-auto.yaml`). Verify: `rg -c 'sweepStaleDshHomes|echoStdout: false' $A/deep-review-auto.yaml $A/deep-research-auto.yaml` prints `3` for each file. Evidence: Prints 3 for each file.
- [x] T008 Apply E6 and E7 (`$A/deep-review-confirm.yaml`). Verify: `rg -c 'unsupported_executor_guard' $A/deep-review-confirm.yaml $A/deep-research-confirm.yaml` prints `1` for each, and `rg -c ':confirm. runs only' $A/*-presentation.txt` prints `1` for the review and research files. Evidence: The guard counts 1 in each `:confirm` file and the presentation line counts 1 in each presentation file.
- [x] T009 Run E8 and E9 (`$A/compiled`). Verify: `node $DL/scripts/check-contract-drift.cjs` prints `[CONTRACT DRIFT] OK commands=3`. Evidence: `[CONTRACT DRIFT] OK commands=3`, and a fresh compile of each contract is byte-identical to its committed file.
- [x] T010 Apply E10 (`$DL/scripts/reduce-state.cjs`). Verify: `rg -c 'sameFindingAtAnotherLine' $DL/scripts/reduce-state.cjs` prints `2`. Evidence: Prints 2.
- [x] T011 Apply E11 (`$DL/scripts/upsert.cjs`). Verify: `rg -c 'canonicalReviewDimensionId' $DL/scripts/upsert.cjs` prints at least `2`. Evidence: Prints 3.
- [x] T012 Apply E12, changelog through `sk-doc` and the four version fields (`.skilled/skills/system-deep-loop/changelog/v1.6.26.0.md`). Verify: `rg -l '1\.6\.26\.0' .skilled/skills/system-deep-loop -g '!changelog/**'` lists the four files and `rg -c '1\.6\.25\.0'` on them prints nothing. Evidence: Lists `SKILL.md`, `description.json`, `hub-router.json`, `mode-registry.json` and the changelog, and `1.6.25.0` counts nothing in the four. The changelog gates printed 0 hard blockers, `PASS` and `VALID`.
- [x] T013 Apply E13, the tests (`$DL/tests`). Verify: each new test fails on the start commit's code and passes after its edit, checked by stashing the edit once per test file. Evidence: With each source swapped to its HEAD copy the new tests fail: 3 in the receipts file, 1 sweep, 3 contract, 1 reducer and 1 upsert. All pass with the edits restored.
- [x] T014 Build C6 as the operator chose (`$DL/lib/deep-loop/executor-audit.ts`). Verify: the option's own test in `plan.md` passes. Blocked until T003 records a choice. When it records "deferred", mark this task `[x]` with that line as its evidence. Evidence: Deferred by the operator, recorded in `goal.md` section 4. Nothing was built for it.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification
<!-- FILL: Write one verification task per requirement. Each one runs a command. GOOD: T003 Run both invocations. Verify: `ls logs/archive | wc -l` prints 3 and 10. WEAK: T003 Test everything. -->

- [x] T015 REQ-001, REQ-002, REQ-003 and REQ-005: the named suites (`$DL/tests`). Verify: `cd $DL && npx vitest run tests/unit/executor-branch-contract.vitest.ts tests/executor-audit-cli-branch-receipts.test.ts` prints `16 passed (16)`. Evidence: `17 passed (17)`, one more than planned because a `0 bytes` edge test was added.
- [x] T016 REQ-004, REQ-006 and REQ-007: the sweep, reducer and upsert tests (`$DL/tests`). Verify: `cd $DL && npx vitest run tests/unit/fanout-run.vitest.ts tests/unit/deep-review-state-reducer.vitest.ts tests/integration/upsert-script.vitest.ts` prints no failure, with three more passed than at T002. Evidence: `211 passed (211)`, three more than the 208 at T002.
- [x] T017 REQ-003: the full suite and typecheck (`$DL`). Verify: `cd $DL && npx vitest run` shows only the `fanout-pool.vitest.ts` timing failure, and `npm run typecheck` exits 0. Evidence: 2903 passed and 8 skipped of 2911, after the four tsx socket-path failures of the long private TMPDIR passed `13 passed (13)` with the default one. No timing failure. Typecheck exits 0.
- [x] T018 REQ-008: the hub routing stays fresh (`.skilled/bin/compiled-route-guard.cjs`). Verify: after the operator's commit, `node .skilled/bin/compiled-route-guard.cjs` prints `system-deep-loop            fresh` and exits 0. Evidence: After the manifest refresh the guard prints `system-deep-loop            fresh` and exits 0.
- [x] T019 Manual run, if a harness login is present (`$A/deep-review-auto.yaml`). Verify: a one-iteration `:auto` harness review of a scratch target prints the `bytes, not echoed` line, and no `dsh-home-` folder older than 24 hours is left in the temp folder. Evidence: No live harness review ran. A stub smoke of both auto branches against a fake rc.3 binary printed `child stdout 4189 bytes, not echoed`, an empty stdout, a removed home and no folder left in its private temp folder.
- [x] T020 Confirm only the planned files changed and stop for the operator (`git status`). Verify: `git status --short` lists the files in `spec.md` section 3 and this packet's docs, and no commit is made before the operator says yes. Evidence: `git status --short` lists the planned files, this packet's docs and the deep-loop route manifest pair the refresh rewrote. The coordinator relayed the commit instruction.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria
<!-- FILL: Keep the three completion lines and add the one artifact that proves the phase is done. GOOD: `--keep 3` leaves 3 archives and the suite passes. WEAK: Work is complete. -->

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] Manual verification passed, or recorded as skipped with the reason
- [x] T015 prints `17 passed (17)` and T009 prints `[CONTRACT DRIFT] OK commands=3`
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References
<!-- FILL: Name the spec and plan files. Add the decision record when the packet has one. GOOD: Specification: `spec.md`. Plan: `plan.md`. WEAK: See the other docs. -->

- **Specification**: See `spec.md`, section 3 for the items and their sources and section 10 for the operator's questions
- **Plan**: See `plan.md`, section 4 for the thirteen edits and section 5 for the baselines
- **Predecessor**: See `../017-dsh-single-executor-loop/` for the branch these edits harden
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

C6 deferred by the operator is not a blocked task. It is recorded in `goal.md` and REQ-009 is met by that record.
<!-- /ANCHOR:protocol -->

---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation
<!-- FILL: Write one check per setup fact, each with a command. GOOD: CHK-001 [P0] The start commit is in `goal.md` section 4. WEAK: Setup is ready. -->

- [x] CHK-001 [P0] Every search text counts 1 (T001)
- [x] CHK-002 [P0] The baselines print as recorded (T002)
- [x] CHK-003 [P1] The C6 choice is recorded (T003)
- [x] CHK-004 [P1] Nothing reads the echoed stdout (T004)
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality
<!-- FILL: Write one check per quality gate, each with the command that answers it. GOOD: CHK-010 [P0] `eslint lib/` exits 0. WEAK: Code is clean. -->

- [x] CHK-010 [P0] `cd $DL && npm run typecheck` exits 0 (T017)
- [x] CHK-011 [P1] No new code comment names a spec path, phase number or finding id: `git diff -U0 -- $DL $A | rg '^\+.*(specs/|phase [0-9]|C[0-9]\b|B-P[0-9]|R[0-9]-P[0-9])'` prints nothing Evidence: it prints six lines, all review finding ids such as `R1-P1-001` inside the reducer test fixture. None is a comment.
- [x] CHK-012 [P1] Each new function has the header comment style its file uses Evidence: `sweepStaleDshHomes` and `sameFindingAtAnotherLine` carry JSDoc headers, the TS and upsert helpers carry line comments like their neighbors.
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing Checklist
<!-- FILL: Write one check per test command and its expected count. GOOD: CHK-020 [P0] `vitest run` prints 14 passed. WEAK: Tests pass. -->

- [x] CHK-020 [P0] Every row in `acceptance-criteria.md` is `Met`
- [x] CHK-021 [P0] The two named suites print `17 passed (17)`, one added edge test over the planned 16 (T015)
- [x] CHK-022 [P0] The drift check prints `[CONTRACT DRIFT] OK commands=3` (T009)
- [x] CHK-023 [P1] The full suite has no new failure (T017)
- [x] CHK-024 [P1] Each new test failed before its edit (T013)
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## FIX ADDENDUM: FIX COMPLETENESS
<!-- FILL: Write one check per finding class this fix covers. GOOD: CHK-FIX-002 [P0] `rg -n 'keep' scripts/` lists every producer. WEAK: The fix is complete. -->

- [x] CHK-FIX-001 [P0] Each item has a class: C1, C2, C5 and C8 `class-of-bug`, C3, C4 and C7 `instance-only`, C6 `design`.
- [x] CHK-FIX-002 [P0] Same-class producers: `rg -n "mkdtempSync\(.*dsh-home-" .skilled -g '!**/node_modules/**' -g '!**/dist/**'` lists only `createDshHome` and the two auto workflows, each with a sweep before it. Evidence: `createDshHome` in `fanout-run.cjs` and the two auto workflows, each with `sweepStaleDshHomes()` on the line before. The fourth hit is a test fixture name.
- [x] CHK-FIX-003 [P0] Consumers of `dispatchEnv`: `rg -n 'dispatchEnv' .skilled -g '!**/node_modules/**' -g '!**/dist/**'` lists no caller that passes a key outside its kind's list. Evidence: the only runner callers are the two auto workflows, each passing exactly the four listed keys. The fan-out `dispatchEnv` is a local spawn env, not this field.
- [x] CHK-FIX-004 [P1] Every review graph write passes `upsert.cjs`: `rg -n 'upsert.cjs' $A/deep-review-auto.yaml $A/deep-review-confirm.yaml` lists the seed and per-iteration steps only. Evidence: lines 618 and 1648 in `:confirm` and 633 and 2278 in `:auto`, the seed and per-iteration steps.
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security
<!-- FILL: Write one check per trust boundary. GOOD: CHK-030 [P0] No path outside the root is read. WEAK: Secure. -->

- [x] CHK-030 [P0] No key off the per-kind list reaches a child through `dispatchEnv` (T015) Evidence: T015 refusal test.
- [x] CHK-031 [P0] The sweep removes no link and nothing outside `os.tmpdir()` (T016) Evidence: T016 link case with a 25-hour target, and the sweep only reads its `tmpRoot` argument.
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation
<!-- FILL: Write one check per document that must agree. GOOD: CHK-040 [P1] `spec.md` and `tasks.md` both name `--keep <n>`. WEAK: Docs are updated. -->

- [x] CHK-040 [P1] The changelog, both presentation files and the step notes agree that `:auto` runs one harness lineage and `:confirm` refuses it Evidence: the changelog, both presentation lines and both step notes say `:auto` runs the lineage and `:confirm` refuses it.
- [x] CHK-041 [P1] `goal.md` section 4 records the C6 choice and every deviation Evidence: `goal.md` section 4.
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization
<!-- FILL: Write one check per file location rule. GOOD: CHK-050 [P1] Test copies live under `scratch/test/`. WEAK: Files are organized. -->

- [x] CHK-050 [P1] Test fixtures live in temp folders the tests remove Evidence: each new test uses `makeTempDir` or the suite temp folder.
- [x] CHK-051 [P2] `scratch/` holds no file the build relies on Evidence: `scratch/` holds only `.gitkeep`.
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary
<!-- FILL: Count the boxes by priority and write the three totals. GOOD: P0 12, P1 13, P2 1. WEAK: Most items done. -->

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 11 | 11/11 |
| P1 Items | 10 | 10/10 |
| P2 Items | 1 | 1/1 |

**Verification Date**: 2026-11-14
<!-- /ANCHOR:summary -->

---
