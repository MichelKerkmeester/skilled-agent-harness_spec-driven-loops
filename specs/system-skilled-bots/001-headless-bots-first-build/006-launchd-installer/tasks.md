---
title: "Tasks: Phase 6: launchd-installer"
description: "Task Format: T### [P?] Description (file path). Verify: <command> prints <expected output>"
trigger_phrases:
  - "launchd installer tasks"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.4 -->
# Tasks: Phase 6: launchd-installer

<!-- SPECKIT_LEVEL: 3 -->

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

`L` is `.skilled/skills/system-skilled-bots/runtime/lib/`. `LA` is `~/Library/LaunchAgents/`. `RUNS` is `.skilled/skills/.state/system-skilled-bots/<identity>/runs/` in the resolved Skilled tree. `IR` is `<state root>/<identity>/installs/`. The probe and test bot use labels outside the hub grammar until T015.
<!-- /ANCHOR:notation -->

---

## AI Execution Protocol

### Pre-Task Checklist
Before starting any task, verify:
1. [ ] `spec.md` scope is unchanged, including the out-of-scope line for `.skilled/commands/doctor/`
2. [x] T001 and T002 pass, so phases 2, 3 and 5 are closed
3. [ ] ADR-003 records the T003 probe before T007 starts
4. [ ] The task's P0 and P1 checklist rows are identified
5. [ ] No real `launchctl` call runs outside T003 and T015 to T020

### Execution Rules
| Rule | Description |
|------|-------------|
| TASK-SEQ | Complete tasks in the dependency order of `plan.md` |
| TASK-SCOPE | Write only the files in `spec.md` Files to Change, `~/Library/LaunchAgents` and the state root |
| TASK-VERIFY | Run each task's Verify command and read its output and exit status |
| TASK-DOC | Mark a task `[x]` only after its Verify line passed |
| TASK-REAL | A real install, enable or fire runs only with the operator watching |

### Status Reporting Format
Report each task as `T### <done|blocked|failed>: <Verify command> -> <observed output>`.

### Blocked Task Protocol
A task waiting on an earlier phase or on the operator is marked `[B]` with the reason. No install runs while a P0 task above it is blocked. After three failed fixes for one symptom, stop and report to the operator.

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup
<!-- FILL: Replace the sample tasks with the real setup steps. Each task names a file and a verify command. GOOD: T001 Confirm `logs/archive/` holds 10 archives. Verify: `ls logs/archive | wc -l` prints 10. WEAK: T001 Set up the project. -->

- [x] T001 Confirm phases 2, 3 and 5 are closed (`../002-schedule-predicates-and-checker/acceptance-criteria.md`, `../003-manual-runner/acceptance-criteria.md`, `../005-request-pipeline/acceptance-criteria.md`). Verify: `rg -c --include-zero '\| Unmet \|' ../002-schedule-predicates-and-checker/acceptance-criteria.md ../003-manual-runner/acceptance-criteria.md ../005-request-pipeline/acceptance-criteria.md` prints `<file>:0` for each of the three files. Evidence: 2026-11-24, all three files print `:0` (`scratch/entry-conditions-2026-11-24.txt:2`). Phase 2 closed once its weekday probe ran. The phase was built before this held, on the brief, and the translator's lone-day-field refusal guarded that gap until the probe settled it.
- [x] T002 Confirm the phase 2 weekday probe result is recorded (`../002-schedule-predicates-and-checker/implementation-summary.md`). Verify: `rg -n 'Weekday' ../002-schedule-predicates-and-checker/implementation-summary.md` prints the result line naming `Weekday` with its dates, and `rg -n 'Probe observation' ../002-schedule-predicates-and-checker/decision-record.md` prints the full record. Evidence: 2026-11-24, the result line prints at `implementation-summary.md:58` and the record at `decision-record.md:50` (`scratch/entry-conditions-2026-11-24.txt:7`, `scratch/entry-conditions-2026-11-24.txt:10`). The probe fired only on its weekday, so the translator now emits a lone `Weekday` key and a weekday schedule installs.
- [x] T003 Probe how `bootstrap` treats a disabled label with a throwaway plist that only appends a timestamp (`scratch/probe-disabled.plist`). Verify: the outcome of `launchctl disable`, then `launchctl bootstrap`, then `launchctl print`, then one calendar minute, is written in `decision-record.md` ADR-003 with the exact exit codes, the macOS version and the domain target (`gui/<uid>` or `user/<uid>`) each command accepted, and `ls LA | grep -c probe` prints 0 after cleanup. Evidence: Done: live, 2026-11-23, macOS 27.0.1 (26A434), domain `gui/501` accepted: `disable` exit 0, `bootstrap` on the disabled label exit 5 (Input/output error, job not loaded), `print` exit 113, and no fire across one held slot (`scratch/live-install-result.txt:8`, `scratch/live-install-result.txt:26`, `scratch/live-install-result.txt:29`). The probe ran on the real test bot through `scratch/live-install.sh` rather than a separate throwaway plist; 0 job files remained (`scratch/live-install-result.txt:123`).
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation
<!-- FILL: Write one implementation task per file change. Add a `Verify:` line with the command and its expected output. GOOD: T002 Add the `--keep <n>` branch. Verify: `--keep 3` leaves 3 archives. WEAK: T002 Implement the feature. -->

- [x] T004 Add the install preflight: runner and its absolute, executable interpreter resolvable; state-root switches readable; identity known; phase 2 checker passes; phase 3 posture check passes (`L/installer.ts`). Verify: the five refusal tests in `installer.vitest.ts` pass and each leaves `LA` unchanged in the stub. Evidence: Done: five refusal cases pass, `tests/installer.vitest.ts:380` to `:411`.
- [x] T005 Render one plist per bot schedule from translator dictionaries, the phase 2 label and install-time absolute paths (`L/plist-render.ts`). Verify: a rendered fixture passes `plutil -lint` and `rg -n '~|\$HOME' <rendered plist>` prints nothing. Evidence: Done: `scratch/rendered-fixtures.txt` shows `plutil -lint` OK on both rendered fixtures and the `~|$HOME` grep printing nothing, exit 1.
- [x] T006 Add the six-step install transaction with temp-file write and rename (`L/installer.ts`). Verify: the stub records lint, bootout, move, bootstrap, print in that order, and a forced lint failure leaves the old file and loaded job unchanged. Evidence: Done: `tests/installer.vitest.ts:234` and `:268`.
- [x] T007 Make a first install disabled with the mechanism ADR-003 settles, and mark it so a reinstall can tell it from a kill-switch label (`L/installer.ts`). Verify: after install, the stubbed `print-disabled` lists the label as disabled, the stub records no fire, and a second install of the same never-enabled bot does not stop with the kill-switch message. Evidence: Done: disable before the move, bootstrap tolerated, a host that loads it anyway is booted out; the record's `hold` tells a first install from a kill switch (ADR-003 as built). `tests/installer.vitest.ts:306` and `:324`.
- [x] T008 Add the `print-disabled` check: stop with a message, or enable only with an explicit flag; never call `load -w` (`L/installer.ts`). Verify: ``rg -n "['\"\`]load['\"\`]|launchctl load" L .skilled/bin/bots.cjs`` prints nothing, and the kill-switch test passes. Evidence: Done: `scratch/grep-gates.txt` lines 4-5 print nothing, exit 1; `tests/installer.vitest.ts:347`.
- [x] T009 Add uninstall with bootout, plist delete, orphan sweep and `print-disabled` check (`L/installer.ts`). Verify: the uninstall test leaves no hub bot label in the stubbed `LA`, keeps the stubbed drain plist, deletes the bot's file in the stubbed `IR`, and leaves the stubbed `RUNS` tree, including another identity's runs, byte-identical. Evidence: Done: `tests/installer.vitest.ts:484`.
- [x] T010 Add slot accounting: snapshot before dispatch, grace window clamp, lateness class, bounded skipped-slot summary from the phase 2 slot lister (`L/slot-accounting.ts`). Verify: `slot-accounting.vitest.ts` passes the on-time, late and catch-up cases and the clamp at 120 and 7,200 seconds. Evidence: Done: `tests/slot-accounting.vitest.ts:61` to `:92` pass the on-time, late and catch-up cases and the 120 and 7,200 clamp.
- [x] T011 Call slot accounting from the runner on schedule fires only (`L/runner`). Verify: a manual run record has no `scheduled_at`, and a stubbed schedule fire record has `scheduled_at`, `dispatched_at` and `lateness_seconds`. Evidence: Done: `tests/slot-accounting.vitest.ts:162` (manual record has no `scheduledAt`) and `:103` (scheduled record has `scheduledAt`, `dispatchedAt`, `latenessSeconds`).
- [x] T012 Render the per-repository drain plist with `QueueDirectories` on phase 5's `<state root>/<repository identity>/requests/inbox/` only (`L/plist-render.ts`), under the drain label `com.skilled.bots.<identity>.drain` from phase 2 ADR-004, and install it through the same transaction (`L/installer.ts`). Verify: the rendered drain plist carries that label and names one absolute path ending in `requests/inbox`, and the `tmp/`, `claimed/`, `done/`, `quarantine/` and `seen/` folders are not under it. Evidence: Done: `tests/installer.vitest.ts:653`.
- [x] T013 Add `schedule install` and `schedule uninstall`, and make `enable` and `disable` reach the launchd label through the installer module (`.skilled/bin/bots.cjs`). Verify: `node .skilled/bin/bots.cjs schedule install` with no id exits non-zero with usage. Evidence: Done: `tests/installer.vitest.ts:969` exits 2 with usage; `node .skilled/bin/bots.cjs schedule install` printed `bots: schedule install needs a bot id, or drain` and exit=2. After the second review, `enable`, `disable`, `pause`, `resume` and `schedule uninstall` resolve the state root from the installed job's `EnvironmentVariables` (`jobEnv` in `L/installer.ts`), so the switch and the scheduler stop land where the job reads; a disable from a shell with another `XDG_STATE_HOME` stops the label and the next fire is refused `disabled` (`tests/installer.vitest.ts:816`). With no install record found, disable still stops a label that has a job file or that the scheduler knows (`tests/installer.vitest.ts:842`). A bot `enable` or `disable` that finds no schedule warns on stderr and exits 0, since the run-layer switch still applies. After the third review every CLI verb resolves the state root through `jobEnv` (install refuses `state-home-changed` instead), proven through the real CLI with a `launchctl` intercept: `bots disable` (`tests/installer.vitest.ts:910`), `bots pause` (`tests/installer.vitest.ts:920`), and `bots disable` with `BOT.md` gone stops the schedule and sets no switch (`tests/installer.vitest.ts:929`).
- [x] T023 Detect the `.skilled` kind and write the install record by temp file and rename (`L/installer.ts`). The kind is `symlink` when the real path of `<repo root>/.skilled/bin/bots.cjs` leaves the repository root, `vendored` when an overlay manifest is found through `.skilled-overlays.json` or the default `skilled-overlays/` folder at the tree root, and `checkout` otherwise. Verify: for three stubbed trees (plain checkout, whole and merged link, vendored with `pin.commit`), the written `IR/<bot-id>.json` names the matching kind, both runner paths, the tree root and the pin only for `vendored`. Evidence: Done: `tests/installer.vitest.ts:548`.
- [x] T024 Add the read-only needs-reinstall check with reasons `runner-missing`, `runner-retargeted`, `kind-changed`, `pin-changed` and `record-missing` (`L/installer.ts`). Verify: the stubbed `launchctl` records no state-changing verb during the check, and the stubbed `IR` and `LA` are byte-identical after it. Evidence: Done: `tests/installer.vitest.ts:633` hashes the state root and the agents folder before and after and records no scheduler call.
- [x] T029 Build the job's environment in one place and compare outputs at install (`L/installer.ts`, `L/plist-render.ts`, `.skilled/bin/bots.cjs`, and `resolveEnv` in `L/runner.ts`, `L/request-drain.ts`, `L/answer.ts`). `launchdJobEnv` gives the bare `PATH`, the account home and the job file's values; the job file always pins `XDG_STATE_HOME` when the config names no `stateRoot`; install refuses `job-env-diverges` when shell and job resolve another identity or state root; every verb resolves under `jobEnv`. Verify: the `GITHUB_REPOSITORY` install refuses `job-env-diverges` with the agents folder unchanged, a CLI `pause` from that shell lands where the fired job refuses, a `HOME` override pins and stays consistent, and a mutation control that drops the comparison fails. Evidence: Done: `tests/installer.vitest.ts:1035`, `:1082`, `:1093`, `:1107`; mutation logged in `scratch/mutation-controls.txt`; inputs inventoried in `scratch/env-inputs.txt`.
- [x] T030 Find a checkout's installed jobs by the `--repo` in each hub job file, not by the label built from the identity of now (`L/installer.ts`). `jobEnv`, `disableSchedule`, `uninstallSchedule` and its sweep use them; install refuses `identity-changed` for a job of another identity and `state-home-changed` for a job written for another state root or for switches stranded under a default root; the check adds `identity-changed` and `state-root-changed`; the intercept refuses to load without an account home. Verify: after an origin change or a declared identity, `bots disable` from another state home disables the old label and sets the switch under the job's root, the old job's fire is refused, a reinstall refuses `identity-changed` with the agents folder unchanged, and reverting the lookup fails the test. Evidence: Done: `tests/installer.vitest.ts:1163`, `:1203`, `:1218`, `:1247`, `:1274`; five mutation controls in `scratch/mutation-controls.txt`.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification
<!-- FILL: Write one verification task per requirement. Each one runs a command. GOOD: T003 Run both invocations. Verify: `ls logs/archive | wc -l` prints 3 and 10. WEAK: T003 Test everything. -->

- [x] T014 Run the stubbed suite (`.skilled/skills/system-skilled-bots/runtime/tests/installer.vitest.ts`). Verify: the runner prints zero failures and exit status 0. Evidence: Done: `scratch/bots-suite-after-1.txt` and `-2.txt`: 31 files, 303 tests passed, exit 0, both runs. After the review fixes: `scratch/bots-suite-review-1.txt` and `-2.txt`: 31 files, 305 tests passed, exit 0, both runs. After the second review: `scratch/bots-suite-review2-1.txt` and `-2.txt`: 31 files, 308 tests passed, exit 0, both runs. After the third review: `scratch/bots-suite-review3-1.txt` and `-2.txt`: 31 files, 312 tests passed, exit 0, both runs.
- [x] T015 Install a harmless cron bot for real and confirm it stays silent while disabled (`LA`). Verify: `launchctl print-disabled gui/$(id -u)` lists the label as disabled, and no run record appears across one scheduled minute. Evidence: Done: `scratch/live-install-result.txt:25` (disabled), `scratch/live-install-result.txt:29` (0 records across the held slot).
- [x] T016 Enable it and wait for one fire (`LA`). Verify: `launchctl print gui/$(id -u)/<label>` shows the absolute interpreter, and one run record carries `scheduled_at` and a lateness class. Evidence: Done: `scratch/live-install-result.txt:39` (absolute interpreter), `scratch/live-install-result.txt:51` to `:56` (fired slot and on-time lateness).
- [x] T017 Prove label separation with two repository identities and the same bot id (`installer.vitest.ts`). Verify: the two rendered labels differ. Evidence: Done: `tests/installer.vitest.ts:450`.
- [x] T018 Simulate a sleep gap (`slot-accounting.vitest.ts`). Verify: one run record has a skipped-slot count, first and last instant, and the run count is 1. Evidence: Done: `tests/slot-accounting.vitest.ts:103`.
- [x] T028 Fire a stubbed schedule while its bot has an open needs-you item, then again after the item is answered (`slot-accounting.vitest.ts`). Verify: the first fire has no dispatch receipt and its slot is recorded as skipped with reason `held-needs-you`, and the second fire leaves one run record with a lateness class. Evidence: Done: `tests/slot-accounting.vitest.ts:135`.
- [x] T019 Enqueue one request with the drain agent enabled (`LA`). Verify: one run record appears and `ls -A <state root>/<repository identity>/requests/inbox` prints nothing afterwards. Evidence: Done: `scratch/live-install-result.txt:106` (inbox empty), `scratch/live-install-result.txt:107` (one more record).
- [x] T020 Uninstall the test bot and the drain agent (`LA`). Verify: `ls LA | grep -c 'com.skilled.bots.'` prints 0, `ls IR` lists neither bot, and the run folders under `RUNS` still exist. Evidence: Done: `scratch/live-install-result.txt:123` (0 job files), `scratch/live-install-result.txt:126` (run folders kept).
- [x] T021 Check the scheduling invariant in code (`.skilled/skills/system-skilled-bots/runtime/lib`, `.skilled/bin/bots.cjs`). Verify: `rg -n --glob '!tests/**' 'launchctl|bootstrap|LaunchAgents' .skilled/skills/system-skilled-bots/runtime/lib .skilled/bin/bots.cjs` prints lines from `installer.ts` only. Evidence: Done: `scratch/grep-gates.txt` lines 1-3: 28 lines, all in `installer.ts`.
- [x] T022 Install the same bot from a second clone of one identity, with the first clone's plist in the stubbed `LA` (`installer.vitest.ts`). Verify: the second install exits non-zero with reason `label-held-by-clone`, prints the first clone's path and leaves the stubbed `LA` byte-identical. Evidence: Done: `tests/installer.vitest.ts:460`.
- [x] T025 Run the needs-reinstall cases (`installer.vitest.ts`). Verify: a deleted runner returns `runner-missing`, a retargeted link returns `runner-retargeted`, a changed `pin.commit` returns `pin-changed`, a label with no record returns `record-missing`, and after a reinstall each returns `ok`. Evidence: Done: `tests/installer.vitest.ts:590` to `:633`.
- [x] T026 Confirm this phase changed nothing under `.skilled/commands/doctor/`. Verify: `git diff --stat <phase start commit> -- .skilled/commands/doctor` prints nothing. Evidence: Done: `scratch/grep-gates.txt` lines 6-7 print nothing.
- [x] T027 Record the post-repin follow-up for system-skilled-doctor (`implementation-summary.md`). Verify: `rg -n 'doctor-overlay-repin.yaml' implementation-summary.md` prints the line that names the hook point and the check to call. Evidence: Done: `implementation-summary.md` Known Limitations names `doctor-overlay-repin.yaml` phase_6_reread and `checkInstallsFor`.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria
<!-- FILL: Keep the three completion lines and add the one artifact that proves the phase is done. GOOD: `--keep 3` leaves 3 archives and the suite passes. WEAK: Work is complete. -->

- [ ] All tasks marked `[x]`
- [ ] No `[B]` blocked tasks remaining
- [ ] Manual verification passed
- [ ] The real-fire run record from T016 is quoted in `implementation-summary.md`
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

A task blocked on an earlier phase is marked `[B]` with the phase named, and no install runs while it stays blocked.
<!-- /ANCHOR:protocol -->

---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation
<!-- FILL: Write one check per setup fact, each with a command. GOOD: CHK-001 [P0] The start commit is in `goal.md` section 4. WEAK: Setup is ready. -->

- [x] CHK-001 [P0] Requirements documented in spec.md: `rg -c '^\| REQ-' spec.md` prints 17 Evidence: 18 rows: REQ-001 to REQ-018. The count of 17 here predates REQ-018.
- [x] CHK-002 [P0] Technical approach defined in plan.md: `rg -n '^## 4' plan.md` prints one line Evidence: `## 4. IMPLEMENTATION PHASES` at plan.md line 85.
- [x] CHK-003 [P1] Phases 2, 3 and 5 closed: T001 and T002 verified Evidence: both verified on 2026-11-24 (`scratch/entry-conditions-2026-11-24.txt`).
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality
<!-- FILL: Write one check per file rule. A command must answer it. GOOD: CHK-010 [P0] `bash -n scripts/rotate-logs.sh` exits 0. WEAK: Code is clean. -->

- [x] CHK-010 [P0] The phase 1 lint and type check pass on `runtime/lib/installer.ts`, `plist-render.ts` and `slot-accounting.ts` Evidence: `scratch/typecheck-after.txt` exit=0; the runtime has no separate lint script.
- [x] CHK-011 [P0] Every rendered fixture plist passes `plutil -lint` Evidence: `scratch/rendered-fixtures.txt`; every install test also lints its job file with the real plutil.
- [x] CHK-012 [P1] Every failed install step names the step and the state it left Evidence: Each failure reads `<step> exited <n>: <state left>`, asserted in `tests/installer.vitest.ts:268`. A read-back failure names the same: the job file in place, the job loaded or held, and no install record written (`tests/installer.vitest.ts:284`).
- [x] CHK-013 [P1] No code comment carries a packet, phase or requirement id: `rg -n 'REQ-|ADR-|phase [0-9]' runtime/lib` prints nothing Evidence: `scratch/grep-gates.txt` lines 8-9 print nothing.
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing Checklist
<!-- FILL: Write one check per acceptance criterion. GOOD: CHK-020 [P0] `--keep 3` leaves 3 archives. WEAK: Tests pass. -->

- [ ] CHK-020 [P0] Every row in `acceptance-criteria.md` is Met with observed evidence Evidence: Open: AC-002, AC-005, AC-008 and AC-009 wait on the live install.
- [x] CHK-021 [P0] The real fire in T016 ran under launchd's bare `PATH` Evidence: `scratch/live-install-result.txt:51` fired under launchd with only the bare PATH and the job file environment.
- [x] CHK-022 [P1] The first-fire, moved-checkout, retargeted-link and re-pin edge cases are tested (T025) Evidence: `tests/slot-accounting.vitest.ts:92` (first fire), `tests/installer.vitest.ts:460` (moved checkout), `:601` (retargeted link), `:623` (re-pin).
- [x] CHK-023 [P1] Lint failure, preflight refusal and kill-switch label each leave `~/Library/LaunchAgents` unchanged Evidence: In the stand-in agents folder: `tests/installer.vitest.ts:268`, `:380` to `:411`, `:347`. The real folder hash was the same before and after both suite runs (`scratch/entry-conditions.txt`).
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:security -->
## Security
<!-- FILL: Write one check per security surface. Write `N/A` with a reason when none applies. GOOD: CHK-030 [P0] `scripts/rotate-logs.sh` reads no credential. WEAK: Security is fine. -->

- [x] CHK-030 [P0] No secret in a rendered plist, and no environment value beyond `XDG_STATE_HOME` (NFR-S02): `rg -n -i 'token|secret|password' <rendered fixtures>` prints nothing, and the only environment key is asserted by test Evidence: `scratch/rendered-fixtures.txt`: `token|secret|password|EnvironmentVariables` prints nothing. The literal `key` grep would match the property list's own `<key>` tags, so it was not used. After review, a job installed from a shell whose `XDG_STATE_HOME` set the state root carries `EnvironmentVariables` with that one path and nothing else, asserted in `tests/installer.vitest.ts:234`; a job whose config names `stateRoot` carries none (`tests/installer.vitest.ts:718`).
- [x] CHK-031 [P0] The installer writes only to `~/Library/LaunchAgents` and the state root, install records included; a test asserts no write under the checkout or under `RUNS` Evidence: `tests/installer.vitest.ts:234` hashes the checkout and the Skilled tree before and after; `:484` keeps the run folders byte-identical.
- [x] CHK-032 [P1] Switch files stay under the state root and no installed plist points a run at a switch inside the checkout Evidence: Switches are read from `identityStatePaths(...).switches` under the state root; a job file names only the interpreter, the runner, the checkout, the Skilled tree and a log under the state root.
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation
<!-- FILL: Write one check per document that must agree. GOOD: CHK-040 [P1] `spec.md` and `tasks.md` both name `--keep <n>`. WEAK: Docs are updated. -->

- [x] CHK-040 [P1] `spec.md`, `plan.md` and `tasks.md` name the same six install steps Evidence: All three name render, lint, bootout, move, bootstrap and print.
- [x] CHK-041 [P1] Code comments explain the disabled default and the never-`load -w` rule without ephemeral ids Evidence: `lib/installer.ts` header comment explains the held default and why the load subcommand is never used.
- [x] CHK-042 [P2] `.skilled/scripts/launchagents/README.md` left unchanged unless the operator asked Evidence: `git status --short .skilled/scripts/launchagents` prints nothing.
- [x] CHK-043 [P1] No file under `.skilled/commands/doctor/` changed (T026) Evidence: `scratch/grep-gates.txt` lines 6-7.
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization
<!-- FILL: Write one check per file location rule. GOOD: CHK-050 [P1] Test copies live under `scratch/test/`. WEAK: Files are organized. -->

- [x] CHK-050 [P1] The probe plist lives in `scratch/` only Evidence: No probe plist was written; the probe steps live in `scratch/live-install.sh`.
- [x] CHK-051 [P1] scratch/ cleaned and no probe or test label left in `~/Library/LaunchAgents` before completion Evidence: `ls ~/Library/LaunchAgents | grep -c com.skilled.bots.` prints 0 (`scratch/entry-conditions.txt`); scratch holds evidence and the live script only.
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary
<!-- FILL: Count the boxes by priority and write the three totals. GOOD: P0 12, P1 13, P2 1. WEAK: Most items done. -->

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 10 | 8/10 |
| P1 Items | 22 | 20/22 |
| P2 Items | 5 | 4/5 |

**Verification Date**: 2026-11-24, T001, T002 and CHK-003 closed from the phase 2 probe. CHK-120 and the rows marked open above still wait
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:arch-verify -->
## L3+: Architecture Verification
<!-- FILL: L3+ means Level 3 and above, so this section stays at Level 3. Write one check per ADR, or delete the section when the packet records no ADR. GOOD: CHK-100 [P0] ADR-001 is followed by T002. WEAK: Architecture is verified. -->

- [x] CHK-100 [P0] Architecture decisions documented in `decision-record.md`, and `plan.md` points at each one Evidence: `plan.md` lists ADR-001 to ADR-006 and points at `decision-record.md`.
- [x] CHK-101 [P1] All ADRs have status: `rg -n '^\| \*\*Status\*\*' decision-record.md` prints six lines, ADR-002 Accepted Evidence: Six status lines, ADR-002 Accepted, the other five Proposed.
- [x] CHK-102 [P1] Alternatives documented with rejection rationale in each ADR Evidence: Each ADR has its Alternatives Considered table.
- [ ] CHK-103 [P1] ADR-002 is followed by T023 to T026, and ADR-003 records the T003 probe before T007 is built Evidence: Open: ADR-002 is followed by T023 to T026, but the T003 probe has not run; ADR-003 records the mechanism built without it.
<!-- /ANCHOR:arch-verify -->

---

<!-- ANCHOR:perf-verify -->
## L3+: Performance Verification
<!-- FILL: L3+ means Level 3 and above, so this section stays at Level 3. Write one check per performance claim, or delete the section when the packet makes none. GOOD: CHK-110 [P1] `--keep 3` adds under 5 ms to a run. WEAK: Performance is verified. -->

- [x] CHK-110 [P1] NFR-P01: the sleep-gap case in T018 stores one skipped-slot summary, not one entry per missed slot Evidence: `tests/slot-accounting.vitest.ts:103`: one summary, count 2015, 100 listed.
- [x] CHK-111 [P1] NFR-P02: install, uninstall and the check make no network call; the stubbed suite runs with network access blocked Evidence: `scratch/network-denied.txt`: 37 tests pass under a sandbox profile that denies outbound network; a control `fetch` under the same profile is blocked with EPERM.
- [x] CHK-112 [P2] No load test applies: launchd fires one job per slot Evidence: N/A as stated.
<!-- /ANCHOR:perf-verify -->

---

<!-- ANCHOR:deploy-ready -->
## L3+: Deployment Readiness
<!-- FILL: L3+ means Level 3 and above, so this section stays at Level 3. Write one check per deployment step, or delete the section when the packet ships no service. GOOD: CHK-120 [P0] The rollback command was run in a copy. WEAK: Ready to deploy. -->

- [B] CHK-120 [P0] The `plan.md` rollback procedure was run once on the T015 test bot: disable, bootout, plist delete and install record delete, with `ls LA | grep -c 'com.skilled.bots.'` printing 0 after Evidence: awaiting orchestrator live install; the uninstall and rollback steps are in `scratch/live-install.sh`.
- [x] CHK-121 [P1] Install output says the job is disabled, names `bots enable <id>` and prints the needs-reinstall check result Evidence: `.skilled/bin/bots.cjs:319` prints the held line naming `bots enable <id>`, `next fire: UNKNOWN` and the check result (code read; the live run shows the output).
- [x] CHK-123 [P1] The enable, disable, uninstall and reinstall steps are written for the operator in `implementation-summary.md` Evidence: `implementation-summary.md` How It Was Delivered, operator steps.
- [ ] CHK-124 [P2] The operator read those steps before the real fire in T016 Evidence: Operator-owned.
<!-- /ANCHOR:deploy-ready -->

---

<!-- ANCHOR:compliance-verify -->
## L3+: Compliance Verification
<!-- FILL: L3+ means Level 3 and above, so this section stays at Level 3. Write one check per compliance surface, or delete the section when none applies. GOOD: CHK-130 [P1] No license changed. WEAK: Compliance is verified. -->

- [ ] CHK-130 [P1] Security review of `installer.ts` covers path resolution, the kill-switch path and the install record Evidence: Left to the orchestrator's review.
- [x] CHK-131 [P1] No new package dependency is added: the phase 1 manifest diff shows none Evidence: `scratch/grep-gates.txt` lines 19-20: no diff in `package.json` or `package-lock.json`.
- [x] CHK-132 [P2] A generated plist and an install record carry no secret (CHK-030 covers the plist) Evidence: The install record holds paths, labels, a kind, a pin and timestamps only.
<!-- /ANCHOR:compliance-verify -->

---

<!-- ANCHOR:docs-verify -->
## L3+: Documentation Verification
<!-- FILL: L3+ means Level 3 and above, so this section stays at Level 3. Write one check per document pair that must agree, or delete the section when the packet holds no paired documents. GOOD: CHK-140 [P1] `plan.md` and `tasks.md` agree on the three phases. WEAK: Docs are verified. -->

- [x] CHK-140 [P1] `spec.md`, `plan.md` and `decision-record.md` name the same install record path and the same five check reasons Evidence: spec.md and decision-record.md name the path and the five reasons; plan.md now names both.
- [x] CHK-141 [P1] Phase 7's spec names the same install record path before phase 7 starts Evidence: `007-status-index/spec.md` line 249 names `<state root>/<identity>/installs/<bot-id>.json`.
- [x] CHK-142 [P2] The system-skilled-doctor follow-up is written in `implementation-summary.md` with its hook point Evidence: `implementation-summary.md` Known Limitations.
<!-- /ANCHOR:docs-verify -->

---

<!-- ANCHOR:sign-off -->
## L3+: Sign-Off
<!-- FILL: L3+ means Level 3 and above, so this section stays at Level 3. Name the real approver. Add a row only for a second approver who signs. Write `N/A` or delete the section when no sign-off applies. GOOD: Operator, merges the commit. WEAK: Signed off. -->

| Approver | Role | Status | Date |
|----------|------|--------|------|
| Operator | Owns the real fire on this host and merges the phase | [ ] Approved | |
<!-- /ANCHOR:sign-off -->
