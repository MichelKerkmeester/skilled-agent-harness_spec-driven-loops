---
title: "Tasks: Phase 15: pi-mode-and-descendant-walk"
description: "Task Format: T### [P?] Description (file path). Verify: <command> prints <expected output>"
trigger_phrases:
  - "pi mode and descendant walk tasks"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.4 -->
# Tasks: Phase 15: pi-mode-and-descendant-walk

<!-- SPECKIT_LEVEL: 2 -->

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

**Task variables**: `SR` is `.skilled/hooks/session-relaunch`. `TESTS` is `.skilled/hooks/session-relaunch/tests`. `PB` is `.pi/git/github.com/janvitos/pi-plan-build`. `PHASE` is `specs/hooks-plugins-extensions/session-turn-boundaries/002-session-relaunch-loop/038-goal-and-workflow-resume/015-pi-mode-and-descendant-walk`.

**Test environment**: run the `node:test` suites with `AI_SESSION_CHILD` unset, as `env -u AI_SESSION_CHILD node --test <file>`. Nothing in this list starts before the operator's greenlight.

**Decline branch**: when T001 or T002 records `rank 13: decline`, skip T006 to T015, write ADR-001 in T005, and mark AC-002 to AC-006 Waived by ADR-001.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Confirm from the extension source and the session store that the live mode is readable (`PB/index.ts`, `PB/plan-state.ts`, `PHASE/scratch/confirm-pi-mode.txt`). Verify: `git -C .pi/git/github.com/janvitos/pi-plan-build rev-parse HEAD` prints `51a97327ed4749c48150241ae5b29eb7b3354ffe`, `rg -n 'pi.appendEntry\(STATE_TYPE|selectedMode = decoded\?\.selectedMode' .pi/git/github.com/janvitos/pi-plan-build/index.ts` prints lines 228 and 1379, and `rg -l '"selectedMode":"plan"' ~/.pi/agent/sessions | wc -l` prints a number above 0. All three outputs are saved to the scratch file. **Evidence:** Done 2026-11-13: all three outputs are in `scratch/confirm-pi-mode.txt`, read from the primary checkout's copy of the extension because it is git-ignored and absent from the worktree.
- [x] T002 Launch Pi once through `skilled-loop` with `--plan` and the extension loaded, then exit (`PHASE/scratch/confirm-pi-mode.txt`). Verify: the scratch file holds the launch command, the mode the composer showed and a final line `rank 13: build` or `rank 13: decline`. A launch error or a Build start writes `rank 13: decline`. **Evidence:** Done 2026-11-13: Pi 1.5.2 started in Plan mode, verdict line `rank 13: build`.
- [x] T003 Record the baseline of the five test files before any edit (`SR/pi/session-relaunch.test.ts`, `TESTS`). Verify: `npx vitest run --config .skilled/hooks/vitest.config.ts .skilled/hooks/session-relaunch/pi/session-relaunch.test.ts` exits 0, and `env -u AI_SESSION_CHILD node --test .skilled/hooks/session-relaunch/tests/relaunch-core.test.cjs .skilled/hooks/session-relaunch/tests/session-relaunch-cli.test.cjs .skilled/hooks/session-relaunch/tests/skilled-loop-wrapper-launch-arguments.test.cjs .skilled/hooks/session-relaunch/tests/skilled-loop-wrapper-model-effort.test.cjs` exits 0 with `fail 0`. **Evidence:** Done: Vitest 59 of 59, exit 0, before any edit.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T004 Write ADR-002, the rank 14 decline, with the pid 1 line, the cases a walk still catches, the false refusals of an any-program walk and the pointer to phase 009 (`PHASE/decision-record.md`). Verify: `rg -n '^### ADR-002|25973     1|mcp-code-mode-launcher|009-nudge-note-lines' decision-record.md` prints at least 4 lines. **Evidence:** Done: the command prints 4 lines.
- [x] T005 On the decline branch only, write ADR-001 with the failing check from `scratch/confirm-pi-mode.txt` (`PHASE/decision-record.md`). Verify: `rg -n '^### ADR-001' decision-record.md` prints 1 line, or the scratch verdict reads `rank 13: build` and the task is skipped. **Evidence:** Skipped: the scratch verdict reads `rank 13: build`.
- [x] T006 Add the adapter mode test, which must fail first (`SR/pi/session-relaunch.test.ts`). Verify: `npx vitest run --config .skilled/hooks/vitest.config.ts -t 'arms with the plan-build mode from the session branch' .skilled/hooks/session-relaunch/pi/session-relaunch.test.ts` exits 1 with `mode` in the failure. **Evidence:** Done: `scratch/red-A.txt`, exit 1.
- [x] T007 Read the last `pi-plan-build-state` entry through a local `getBranch` cast and add `mode` when it is `plan` or `build` (`SR/pi/session-relaunch.ts`). Verify: the T006 command exits 0. **Evidence:** Done: `scratch/green-A.txt`, exit 0.
- [x] T008 Add the arm filter test, which must fail first (`TESTS/relaunch-core.test.cjs`). Verify: `node --test --test-name-pattern 'arm keeps a plan or build mode' .skilled/hooks/session-relaunch/tests/relaunch-core.test.cjs` exits 1 with `mode` in the failure. **Evidence:** Done: `scratch/red-B.txt`, exit 1.
- [x] T009 Keep `settings.mode` in `armLocked` only when it is `plan` or `build` (`SR/lib/relaunch-core.cjs`). Verify: the T008 command exits 0 with `fail 0`. **Evidence:** Done: `scratch/green-B.txt`, exit 0 with `fail 0`.
- [x] T010 Add the consume test, which must fail first (`TESTS/session-relaunch-cli.test.cjs`). Verify: `env -u AI_SESSION_CHILD node --test --test-name-pattern 'consume prints the recorded Pi mode' .skilled/hooks/session-relaunch/tests/session-relaunch-cli.test.cjs` exits 1 with `mode` in the failure. **Evidence:** Done: `scratch/red-C.txt`, exit 1.
- [x] T011 Add `mode` to the key list `consume` prints (`SR/bin/session-relaunch.cjs`). Verify: the T010 command exits 0 with `fail 0`. **Evidence:** Done: `scratch/green-C.txt`, exit 0 with `fail 0`.
- [x] T012 Add the wrapper replay test, which must fail first (`TESTS/skilled-loop-wrapper-launch-arguments.test.cjs`). Verify: `env -u AI_SESSION_CHILD node --test --test-name-pattern 'replaces the launch mode flag with the consumed mode' .skilled/hooks/session-relaunch/tests/skilled-loop-wrapper-launch-arguments.test.cjs` exits 1 with `--build` in the failure. **Evidence:** Done: `scratch/red-D.txt`, exit 1 on the mode flag assertion.
- [x] T013 Drop launch `--plan` and `--build` from the Pi replay and add the consumed mode once (`.skilled/bin/skilled-loop`). Verify: the T012 command exits 0 with `fail 0`, and `bash -n .skilled/bin/skilled-loop` exits 0. **Evidence:** Done: `scratch/green-D.txt`, exit 0 with `fail 0`, and `bash -n` exit 0.
- [x] T014 Add one sentence on the Pi mode under "Model And Effort Across A Hop" (`SR/README.md`). Verify: `rg -n 'Plan or Build mode' .skilled/hooks/session-relaunch/README.md` prints 1 line. **Evidence:** Done: 1 line, at README line 42.
- [x] T015 Save the four red runs and the four green runs (`PHASE/scratch/red.txt`, `PHASE/scratch/green.txt`). Verify: `rg -c 'fail|FAIL' scratch/red.txt` prints at least 4, and `rg -c 'pass|PASS' scratch/green.txt` prints at least 4. **Evidence:** Done: `red.txt` 10 matching lines, `green.txt` 18.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T016 Run the Pi adapter suite (`SR/pi/session-relaunch.test.ts`). Verify: `npx vitest run --config .skilled/hooks/vitest.config.ts .skilled/hooks/session-relaunch/pi/session-relaunch.test.ts` exits 0 with no failed test. **Evidence:** Done: 62 of 62, exit 0.
- [x] T017 Run every relaunch suite (`TESTS`). Verify: `env -u AI_SESSION_CHILD node --test .skilled/hooks/session-relaunch/tests/*.test.cjs` exits 0 with `fail 0`. **Evidence:** Done: run together with the OpenCode plugin suites, 1524 of 1524, `fail 0`, exit 0.
- [x] T018 Run the named guard tests by title (`SR/pi/session-relaunch.test.ts`, `TESTS`). Verify: `npx vitest run --config .skilled/hooks/vitest.config.ts -t 'agent_settled' .skilled/hooks/session-relaunch/pi/session-relaunch.test.ts` exits 0, and `env -u AI_SESSION_CHILD node --test --test-name-pattern 'arm with a new model|consume|Pi first launch arguments|pi relaunch carries provider' .skilled/hooks/session-relaunch/tests/relaunch-core.test.cjs .skilled/hooks/session-relaunch/tests/session-relaunch-cli.test.cjs .skilled/hooks/session-relaunch/tests/skilled-loop-wrapper-launch-arguments.test.cjs` exits 0 with `fail 0`. **Evidence:** Done: Vitest 13 passed, exit 0. Node 28 of 28, `fail 0`.
- [x] T019 Confirm the running work check is unchanged (`SR/bin/session-relaunch.cjs`). Verify: `git diff -U0 -- .skilled/hooks/session-relaunch/bin/session-relaunch.cjs` shows hunks only inside `function consume`. **Evidence:** Done: one hunk, `@@ -821,3 +821,3 @@ function consume(args)`.
- [x] T020 Confirm the phase touched only the named files (`SR`, `.skilled/bin/skilled-loop`). Verify: `git diff --name-only -- .skilled` prints only the nine source, test and doc files named in `spec.md`. **Evidence:** Done: nine files listed, all named in `spec.md`.
- [x] T021 Run strict validation on the phase (`PHASE`). Verify: `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh specs/hooks-plugins-extensions/session-turn-boundaries/002-session-relaunch-loop/038-goal-and-workflow-resume/015-pi-mode-and-descendant-walk --strict` prints `RESULT: PASSED`. **Evidence:** Done: `RESULT: PASSED`.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`, or skipped on the decline branch with ADR-001 named
- [x] No `[B]` blocked tasks remaining
- [x] Manual verification passed: the T002 launch is recorded in `scratch/confirm-pi-mode.txt`
- [x] Every row of `acceptance-criteria.md` is `Met` or `Waived` by an ADR in `decision-record.md`
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Decisions**: See `decision-record.md`, written in T004 and T005
- **Research**: `../research/research.md` sections 5, 9 and 12
<!-- /ANCHOR:cross-refs -->

---

## Verification Checklist

<!-- ANCHOR:protocol -->
## Verification Protocol

| Priority | Handling | Completion Impact |
|----------|----------|-------------------|
| **[P0]** | HARD BLOCKER | Cannot claim done until complete |
| **[P1]** | Required | Must complete OR get user approval |
| **[P2]** | Optional | Can defer with documented reason |

A task skipped on the decline branch counts as done only when ADR-001 exists and names it.
<!-- /ANCHOR:protocol -->

---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [x] CHK-001 [P0] Requirements documented in spec.md. Verify: `rg -c '^\| REQ-' spec.md` prints 8. **Evidence:** Prints 8.
- [x] CHK-002 [P0] The operator greenlight is logged. Verify: `rg -n 'greenlight' goal.md` shows a Done row in the Progress table. **Evidence:** The greenlight row in `goal.md` is Done.
- [x] CHK-003 [P0] The rank 13 verdict exists before any code edit. Verify: `rg -n '^rank 13: (build|decline)$' scratch/confirm-pi-mode.txt` prints 1 line. **Evidence:** Prints 1 line, written before the first code edit.
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] The changed sources parse. Verify: `node --check .skilled/hooks/session-relaunch/lib/relaunch-core.cjs .skilled/hooks/session-relaunch/bin/session-relaunch.cjs` and `bash -n .skilled/bin/skilled-loop` exit 0. **Evidence:** All three exit 0.
- [x] CHK-011 [P0] The Pi adapter type-checks. Verify: `npx tsc -p tsconfig.pi.json --noEmit` exits 0. **Evidence:** Exit 0, run as `./.pi/npm/node_modules/.bin/tsc -p tsconfig.pi.json --noEmit`, because the worktree has no root TypeScript install and `npx tsc` resolves to a placeholder package.
- [x] CHK-012 [P1] No changed line carries a spec path, phase number or task id in a comment. Verify: `git diff -U0 -- .skilled` prints no added line matching `specs/`, `015-`, `ADR-` or `T0`. **Evidence:** No added line matches.
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing Checklist

- [x] CHK-020 [P0] Every acceptance row is Met or Waived. Verify: `rg -c '\| Unmet \|' acceptance-criteria.md` prints nothing. **Evidence:** Prints nothing.
- [x] CHK-021 [P0] The relaunch suites exit 0. Verify: `env -u AI_SESSION_CHILD node --test .skilled/hooks/session-relaunch/tests/*.test.cjs` exits 0 with `fail 0`. **Evidence:** 1524 of 1524 with the OpenCode plugin suites, `fail 0`.
- [x] CHK-022 [P1] Each must-fail test holds a red run. Verify: `rg -c 'fail|FAIL' scratch/red.txt` prints at least 4 on the build branch. **Evidence:** Prints 10.
- [x] CHK-023 [P1] The edge cases are tested: no entry, a `getBranch` that throws, and an `auto` mode. Verify: `rg -n 'no plan-build state|getBranch|auto' .skilled/hooks/session-relaunch/pi/session-relaunch.test.ts .skilled/hooks/session-relaunch/tests/relaunch-core.test.cjs` prints at least 3 lines. **Evidence:** Prints 10 lines. The two adapter edge cases are the tests `agent_settled arms without a plan-build mode when the branch holds no plan-build state` and `... when getBranch throws`.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## FIX ADDENDUM: FIX COMPLETENESS

- [x] CHK-FIX-001 [P0] Each item carries one class in `plan.md`. Verify: `rg -n 'cross-consumer|matrix/evidence' plan.md` prints the class line. **Evidence:** Prints the class line at `plan.md:93`.
- [x] CHK-FIX-002 [P0] The same-class producer inventory ran. Verify: `rg -n "for \(const key of \['model', 'provider', 'effort'" .skilled/hooks/session-relaunch` prints no line after the change. **Evidence:** Deviation: the command still prints `lib/relaunch-core.cjs:1018`, the arm's loop over `model`, `provider`, `effort` and `permissionMode`. That loop is kept on purpose, because those keys take any non-empty string and the mode takes only two literals, so the mode has its own line below the loop. The `consume` list in `bin/session-relaunch.cjs:823` now ends with `mode`.
- [x] CHK-FIX-003 [P0] The consumer inventory ran. Verify: `rg -n 'consumed_field mode' .skilled/bin/skilled-loop` prints 1 line. **Evidence:** Deviation: the pattern as written prints 2 lines, because it also matches `consumed_field model`. `rg -n 'consumed_field mode\)' .skilled/bin/skilled-loop` prints the 1 line that reads the mode, line 1426.
- [x] CHK-FIX-004 [P0] The launch line holds only the two literals. Verify: the T012 test asserts that a consumed `mode: auto` adds no flag. **Evidence:** The test's second case consumes `auto` after a `--build` launch and asserts one `--build` and no `--plan`.
- [x] CHK-FIX-005 [P1] The matrix axes are listed. Verify: `rg -n 'Matrix axes' plan.md` prints 1 line. **Evidence:** Prints 1 line, `plan.md:96`.
- [x] CHK-FIX-006 [P1] The hostile host variant ran. Verify: the Vitest case with a throwing `getBranch` passes in T016. **Evidence:** The throwing `getBranch` case passes in the 62 of 62 run.
- [x] CHK-FIX-007 [P1] The evidence is pinned to a commit. Verify: `git rev-parse HEAD` is written in `goal.md` at close. **Evidence:** `goal.md` names the base commit `8b3868a028` the evidence was taken on.
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] No hardcoded secret is added. Verify: `git diff -U0 -- .skilled` prints no added line matching `api_key`, `password` or `secret`. **Evidence:** No added line matches.
- [x] CHK-031 [P0] Session text never reaches the launch line. Verify: CHK-FIX-004 passes. **Evidence:** CHK-FIX-004 passes.
- [x] CHK-032 [P1] The scratch evidence holds counts, not session content. Verify: `rg -c '"role"' scratch/confirm-pi-mode.txt` prints nothing. **Evidence:** Prints nothing.
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] Spec, plan, tasks, criteria and goal name the same decision for rank 14. Verify: `rg -l 'ADR-002' spec.md plan.md tasks.md acceptance-criteria.md goal.md` lists at least 4 files. **Evidence:** Lists 5 files.
- [x] CHK-041 [P1] The README names the Pi mode. Verify: `rg -n 'Plan or Build mode' .skilled/hooks/session-relaunch/README.md` prints 1 line. **Evidence:** Prints 1 line.
- [x] CHK-042 [P2] The README diff is one added sentence. Verify: `git diff --numstat -- .skilled/hooks/session-relaunch/README.md` prints `1 1`. **Evidence:** Prints `1 1`.
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P1] Run evidence lives in `scratch/`. Verify: `ls scratch` lists `confirm-pi-mode.txt`, `red.txt` and `green.txt` on the build branch. **Evidence:** All three are listed, beside the per-brief `red-A` to `green-E` files.
- [x] CHK-051 [P1] No new file lands outside the phase and the named files. Verify: `git status --short --untracked-files=all` lists no other path. **Evidence:** No other path: the nine named files, this phase's folder and phase 016's own scratch folder.
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 13 | 13/13 |
| P1 Items | 11 | 11/11 |
| P2 Items | 1 | 1/1 |

**Verification Date**: 2026-11-13
<!-- /ANCHOR:summary -->

---
