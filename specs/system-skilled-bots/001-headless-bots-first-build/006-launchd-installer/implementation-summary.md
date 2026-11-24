---
title: "Implementation Summary"
description: "The launchd installer, slot accounting, the throttled drain job and the install record with its needs-reinstall check are built and tested against a stand-in scheduler; and the live install passed twice on 2026-11-23, plain and with XDG_STATE_HOME."
trigger_phrases:
  - "launchd installer implementation summary"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-skilled-bots/001-headless-bots-first-build/006-launchd-installer"
    last_updated_at: "2026-11-24T11:13:43Z"
    last_updated_by: "generate-context"
    recent_action: "Closed T001, T002 and CHK-003 after phase 2 recorded the weekday probe"
    next_safe_action: "Run the plan.md rollback once on the test bot for CHK-120"
    packet_purpose: "Purpose: An operator can install a bot's schedule as a disabled launchd agent, enable it on purpose, see it fire and stop it at the scheduler."
    blockers: []
    key_files:
      - "specs/system-skilled-bots/001-headless-bots-first-build/006-launchd-installer/scratch/entry-conditions-2026-11-24.txt"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "implement-006-launchd-installer"
      parent_session_id: null
    session_ref:
      runtime: "claude"
      sessionId: "335d5a41-9d36-45cb-8bae-6e6010fef894"
      workspace: "/Users/michelkerkmeester/worktrees/public/system-skilled-bots"
      savedAt: "2026-11-24T11:13:43Z"
      locatorKind: "transcript_path"
      version: 1
    completion_pct: 90
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.4 -->
# Implementation Summary

<!-- SPECKIT_LEVEL: 3 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 006-launchd-installer |
| **Completed** | 2026-11-23: all 18 rows Met. T001, T002 and CHK-003 wait on the phase 2 weekday probe, and CHK-120 (rollback run by hand) is not run |
| **Level** | 3 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

`bots schedule install <id>` now turns a cron bot into a launchd job that is held disabled until `bots enable <id>`, and `bots schedule uninstall <id>` removes it again. Every scheduled fire records the slot it stood for, how late it ran and which slots it skipped, and a read-only check names each schedule that a moved checkout, a retargeted link or a re-pin left stale.

### Phase 6: launchd-installer

- **Install transaction.** Preflight, render to a private temp file, `plutil -lint`, read the scheduler's disabled list, stop at a kill switch or at another clone's label, set the hold, boot out the old job, move the file into place, `bootstrap`, `print`, read the schedule back against the translator. Every refusal before the move leaves the agents folder untouched. The next fire is reported as `UNKNOWN`.
- **Preflight.** Identity first (an unknown identity writes nothing at all), then the runner and its installed runtime, the interpreter, the Skilled tree's run root (checked without writing, so a linked worktree or a missing ignore line is refused at install, not at 3 a.m.), the switches, the real definition checker, the schedule and the posture.
- **Held first install.** `launchctl disable` runs before the job file lands. `bootstrap` still runs and its exit is kept as evidence; a host that loads the disabled label anyway gets it booted out again. The install record's `hold` (`first-install`, `definition`, `operator`) tells a first install from a kill switch. No path uses the load subcommand.
- **Program arguments.** `<absolute node> <real path of .skilled/bin/bots.cjs> run <id> --schedule-index 0 --repo <absolute checkout> --skilled-tree <absolute Skilled tree>`. The Skilled tree is always passed, never left to the CLI's default, because the default is the runner's own tree, which is a linked worktree for a dev checkout and is refused for run folders. The installer takes `--skilled-tree` (default: the tree the invoking CLI lives in), resolves its real path and checks it in the preflight. `WorkingDirectory` is the checkout, `StandardOutPath` and `StandardErrorPath` go to `<state root>/<identity>/agent-logs/<label>.log`. The job carries one environment value at most: `EnvironmentVariables` holds `XDG_STATE_HOME` whenever `bots/config.json` names no `stateRoot`, set to the resolved parent of the state root. Without it launchd's bare environment made a fired run and the drain resolve `~/.local/state/system-skilled-bots`, a different root from the one holding the install record and the watched inbox. The read-back checks that the installed job carries exactly that value.
- **Slot accounting.** A `scheduled` request kind in the runner. The fire is accounted right after the definition parses, before any switch or hold can refuse it: it reads the last-fire snapshot, lists slots with the phase 2 slot lister, writes its own snapshot, and puts `scheduledAt`, `latenessSeconds`, `latenessClass` (`on-time`, `late`, `catch-up`) and a bounded skipped-slot summary in the record. A held fire records `heldSlot` with reason `held-needs-you`. Nothing is backfilled.
- **Operator verbs follow the job's state root.** `enable`, `disable`, `pause`, `resume` and `schedule uninstall` read the installed job file's `EnvironmentVariables` (`jobEnv`) and resolve the state root from its `XDG_STATE_HOME`, or from none when the job carries none, whenever the config names no `stateRoot`. The run-layer switch, the install record lookup and the scheduler stop then all land where the job reads. With no install record found, `disable` still disables and boots out the label built from identity and bot id when it has a job file or the scheduler knows it. A bot `enable` or `disable` that finds no schedule prints a warning on stderr and exits 0.
- **One state root per installed identity.** `jobEnv` reads the named job's file first, then any other job file of the same identity. Every CLI verb except `schedule install` resolves its state root through it: verbs on one bot (`run`, `enable`, `disable`, `pause`, `resume`) from that bot's job, the rest (`inbox`, `enqueue`, `drain`, `answer`) from the drain job's, falling back to any job of the identity. In the library, `enableSchedule`, `disableSchedule`, `uninstallSchedule` (and each swept bot's record, resolved from its own job before its file is removed), `checkInstallsFor` and `scheduledDrain` do the same. `installSchedule` compares the shell's root with the installed jobs' root before it writes anything and refuses `state-home-changed` on a mismatch, naming both roots and the `XDG_STATE_HOME` to run from; the previous record and so the kill-switch guard are always read under the jobs' root. `bots disable <id>` with `BOT.md` gone still stops the schedule and skips only the run-layer switch.
- **One built job environment, compared at install.** `launchdJobEnv` in `installer.ts` builds exactly what launchd gives a job: the bare `PATH`, the account's home from the user database (`accountHome`, never a shell's `HOME`) and the job file's `EnvironmentVariables`. The job file always carries `XDG_STATE_HOME` when the config names no `stateRoot` (`jobEnvironmentVariables`). The install preflight resolves `(identity, state root)` under the shell and under that built environment and refuses `job-env-diverges` before any write when they differ, naming both pairs and the fix (declare `identity` and/or `stateRoot` in `bots/config.json`). `state-home-changed` stays a separate, earlier check for an already installed job pinned to another state home, because its message names the `XDG_STATE_HOME` to run from. `jobEnv` now returns the built environment, never the shell's with a key patched: identity under the bare environment names the label, the state home comes from the installed job file, and with no job file it is the one an install from this shell would pin. The CLI and `scheduledDrain` resolve under it and pass it as `resolveEnv` to the runner, the drain and the answer, while a run still executes under the caller's environment. The default agents folder also comes from the account's home.
- **Jobs found by their checkout.** A label is built from the identity, and the identity can change under an installed job (an origin renamed, an identity declared in `bots/config.json`). So the installer finds a checkout's jobs by the `--repo` in each hub job file, compared by real path (`checkoutJobs`), never by the label built now. `jobEnv` takes the pinned state home from those files. Install refuses `identity-changed` when one carries a label of another identity, naming the old label and the `bots schedule uninstall` to run first, and refuses `state-home-changed` when one was written for another state root (its log path, or a drain job's watched folder, differs from the one resolved now, as after a config `stateRoot` is added). With no job installed, it also refuses `state-home-changed` when the account home's or the shell home's default root holds this identity's switches, so a pause set before the first install is not stranded. `bots disable` and `bots schedule uninstall` (and its sweep) act on every job of the checkout for the bot, under any identity; uninstall deletes each found job's record under the root that job fires with. The check for a checkout adds `identity-changed` and `state-root-changed`.
- **Job paths.** A path is refused when it is relative, starts with `~`, or holds a shell variable (`$NAME`, `${`). A `~` inside a name, as in iCloud Drive's `com~apple~CloudDocs`, is accepted.
- **Drain job.** One per identity, label `com.skilled.bots.<identity>.drain`, `QueueDirectories` on `requests/inbox` only, `ThrottleInterval` 60, running `bots drain --scheduled` with a doubling back-off after a setup fault.
- **Install record and check.** `<state root>/<identity>/installs/<bot-id>.json` holds the labels, job file paths, checkout, interpreter, the runner path in the job file, `<repo>/.skilled/bin/bots.cjs`, its real path, the tree root, the Skilled tree, the kind (`checkout`, `symlink`, `vendored`), `pin.commit` for a vendored tree, the schedule, the hold and the install and enable times. `checkInstalls` returns `ok` or `needs-reinstall` with `runner-missing`, `runner-retargeted`, `kind-changed`, `pin-changed` or `record-missing`, and writes nothing.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.skilled/skills/system-skilled-bots/runtime/lib/installer.ts` | Create | Preflight, transaction, enable, disable, uninstall and sweep, kind detection, install record, check, drain back-off |
| `.skilled/skills/system-skilled-bots/runtime/lib/plist-render.ts` | Create | Bot and drain job files, program arguments, read-back comparison |
| `.skilled/skills/system-skilled-bots/runtime/lib/slot-accounting.ts` | Create | Grace window, lateness class, bounded summary, last-fire snapshot |
| `.skilled/skills/system-skilled-bots/runtime/lib/runner.ts` | Modify | `scheduled` request kind, slot fields through the seed into every record, `heldSlot` on a hold, refusal cause `schedule-stale`; optional `resolveEnv` for identity and the state root, and a header saying a library caller passes the job's environment there |
| `.skilled/bin/bots.cjs` | Modify | `schedule install`, `schedule uninstall`, `run --schedule-index`, `drain --scheduled`; `enable` and `disable` reach an installed schedule through the installer; verbs on one bot resolve the job's state root; a bot verb with no schedule warns |
| `.skilled/skills/system-skilled-bots/runtime/lib/state-root.ts` | Modify (contract) | `checkRunFolder` (the run-folder rules with no write; `resolveRunFolder` now calls it), `slotSnapshotFile`, `drainBackoffFile`, `agentLogFile` |
| `.skilled/skills/system-skilled-bots/runtime/lib/run-record.ts` | Modify (contract) | `skippedSlots` gains optional `first` and `last`; optional `dispatch.heldSlot`; both validated |
| `.skilled/skills/system-skilled-bots/runtime/lib/label.ts` | Modify (comment only) | The header named the agents folder by path, which tripped the scheduling-invariant grep; reworded |
| `.skilled/skills/system-skilled-bots/runtime/tests/installer.vitest.ts` | Create | 50 cases against a stand-in scheduler and real plutil, seven of them through the real CLI; every fired job starts under the built job environment with the intercept loaded |
| `.skilled/skills/system-skilled-bots/runtime/tests/fixtures/launchctl-intercept.cjs` | Create | Test-only `--require` intercept that answers and logs every `launchctl` call of a CLI a test starts and answers the account home the test names; it refuses to load without either |
| `.skilled/skills/system-skilled-bots/runtime/lib/request-drain.ts`, `lib/answer.ts` | Modify (shared, minimal) | Optional `resolveEnv` for identity and the state root, passed on to every run; header says a library caller passes the job's environment there |
| `.skilled/skills/system-skilled-bots/runtime/lib/request-queue.ts` | Modify (shared, header only) | Header says a library caller passes the job's environment as `env` |
| `.skilled/skills/system-skilled-bots/runtime/tests/slot-accounting.vitest.ts` | Create | 8 cases, including the sleep gap and the held fire through the runner |
| `scratch/live-install.sh` | Create | The live install, not run. Takes `--skilled-tree` or `SKILLED_TREE`, reads the label from its own install output, counts only its own identity's job files, and `--state-from-xdg` runs it with no config `stateRoot` and a scratch `XDG_STATE_HOME` |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The work followed `/speckit:implement` in autonomous mode in the worktree, with the review and save steps left to the orchestrator. No real scheduler call ran: every test hands the installer a temp agents folder and an in-memory scheduler that records its calls, and only `plutil` is real.

Proof, in the order it ran:
1. Baseline: 29 files, 264 tests, exit 0 (`scratch/bots-suite-baseline.txt`). A hash of `~/Library/LaunchAgents` (listing and file contents) was taken first.
2. The modules, the runner change and the CLI, then the two test files. Typecheck exit 0.
3. Twelve mutation controls, each restored and its hash checked (`scratch/mutation-controls.txt`). Every one failed its test; the first sweep test let one through, so it was fixed and rerun.
4. A job file's own program arguments run under `PATH=/usr/bin:/bin:/usr/sbin:/sbin` against the real CLI, without launchd: refused `precheck-silent`, exit 4, one record with the fired slot. The drain job's own arguments, run the same way with a setup fault, back off through the CLI.
5. The live script's setup, built in the session scratchpad with a temp Skilled tree and no launchd call (`scratch/live-setup-smoke.txt`): the real checker passes the probe bot, and a bare-PATH scheduled run writes a record with the fired slot. It also caught a commit the commit-message hook refused, fixed in the script.
6. Whole suite twice and the typecheck, the grep gates, rendered fixtures, the network-denied run, and the `~/Library/LaunchAgents` hash again.
7. Review fixes. A job installed from a shell whose `XDG_STATE_HOME` decided the state root now carries that value, and a test starts the bot job and the drain job from their own program arguments under a bare environment plus the job file's `EnvironmentVariables`: the run record, the install record and the drain's back-off all land under one root, and nothing appears under the bare `HOME`'s `.local/state`. With the fix switched off, that test fails (`expected [] to have a length of 1 but got +0`). A read-back failure now names what it left (the job file in place, loaded or held, no install record written). The default agents folder falls back to `homedir()` when `HOME` is unset. The `load` grep was widened to single, double and backtick quotes and still prints nothing, exit 1. Suite twice: 31 files, 305 tests, exit 0 (`scratch/bots-suite-review-1.txt`, `-2.txt`); typecheck exit 0 (`scratch/typecheck-review.txt`).
8. Second review. That fix exposed a stop that did nothing: `bots disable` from a shell with another `XDG_STATE_HOME` found no install record, ran no scheduler verb, wrote the switch under the shell's root and exited 0. The operator verbs now resolve the job's state home from its job file, `disable` stops a label it finds without a record, and a bot verb with no schedule warns. Two mutation controls (verbs keep the shell's environment; no unrecorded disable) each failed their test (`scratch/mutation-controls.txt`). The path check now accepts `com~apple~CloudDocs`. Suite twice: 31 files, 308 tests, exit 0 (`scratch/bots-suite-review2-1.txt`, `-2.txt`); typecheck exit 0 (`scratch/typecheck-review2.txt`).
9. Third review, closed as a class. A reinstall from a shell with another state home read no previous record, skipped the kill-switch guard and moved the job to a new root. Install now refuses `state-home-changed` with nothing written, and every verb that resolves a state root goes through `jobEnv` (the list is under Key Decisions). CLI tests run the real `bots.cjs` with `launchctl` answered by an intercept loaded with `--require` (`tests/fixtures/launchctl-intercept.cjs`), so `bots disable` and `bots pause` are proven end to end without the scheduler. Two more mutation controls failed their tests (`scratch/mutation-controls.txt`). Suite twice: 31 files, 312 tests, exit 0 (`scratch/bots-suite-review3-1.txt`, `-2.txt`); typecheck exit 0 (`scratch/typecheck-review3.txt`).
10. Fourth review, closed by construction. Each earlier round found one more shell input the job did not share (`XDG_STATE_HOME`, an install from another shell, then `GITHUB_REPOSITORY`, then a `HOME` override). The job's environment is now built in one place and the install compares the resolved outputs, so any input, listed or not, that would split the shell from the job is refused as `job-env-diverges`. Every input the resolvers read is inventoried in `scratch/env-inputs.txt`. A mutation control that drops the comparison fails the `GITHUB_REPOSITORY` test (`scratch/mutation-controls.txt`).
11. Fifth review. Installed jobs were looked up by the label built from the identity resolved at the time, so after an origin rename or a declared identity the old job was not found: `bots disable` from a shell with another state home wrote the switch where the job never looks, and the old label stayed enabled. Jobs are now found by their `--repo`; install refuses `identity-changed` and, for a job written for another state root or a switch stranded under a default root, `state-home-changed`. Five mutation controls, each failing its test, are in `scratch/mutation-controls.txt`.

### Operator steps

- Install: `node .skilled/bin/bots.cjs schedule install <id> --skilled-tree <primary Skilled checkout>`. It prints the steps, the label, `held disabled (first-install); nothing fires until: bots enable <id>`, `next fire: UNKNOWN` and the check.
- Enable: `bots enable <id>` reruns the preflight, enables the label, bootstraps it and clears the run-layer switch. It refuses while `BOT.md` says `enabled: false`.
- Disable (kill switch): `bots disable <id>` sets the run-layer switch first, then disables and boots out the label. A later install stops at it until `bots enable`.
- Reinstall: run install again after a move, a link change or a re-pin. It keeps the hold the record has.
- Uninstall: `bots schedule uninstall <id>` boots out and deletes the job file and the record, sweeps this identity's bot labels whose definition is gone, keeps the drain job and never touches run folders or records.
- Drain job: the same verbs with the id `drain`.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| ADR-002 Accepted: detect a changed tree and reinstall, with an install record per bot | The operator chose detect and reinstall with the overlay system in view. A re-pin keeps the runner path but changes its code, so the record keeps `pin.commit` as well as the paths |
| [DEVIATION: T003 not run] ADR-003 built without the probe: disable before the move, bootstrap tolerated, a loaded hold booted out | No real scheduler call was allowed. This option keeps nothing loaded whatever the probe shows; the live script records the exit codes that settle it |
| A label disabled with no install record installs under a `first-install` hold, not as a kill switch | Uninstall leaves the scheduler's disable entry behind. Install never enables, so the label stays disabled either way, and stopping here would leave no way back without a hand `launchctl` call. The advisor's alternative was to stop; this records why I did not |
| Drain respawn: `ThrottleInterval` 60 plus a back-off file under `--scheduled` | The throttle bounds how often launchd starts the job; the back-off makes each start inside the window return at once. Neither touches phase 5's drain |
| The checker gate refuses on any `FAIL` line in the checkout, not only the bot's own | The checker reports per checkout. Filtering its lines by path would restate its rules; refusing is the conservative choice |
| `bots enable` rechecks the job as installed: the record's Skilled tree and interpreter | The job runs with those, not with the enabling shell's, so a consumer linked to a dev worktree can enable without naming the tree again |
| Install registers the checkout root | The clone check reads registered roots, and no other code calls `registerRoot` |
| A bot `enable` or `disable` that finds no installed schedule warns and exits 0; the drain branch still exits 4 | A bot without a schedule is stopped by the run-layer switch alone, so the verb did its job; the drain job exists only as a scheduler job, so finding none there is a refusal |
| A reinstall from another state home refuses `state-home-changed` rather than adopting the job's root | On a fresh install the shell chooses the root (NFR-S02); adopting silently would hide that the shell and the jobs disagree |
| Class sweep: every state-root resolver goes through `jobEnv` or refuses | CLI: `run`, `enable`, `disable`, `pause`, `resume` (that bot's job), `inbox`, `enqueue`, `enqueue --git-commit`, `drain`, `drain --scheduled`, `answer` (the drain job's, else any job of the identity), `schedule uninstall` (inside the installer), `schedule install` (refuses on mismatch). Installer exports: `installSchedule` (refuses), `enableSchedule`, `disableSchedule`, `uninstallSchedule` and its sweep, `checkInstallsFor`, `scheduledDrain` (`jobEnv`). `checkInstalls`, `readInstallRecord` and `readDrainBackoff` take a resolved root and resolve none. The runner, drain and answer libraries take a `resolveEnv` beside the execution `env`, and the queue's `env` is read only to resolve; a caller outside the CLI passes a `jobEnv` result there, as each module header says. Identity resolves under it too, so a shell's `GITHUB_REPOSITORY` no longer decides where a verb lands |
| One built job environment and an output comparison, not a fix per variable | Four rounds each found one more input; comparing the resolved identity and state root catches every input, listed or not, and the inventory in `scratch/env-inputs.txt` shows each flows through it |
| The built environment resolves; it never becomes the dispatch environment | A manual `bots run`, `drain` or `answer` keeps the shell's `PATH`, secrets and allowlisted values for the executor, the precheck and the secret check. The runner, drain and answer take `resolveEnv` beside `env`; under launchd the two are the same |
| Jobs are found by `--repo`, not by label | The checkout written into a job file does not drift; the identity does. A second clone of the same identity has its own `--repo`, so the clone rule is unchanged |
| A job of this checkout under another identity refuses install with `identity-changed`; it is not replaced | Replacing it would mean uninstalling a job under an identity the operator may not know changed; naming the label and the uninstall step keeps that choice with the operator |
| Every job's log path is compared with the one resolved now, not only the drain job's watched folder | A bot job written for another root keeps its install record there, so a reinstall would read no previous record and skip the kill-switch guard, the defect the third review found |
| `state-home-changed` kept beside `job-env-diverges` | It covers an installed job pinned to another state home and names the `XDG_STATE_HOME` to run from; the new check covers a fresh install whose job would diverge |
| The account home comes from the user database, and the agents folder from it | `HOME` can be overridden in a shell; launchd uses the account's home, so a job file written under an overridden `HOME` would sit where launchd never loads it |
| `pause` and `resume` resolve the job's state root too, not only `enable` and `disable` | They write the same switch store the fired job reads; leaving them on the shell's root would repeat the defect for a pause |
| The skipped-slot summary lists the most recent `retention.skippedSlotsPerSummary` slots | The phase 1 config already bounds it; `first` and `last` carry the full range |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Whole bots suite, twice | `Test Files  31 passed (31)`, `Tests  303 passed (303)`, exit 0, both runs (`scratch/bots-suite-after-1.txt`, `-2.txt`). Baseline 264; the delta of 39 is the 31 installer and 8 slot-accounting cases |
| Whole bots suite after the review fixes, twice | `Test Files  31 passed (31)`, `Tests  305 passed (305)`, exit 0, both runs (`scratch/bots-suite-review-1.txt`, `-2.txt`). The delta of 2 is the state-home fire test and the default agents folder test |
| Whole bots suite after the third review, twice | `Test Files  31 passed (31)`, `Tests  312 passed (312)`, exit 0, both runs (`scratch/bots-suite-review3-1.txt`, `-2.txt`). The delta of 4 is the `state-home-changed` test and three CLI tests |
| Whole bots suite after the second review, twice | `Test Files  31 passed (31)`, `Tests  308 passed (308)`, exit 0, both runs (`scratch/bots-suite-review2-1.txt`, `-2.txt`). The delta of 3 is the two cross-state-home stop tests and the iCloud path test |
| Whole bots suite after the fourth review, twice | `Test Files  31 passed (31)`, `Tests  316 passed (316)`, exit 0, both runs (`scratch/bots-suite-review4-1.txt`, `-2.txt`). The delta of 4 is the `job-env-diverges` test, two CLI tests from a shell that sets `GITHUB_REPOSITORY`, and the `HOME` override test; the default agents folder test was rewritten in place |
| Whole bots suite after the fifth review, twice | `Test Files  31 passed (31)`, `Tests  322 passed (322)`, exit 0, both runs (`scratch/bots-suite-review5-1.txt`, `-2.txt`). The delta of 6 is the two rename tests (origin and config), the unrecorded disable, the state-root drift test, the stranded switch test and the intercept test. The real `~/Library/LaunchAgents` hash was unchanged across the first run (`scratch/launchagents-hash-review5.txt`); `tests/post-commit-leg.test.sh` printed 28 passed, 0 failed, exit 0 |
| `npm run typecheck` | exit 0 (`scratch/typecheck-after.txt`); after the fifth review exit 0 (`scratch/typecheck-review5.txt`); after the review fixes exit 0 (`scratch/typecheck-review.txt`); after the second review exit 0 (`scratch/typecheck-review2.txt`); after the third review exit 0 (`scratch/typecheck-review3.txt`); after the fourth review exit 0 (`scratch/typecheck-review4.txt`) |
| Mutation controls | 12 of 12 failed their test, 2 of 2 added after the second review, 2 of 2 after the third, 1 of 1 after the fourth and 5 of 5 after the fifth (`scratch/mutation-controls.txt`) |
| Scheduling invariant grep | 28 matches, all in `installer.ts`; the widened load grep (single, double and backtick quotes, and `launchctl load`) prints nothing, exit 1 (`scratch/grep-gates.txt`) |
| `.skilled/commands/doctor/` | `git diff --stat a2f1f8e8fa0` and `git status` print nothing |
| Rendered fixtures | `plutil -lint` OK on both; no `~`, `$HOME`, token, secret or environment key (`scratch/rendered-fixtures.txt`). The fixtures were rendered before the state-home fix; a job whose config names no `stateRoot` now always carries `EnvironmentVariables` with `XDG_STATE_HOME` only, a path and no secret, asserted in `tests/installer.vitest.ts` |
| Network denied | 37 tests pass under a deny-network sandbox profile; a control `fetch` is blocked with EPERM (`scratch/network-denied.txt`) |
| `~/Library/LaunchAgents` | Hash `0deff7da...` before the build and after the suite runs; no `com.skilled.bots.` file (`scratch/entry-conditions.txt`). The hash says nothing about launchd's own disabled-override list, which `enable` and `disable` write. That no real `launchctl` call ran rests on the code: every test hands the installer its scheduler seam, and the CLI's `enable` and `disable` reach the installer's scheduler steps only when an install record exists, which no suite state root holds outside a test's temp folder |
| Acceptance criteria | 18 of 18 Met. The live install ran twice on 2026-11-23 (`scratch/live-install-result.txt`, `scratch/live-install-result-xdg.txt`): held disabled, one fire with slot and lateness, the drain emptied the inbox, uninstall left nothing. Five review rounds, the last fix verified by the orchestrator under operator answer Q008. Observed: install prints `next fire: UNKNOWN` for a held job |
| Real fire (T016) | Not run. Its run record is quoted here once `scratch/live-install.sh` runs |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **The live half is not proven.** The disabled hold, the real fire, the drain job and the clean uninstall run only in `scratch/live-install.sh`, which needs the operator's yes. Its bot never calls a model: its precheck prints `[SILENT]`, so the fire ends refused and still writes the slot fields.
2. **Executors under the bare PATH are open.** A scheduled run starts the runner with an absolute interpreter, but the runner finds an executor such as `codex` on `PATH`, which launchd leaves bare, and the job carries no environment beyond the state home. A real scheduled dispatch fails until that is decided. Raised in `spec.md` open questions.
12. **The uninstall sweep's root per swept bot is not tested on its own.** Since an install of a second state home is now refused, two jobs of one identity can only carry different state homes when they predate that check; the sweep resolves each swept bot's root from its own job file, and the existing sweep test covers the shared-root case.
3. **ADR-003 waits on the probe.** The built mechanism does not depend on the probe's answer, but the record stays Proposed until the live script reports the exit codes and the domain target.
4. **Entry conditions met late.** Phase 2 closed on 2026-11-24, after this phase was built. Its probe settled the weekday rule on emit, so weekday-only and day-only crons now install.
5. **Next fire time stays UNKNOWN.** launchd reports none for a calendar job.
6. **A re-pin prints no schedule warning yet.** Follow-up for system-skilled-doctor: the hook point is phase_6_reread in `.skilled/commands/doctor/assets/doctor-overlay-repin.yaml`, which runs `overlay-engine.cjs status` after any engine write. The flow could call `checkInstallsFor({ checkoutRoot })` from `installer.ts` there and list the schedules that return `needs-reinstall` with `pin-changed`. This phase edits nothing under `.skilled/commands/doctor/`; until the follow-up lands, phase 7's `bots status` shows the rows.
7. **The drain job meets phase 5's retry bound sooner.** It relaunches about once a minute while a retried request sits in the inbox, so a request that hits `lease-held` behind a long scheduled run of the same bot reaches `retry-bound` in two or three minutes. Reported, not changed: the bound is phase 5's.
8. **No identity, no back-off memory.** A drain job whose repository loses its identity has no state folder for the back-off file, so only the 60-second throttle bounds it.
9. **Uninstall ignores the clone rule (open follow-up).** `holdingClone` guards install only. `bots schedule uninstall` and its orphan sweep, run from a second clone of the same identity, boot out and delete a label the first clone installed. Raised in `spec.md` open questions; not fixed here.
10. **The check never looks at the interpreter (open follow-up).** The needs-reinstall check compares runner paths, kind and pin, never the recorded Node interpreter. A job whose interpreter was removed or upgraded away reads `ok` and fails at its next fire. Raised in `spec.md` open questions; not fixed here.
11. **A different `HOME` with no `XDG_STATE_HOME` (closed).** The job now always carries the state home when the config names none, and the agents folder comes from the account's home, so an install under another `HOME` pins the root it resolved. A manual `bots run`, `drain` or `answer` still executes under the shell's environment; only resolution uses the job's. The CLI's checkout root comes from `git rev-parse` under the shell, but the job receives it as a literal `--repo`, so a verb given the same `--repo` agrees.
13. **A switch stranded under an arbitrary state home is not found.** Before the first install, install looks for this identity's switches under the account home's and the shell home's default roots only. A pause written from a shell whose `XDG_STATE_HOME` named some other folder leaves no trace the installer can find, so that pause stays stranded.
<!-- /ANCHOR:limitations -->

---
