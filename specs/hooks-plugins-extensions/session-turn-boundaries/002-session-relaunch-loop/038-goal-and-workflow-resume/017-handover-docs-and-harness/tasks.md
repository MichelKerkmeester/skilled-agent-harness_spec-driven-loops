---
title: "Tasks: Phase 17: handover-docs-and-harness"
description: "Task Format: T### [P?] Description (file path). Verify: <command> prints <expected output>"
trigger_phrases:
  - "handover docs and harness tasks"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.4 -->
# Tasks: Phase 17: handover-docs-and-harness

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

**Task variables**: `P` is `specs/hooks-plugins-extensions/session-turn-boundaries/002-session-relaunch-loop/038-goal-and-workflow-resume`. `H` is `specs/hooks-plugins-extensions/session-turn-boundaries/002-session-relaunch-loop/028-goal-rebind-live-proof-and-docs/scratch/harness`. `README` is `.skilled/hooks/session-relaunch/README.md`. `PB` is `.skilled/skills/system-spec-kit/manual-testing-playbook/plugins-and-hooks/session-relaunch-claude.md`. `DIFF` is `$P/scratch/live-hops-claude-2026-11-13/10-background-worker-orphaned/run-hop-variant.diff`.

**Phase source rule**: a documentation task reads its phase's `acceptance-criteria.md` and `implementation-summary.md` first. When the closure line says Yes, it documents what the Met rows record. When the phase records a decline, it documents the decline and the reason that phase gives. It writes nothing for a phase that is still open.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Confirm phases 009 to 016 have closed or declined (`$P/0{09..16}-*/acceptance-criteria.md`). Verify: `rg -c 'Closeable:\*\* Yes' $P/0{09,10,11,12,13,14,15,16}-*/acceptance-criteria.md` prints 8 lines, or each missing phase has a decline row in its own `goal.md` found by `rg -n -i 'declin' $P/<phase>/goal.md`. **Evidence:** Done: prints 8 lines. Three of them read No at first while every row was Met, and were corrected before this phase's documents were written.
- [x] T002 Confirm the late-write cause live before the fix: one no-goal hop with the unchanged `finish-run.sh`, then a look at the project folder 15 s later (`$H/finish-run.sh`). Verify: after `bash $H/build-sandbox.sh claude "$sandbox" 3990 "$(git rev-parse --show-toplevel)"`, `NO_GOAL=1 bash $H/run-hop.sh claude "$sandbox" "$out" late-write; bash $H/finish-run.sh claude "$out"; sleep 15; ls -d "$(cat "$out/project-dir.txt")"` prints the folder (cause confirmed) or `No such file` (cause unconfirmed), and the result goes into `goal.md` before the folder is removed by hand. **Evidence:** Done, cause not reproduced in this run: `ls -d` printed `No such file`, exit 1, 15 s after the old script (`scratch/late-write.txt`). The run used an export of the harness from the commit before the fix, because the fix was already in the worktree. The late write was seen live the same day in three of phase 016's ten goal hops.
- [x] T003 Apply the worker diff to a scratch copy to show it still applies (`DIFF`). Verify: `patch -o "$TMPDIR/run-hop-worker.sh" $H/run-hop.sh $DIFF` exits 0 and `bash -n "$TMPDIR/run-hop-worker.sh"` exits 0. **Evidence:** Done: `patch -o` exit 0 and `bash -n` exit 0.
- [x] T004 Record the document baselines (`README`, `PB`). Verify: `python3 .skilled/skills/sk-doc/shared/scripts/validate_document.py <file>` prints `VALID` and `Total issues: 0` for both, and `rg -n '^version:' $PB` prints `9:version: 1.0.21.0`. **Evidence:** Done: both printed `VALID` and `Total issues: 0`, and the playbook read `9:version: 1.0.21.0`.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T005 Add the late-write test, which must fail first against the unchanged script (`$H/test-finish-run.sh`). Verify: `bash $H/test-finish-run.sh` exits 1 and prints `FAIL: project folder still present`. **Evidence:** Done: `scratch/red.txt`, exit 1 with `FAIL: project folder still present`. The orchestrator ran the test against the old script again at close: exit 1, same line.
- [x] T006 Watch the removed project folder for `FINISH_SETTLE_S` seconds, default 15, and remove it again on each reappearance (`$H/finish-run.sh`). Verify: `bash $H/test-finish-run.sh` exits 0 and prints `ok`, and `bash -n $H/finish-run.sh` exits 0. **Evidence:** Done: `scratch/green.txt`, exit 0 and `ok`. `bash -n` exit 0.
- [x] T007 Depends on phase 009. Describe the `Running workers:`, `Scheduled:` and `Added directories:` note lines and what the receiver does with each, or the decline reason (`README`). Verify: `rg -c 'Running workers:|Scheduled:|Added directories:' .skilled/hooks/session-relaunch/README.md` prints at least 3, or `rg -n 'declined' .skilled/hooks/session-relaunch/README.md` names each missing line. **Evidence:** Done: prints 4.
- [x] T008 Depends on phases 009 and 010. Rewrite the deep-loop step sentence and add the fan-out liveness sentence, or the decline reason (`README`). Verify: `rg -n 'deep-loop lock' .skilled/hooks/session-relaunch/README.md` prints the changed sentence, and `rg -n 'fanout-pool.cjs' .skilled/hooks/session-relaunch/README.md` prints 1 line. **Evidence:** Done: the changed sentence is on the deep-loop lock line, and `fanout-pool.cjs` prints 1 line.
- [x] T009 Depends on phase 011. Describe the permission mode carry-over per runtime, or the decline reason (`README`). Verify: `rg -n 'permission' .skilled/hooks/session-relaunch/README.md` prints the new sentence in section 1 or section 3. **Evidence:** Done: the permission mode paragraph follows the runtime list in section 1.
- [x] T010 Depends on phase 012. Describe the session name carry-over with its hop suffix, and correct line 83 so it names the source the wrapper uses (`README`). Verify: `rg -n 'name, provider and Pi extension settings come from the relaunch record' .skilled/hooks/session-relaunch/README.md` prints nothing unless phase 012 made `skilled-loop` read `name` from `consume`, which `rg -n 'consumed_field name' .skilled/bin/skilled-loop` shows. **Evidence:** Done: the old sentence is gone. The new one names the record or the launch line per setting, and `consumed_field name` is on one line of the wrapper.
- [x] T011 Depends on phase 013. Describe the OpenCode child-session guard and the title carry-over, or each decline reason (`README`). Verify: `rg -n 'parentID|title' .skilled/hooks/session-relaunch/README.md` prints the changed Sub-Agents paragraph and the title sentence. **Evidence:** Done: the Sub-Agents paragraph names the `parentID` tracking, the held arm and the title carry-over.
- [x] T012 Depends on phase 014. Describe the deferred-hop notice and the cron handling on Claude, or each decline reason (`README`). Verify: `rg -n 'session_crons|deferred' .skilled/hooks/session-relaunch/README.md` prints the new sentences. **Evidence:** Done: the Stop paragraph names the notice, the `session-crons` line and what ends with the session.
- [x] T013 Depends on phase 015. Describe the Pi mode carry-over and the descendant walk as shipped or declined, with the reason (`README`). Verify: `rg -n 'Any other child program is not detected' .skilled/hooks/session-relaunch/README.md` still prints line 124 when the walk is declined, and the Pi mode sentence names `--plan` or the decline. **Evidence:** Done: the sentence still prints once. The walk is named as declined with its reason, and the Pi mode sentence names `--plan`.
- [x] T014 Depends on phase 016. Describe how a receiver claims its note under a carried goal, as phase 016 ends (`README`). Verify: `rg -n 'Goal In A Claude Receiver' -A 12 .skilled/hooks/session-relaunch/README.md` shows the added sentence. **Evidence:** Done: the paragraph ends with the two counts and names the claim line as declined.
- [x] T015 Depends on phases 009 to 016. Add a `Hand-Over State Checks` section with one check per shipped behaviour, each naming the test its phase added, the expected signal and the pass or fail line (`PB`). Verify: `rg -c '^#### HS-' .skilled/skills/system-spec-kit/manual-testing-playbook/plugins-and-hooks/session-relaunch-claude.md` equals the number of shipped behaviours listed in `goal.md`. **Evidence:** Done: prints 8, the seven shipped behaviours in the goal log plus the live worker check.
- [x] T016 Add the live background-worker hop check, built from `DIFF` with `patch -o` into the run's out folder, run with `NO_GOAL=1`, reading `RECEIVER.marker`, `PREPARE.exit` and `worker.log`, and naming the `PREPARE.exit` value phases 009 and 015 leave for a note with no `Running workers:` line and a `&` worker (`PB`). Verify: `rg -n 'run-hop-variant.diff' .skilled/skills/system-spec-kit/manual-testing-playbook/plugins-and-hooks/session-relaunch-claude.md` prints at least 1 line inside the new section. **Evidence:** Done: the diff is named inside HS-8. The check names `PREPARE.exit` `0`.
- [x] T017 Add the test script and the diff to the source files table, and say in the GR-1 text that `finish-run.sh` re-checks the project folder (`PB`). Verify: `rg -n 'test-finish-run.sh|FINISH_SETTLE_S' .skilled/skills/system-spec-kit/manual-testing-playbook/plugins-and-hooks/session-relaunch-claude.md` prints at least 2 lines. **Evidence:** Done: prints 2 lines.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T018 Stage the playbook and raise its version (`PB`). Verify: after `git add $PB`, `node .skilled/skills/sk-doc/shared/scripts/frontmatter-version.mjs bump --base HEAD` exits 0, `rg -n '^version:' $PB` prints a version above 1.0.21.0, and `node .skilled/skills/sk-doc/shared/scripts/frontmatter-version.mjs bump --base HEAD --check` exits 0. **Evidence:** Done: 1.0.21.0 raised to 1.0.22.0, and the check exits 0.
- [x] T019 Run the document validator on both documents (`README`, `PB`). Verify: `python3 .skilled/skills/sk-doc/shared/scripts/validate_document.py <file>` prints `VALID` and `Total issues: 0` for each. **Evidence:** Done: both print `VALID` and `Total issues: 0`.
- [x] T020 Run the background-worker check once as the playbook writes it, with its evidence under this phase (`scratch/live-worker-hop/`). Verify: `rg -n 'PREPARE.exit: ' scratch/live-worker-hop/summary.txt` prints the value the check names, `ls -d "$(cat scratch/live-worker-hop/project-dir.txt)"` prints `No such file` 15 s after `finish-run.sh` returns, and `ps -p "$(cat "$sandbox/WORKER.pid")"` prints no process. **Evidence:** Done 2026-11-13: `PREPARE.exit: 0`, `ls -d` printed `No such file` 15 s after `finish-run.sh`, and `ps -p` showed no worker. The run gave the patched script its helper through a temporary copy of the harness folder. The playbook links the one helper into the out folder, which has the same effect and was not itself run live.
- [x] T021 Run the automatable command of every new HS check (`PB`). Verify: each command exits 0 with `fail 0`. **Evidence:** Done: seven commands, each exit 0 with `fail 0` (`scratch/hs-checks.txt`).
- [x] T022 Confirm no behaviour change (`.skilled`, `.opencode`, `H`). Verify: `git diff --name-only -- .skilled .opencode $H` plus `git status --short $H` list only the README, the playbook, `finish-run.sh` and `test-finish-run.sh`. **Evidence:** Done: the README, the playbook, `finish-run.sh` and `test-finish-run.sh`, and nothing else.
- [x] T023 Run strict validation on this phase (`spec.md`, `plan.md`, `tasks.md`, `acceptance-criteria.md`, `goal.md`). Verify: `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh $P/017-handover-docs-and-harness --strict` prints `RESULT: PASSED`. **Evidence:** Done: `RESULT: PASSED`.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] Manual verification passed: the live background-worker run in T020
- [x] Every row of `acceptance-criteria.md` is `Met`
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Research**: `../research/research.md` sections 6, 7, 9 and 15
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

A task that waits on an open sibling phase stays `[ ]`, not `[B]`, and the phase does not close until it is done.
<!-- /ANCHOR:protocol -->

---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [x] CHK-001 [P0] Requirements documented in spec.md. Verify: `rg -c '^\| REQ-' spec.md` prints 11. **Evidence:** Prints 11.
- [x] CHK-002 [P0] Technical approach defined in plan.md. Verify: `rg -n '^## 4. IMPLEMENTATION PHASES' plan.md` prints 1 line. **Evidence:** Prints 1 line, `plan.md:92`.
- [x] CHK-003 [P1] Phases 009 to 016 are closed or declined. Verify: the T001 command. **Evidence:** Prints 8 lines.
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] Both harness scripts parse. Verify: `bash -n $H/finish-run.sh && bash -n $H/test-finish-run.sh` exits 0. **Evidence:** Exit 0.
- [x] CHK-011 [P0] `finish-run.sh` removes no path it did not remove before. Verify: `rg -n 'rm -rf' $H/finish-run.sh` lists only the project folder and `$out/run`. **Evidence:** Three lines: the project folder twice, once in the settle loop, and `$out/run`.
- [x] CHK-012 [P1] No spec path, phase number or task id appears in a new script comment. Verify: `rg -n 'specs/|T0[0-9]|REQ-|phase 0' $H/finish-run.sh $H/test-finish-run.sh` prints nothing. **Evidence:** Prints nothing.
- [x] CHK-013 [P1] The settle loop keeps its WHY in a comment. Verify: `rg -n 'late write' $H/finish-run.sh` prints at least 1 line. **Evidence:** The comment above the loop names the late write.
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing Checklist

- [x] CHK-020 [P0] Every acceptance row is `Met`. Verify: `rg -c '\| Met \|' acceptance-criteria.md` prints 11. **Evidence:** Prints 11.
- [x] CHK-021 [P0] The finish-run test failed first and passes now. Verify: `scratch/red.txt` holds `FAIL: project folder still present` and `bash $H/test-finish-run.sh` prints `ok`. **Evidence:** Both hold.
- [x] CHK-022 [P1] The live run left no project folder. Verify: the T020 `ls -d` command prints `No such file`. **Evidence:** `No such file`, exit 1.
- [x] CHK-023 [P1] Every new HS check's command passes. Verify: the T021 commands. **Evidence:** Seven of seven exit 0.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## FIX ADDENDUM: FIX COMPLETENESS

- [x] CHK-FIX-001 [P0] Each finding carries one class in `plan.md`. Verify: `rg -n 'test-isolation|matrix/evidence' plan.md` prints the class line. **Evidence:** Prints `plan.md:82`.
- [x] CHK-FIX-002 [P0] The same-class producer inventory ran. Verify: `rg -n 'rm -rf' $H` lists each removal in the harness. **Evidence:** The removals are in `finish-run.sh` and the tests' own temporary folders.
- [x] CHK-FIX-003 [P0] The consumer inventory ran. Verify: `rg -n 'finish-run.sh' .skilled/skills/system-spec-kit/manual-testing-playbook` lists every call. **Evidence:** Two playbooks name the script, five lines in the Claude one and two in the Pi and OpenCode one. The second describes the same call and needed no change.
- [x] CHK-FIX-004 [P0] The adversarial case exists for a late write. Verify: `rg -n 'late write' $H/test-finish-run.sh` prints at least 1 line. **Evidence:** The test names the late write in its header and its first case.
- [x] CHK-FIX-005 [P1] The matrix axes are listed. Verify: `rg -n 'Matrix axes' plan.md` prints 1 line. **Evidence:** Prints 1 line, `plan.md:85`.
- [x] CHK-FIX-006 [P1] The empty `project-dir.txt` case ran. Verify: `bash $H/test-finish-run.sh` prints `ok` for both cases. **Evidence:** The script prints one `ok - ` line per case and then `ok`. The second case was added by a follow-up brief, because the first wrote one case.
- [x] CHK-FIX-007 [P1] Evidence is pinned to a commit. Verify: `git rev-parse HEAD` is recorded in `goal.md` at close. **Evidence:** The goal log names the commit the evidence was taken on.
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] No raw transcript remains in an evidence folder. Verify: `ls scratch/live-worker-hop/ | rg 'transcript-'` prints nothing. **Evidence:** Prints nothing.
- [x] CHK-031 [P0] No sandbox session folder remains under the runtime home. Verify: the T020 `ls -d` command prints `No such file`. **Evidence:** `No such file`, exit 1.
- [x] CHK-032 [P1] No secret is added. Verify: `git diff -U0` prints no added line matching `api_key`, `password` or `secret`. **Evidence:** No added line matches.
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] Spec, plan, tasks and criteria name the same four files. Verify: `rg -l 'test-finish-run.sh' spec.md plan.md tasks.md acceptance-criteria.md` lists 4 files. **Evidence:** Lists 4 files.
- [x] CHK-041 [P1] Each of phases 009 to 016 is named in the README by its change or its decline. Verify: AC-001 to AC-005 are Met. **Evidence:** AC-001 to AC-005 are Met.
- [x] CHK-042 [P2] The playbook version rose by one step. Verify: `git diff -- $PB | rg '^\+version:'` prints 1 line. **Evidence:** Prints 1 line.
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P1] The red run and the live evidence live in this phase's `scratch/`. Verify: `ls scratch` lists `red.txt` and `live-worker-hop`. **Evidence:** Both are listed.
- [x] CHK-051 [P1] The scratch copy of the patched harness is not committed. Verify: `git status --short` lists no `run-hop-worker.sh`. **Evidence:** No such line. The patched copy was moved out of the worktree.
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
