---
title: "Tasks: Phase 9: nudge-note-lines"
description: "Task Format: T### [P?] Description (file path). Verify: <command> prints <expected output>"
trigger_phrases:
  - "nudge note lines tasks"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.4 -->
# Tasks: Phase 9: nudge-note-lines

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

**Task variables**: `SR` is `.skilled/hooks/session-relaunch`. `TESTS` is `.skilled/hooks/session-relaunch/tests`. `DL` is `.skilled/skills/system-deep-loop/runtime`. `PKT` is this phase folder.

**Test environment**: run the suites with `AI_SESSION_CHILD` unset, as `env -u AI_SESSION_CHILD node --test <file>`. The claim guard treats a dispatched child as silent, so a test process that inherits the marker fails the claim cases for that reason alone.

**Start condition**: no task below runs before the operator gives the greenlight.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Confirm that a fan-out runner exits on SIGTERM, which the new deep-loop step relies on (`DL/tests/unit/fanout-run.vitest.ts`). Verify: `cd .skilled/skills/system-deep-loop/runtime && npx vitest run tests/unit/fanout-run.vitest.ts -t 'writes a stopped partial orchestration summary when SIGTERM interrupts an in-flight run'` exits 0 with 1 test passed, and the result is written as a row in `PKT/goal.md` section 4. The lineage group kill itself is read from `fanout-run.cjs:3532`, `:591` and `:719`, and the row says so.
- [x] T002 Confirm from the vendor page whether a Claude Code session can create a scheduled task and whether it can add a directory without the operator (`https://code.claude.com/docs/en/scheduled-tasks`, `claude --help`). Verify: `rg -n 'T002' PKT/goal.md` prints a row that quotes the page line or help line for each answer, or says UNCONFIRMED and keeps the operator wording of `REQ-007`.
- [x] T003 Record the baseline of the three test files before any edit (`TESTS`). Verify: `env -u AI_SESSION_CHILD node --test .skilled/hooks/session-relaunch/tests/nudge.test.cjs .skilled/hooks/session-relaunch/tests/session-relaunch-cli.test.cjs .skilled/hooks/session-relaunch/tests/skilled-loop-wrapper-claim-goal.test.cjs` exits 0 with `pass 280` and `fail 0`.
- [x] T004 Record the source anchors the plan cites (`SR/lib/nudge.cjs`, `SR/bin/session-relaunch.cjs`, `.skilled/commands/speckit/handoff.md`). Verify: `rg -n -F -e 'release it before prepare' -e 'include an `Active command:` line' -e 'core.validateHandoff(handoffPath' -e 'recordGoalPacket({ handoffPath' .skilled/hooks/session-relaunch/lib/nudge.cjs .skilled/hooks/session-relaunch/bin/session-relaunch.cjs .skilled/commands/speckit/handoff.md` prints lines `nudge.cjs:183`, `nudge.cjs:199`, `session-relaunch.cjs:419`, `session-relaunch.cjs:456` and `handoff.md:133`, or the drift is written in `PKT/goal.md` before any edit.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T005 Add the runner-stop test, which must fail first (`TESTS/nudge.test.cjs`). Verify: `node --test --test-name-pattern 'stops a running fan-out runner and waits for it before releasing the lock' .skilled/hooks/session-relaunch/tests/nudge.test.cjs` exits 1 with `kill -TERM` in the failure.
- [x] T006 Add the Running workers line test, which must fail first (`TESTS/nudge.test.cjs`). Verify: `node --test --test-name-pattern 'Running workers line with none as the empty value' .skilled/hooks/session-relaunch/tests/nudge.test.cjs` exits 1 with `Running workers:` in the failure.
- [x] T007 Add the Scheduled and Added directories line test, which must fail first (`TESTS/nudge.test.cjs`). Verify: `node --test --test-name-pattern 'asks for Scheduled and Added directories lines' .skilled/hooks/session-relaunch/tests/nudge.test.cjs` exits 1 with `Scheduled:` in the failure.
- [x] T008 Add the seed worker-check test, which must fail first (`TESTS/nudge.test.cjs`). Verify: `node --test --test-name-pattern 'checks running workers before running the active command again' .skilled/hooks/session-relaunch/tests/nudge.test.cjs` exits 1 with `kill -0` in the failure.
- [x] T009 Add the hop-only seed steps test, which must fail first (`TESTS/nudge.test.cjs`). Verify: `node --test --test-name-pattern 'recreates scheduled tasks and re-adds directories' .skilled/hooks/session-relaunch/tests/nudge.test.cjs` exits 1 with `Scheduled:` in the failure.
- [x] T010 Save the five failing runs (`PKT/scratch/red.txt`). Verify: `rg -c '^not ok' PKT/scratch/red.txt` prints 5.
- [x] T011 Rewrite the deep-loop step at `nudge.cjs:199-203` as one step that stops a live `fanout-run.cjs` runner with `kill -TERM <runner-pid>`, waits until `kill -0 <runner-pid>` fails, then releases the lock with the existing form (`SR/lib/nudge.cjs`). Verify: `node --test --test-name-pattern 'stops a running fan-out runner|releases a deep-loop lock before prepare' .skilled/hooks/session-relaunch/tests/nudge.test.cjs` exits 0 with `fail 0`.
- [x] T012 Add the `Running workers:`, `Scheduled:` and `Added directories:` instructions after the `Active command:` instruction at `nudge.cjs:183-185` (`SR/lib/nudge.cjs`). Verify: `node --test --test-name-pattern 'Running workers line with none|Scheduled and Added directories|asks for an active command line|exactly the sections the core validates' .skilled/hooks/session-relaunch/tests/nudge.test.cjs` exits 0 with `fail 0`.
- [x] T013 Add the worker-check step before the `Active command:` step at `nudge.cjs:279-283`, and the two hop-only steps after it under `!afterCompaction` (`SR/lib/nudge.cjs`). Verify: `node --test .skilled/hooks/session-relaunch/tests/nudge.test.cjs` exits 0 with `fail 0`.
- [x] T014 Add the two prepare refusal tests, which must fail first (`TESTS/session-relaunch-cli.test.cjs`). Verify: `env -u AI_SESSION_CHILD node --test --test-name-pattern 'note with no Running workers line|neither none nor a pid' .skilled/hooks/session-relaunch/tests/session-relaunch-cli.test.cjs` exits 1 with `fail 2`, and the run is appended to `PKT/scratch/red.txt`.
- [x] T015 Add the two pin tests, which may pass at once (`TESTS/session-relaunch-cli.test.cjs`). Verify: `env -u AI_SESSION_CHILD node --test --test-name-pattern 'accepts Running workers none and a line that names a pid|keep accepts a note with no Running workers line' .skilled/hooks/session-relaunch/tests/session-relaunch-cli.test.cjs` exits 0 with `fail 0`.
- [x] T016 Add `Running workers: none` under In-flight state in the shared fixture note (`TESTS/session-relaunch-cli.test.cjs`). Verify: `rg -n "Running workers: none" .skilled/hooks/session-relaunch/tests/session-relaunch-cli.test.cjs` prints the fixture line, and the full file still exits 0 except the two T014 cases.
- [x] T017 Add `Running workers: none` under In-flight state in the note passed to `prepare` (`TESTS/skilled-loop-wrapper-claim-goal.test.cjs`). Verify: `env -u AI_SESSION_CHILD node --test .skilled/hooks/session-relaunch/tests/skilled-loop-wrapper-claim-goal.test.cjs` exits 0 with `fail 0`.
- [x] T018 Add the `requireRunningWorkers` option to `validatedNote`, checked after `core.validateHandoff` and before the goal packet write, and pass it from `prepare` only (`SR/bin/session-relaunch.cjs`). Verify: `env -u AI_SESSION_CHILD node --test .skilled/hooks/session-relaunch/tests/session-relaunch-cli.test.cjs` exits 0 with `fail 0`.
- [x] T019 Ask for the three lines in the note template guidance at `handoff.md:132-133` and add the runner stop to Step 4 at `handoff.md:136-144` (`.skilled/commands/speckit/handoff.md`). Verify: `rg -o -e 'Running workers:' -e 'Scheduled:' -e 'Added directories:' -e 'kill -TERM' .skilled/commands/speckit/handoff.md` prints each of the four strings at least once.
- [x] T026 Add `Running workers: none` under In-flight state in the note the live hop harness writes (`specs/hooks-plugins-extensions/session-turn-boundaries/002-session-relaunch-loop/028-goal-rebind-live-proof-and-docs/scratch/harness/run-hop.sh`). Verify: `rg -c 'Running workers: none' specs/hooks-plugins-extensions/session-turn-boundaries/002-session-relaunch-loop/028-goal-rebind-live-proof-and-docs/scratch/harness/run-hop.sh` prints 1, and `git diff --numstat -- specs/hooks-plugins-extensions/session-turn-boundaries/002-session-relaunch-loop/028-goal-rebind-live-proof-and-docs/scratch/harness/run-hop.sh` prints `1 0`.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T020 Run the nudge suite (`TESTS/nudge.test.cjs`). Verify: `node --test .skilled/hooks/session-relaunch/tests/nudge.test.cjs` exits 0 with `fail 0`, appended to `PKT/scratch/green.txt`.
- [x] T021 Run the CLI and wrapper claim suites (`TESTS/session-relaunch-cli.test.cjs`, `TESTS/skilled-loop-wrapper-claim-goal.test.cjs`). Verify: `env -u AI_SESSION_CHILD node --test .skilled/hooks/session-relaunch/tests/session-relaunch-cli.test.cjs .skilled/hooks/session-relaunch/tests/skilled-loop-wrapper-claim-goal.test.cjs` exits 0 with `fail 0`, appended to `PKT/scratch/green.txt`.
- [x] T022 Run every relaunch and plugin suite (`TESTS`, `.opencode/plugins/tests`). Verify: `env -u AI_SESSION_CHILD node --test .skilled/hooks/session-relaunch/tests/*.test.cjs .opencode/plugins/tests/*.test.cjs` exits 0 with `fail 0`. Observed 2026-11-13: the harness exports `OPENCODE_DB=opencode-v1.db`, which the unmodified history lookup plugin test feeds to its fixture reader and gets `store_unreadable`; with `OPENCODE_DB` unset the suite runs 1489 of 1489 with `fail 0`, see the deviation row in `goal.md`.
- [x] T023 Run the named guard tests by title (`TESTS`). Verify: `env -u AI_SESSION_CHILD node --test --test-name-pattern 'asks for an active command line|releases a deep-loop lock before prepare|runs the active command again|exactly the sections the core validates|exits two for an invalid handoff note|keep accepts a note with no Running workers line' .skilled/hooks/session-relaunch/tests/nudge.test.cjs .skilled/hooks/session-relaunch/tests/session-relaunch-cli.test.cjs` exits 0 with `fail 0`.
- [x] T024 Confirm the phase touched only the six named files under `.skilled` and the harness note outside the packet (`SR`, `.skilled/commands/speckit`). Verify: `git diff --name-only -- .skilled .opencode` prints only the six files in `spec.md`. Observed 2026-11-13: the command prints ten paths, because the shared worktree also carries the parallel phase-010 lane's uncommitted edits under `.skilled/skills/system-deep-loop/runtime/`; the six session-relaunch and commands paths are the only ones this phase touched, see the deviation row in `goal.md`.
- [x] T025 Run strict validation on the packet (`PKT`). Verify: `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh specs/hooks-plugins-extensions/session-turn-boundaries/002-session-relaunch-loop/038-goal-and-workflow-resume/009-nudge-note-lines --strict` prints `RESULT: PASSED`.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] Manual verification passed
- [x] Every row of `acceptance-criteria.md` is `Met`
- [x] `PKT/scratch/red.txt` holds seven failing runs and `PKT/scratch/green.txt` the passing runs
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Research**: `../research/research.md` section 9, ranks 1, 3, 4 and 12
- **Live evidence**: `../scratch/live-hops-claude-2026-11-13/10-background-worker-orphaned/`
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

A task that cannot run is marked `[B]` with its reason in `goal.md` section 4, and a `[B]` task blocks close.
<!-- /ANCHOR:protocol -->

---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [x] CHK-001 [P0] Requirements documented in spec.md. Verify: `rg -c '^\| REQ-' spec.md` prints 9.
- [x] CHK-002 [P0] Technical approach defined in plan.md. Verify: `rg -n '^## 4. IMPLEMENTATION PHASES' plan.md` prints 1 line.
- [x] CHK-003 [P1] T001 and T002 are recorded before the first edit. Verify: `rg -n 'T001|T002' goal.md` prints 2 rows in the Progress table with state Done.
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] The changed sources parse. Verify: `node --check .skilled/hooks/session-relaunch/lib/nudge.cjs && node --check .skilled/hooks/session-relaunch/bin/session-relaunch.cjs` exits 0.
- [x] CHK-011 [P0] No console output is added to the changed sources. Verify: `git diff -U0 -- .skilled/hooks/session-relaunch/lib .skilled/hooks/session-relaunch/bin` prints no added `console.` line.
- [x] CHK-012 [P1] The changed sources carry no spec path, phase number or task id in a comment. Verify: `git diff -U0 -- .skilled/hooks/session-relaunch/lib .skilled/hooks/session-relaunch/bin` prints no added line matching `specs/`, `REQ-`, `T0` or `phase 0`.
- [x] CHK-013 [P1] The new check keeps its durable WHY in a comment. Verify: `rg -n 'Running workers' .skilled/hooks/session-relaunch/bin/session-relaunch.cjs` prints at least one comment line that says why the receiver needs the line.
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing Checklist

- [x] CHK-020 [P0] Every acceptance row is `Met`. Verify: `rg -c '\| Met \|' acceptance-criteria.md` prints 12.
- [x] CHK-021 [P0] The full relaunch and plugin suites exit 0. Verify: `env -u AI_SESSION_CHILD node --test .skilled/hooks/session-relaunch/tests/*.test.cjs .opencode/plugins/tests/*.test.cjs` exits 0 with `fail 0`.
- [x] CHK-022 [P1] Each must-fail test holds a red run. Verify: `rg -c '^not ok' scratch/red.txt` prints 7.
- [x] CHK-023 [P1] The refusal reason names the line. Verify: `env -u AI_SESSION_CHILD node --test --test-name-pattern 'note with no Running workers line' .skilled/hooks/session-relaunch/tests/session-relaunch-cli.test.cjs` exits 0 with `fail 0`.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## FIX ADDENDUM: FIX COMPLETENESS

- [x] CHK-FIX-001 [P0] Each gap carries one class in `plan.md`. Verify: `rg -n 'instance-only|cross-consumer' plan.md` prints the class list.
- [x] CHK-FIX-002 [P0] The same-class producer inventory ran. Verify: `rg -l 'In-flight state' .skilled .opencode --glob '!specs/**'` lists no note writer that passes a note to `prepare` and lacks `Running workers:`.
- [x] CHK-FIX-003 [P0] The consumer inventory ran. Verify: `rg -n "validatedNote\(" .skilled/hooks/session-relaunch/bin/session-relaunch.cjs` prints the definition, the `prepare` call with the option and the `keep` call without it.
- [x] CHK-FIX-004 [P0] The adversarial values are tested. Verify: `rg -n "Running workers:" .skilled/hooks/session-relaunch/tests/session-relaunch-cli.test.cjs` shows a missing line, an empty value, a value with no pid, `none` and a pid value.
- [x] CHK-FIX-005 [P1] The matrix axes are listed. Verify: `rg -n 'Matrix axes' plan.md` prints 1 line.
- [x] CHK-FIX-006 [P1] The suites ran with `AI_SESSION_CHILD` unset. Verify: every suite command in `scratch/green.txt` starts with `env -u AI_SESSION_CHILD` or runs a file that does not claim.
- [x] CHK-FIX-007 [P1] The evidence is pinned to a commit. Verify: `git rev-parse HEAD` prints `59c7aede7d5cac15a998d53a9d1c45bb7dde5ee4`; the phase edits are uncommitted and the orchestrator commits them.
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] No secret is added. Verify: `git diff -U0` prints no added line matching `api_key`, `password` or `secret`.
- [x] CHK-031 [P0] The new nudge and seed lines print no note value. Verify: `node --test --test-name-pattern 'checks running workers before' .skilled/hooks/session-relaunch/tests/nudge.test.cjs` exits 0 and its assertion checks the placeholder `<pid>`.
- [x] CHK-032 [P1] The refusal reason prints no note content. Verify: the T014 test asserts the reason text is the fixed message.
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] Spec, plan, tasks, criteria and goal name the same six files. Verify: `rg -l 'skilled-loop-wrapper-claim-goal' spec.md plan.md tasks.md` lists 3 files.
- [x] CHK-041 [P1] The handoff template matches the nudge. Verify: `rg -o -e 'Running workers:' -e 'Scheduled:' -e 'Added directories:' -e 'kill -TERM' .skilled/commands/speckit/handoff.md` prints all four strings.
- [x] CHK-042 [P2] The README and playbook are left to phase 017. Verify: `git diff --name-only -- .skilled/hooks/session-relaunch/README.md .skilled/skills/system-spec-kit/manual-testing-playbook` prints nothing.
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P1] scratch holds the two run logs. Verify: `ls scratch` lists `red.txt` and `green.txt`.
- [x] CHK-051 [P1] No new file lands outside the packet and the six named files. Verify: `git status --short --untracked-files=all -- .skilled .opencode` lists no other path.
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 12 | 12/12 |
| P1 Items | 13 | 13/13 |
| P2 Items | 1 | 1/1 |

**Verification Date**: 2026-11-13
<!-- /ANCHOR:summary -->

---
